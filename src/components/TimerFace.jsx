import { formatClock } from "@/lib/pomodoro";

const LABEL = { waiting: "Starts in", focus: "Focus", break: "Break", done: "Session complete" };

/** The big clock. Focus time gets the highlighter, breaks turn green. */
export function TimerFace({ state, compact = false }) {
  const { phase, remainingMs, round, rounds, overallProgress } = state;
  const digits = phase === "done" ? "Done" : formatClock(remainingMs);
  return (
    <div>
      <p className={`font-bold ${phase === "break" ? "text-leaf" : "text-ink"} ${compact ? "text-sm" : "text-lg"}`}>
        {LABEL[phase]}
        {(phase === "focus" || phase === "break") && <span className="font-normal text-pencil"> round {round} of {rounds}</span>}
      </p>
      <p
        className={`font-display font-extrabold leading-none tabular-nums tracking-tight ${compact ? "text-6xl" : "text-[clamp(4.5rem,16vw,10rem)]"}`}
        role="timer"
        aria-live="off"
      >
        <span className={phase === "break" ? "marked marked-leaf" : phase === "done" ? "" : "marked"}>{digits}</span>
      </p>
      <div className="mt-4 h-2 w-full rounded-full bg-grid" aria-hidden="true">
        <div
          className={`h-2 rounded-full ${phase === "break" ? "bg-leaf" : "bg-ink"}`}
          style={{ width: `${Math.round(overallProgress * 100)}%`, transition: "width 1s linear" }}
        />
      </div>
      <p className="mt-1 text-xs text-pencil">{Math.round(overallProgress * 100)}% of the session done</p>
    </div>
  );
}
