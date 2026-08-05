-- =========================================================
-- Study OS — Phase 4 schema addition
-- Run this in Supabase: Project → SQL Editor → New query → Run
-- (Adds to the tables from Phase 0/1 — doesn't touch them)
-- =========================================================

-- Generic store for handbook pages that change on a schedule:
-- weekly plans (one per ISO week) and the semester plan (one current record).
create table if not exists handbook_entries (
  id bigserial primary key,
  entry_type text not null,        -- 'weekly_plan' | 'semester_plan' | 'reflection'
  period_key text not null,        -- e.g. '2026-W36' for a week, 'current' for semester plan
  content jsonb not null default '{}',
  updated_at timestamptz default now(),
  unique (entry_type, period_key)
);

-- Checklist item state. checklist_key encodes which checklist + which period,
-- e.g. 'daily:2026-08-03' or 'weekly:2026-W36' or 'semester:current' —
-- daily checklists naturally reset each day because the key changes.
create table if not exists checklist_state (
  id bigserial primary key,
  checklist_key text not null,
  item_key text not null,
  checked boolean not null default false,
  updated_at timestamptz default now(),
  unique (checklist_key, item_key)
);

alter table handbook_entries enable row level security;
alter table checklist_state enable row level security;

create policy "owner full access handbook" on handbook_entries
  for all using (true) with check (true);
create policy "owner full access checklist" on checklist_state
  for all using (true) with check (true);
