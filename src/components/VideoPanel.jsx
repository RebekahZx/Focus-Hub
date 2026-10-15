"use client";
import { useState } from "react";

const DOMAIN = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "meet.jit.si";

// Optional "study with me" video room. Closed by default; mic and camera start off.
export function VideoPanel({ code, name }) {
  const [open, setOpen] = useState(false);
  const display = encodeURIComponent(JSON.stringify(name || "Student"));
  const src =
    `https://${DOMAIN}/FocusHub-${code}` +
    `#userInfo.displayName=${display}` +
    "&config.prejoinPageEnabled=false&config.startWithAudioMuted=true&config.startWithVideoMuted=true";

  return (
    <section className="sheet p-5" aria-labelledby="video-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="video-heading" className="text-xl font-bold">Video room</h2>
          <p className="text-sm text-pencil">Study with cameras on for company. Your mic and camera start off.</p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-md border border-ink/25 bg-white px-4 py-2 font-bold hover:border-ink"
          aria-expanded={open}
        >
          {open ? "Leave video room" : "Join video room"}
        </button>
      </div>
      {open && (
        <iframe
          title="Study session video room"
          src={src}
          className="mt-4 aspect-video w-full rounded-md border border-grid"
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
        />
      )}
    </section>
  );
}
