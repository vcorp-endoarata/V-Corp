-- V-Corp Pulse — Initial schema
-- Apply to: Supabase project under V-Corp (Pro) organization
-- Version: 0.1.0
-- Date: 2026-05-02

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================
do $$ begin
  create type pulse_plan as enum ('starter', 'pro', 'business', 'enterprise', 'lifetime');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
exception when duplicate_object then null; end $$;

do $$ begin
  create type briefing_status as enum ('queued', 'processing', 'completed', 'failed');
exception when duplicate_object then null; end $$;

-- ============================================================
-- Tenants (= 顧客企業)
-- ============================================================
create table if not exists tenants (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  plan         pulse_plan not null default 'starter',
  stripe_customer_id text unique,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- Users (Supabase auth.users との 1:1 リンク)
-- ============================================================
create table if not exists users (
  id           uuid primary key,                  -- = auth.users.id
  tenant_id    uuid not null references tenants(id) on delete cascade,
  email        text not null,
  display_name text,
  role         text not null default 'member' check (role in ('owner','admin','member','viewer')),
  created_at   timestamptz not null default now()
);
create index if not exists idx_users_tenant on users(tenant_id);

-- ============================================================
-- Subscriptions
-- ============================================================
create table if not exists subscriptions (
  id                     uuid primary key default uuid_generate_v4(),
  tenant_id              uuid not null references tenants(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id        text not null,
  plan                   pulse_plan not null,
  status                 subscription_status not null default 'trialing',
  current_period_end     timestamptz,
  created_at             timestamptz not null default now()
);
create index if not exists idx_subscriptions_tenant on subscriptions(tenant_id);

-- ============================================================
-- KPI metrics (顧客が登録する任意のKPI)
-- ============================================================
create table if not exists kpi_metrics (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  name        text not null,
  unit        text,
  source      text,                 -- 'manual' / 'stripe' / 'shopify' / 'api'
  created_at  timestamptz not null default now()
);
create index if not exists idx_kpi_tenant on kpi_metrics(tenant_id);

create table if not exists kpi_values (
  id          uuid primary key default uuid_generate_v4(),
  metric_id   uuid not null references kpi_metrics(id) on delete cascade,
  value       numeric not null,
  observed_at timestamptz not null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_kpi_values_metric_time on kpi_values(metric_id, observed_at desc);

-- ============================================================
-- AI Daily Briefings (毎朝7:00に1テナントにつき1件生成)
-- ============================================================
create table if not exists briefings (
  id           uuid primary key default uuid_generate_v4(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  brief_date   date not null,
  status       briefing_status not null default 'queued',
  summary_md   text,
  actions      jsonb,                -- [{ title, why, owner }]
  model        text,                 -- e.g. 'claude-opus-4-7'
  tokens_in    integer,
  tokens_out   integer,
  created_at   timestamptz not null default now(),
  unique (tenant_id, brief_date)
);
create index if not exists idx_briefings_tenant_date on briefings(tenant_id, brief_date desc);

-- ============================================================
-- On-demand Strategy Reports
-- ============================================================
create table if not exists reports (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  user_id     uuid references users(id) on delete set null,
  title       text not null,
  prompt      text not null,
  output_md   text,
  status      briefing_status not null default 'queued',
  model       text,
  tokens_in   integer,
  tokens_out  integer,
  cost_jpy    numeric(12,4),
  created_at  timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists idx_reports_tenant_created on reports(tenant_id, created_at desc);

-- ============================================================
-- Audit log
-- ============================================================
create table if not exists audit_logs (
  id          bigserial primary key,
  tenant_id   uuid references tenants(id) on delete cascade,
  user_id     uuid references users(id) on delete set null,
  action      text not null,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Updated_at triggers
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;$$;

drop trigger if exists tenants_set_updated_at on tenants;
create trigger tenants_set_updated_at before update on tenants
for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security (基本ポリシー)
-- ============================================================
alter table tenants        enable row level security;
alter table users          enable row level security;
alter table subscriptions  enable row level security;
alter table kpi_metrics    enable row level security;
alter table kpi_values     enable row level security;
alter table briefings      enable row level security;
alter table reports        enable row level security;
alter table audit_logs     enable row level security;

-- 認証済みユーザーは自分のテナントだけ read/write 可。
-- Postgres 17 でも `create policy if not exists` は未対応のため、drop → create で冪等化。
drop policy if exists "tenant read self" on tenants;
create policy "tenant read self" on tenants
  for select using (id in (select tenant_id from users where id = auth.uid()));

drop policy if exists "users see own tenant" on users;
create policy "users see own tenant" on users
  for select using (tenant_id in (select tenant_id from users where id = auth.uid()));

drop policy if exists "subscriptions read own tenant" on subscriptions;
create policy "subscriptions read own tenant" on subscriptions
  for select using (tenant_id in (select tenant_id from users where id = auth.uid()));

drop policy if exists "kpi_metrics read own tenant" on kpi_metrics;
create policy "kpi_metrics read own tenant" on kpi_metrics
  for select using (tenant_id in (select tenant_id from users where id = auth.uid()));

drop policy if exists "kpi_values read own tenant" on kpi_values;
create policy "kpi_values read own tenant" on kpi_values
  for select using (
    metric_id in (
      select id from kpi_metrics
      where tenant_id in (select tenant_id from users where id = auth.uid())
    )
  );

drop policy if exists "briefings read own tenant" on briefings;
create policy "briefings read own tenant" on briefings
  for select using (tenant_id in (select tenant_id from users where id = auth.uid()));

drop policy if exists "reports read own tenant" on reports;
create policy "reports read own tenant" on reports
  for select using (tenant_id in (select tenant_id from users where id = auth.uid()));
