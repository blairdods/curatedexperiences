-- Google Ads attribution, reporting snapshots, and approval-gated ad drafts.

alter table public.enquiries
  add column if not exists capture_surface text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists gclid text,
  add column if not exists gbraid text,
  add column if not exists wbraid text,
  add column if not exists landing_page text;

create index if not exists enquiries_gclid_idx on public.enquiries (gclid)
  where gclid is not null;
create index if not exists enquiries_utm_campaign_idx on public.enquiries (utm_campaign)
  where utm_campaign is not null;

create table public.google_ads_sync_runs (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  status text not null check (status in ('running', 'completed', 'failed', 'skipped')),
  days_back int not null default 7,
  row_counts jsonb not null default '{}'::jsonb,
  error text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.google_ads_campaign_daily (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  date date not null,
  campaign_id text not null,
  campaign_name text not null,
  campaign_status text,
  channel_type text,
  bidding_strategy_type text,
  currency_code text,
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  cost_micros bigint not null default 0,
  conversions numeric not null default 0,
  conversion_value numeric not null default 0,
  ctr numeric,
  average_cpc_micros bigint,
  cost_per_conversion_micros bigint,
  search_impression_share numeric,
  fetched_at timestamptz not null default now(),
  unique (customer_id, date, campaign_id)
);

create table public.google_ads_ad_group_daily (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  date date not null,
  campaign_id text not null,
  campaign_name text not null,
  ad_group_id text not null,
  ad_group_name text not null,
  ad_group_status text,
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  cost_micros bigint not null default 0,
  conversions numeric not null default 0,
  conversion_value numeric not null default 0,
  ctr numeric,
  average_cpc_micros bigint,
  fetched_at timestamptz not null default now(),
  unique (customer_id, date, ad_group_id)
);

create table public.google_ads_search_term_daily (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  date date not null,
  campaign_id text not null,
  campaign_name text not null,
  ad_group_id text not null,
  ad_group_name text not null,
  search_term text not null,
  keyword_text text,
  match_type text,
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  cost_micros bigint not null default 0,
  conversions numeric not null default 0,
  fetched_at timestamptz not null default now(),
  unique (customer_id, date, campaign_id, ad_group_id, search_term)
);

create table public.google_ads_conversion_daily (
  id uuid primary key default gen_random_uuid(),
  customer_id text not null,
  date date not null,
  campaign_id text not null,
  campaign_name text not null,
  conversion_action_id text not null,
  conversion_action_name text,
  conversions numeric not null default 0,
  conversion_value numeric not null default 0,
  all_conversions numeric not null default 0,
  fetched_at timestamptz not null default now(),
  unique (customer_id, date, campaign_id, conversion_action_id)
);

create table public.google_ads_ad_drafts (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('destination', 'journey', 'journal')),
  source_id text not null,
  source_slug text not null,
  source_title text not null,
  campaign_name text not null,
  ad_group_name text not null,
  final_url text not null,
  headlines text[] not null default '{}',
  descriptions text[] not null default '{}',
  keywords text[] not null default '{}',
  negative_keywords text[] not null default '{}',
  selected_asset_ids text[] not null default '{}',
  asset_snapshot jsonb not null default '[]'::jsonb,
  rationale text,
  status text not null default 'draft' check (status in ('draft', 'approved', 'rejected', 'published')),
  generated_by_email text,
  approved_by_email text,
  approved_at timestamptz,
  google_campaign_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index google_ads_campaign_daily_date_idx
  on public.google_ads_campaign_daily (date desc, campaign_id);
create index google_ads_search_term_daily_date_idx
  on public.google_ads_search_term_daily (date desc, campaign_id);
create index google_ads_drafts_status_idx
  on public.google_ads_ad_drafts (status, created_at desc);

create trigger google_ads_ad_drafts_updated_at
  before update on public.google_ads_ad_drafts
  for each row execute function public.handle_updated_at();

alter table public.google_ads_sync_runs enable row level security;
alter table public.google_ads_campaign_daily enable row level security;
alter table public.google_ads_ad_group_daily enable row level security;
alter table public.google_ads_search_term_daily enable row level security;
alter table public.google_ads_conversion_daily enable row level security;
alter table public.google_ads_ad_drafts enable row level security;

create policy "Service role manages Google Ads sync runs"
  on public.google_ads_sync_runs for all to service_role using (true) with check (true);
create policy "Service role manages Google Ads campaign metrics"
  on public.google_ads_campaign_daily for all to service_role using (true) with check (true);
create policy "Service role manages Google Ads ad group metrics"
  on public.google_ads_ad_group_daily for all to service_role using (true) with check (true);
create policy "Service role manages Google Ads search terms"
  on public.google_ads_search_term_daily for all to service_role using (true) with check (true);
create policy "Service role manages Google Ads conversions"
  on public.google_ads_conversion_daily for all to service_role using (true) with check (true);
create policy "Service role manages Google Ads drafts"
  on public.google_ads_ad_drafts for all to service_role using (true) with check (true);

grant all on public.google_ads_sync_runs to service_role;
grant all on public.google_ads_campaign_daily to service_role;
grant all on public.google_ads_ad_group_daily to service_role;
grant all on public.google_ads_search_term_daily to service_role;
grant all on public.google_ads_conversion_daily to service_role;
grant all on public.google_ads_ad_drafts to service_role;
