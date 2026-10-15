# Focus Hub

[![build](https://github.com/RebekahZx/Focus-Hub/actions/workflows/build.yml/badge.svg)](https://github.com/RebekahZx/Focus-Hub/actions/workflows/build.yml)

A website for online study sessions. Plan a session, send the link to your study group, and
everyone works through the same focus and break rounds on one shared timer. Each person keeps a
private goal list, and there's an optional video room for studying with cameras on.

Built with Next.js 15 (App Router), NextAuth (Google and GitHub sign-in), MongoDB through
Mongoose, and Tailwind CSS.

## What you can do

- **Plan a session.** Set a title and subject, then choose:
  - focus length: 25, 45, 50 or 90 minutes;
  - break length: 5, 10 or 15 minutes;
  - number of rounds: 1 to 8;
  - a start time: now, or a set time up to 60 days ahead.
- **Share it.** Every session gets a short code like `k7mp-x3vd` and a link. Guests join with
  either, and **Add to calendar** downloads an `.ics` event for any calendar app.
- **Study on the same clock.** Everyone sees the same round, the same break and the same time
  left. The page title shows the countdown, and an optional chime plays at each change.
- **Track goals.** Write down what you want to finish and tick items off. Goals stay in your
  browser and are visible only to you.
- **Study with company.** The video room is an embedded Jitsi Meet call that opens only when you
  choose. Microphone and camera start off.
- **Manage your sessions.** Your dashboard lists live, upcoming and past sessions you host.
  The host can delete a session.

## How the shared timer works

There is no realtime server. A session stores only its start time and settings. Each browser
works out the current phase from those and the clock (`src/lib/pomodoro.js`):

```
cycle   = focus + break
elapsed = now − startsAt
round   = floor(elapsed / cycle) + 1
phase   = focus if (elapsed mod cycle) < focus, otherwise break   (no break after the last round)
```

Everyone with the same session data sees the same state, as long as their device clocks are
roughly right.

## Project layout

```
src/
  app/
    page.js                       landing page with a live sample timer
    dashboard/page.jsx            create a session, join by code, your sessions
    s/[code]/page.jsx             the study room: timer, goals, video, invite, calendar
    user-auth/page.jsx            sign in (shows only configured providers)
    api/sessions/route.js         POST create, GET your sessions
    api/sessions/[code]/route.js  GET one session, DELETE (host only)
  lib/
    pomodoro.js                   timer state from start time + settings
    session.js                    input validation, session codes, link parsing
    ics.js                        calendar export
    auth.js                       NextAuth config
  models/                         Mongoose models: StudySession, User
  middleware.js                   sign-in required for /dashboard and /s/*
```

## Run locally

```bash
npm install
cp .env.example .env.local     # MongoDB URI, NEXTAUTH_SECRET, and at least one OAuth app
npm run dev                    # http://localhost:3000
```

Create the OAuth apps in GitHub (Settings → Developer settings → OAuth Apps) and/or Google Cloud
Console. Use the callback URLs listed in `.env.example`.

**Deploying on Vercel:** add the same variables in the project settings. `NEXTAUTH_URL` should
be the production URL, and the OAuth apps need that URL's callback too.

## Tests

```bash
npm test
```

- **Unit tests (15).** The timer covers waiting, focus, break, the last round and finishing.
  Input validation, session codes, link parsing and the calendar export are also tested.
- **API integration tests.** These run the session routes against a real MongoDB. They cover
  sign-in checks, validation, create, list, fetch, host-only delete and malformed codes.
  GitHub Actions runs them with a MongoDB service; locally they're skipped unless
  `MONGODB_URI_TEST` is set.

## Limitations

- **Anyone with the link can join.** Any signed-in person with the link or code can join; there
  is no waiting room or member list.
- **Timer accuracy.** The shared timer depends on each person's device clock being roughly right.
- **Video server.** The public `meet.jit.si` server may limit how long embedded calls last. For
  regular use, set `NEXT_PUBLIC_JITSI_DOMAIN` to your own Jitsi server or a JaaS domain.

## Author

Shrinivas Anavekar · MIT License
