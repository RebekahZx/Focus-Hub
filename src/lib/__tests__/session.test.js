import { describe, expect, test } from "vitest";
import { CODE_RE, makeCode, parseCode, toPublicSession, validateSessionInput } from "../session";
import { buildIcs } from "../ics";

const now = Date.parse("2026-10-15T10:00:00Z");
const good = { title: "  Calculus problem set ", subject: "Maths", focusMin: 25, breakMin: 5, rounds: 4, startsAt: "now" };

describe("validateSessionInput", () => {
  test("accepts a valid session and trims text", () => {
    const r = validateSessionInput(good, now);
    expect(r.ok).toBe(true);
    expect(r.value).toMatchObject({ title: "Calculus problem set", subject: "Maths", rounds: 4 });
    expect(r.value.startsAt.getTime()).toBe(now);
  });

  test("accepts numbers sent as strings from a form", () => {
    expect(validateSessionInput({ ...good, focusMin: "50", breakMin: "10", rounds: "2" }, now).ok).toBe(true);
  });

  test("schedules a future start", () => {
    const r = validateSessionInput({ ...good, startsAt: "2026-10-16T09:00:00Z" }, now);
    expect(r.value.startsAt.toISOString()).toBe("2026-10-16T09:00:00.000Z");
  });

  test("reports every invalid field", () => {
    const r = validateSessionInput({ title: " ", subject: "x".repeat(41), focusMin: 5, breakMin: 1.5, rounds: 9, startsAt: "nope" }, now);
    expect(r.ok).toBe(false);
    expect(Object.keys(r.errors).sort()).toEqual(["breakMin", "focusMin", "rounds", "startsAt", "subject", "title"]);
  });

  test("rejects past and far-future start times", () => {
    expect(validateSessionInput({ ...good, startsAt: "2026-10-15T09:00:00Z" }, now).errors.startsAt).toMatch(/past/);
    expect(validateSessionInput({ ...good, startsAt: "2027-10-15T09:00:00Z" }, now).errors.startsAt).toMatch(/60 days/);
  });

  test("handles missing or non-object bodies", () => {
    expect(validateSessionInput(null, now).ok).toBe(false);
    expect(validateSessionInput("title", now).ok).toBe(false);
  });
});

describe("codes", () => {
  test("generated codes are readable and match the pattern", () => {
    for (let i = 0; i < 200; i++) {
      const c = makeCode();
      expect(c).toMatch(CODE_RE);
      expect(c).not.toMatch(/[01oil]/);
    }
  });

  test("parseCode accepts codes and links, rejects junk", () => {
    expect(parseCode("abcd-efgh")).toBe("abcd-efgh");
    expect(parseCode("  ABCD-EFGH ")).toBe("abcd-efgh");
    expect(parseCode("https://focus-hub.app/s/abcd-efgh")).toBe("abcd-efgh");
    expect(parseCode("https://focus-hub.app/s/abcd-efgh?x=1")).toBe("abcd-efgh");
    expect(parseCode("abcd-efg")).toBeNull();
    expect(parseCode("abc1-efgh")).toBeNull();
    expect(parseCode(42)).toBeNull();
  });
});

test("toPublicSession and calendar export", () => {
  const s = toPublicSession({
    code: "abcd-efgh", title: "Essay, draft 2", subject: "", focusMin: 25, breakMin: 5, rounds: 2,
    startsAt: new Date("2026-10-15T10:00:00Z"), hostName: "Jay", hostEmail: "j@example.com", extra: "dropped",
  });
  expect(s).not.toHaveProperty("extra");
  const ics = buildIcs(s, "https://x.test/s/abcd-efgh", new Date("2026-10-15T09:00:00Z"));
  expect(ics).toContain("DTSTART:20261015T100000Z");
  expect(ics).toContain("DTEND:20261015T105500Z");
  expect(ics).toContain("SUMMARY:Study session: Essay\\, draft 2");
  expect(ics.split("\r\n").length).toBeGreaterThan(10);
});
