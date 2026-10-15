// Validation and helpers for study sessions, shared by the API and the UI.

export const LIMITS = {
  title: { min: 1, max: 80 },
  subject: { max: 40 },
  focusMin: { min: 10, max: 90 },
  breakMin: { min: 2, max: 30 },
  rounds: { min: 1, max: 8 },
};

const DAY = 24 * 60 * 60 * 1000;
const MAX_AHEAD = 60 * DAY;
const GRACE = 5 * 60 * 1000;

function intIn(value, { min, max }) {
  const n = Number(value);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

/** Returns { ok: true, value } or { ok: false, errors: { field: message } }. */
export function validateSessionInput(input, now = Date.now()) {
  const errors = {};
  const src = input && typeof input === "object" ? input : {};

  const title = typeof src.title === "string" ? src.title.trim() : "";
  if (title.length < LIMITS.title.min) errors.title = "Give the session a title.";
  else if (title.length > LIMITS.title.max) errors.title = `Keep the title under ${LIMITS.title.max} characters.`;

  const subject = typeof src.subject === "string" ? src.subject.trim() : "";
  if (subject.length > LIMITS.subject.max) errors.subject = `Keep the subject under ${LIMITS.subject.max} characters.`;

  const focusMin = intIn(src.focusMin, LIMITS.focusMin);
  if (focusMin === null) errors.focusMin = `Focus length must be ${LIMITS.focusMin.min}–${LIMITS.focusMin.max} minutes.`;
  const breakMin = intIn(src.breakMin, LIMITS.breakMin);
  if (breakMin === null) errors.breakMin = `Break length must be ${LIMITS.breakMin.min}–${LIMITS.breakMin.max} minutes.`;
  const rounds = intIn(src.rounds, LIMITS.rounds);
  if (rounds === null) errors.rounds = `Rounds must be ${LIMITS.rounds.min}–${LIMITS.rounds.max}.`;

  let startsAt = null;
  if (src.startsAt === "now" || src.startsAt === undefined) {
    startsAt = new Date(now);
  } else {
    const t = new Date(src.startsAt).getTime();
    if (Number.isNaN(t)) errors.startsAt = "Pick a valid start time.";
    else if (t < now - GRACE) errors.startsAt = "The start time is in the past.";
    else if (t > now + MAX_AHEAD) errors.startsAt = "Schedule sessions at most 60 days ahead.";
    else startsAt = new Date(t);
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { title, subject, focusMin, breakMin, rounds, startsAt } };
}

// No 0/o/1/l/i, so codes are easy to read aloud and type.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
export const CODE_RE = /^[a-hj-km-np-z2-9]{4}-[a-hj-km-np-z2-9]{4}$/;

export function makeCode(randomBytes = (n) => crypto.getRandomValues(new Uint8Array(n))) {
  const bytes = randomBytes(8);
  let s = "";
  for (let i = 0; i < 8; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

/** Accepts a bare code or a full session link; returns the code or null. */
export function parseCode(input) {
  if (typeof input !== "string") return null;
  const match = input.trim().toLowerCase().match(/([a-z0-9]{4}-[a-z0-9]{4})\/?(?:[?#].*)?$/);
  return match && CODE_RE.test(match[1]) ? match[1] : null;
}

export function toPublicSession(doc) {
  return {
    code: doc.code,
    title: doc.title,
    subject: doc.subject || "",
    focusMin: doc.focusMin,
    breakMin: doc.breakMin,
    rounds: doc.rounds,
    startsAt: new Date(doc.startsAt).toISOString(),
    hostName: doc.hostName || "",
    hostEmail: doc.hostEmail,
  };
}
