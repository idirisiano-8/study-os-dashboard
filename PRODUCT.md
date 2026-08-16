# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 18 + Vite 5, Supabase client (`@supabase/supabase-js`), Framer Motion, Lucide icons. PWA via `vite-plugin-pwa`. Data is populated by a separate `anki-sync.js` script in the parent Study OS repo — this dashboard reads only; it does not sync Anki itself. Dev: `npm run dev` (port 5173). Deploy target: Vercel or Netlify with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Users

Primary user: Idirisiano — a medical student balancing school lectures, USMLE Step 1 prep, Anki review, and personal scheduling (gym, football). Opens the app daily on desktop or phone (PWA) to orient the day, not to replace Anki itself.

Secondary audience: friends who may receive the repo or deployed URL — the product is not built for anonymous or multi-tenant use.

## Product Purpose

Study OS Dashboard is a personal study command center. It pulls real Anki review and backlog data (via Supabase) into one surface alongside weekly plans, semester plans, daily checklists, and narrative readiness signals — so the user knows what to study today, why it matters, and whether they are on track.

Success means all three at once:

1. **Clear priorities** — ranked daily focus, not just raw stats.
2. **Accountability** — streaks, checklists, and plans that keep habits visible.
3. **Study health at a glance** — backlog, retention, weak tags, leeches, and fatigue signals in one place.

## Positioning

A unified study OS: Anki data, weekly/semester planning, and daily rituals in one app. Neighboring tools show Anki stats or host a planner; Study OS connects synced review reality to planning and daily execution in a single PWA tuned to one person's med-school workflow.

## Operating Context

- **Data pipeline:** `anki-sync.js` (separate project) writes to Supabase tables (`anki_reviews`, `daily_snapshots`, handbook entries). Dashboard is read-mostly; handbook fields (weekly plan, semester plan, checklists) are edited in-app and persisted via Supabase.
- **Daily rhythm:** 45–60 min Anki review window, same-day lecture review, targeted questions, new cards from today's understanding, optional gym/football — tracked via daily checklist in Mission Hero.
- **Planning cadence:** Weekly plan (school focus, Step 1 focus, backlog targets, day-by-day grid); semester plan; checklists tab.
- **Surfaces:** Dashboard (metrics, heatmap, weak tags, leeches, readiness, reflection), Weekly plan, Semester plan, Checklists. Bottom nav on mobile; tab nav on desktop.
- **Sync indicator:** Last-synced timestamp in masthead; empty state when sync has not run or `.env` is misconfigured.

## Capabilities and Constraints

**Current (Phase 2):**

- Summary strip: reviews today, total backlog, review streak, 7-day retention.
- 18-week review heatmap (accuracy-colored).
- Backlog by deck, weakest tags, leeches, calibration, study sessions, wins strip, reflection.
- Weakness scoring and top-task ranking (`DailyTasks`) blending backlog urgency and retention fragility.
- Mission Hero with daily checklist and time estimate.
- Weekly / semester planning with autosave to Supabase handbook.
- Dark/light theme toggle (persisted in `localStorage`).
- PWA installable on phone via `--host` dev or deployed URL.

**Planned (Phase 3 — per README, partially started):**

- Weakness engine and daily task generator turning weak-tag data into a ranked to-do list for the day.

**Constraints:**

- Browser must use Supabase **publishable** key only; secret key stays in sync script.
- Row-level security on Supabase tables protects data; no extra auth layer in the app today.
- AnKing-style deck/tag paths are displayed shortened (`displayName`) but matched on raw values.
- Private personal data — sharing the deploy URL is intentional but not a product requirement.

## Brand Commitments

- Product name: **Study OS** (dashboard is Phase 2 of the broader Study OS effort).
- Masthead and document title: **Idirisiano** — personal brand, not a generic "Study OS" label in the UI shell.
- Voice: direct, operational, student-facing — greetings by time of day, concrete time estimates, no corporate filler.

## Evidence on Hand

- Real Anki review and snapshot data via Supabase (no mock/demo datasets in production path).
- AnKing-style deck and tag naming conventions in live data.
- Med-school-specific planning fields (school focus, Step 1 focus, backlog targets).
- No testimonials, case studies, press, or third-party proof assets — future work must not fabricate these.

## Product Principles

1. **Reality over aspiration** — surface synced Anki data and saved plans; do not show stats the sync has not produced.
2. **One surface for orientation** — the user should leave knowing today's priority, not hunting across Anki, spreadsheets, and notes.
3. **Accountability without guilt** — streaks and checklists motivate; fatigue and readiness narratives flag overload without shaming.
4. **Personal first** — optimize for one workflow (med school + Step 1 + daily rituals); resist generic dashboard patterns that dilute that focus.
5. **Phone-ready** — PWA behavior and bottom nav matter as much as desktop; the daily open often happens on mobile.

## Accessibility & Inclusion

No product-specific accessibility standard confirmed yet. Baseline expectation: readable in light and dark themes, usable on mobile viewports; formal WCAG target undecided.
