"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CreateSessionForm } from "@/components/CreateSessionForm";
import { JoinForm } from "@/components/JoinForm";
import { SiteHeader } from "@/components/SiteHeader";
import { useNow } from "@/components/useNow";
import { endsAt, sessionState } from "@/lib/pomodoro";

const fmt = (iso) => new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function Status({ session, now }) {
  const { phase } = sessionState(session, now);
  if (phase === "waiting") return <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-bold">Upcoming</span>;
  if (phase === "done") return <span className="rounded-full bg-paper px-2 py-0.5 text-xs text-pencil">Finished</span>;
  return <span className="rounded-full bg-marker px-2 py-0.5 text-xs font-bold">Live now</span>;
}

export default function Dashboard() {
  const now = useNow(15000);
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setSessions(d.sessions))
      .catch(() => setError("Couldn't load your sessions. Refresh to try again."));
  }, []);

  const active = sessions && now ? sessions.filter((s) => endsAt(s).getTime() > now).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)) : [];
  const past = sessions && now ? sessions.filter((s) => endsAt(s).getTime() <= now) : [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight">My sessions</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <CreateSessionForm />
          <div className="space-y-8">
            <div className="sheet p-6"><JoinForm /></div>

            <section aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading" className="text-2xl font-bold">Live and upcoming</h2>
              {error && <p className="mt-3 text-redpen">{error}</p>}
              {!error && sessions === null && <p className="mt-3 text-pencil">Loading…</p>}
              {sessions && active.length === 0 && (
                <p className="mt-3 text-pencil">Nothing scheduled. Create a session to get a link you can share.</p>
              )}
              <ul className="mt-3 space-y-2">
                {active.map((s) => (
                  <li key={s.code}>
                    <Link href={`/s/${s.code}`} className="sheet flex items-center justify-between gap-3 p-4 hover:border-ink/40">
                      <span>
                        <span className="block font-bold">{s.title}</span>
                        <span className="text-sm text-pencil">{fmt(s.startsAt)}, {s.rounds} × {s.focusMin} min{s.subject ? `, ${s.subject}` : ""}</span>
                      </span>
                      <Status session={s} now={now} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {past.length > 0 && (
              <section aria-labelledby="past-heading">
                <h2 id="past-heading" className="text-xl font-bold">Past sessions</h2>
                <ul className="mt-3 space-y-1 text-sm">
                  {past.slice(0, 10).map((s) => (
                    <li key={s.code} className="flex justify-between gap-3 border-b border-grid py-2">
                      <Link href={`/s/${s.code}`} className="hover:underline">{s.title}</Link>
                      <span className="text-pencil">{fmt(s.startsAt)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
