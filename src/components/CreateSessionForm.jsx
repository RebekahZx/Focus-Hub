"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDuration, totalMs } from "@/lib/pomodoro";
import { LIMITS } from "@/lib/session";

const FOCUS = [25, 45, 50, 90];
const BREAKS = [5, 10, 15];

export function CreateSessionForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", subject: "", focusMin: 25, breakMin: 5, rounds: 4, when: "now", startsAt: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const body = {
      title: form.title,
      subject: form.subject,
      focusMin: Number(form.focusMin),
      breakMin: Number(form.breakMin),
      rounds: Number(form.rounds),
      // datetime-local has no timezone; new Date() reads it as the browser's local time.
      startsAt: form.when === "now" ? "now" : form.startsAt ? new Date(form.startsAt).toISOString() : "",
    };
    try {
      const res = await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return router.push(`/s/${data.session.code}`);
      setErrors(data.errors || { form: data.error || "Couldn't create the session. Try again." });
    } catch {
      setErrors({ form: "Couldn't reach the server. Check your connection and try again." });
    }
    setBusy(false);
  };

  const length = formatDuration(totalMs({ focusMin: +form.focusMin || 0, breakMin: +form.breakMin || 0, rounds: +form.rounds || 1 }));
  const err = (k) => errors[k] && <p id={`${k}-error`} className="mt-1 text-sm text-redpen">{errors[k]}</p>;

  return (
    <form onSubmit={submit} className="sheet space-y-5 p-6" noValidate aria-labelledby="create-heading">
      <h2 id="create-heading" className="text-2xl font-bold">New study session</h2>

      <div>
        <label htmlFor="title" className="label">Title</label>
        <input id="title" className="field" value={form.title} onChange={set("title")} maxLength={LIMITS.title.max}
          placeholder="Calculus problem set" aria-invalid={!!errors.title} aria-describedby={errors.title ? "title-error" : undefined} required />
        {err("title")}
      </div>

      <div>
        <label htmlFor="subject" className="label">Subject <span className="font-normal text-pencil">(optional)</span></label>
        <input id="subject" className="field" value={form.subject} onChange={set("subject")} maxLength={LIMITS.subject.max} placeholder="Maths" />
        {err("subject")}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="focusMin" className="label">Focus</label>
          <select id="focusMin" className="field" value={form.focusMin} onChange={set("focusMin")}>
            {FOCUS.map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
          {err("focusMin")}
        </div>
        <div>
          <label htmlFor="breakMin" className="label">Break</label>
          <select id="breakMin" className="field" value={form.breakMin} onChange={set("breakMin")}>
            {BREAKS.map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
          {err("breakMin")}
        </div>
        <div>
          <label htmlFor="rounds" className="label">Rounds</label>
          <input id="rounds" type="number" className="field" min={LIMITS.rounds.min} max={LIMITS.rounds.max} value={form.rounds} onChange={set("rounds")} />
          {err("rounds")}
        </div>
      </div>

      <fieldset>
        <legend className="label">Start</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2"><input type="radio" name="when" value="now" checked={form.when === "now"} onChange={set("when")} className="accent-ink" /> Now</label>
          <label className="flex items-center gap-2"><input type="radio" name="when" value="later" checked={form.when === "later"} onChange={set("when")} className="accent-ink" /> At a set time</label>
        </div>
        {form.when === "later" && (
          <div className="mt-3">
            <label htmlFor="startsAt" className="sr-only">Start time</label>
            <input id="startsAt" type="datetime-local" className="field" value={form.startsAt} onChange={set("startsAt")} />
          </div>
        )}
        {err("startsAt")}
      </fieldset>

      <p className="text-sm text-pencil">Total length: {length}, with no break after the last round.</p>
      {errors.form && <p className="text-sm text-redpen" role="alert">{errors.form}</p>}
      <button disabled={busy} className="w-full rounded-md bg-ink px-4 py-3 text-lg font-bold text-white hover:bg-ink-soft disabled:opacity-60">
        {busy ? "Creating…" : "Create session"}
      </button>
    </form>
  );
}
