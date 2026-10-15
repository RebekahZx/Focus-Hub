"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function SiteHeader() {
  const { data: session, status } = useSession();
  return (
    <header className="border-b border-grid bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          Focus Hub
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard" className="font-bold hover:underline">My sessions</Link>
              <span className="hidden text-pencil sm:inline">{session.user?.name}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-pencil hover:text-ink hover:underline">
                Sign out
              </button>
            </>
          ) : status === "unauthenticated" ? (
            <Link href="/user-auth" className="font-bold hover:underline">Sign in</Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
