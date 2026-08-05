# Study OS — Dashboard (Phase 2)

The dashboard reads straight from the Supabase tables your `anki-sync.js`
script has been filling. It shows:

- **Summary strip** — reviews today, total backlog, review streak, 7-day retention
- **Heatmap** — 18 weeks of review activity, colored by accuracy (teal = strong, amber = shaky, red = weak)
- **Backlog by deck** — how many cards are due, per deck, from your latest sync
- **Weakest tags** — the tags with the lowest retention, sorted worst-first

This is a separate small project from the sync script — it lives in its own
`dashboard` folder so the two can be worked on independently.

## 1. Get your publishable key

This app runs in the browser, so it must use the **publishable** key, never
the secret one. In Supabase: Project Settings → API → copy the key starting
with `sb_publishable_...`.

(Your secret key stays only in the sync script's `.env` — never put it here.)

## 2. Set up the project

```bash
cd dashboard
npm install
cp .env.example .env
```

Open `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

## 3. Run it locally

```bash
npm run dev
```

This prints a local address, usually `http://localhost:5173`. Open that in
your browser — you should see the dashboard populated with your real Anki
data.

If it's empty or errors, the most likely cause is that `anki-sync.js` hasn't
been run yet, or the `.env` values don't match your Supabase project.

## 4. Install it on your phone (PWA)

Once it's running locally, you can preview it on your phone over your home
Wi-Fi:

```bash
npm run dev -- --host
```

This prints a network address like `http://192.168.1.x:5173` — open that on
your phone's browser (same Wi-Fi network), then use "Add to Home Screen"
(iOS Safari) or the install prompt (Android Chrome). It'll behave like a
native app icon.

For access from anywhere (not just home Wi-Fi), the next step is deploying
it — see below.

## 5. Deploy it so it's always reachable (optional, recommended)

The easiest free option is **Vercel** or **Netlify** — both deploy a Vite
project in a few clicks:

1. Push this `dashboard` folder to a private GitHub repo.
2. Sign into Vercel (or Netlify) with GitHub, import the repo.
3. In the project's environment variable settings, add the same two
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` values from your `.env`.
4. Deploy. You'll get a permanent URL you can install as a PWA from any network.

Since it's a private repo and the publishable key is safe to expose (that's
what it's designed for), this is fine to do without extra auth — the data
itself is still protected by Supabase's row-level security on the tables.

## What's next (Phase 3)

Once this is up and running for a few days, we'll add the weakness engine
and daily task generator on top of this same data — turning the "weakest
tags" table into an actual ranked to-do list for the day.
