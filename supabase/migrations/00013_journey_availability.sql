-- Journey availability windows with seasonal pricing
create table if not exists journey_availability (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references tours(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  capacity int not null default 1,
  booked_count int not null default 0,
  price_usd numeric,
  status text not null default 'available' check (status in ('available', 'limited', 'unavailable')),
  notes text,
  created_at timestamptz default now(),
  check (end_date >= start_date)
);

-- RLS
alter table journey_availability enable row level security;

create policy "Authenticated users can read journey availability"
  on journey_availability for select
  to authenticated
  using (true);
