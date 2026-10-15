"use client";
import { useMemo } from "react";
import { sessionState } from "@/lib/pomodoro";
import { TimerFace } from "./TimerFace";
import { useNow } from "./useNow";

// A live sample session on the home page: 4 rounds of 25 minutes, starting now.
export function DemoTimer() {
  const now = useNow(1000);
  const demo = useMemo(() => ({ startsAt: new Date().toISOString(), focusMin: 25, breakMin: 5, rounds: 4 }), []);
  const state = now ? sessionState(demo, now) : sessionState(demo, new Date(demo.startsAt).getTime());
  return (
    <div className="sheet p-6 sm:p-8">
      <p className="text-sm text-pencil">Sample session</p>
      <h2 className="mt-1 text-2xl font-bold">Organic chemistry, chapter 7</h2>
      <div className="mt-6">
        <TimerFace state={state} />
      </div>
      <ul className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Who is studying">
        {["Priya", "Jay", "Lena", "Marco"].map((n) => (
          <li key={n} className="rounded-full border border-grid bg-paper px-3 py-1">{n}</li>
        ))}
      </ul>
    </div>
  );
}
