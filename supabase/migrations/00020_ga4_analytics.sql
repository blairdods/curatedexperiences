-- GA4 daily aggregated metrics from Google Analytics Data API
create table public.ga4_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  source text default '',
  medium text default '',
  campaign text default '',
  users int default 0,
  new_users int default 0,
  sessions int default 0,
  engaged_sessions int default 0,
  pageviews int default 0,
  engagement_rate numeric,
  bounce_rate numeric,
  avg_session_duration_seconds numeric,
  conversions int default 0,
  total_revenue numeric default 0,
  snapshot jsonb,
  fetched_at timestamptz default now()
);

-- Google Search Console daily metrics
create table public.search_console_metrics (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  query text default '',
  page text default '',
  impressions int default 0,
  clicks int default 0,
  ctr numeric,
  avg_position numeric,
  fetched_at timestamptz default now()
);

-- GA4 event conversion goals (e.g. form_submit, booking_enquiry)
create table public.ga4_event_goals (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  event_name text not null,
  event_count int default 0,
  unique_users int default 0,
  event_value numeric default 0,
  fetched_at timestamptz default now()
);

-- Unique constraints (values default to '' so simple column uniqueness works)
alter table public.ga4_daily_metrics add constraint uq_ga4_metrics unique (date, source, medium, campaign);
alter table public.search_console_metrics add constraint uq_sc_metrics unique (date, query, page);
alter table public.ga4_event_goals add constraint uq_ga4_events unique (date, event_name);

-- Performance indexes
create index ga4_daily_metrics_date_idx on public.ga4_daily_metrics (date desc);
create index ga4_daily_metrics_source_idx on public.ga4_daily_metrics (source);
create index search_console_metrics_date_idx on public.search_console_metrics (date desc);
create index ga4_event_goals_date_idx on public.ga4_event_goals (date desc);

-- RLS: service_role only (internal analytics data)
alter table public.ga4_daily_metrics enable row level security;
alter table public.search_console_metrics enable row level security;
alter table public.ga4_event_goals enable row level security;

create policy "Service role can manage ga4_daily_metrics"
  on public.ga4_daily_metrics for all
  to service_role
  using (true)
  with check (true);

create policy "Service role can manage search_console_metrics"
  on public.search_console_metrics for all
  to service_role
  using (true)
  with check (true);

create policy "Service role can manage ga4_event_goals"
  on public.ga4_event_goals for all
  to service_role
  using (true)
  with check (true);

-- Grant permissions
grant all on public.ga4_daily_metrics to service_role;
grant all on public.search_console_metrics to service_role;
grant all on public.ga4_event_goals to service_role;
