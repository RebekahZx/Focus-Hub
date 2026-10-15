import { describe, expect, test } from "vitest";
import { MINUTE, endsAt, formatClock, formatDuration, sessionState, totalMs } from "../pomodoro";

const start = Date.parse("2026-10-15T10:00:00Z");
const s = { startsAt: new Date(start).toISOString(), focusMin: 25, breakMin: 5, rounds: 3 };
const at = (min) => start + min * MINUTE;

describe("sessionState", () => {
  test("waits before the start and counts down to it", () => {
    expect(sessionState(s, at(-2))).toMatchObject({ phase: "waiting", remainingMs: 2 * MINUTE, round: 0 });
  });

  test("walks through focus and break rounds", () => {
    expect(sessionState(s, at(0))).toMatchObject({ phase: "focus", round: 1, remainingMs: 25 * MINUTE });
    expect(sessionState(s, at(24))).toMatchObject({ phase: "focus", round: 1, remainingMs: 1 * MINUTE });
    expect(sessionState(s, at(25))).toMatchObject({ phase: "break", round: 1, remainingMs: 5 * MINUTE });
    expect(sessionState(s, at(30))).toMatchObject({ phase: "focus", round: 2 });
    expect(sessionState(s, at(60))).toMatchObject({ phase: "focus", round: 3 });
  });

  test("has no break after the last round, then finishes", () => {
    expect(totalMs(s)).toBe(85 * MINUTE);
    expect(sessionState(s, at(84))).toMatchObject({ phase: "focus", round: 3, remainingMs: MINUTE });
    expect(sessionState(s, at(85))).toMatchObject({ phase: "done", round: 3 });
    expect(endsAt(s).toISOString()).toBe("2026-10-15T11:25:00.000Z");
  });

  test("everyone gets the same state for the same moment", () => {
    const now = at(37.5);
    expect(sessionState({ ...s }, now)).toEqual(sessionState(s, now));
  });

  test("progress values stay between 0 and 1", () => {
    for (let m = 0; m < 85; m += 0.5) {
      const st = sessionState(s, at(m));
      expect(st.phaseProgress).toBeGreaterThanOrEqual(0);
      expect(st.phaseProgress).toBeLessThan(1);
      expect(st.overallProgress).toBeLessThan(1);
    }
  });
});

test("formatting", () => {
  expect(formatClock(25 * MINUTE)).toBe("25:00");
  expect(formatClock(61_001)).toBe("01:02");
  expect(formatClock(2 * 60 * MINUTE + 5000)).toBe("2:00:05");
  expect(formatClock(-5)).toBe("00:00");
  expect(formatDuration(85 * MINUTE)).toBe("1 h 25 min");
  expect(formatDuration(45 * MINUTE)).toBe("45 min");
});
