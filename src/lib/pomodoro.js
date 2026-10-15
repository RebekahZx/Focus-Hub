// Shared study timer. Every participant computes the same state from the session's
// start time and settings, so the clock stays in sync without a realtime server.

export const MINUTE = 60_000;

export function totalMs({ focusMin, breakMin, rounds }) {
  // No break after the last focus round.
  return (rounds * focusMin + (rounds - 1) * breakMin) * MINUTE;
}

export function endsAt(session) {
  return new Date(new Date(session.startsAt).getTime() + totalMs(session));
}

/**
 * phase: "waiting" | "focus" | "break" | "done"
 * remainingMs: time left in the current phase (or until the start, when waiting)
 * round: 1-based current round (0 while waiting)
 */
export function sessionState(session, now = Date.now()) {
  const { focusMin, breakMin, rounds } = session;
  const start = new Date(session.startsAt).getTime();
  const focus = focusMin * MINUTE;
  const brk = breakMin * MINUTE;
  const cycle = focus + brk;
  const total = totalMs(session);

  if (now < start) {
    return { phase: "waiting", remainingMs: start - now, round: 0, rounds, phaseProgress: 0, overallProgress: 0 };
  }
  const elapsed = now - start;
  if (elapsed >= total) {
    return { phase: "done", remainingMs: 0, round: rounds, rounds, phaseProgress: 1, overallProgress: 1 };
  }
  const index = Math.floor(elapsed / cycle);
  const within = elapsed - index * cycle;
  const inFocus = within < focus;
  return {
    phase: inFocus ? "focus" : "break",
    remainingMs: inFocus ? focus - within : cycle - within,
    round: index + 1,
    rounds,
    phaseProgress: inFocus ? within / focus : (within - focus) / brk,
    overallProgress: elapsed / total,
  };
}

export function formatClock(ms) {
  const t = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function formatDuration(ms) {
  const mins = Math.round(ms / MINUTE);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}
