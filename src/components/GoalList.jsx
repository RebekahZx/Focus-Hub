"use client";
import { useEffect, useState } from "react";

// Personal goals for this session, kept in this browser only.
export function GoalList({ code }) {
  const key = `focus-hub:goals:${code}`;
  const [goals, setGoals] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      setGoals(JSON.parse(localStorage.getItem(key) || "[]"));
    } catch {
      setGoals([]);
    }
  }, [key]);

  const save = (next) => {
    setGoals(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };

  const add = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    save([...goals, { id: Date.now(), text: t.slice(0, 120), done: false }]);
    setText("");
  };

  const doneCount = goals.filter((g) => g.done).length;

  return (
    <section className="sheet p-5" aria-labelledby="goals-heading">
      <div className="flex items-baseline justify-between">
        <h2 id="goals-heading" className="text-xl font-bold">My goals</h2>
        {goals.length > 0 && <span className="text-sm text-pencil">{doneCount} of {goals.length} done</span>}
      </div>
      <p className="mt-1 text-sm text-pencil">Only you can see these.</p>
      <form onSubmit={add} className="mt-3 flex gap-2">
        <label htmlFor="goal" className="sr-only">New goal</label>
        <input id="goal" className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Finish problems 1–6" />
        <button className="rounded-md bg-ink px-3 font-bold text-white hover:bg-ink-soft">Add</button>
      </form>
      {goals.length === 0 ? (
        <p className="mt-4 text-sm text-pencil">Write down what you want to finish in this session.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {goals.map((g) => (
            <li key={g.id} className="flex items-start gap-3">
              <input
                id={`g-${g.id}`}
                type="checkbox"
                checked={g.done}
                onChange={() => save(goals.map((x) => (x.id === g.id ? { ...x, done: !x.done } : x)))}
                className="mt-1 h-4 w-4 accent-ink"
              />
              <label htmlFor={`g-${g.id}`} className={`flex-1 ${g.done ? "text-pencil line-through" : ""}`}>{g.text}</label>
              <button
                onClick={() => save(goals.filter((x) => x.id !== g.id))}
                className="text-sm text-pencil hover:text-redpen"
                aria-label={`Remove goal: ${g.text}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
