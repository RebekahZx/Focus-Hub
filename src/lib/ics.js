import { endsAt } from "./pomodoro";

const stamp = (d) => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** iCalendar event for a study session, so people can add it to any calendar app. */
export function buildIcs(session, url, now = new Date()) {
  const plan = `${session.rounds} × ${session.focusMin} min focus, ${session.breakMin} min breaks`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Focus Hub//Study sessions//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${session.code}@focus-hub`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(session.startsAt)}`,
    `DTEND:${stamp(endsAt(session))}`,
    `SUMMARY:${esc(`Study session: ${session.title}`)}`,
    `DESCRIPTION:${esc(`${session.subject ? session.subject + ". " : ""}${plan}. Join: ${url}`)}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}
