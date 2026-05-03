-- ============================================================
-- Tour Costing Module
-- ============================================================

-- COSTING TEMPLATES
-- One per booking. Carries global defaults (FX rate, margin, PAX).
create table public.costing_templates (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references public.bookings(id) on delete cascade,
  version           integer not null default 1,
  fx_rate           numeric not null default 0.60,
  global_margin_pct numeric not null default 25.00,
  market            text default 'USA',
  season            text,
  grade             text,
  pax               integer,
  rooms             integer,
  notes             text,
  prepared_by       text,
  tour_code         text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  constraint unique_booking_version unique (booking_id, version)
);

create index costing_templates_booking_idx on public.costing_templates (booking_id);

create trigger costing_templates_updated_at
  before update on public.costing_templates
  for each row execute function public.handle_updated_at();

-- COSTING SECTIONS
-- 8 predefined sections per template, created automatically on template creation.
create table public.costing_sections (
  id            uuid primary key default gen_random_uuid(),
  template_id   uuid not null references public.costing_templates(id) on delete cascade,
  name          text not null,
  sort_order    integer not null default 0,
  created_at    timestamptz default now()
);

create index costing_sections_template_idx on public.costing_sections (template_id);

-- COSTING LINE ITEMS
-- Individual cost lines within a section.
create table public.costing_line_items (
  id                  uuid primary key default gen_random_uuid(),
  section_id          uuid not null references public.costing_sections(id) on delete cascade,
  day_number          integer,
  supplier_name       text not null,
  service_description text not null,
  quote_type          text not null check (quote_type in ('per_person', 'per_room', 'flat_rate')),
  quantity            integer not null default 1,
  unit_cost_nzd       numeric not null default 0,
  item_margin_pct     numeric,
  total_net_nzd       numeric not null default 0,
  total_gross_nzd     numeric not null default 0,
  notes               text,
  sort_order          integer not null default 0,
  source_option_id    uuid,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index costing_line_items_section_idx on public.costing_line_items (section_id);

create trigger costing_line_items_updated_at
  before update on public.costing_line_items
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.costing_templates enable row level security;
alter table public.costing_sections enable row level security;
alter table public.costing_line_items enable row level security;

create policy "Authenticated users can manage costing templates"
  on public.costing_templates for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage costing sections"
  on public.costing_sections for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can manage costing line items"
  on public.costing_line_items for all
  to authenticated
  using (true)
  with check (true);
