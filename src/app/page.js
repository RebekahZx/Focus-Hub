import { Button } from "@/components/Button";
import { DemoTimer } from "@/components/DemoTimer";
import { JoinForm } from "@/components/JoinForm";
import { SiteHeader } from "@/components/SiteHeader";

const steps = [
  {
    title: "Plan the session",
    body: "Give it a title and subject, choose focus and break lengths and how many rounds, then start now or pick a time.",
  },
  {
    title: "Share the link",
    body: "Send the link or the short code to your study group. They can add the session to their calendar in one click.",
  },
  {
    title: "Study on the same clock",
    body: "The timer runs from the session's start time, so everyone sees the same round and the same break, wherever they are.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
          <div>
            <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.02] tracking-tight">
              Study with your group on one shared timer.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-pencil">
              Create a study session, send the link, and everyone works through the same focus and break rounds.
              Write your goals, and open a video room when you want company.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/dashboard" variant="primary" className="px-6 py-3 text-lg">Start a study session</Button>
            </div>
            <div className="mt-6 max-w-sm">
              <JoinForm />
            </div>
          </div>
          <DemoTimer />
        </section>

        <section className="border-t border-grid bg-white/70" aria-labelledby="how-heading">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <h2 id="how-heading" className="text-3xl font-extrabold tracking-tight">How a session works</h2>
            <ol className="mt-8 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span className="font-display text-5xl font-extrabold text-ink/20" aria-hidden="true">{i + 1}</span>
                  <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-pencil">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <footer className="mx-auto max-w-6xl px-5 py-8 text-sm text-pencil">
        Focus Hub, built by Shrinivas Anavekar.{" "}
        <a href="https://github.com/RebekahZx/Focus-Hub" className="underline hover:text-ink">Source on GitHub</a>
      </footer>
    </>
  );
}
