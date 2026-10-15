"use client";
import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

function SignIn() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const error = params.get("error");
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    getProviders().then((p) => setProviders(p ? Object.values(p) : []));
  }, []);

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Sign in to study</h1>
      <p className="mt-3 text-pencil">
        You need an account to create a session or join one. Your name is shown to the people you study with.
      </p>
      {error && (
        <p className="mt-4 rounded-md border border-redpen/40 bg-white p-3 text-sm text-redpen" role="alert">
          Sign-in didn&apos;t finish. Try again, or use the other option below.
        </p>
      )}
      <div className="mt-8 space-y-3">
        {providers === null && <p className="text-pencil">Loading sign-in options…</p>}
        {providers?.length === 0 && (
          <p className="text-redpen">No sign-in methods are configured on this server. See the README.</p>
        )}
        {providers?.map((p) => (
          <button
            key={p.id}
            onClick={() => signIn(p.id, { callbackUrl })}
            className="w-full rounded-md border border-ink/25 bg-white px-4 py-3 font-bold hover:border-ink"
          >
            Continue with {p.name}
          </button>
        ))}
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <Suspense>
        <SignIn />
      </Suspense>
    </>
  );
}
