-- Enable required extensions
create extension if not exists "vector" with schema extensions;
create extension if not exists "btree_gist";  -- for daterange indexing

-- ============================================================
-- tours
-- ============================================================
create table public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text,
  journey_type text[],
  duration_days int,
  price_from_usd int,
  regions text[],
  experience_tags text[],
  theme_tags text[],
  ideal_for text[],
  seasons text[],
  highlights text[],
  inclusions text[],
  itinerary_days jsonb[],
  media jsonb[],
  supplier_ids uuid[],
  testimonial_ids uuid[],
  embedding extensions.vector(1536),
  customisable boolean default true,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index tours_embedding_idx on public.tours
  using ivfflat (embedding extensions.vector_cosine_ops) with (lists = 10);
create index tours_active_idx on public.tours (active) where active = true;
create index tours_regions_idx on public.tours using gin (regions);

-- ============================================================
-- enquiries
-- ============================================================
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  source text,
  utm_campaign text,
  zip_code text,
  journey_interest uuid[],
  travel_dates daterange,
  group_size int,
  group_composition text,
  interests text[],
  journey_type_pref text,
  budget_signal text default 'none',
  intent_score int,
  ai_brief text,
  status text default 'new',
  assigned_to text,
  nurture_sequence text,
  notes text,
  created_at timestamptz default now(),
  last_contact_at timestamptz
);

create index enquiries_status_idx on public.enquiries (status);
create index enquiries_assigned_idx on public.enquiries (assigned_to);
create index enquiries_created_idx on public.enquiries (created_at desc);

-- ============================================================
-- content
-- ============================================================
create table public.content (
  id uuid primary key default gen_random_uuid(),
  type text,
  title text,
  body text,
  source_type text,
  source_id uuid,
  region_tags text[],
  journey_ids uuid[],
  embedding extensions.vector(1536),
  status text default 'active',
  approved_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index content_embedding_idx on public.content
  using ivfflat (embedding extensions.vector_cosine_ops) with (lists = 10);
create index content_type_idx on public.content (type);
create index content_status_idx on public.content (status);

-- ============================================================
-- bookings
-- ============================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid references public.enquiries(id),
  tour_id uuid references public.tours(id),
  custom_itinerary jsonb,
  start_date date,
  end_date date,
  guests jsonb[],
  total_value_usd decimal,
  cost_breakdown jsonb,
  gross_margin_pct decimal,
  deposit_amount decimal,
  deposit_paid_at timestamptz,
  balance_due_date date,
  balance_paid_at timestamptz,
  supplier_bookings jsonb[],
  documents text[],
  status text default 'confirmed',
  post_trip_review text,
  created_at timestamptz default now()
);

create index bookings_enquiry_idx on public.bookings (enquiry_id);
create index bookings_tour_idx on public.bookings (tour_id);
create index bookings_status_idx on public.bookings (status);

-- ============================================================
-- agent_outputs
-- ============================================================
create table public.agent_outputs (
  id uuid primary key default gen_random_uuid(),
  agent_name text,
  output_type text,
  content text,
  status text default 'pending',
  metadata jsonb,
  cost_usd decimal,
  created_at timestamptz default now()
);

create index agent_outputs_agent_idx on public.agent_outputs (agent_name, created_at desc);
create index agent_outputs_status_idx on public.agent_outputs (status);

-- ============================================================
-- updated_at trigger function
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tours_updated_at
  before update on public.tours
  for each row execute function public.handle_updated_at();

create trigger content_updated_at
  before update on public.content
  for each row execute function public.handle_updated_at();
