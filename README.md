# Focus Hub

[![build](https://github.com/RebekahZx/Focus-Hub/actions/workflows/build.yml/badge.svg)](https://github.com/RebekahZx/Focus-Hub/actions/workflows/build.yml)

A video-meeting web app. Sign in with Google or GitHub, start an instant meeting or create a
link for later, and share it. Anyone signed in who opens the link joins the same room. Built
with Next.js 15 (App Router), NextAuth, MongoDB and Tailwind/shadcn UI; the calls run on
embedded [Jitsi Meet](https://jitsi.org).

## Features

- **Sign-in.** Google and GitHub OAuth through NextAuth. On first sign-in, a user record is
  created in MongoDB.
- **Protected routes.** Middleware sends signed-out visitors to `/user-auth`, so the home page
  and meeting rooms need a session.
- **Meetings.**
  - "Start an instant meeting" opens a new room at `/video-meeting/<uuid>`.
  - "Create a meeting for later" gives you a link to copy.
  - "Join" accepts either a code or a full link.
- **In the call.** Jitsi provides camera, microphone, screen sharing and chat. Your display
  name comes from your account, and the room has a "Copy link" button.
- **Light and dark themes** via `next-themes`.

## How it fits together

```
src/
  middleware.js                      session check for /, /user-auth and /video-meeting/*
  app/
    api/auth/[...nextauth]/route.js  OAuth providers, JWT sessions, create user on first sign-in
    user-auth/page.jsx               sign-in page
    page.js                          home: meeting actions + feature carousel
    video-meeting/[roomId]/page.jsx  meeting room (Jitsi iframe, room id validated)
  components/                        Header, MeetingAction, MeetingFeature, shadcn/ui primitives
  lib/dbConnect.js                   cached Mongoose connection
  models/User.js                     user schema
```

## Run locally

```bash
npm install
cp .env.example .env.local     # fill in MongoDB, NextAuth secret and the OAuth app keys
npm run dev                    # http://localhost:3000
```

You need two OAuth apps: one in GitHub (Settings → Developer settings → OAuth Apps) and one in
Google Cloud Console. Use the callback URLs listed in `.env.example`.

**About the call server.** By default, rooms are hosted on the public `meet.jit.si` server.
That server is meant for trying things out when embedded in another site, and it may limit
call length or ask participants to log in. For real use, set `NEXT_PUBLIC_JITSI_DOMAIN` to
your own Jitsi server or a JaaS (Jitsi as a Service) domain.

## Fixed in the latest revision

- **Meetings didn't exist.** Every meeting link sent you to a page that was never built (404).
  The meeting room is now implemented.
- **The build failed.** The `uuid` package was used but not listed as a dependency.
- **GitHub sign-in could fail.** The user record required a name, and many GitHub profiles have
  none. Sign-in now uses the normalised NextAuth user (name falls back to the email handle).
- **Access tokens were logged.** OAuth tokens and profiles were printed to the server log, and
  the GitHub access token was copied into the session token. Both are removed.
- **Config errors.** The middleware read a misspelt environment variable, and the sign-in page
  path was missing its leading `/`.
- **Duplicate config.** There were two Tailwind and two PostCSS configs, and the one Tailwind
  actually loaded had no dark-mode setting. They're merged into one each, and the theme
  provider now sets the class Tailwind reads.
- **Borrowed branding.** The pages hotlinked Google Meet's illustrations and promised features
  the app doesn't have (Google Calendar scheduling, host admission). They now use local images
  and describe what the app does.
- **Housekeeping.** Removed commented-out duplicate code, the leftover merge-conflict markers in
  this README, and an unused dependency. Added `.env.example` and a CI build.

## Not implemented

- No meeting scheduling or calendar invites.
- No host controls or waiting room. Anyone signed in with the link can join.
- No meeting history.

## Author

Shrinivas Anavekar · MIT License
