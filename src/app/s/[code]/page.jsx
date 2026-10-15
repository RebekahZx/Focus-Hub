"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import { GoalList } from "@/components/GoalList";
import { SiteHeader } from "@/components/SiteHeader";
import { TimerFace } from "@/components/TimerFace";
import { VideoPanel } from "@/components/VideoPanel";
import { useNow } from "@/components/useNow";
import { buildIcs } from "@/lib/ics";
import { endsAt, formatClock, sessionState } from "@/lib/pomodoro";

// Short two-tone chime when the phase changes (no audio file needed).
function chime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [660, 880].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.25);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.25 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.25 + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.25);
      o.stop(ctx.currentTime + i * 0.25 + 0.45);
    });
  } catch {}
}

const LABEL = { waiting: "Starts in", focus: "Focus", break: "Break" };

export default function StudyRoom() {
  const { code } = useParams();
  const router = useRouter();
  const { data: auth } = useSession();
  const now = useNow();
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [sound, setSound] = useState(true);
  const lastPhase = useRef(null);

  useEffect(() => {
    fetch(`/api/sessions/${code}`)
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || "Couldn't load this session.");
        setSession(d.session);
      })
      .catch((e) => setError(e.message));
  }, [code]);

  const state = session && now ? sessionState(session, now) : null;

  useEffect(() => {
    if (!state) return;
    document.title = state.phase === "done" ? `Done | ${session.title}` : `${formatClock(state.remainingMs)} ${LABEL[state.phase]} | ${session.title}`;
    if (lastPhase.current && lastPhase.current !== state.phase && sound) chime();
    lastPhase.current = state.phase;
  }, [state?.phase, state?.remainingMs, session, sound]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-5 py-16">
          <h1 className="text-3xl font-extrabold">Session not found</h1>
          <p className="mt-3 text-pencil">{error} Check the link or code with whoever sent it.</p>
          <Button href="/dashboard" className="mt-6">Go to my sessions</Button>
        </main>
      </>
    );
  }
  if (!session || !state) {
    return (<><SiteHeader /><main className="mx-auto max-w-6xl px-5 py-16 text-pencil">Loading session…</main></>);
  }

  const link = typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
  const isHost = auth?.user?.email && auth.user.email === session.hostEmail;
  const end = endsAt(session);
  const time = (d) => new Date(d).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); toast.success("Link copied"); }
    catch { toast.error("Couldn't copy. Select the address bar and copy it from there."); }
  };
  const addToCalendar = () => {
    const blob = new Blob([buildIcs(session, link)], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `study-session-${session.code}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const remove = async () => {
    if (!window.confirm("Delete this session? The link will stop working for everyone.")) return;
    const r = await fetch(`/api/sessions/${session.code}`, { method: "DELETE" });
    if (r.ok) { toast.success("Session deleted"); router.push("/dashboard"); }
    else toast.error("Couldn't delete the session.");
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {session.subject && <p className="text-pencil">{session.subject}</p>}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{session.title}</h1>
            <p className="mt-1 text-sm text-pencil">
              {time(session.startsAt)} to {time(end)}, {session.rounds} rounds of {session.focusMin} min with {session.breakMin} min breaks.
              {session.hostName && ` Hosted by ${session.hostName}.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="marker" onClick={copy}>Copy invite link</Button>
            <Button variant="quiet" onClick={addToCalendar}>Add to calendar</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="sheet p-6 sm:p-8" aria-label="Session timer">
            <TimerFace state={state} />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-pencil">
                Code <span className="font-bold text-ink">{session.code}</span>
              </p>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} className="accent-ink" />
                Chime when a round starts or ends
              </label>
            </div>
          </section>
          <GoalList code={session.code} />
        </div>

        <div className="mt-6">
          <VideoPanel code={session.code} name={auth?.user?.name} />
        </div>

        {isHost && (
          <div className="mt-8 border-t border-grid pt-6">
            <Button variant="danger" onClick={remove}>Delete session</Button>
          </div>
        )}
      </main>
    </>
  );
}
