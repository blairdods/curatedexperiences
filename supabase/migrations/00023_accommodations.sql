-- ============================================================
-- Accommodations
-- Standalone property database with Platinum / Gold / Silver tiers
-- ============================================================

create table public.accommodations (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  tier                text not null check (tier in ('platinum', 'gold', 'silver')),
  region              text not null,
  location            text,
  property_type       text check (property_type in ('lodge', 'hotel', 'boutique_hotel', 'camp', 'villa', 'retreat', 'other')),
  description         text,
  nightly_rate_nzd_min integer,
  nightly_rate_nzd_max integer,
  highlights          text[],
  images              jsonb default '[]'::jsonb,
  contact_name        text,
  contact_email       text,
  contact_phone       text,
  website_url         text,
  contracted          boolean default false,
  notes               text,
  active              boolean default true,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index accommodations_tier_idx      on public.accommodations (tier);
create index accommodations_region_idx    on public.accommodations (region);
create index accommodations_contracted_idx on public.accommodations (contracted);
create index accommodations_active_idx    on public.accommodations (active) where active = true;

create trigger accommodations_updated_at
  before update on public.accommodations
  for each row execute function public.handle_updated_at();

-- RLS: only authenticated users can read/write
alter table public.accommodations enable row level security;

create policy "Authenticated users can manage accommodations"
  on public.accommodations for all
  to authenticated
  using (true)
  with check (true);

-- Explicit grants required for Supabase API access
grant all on public.accommodations to service_role;
grant select, insert, update, delete on public.accommodations to authenticated;
