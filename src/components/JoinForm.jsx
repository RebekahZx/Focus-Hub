"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseCode } from "@/lib/session";

export function JoinForm({ compact = false }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const code = parseCode(value);
    if (!code) return setError("Enter a code like abcd-efgh, or paste the session link.");
    router.push(`/s/${code}`);
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="join" className={compact ? "sr-only" : "label"}>Join with a code or link</label>
      <div className="flex gap-2">
        <input
          id="join"
          className="field"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          placeholder="abcd-efgh"
          aria-invalid={!!error}
          aria-describedby={error ? "join-error" : undefined}
          autoComplete="off"
        />
        <button className="shrink-0 rounded-md border border-ink/25 bg-white px-4 font-bold hover:border-ink">Join</button>
      </div>
      {error && <p id="join-error" className="mt-1 text-sm text-redpen">{error}</p>}
    </form>
  );
}
