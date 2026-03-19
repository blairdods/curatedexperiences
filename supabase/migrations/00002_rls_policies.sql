-- ============================================================
-- Row Level Security policies
-- ============================================================

-- tours: public read for active tours, authenticated write
alter table public.tours enable row level security;

create policy "Public can read active tours"
  on public.tours for select
  using (active = true);

create policy "Authenticated users can manage tours"
  on public.tours for all
  to authenticated
  using (true)
  with check (true);

-- enquiries: authenticated only (admin)
alter table public.enquiries enable row level security;

create policy "Authenticated users can manage enquiries"
  on public.enquiries for all
  to authenticated
  using (true)
  with check (true);

-- Allow anonymous inserts for public lead form
create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  to anon
  with check (true);

-- content: public read for active content, authenticated write
alter table public.content enable row level security;

create policy "Public can read active content"
  on public.content for select
  using (status = 'active');

create policy "Authenticated users can manage content"
  on public.content for all
  to authenticated
  using (true)
  with check (true);

-- bookings: authenticated only
alter table public.bookings enable row level security;

create policy "Authenticated users can manage bookings"
  on public.bookings for all
  to authenticated
  using (true)
  with check (true);

-- agent_outputs: authenticated only
alter table public.agent_outputs enable row level security;

create policy "Authenticated users can manage agent outputs"
  on public.agent_outputs for all
  to authenticated
  using (true)
  with check (true);
