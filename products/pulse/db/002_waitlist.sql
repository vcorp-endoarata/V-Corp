-- V-Corp Pulse — Waitlist table
-- Applied to: vcorp-pulse (Supabase project ueurwfnwhxwkkqbweysh)
-- Date: 2026-05-02

create table if not exists waitlist (
  id           uuid primary key default uuid_generate_v4(),
  email        text not null unique,
  source       text,                 -- 'lp' / 'twitter' / 'referral' / 'other'
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  referrer     text,
  ip_hash      text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_waitlist_created on waitlist(created_at desc);

alter table waitlist enable row level security;

-- 認証なしの公開フォームから insert を許可、select はサービスロールのみ。
drop policy if exists "anon can insert waitlist" on waitlist;
create policy "anon can insert waitlist" on waitlist
  for insert
  with check (true);
