create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  region text not null check (region in ('North Island', 'South Island')),
  tagline text,
  description text,
  highlights text[],
  best_for text[],
  best_seasons text,
  related_journey_slugs text[],
  hero_image text,
  images jsonb default '[]'::jsonb,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.destinations enable row level security;

create policy "service role full access"
  on public.destinations for all
  to service_role
  using (true)
  with check (true);

create policy "authenticated users can read destinations"
  on public.destinations for select
  to authenticated
  using (true);

create policy "authenticated users can insert destinations"
  on public.destinations for insert
  to authenticated
  with check (true);

create policy "authenticated users can update destinations"
  on public.destinations for update
  to authenticated
  using (true);

create policy "authenticated users can delete destinations"
  on public.destinations for delete
  to authenticated
  using (true);

-- Public read (for the public-facing site)
create policy "anon can read active destinations"
  on public.destinations for select
  to anon
  using (active = true);

grant all on public.destinations to service_role;
grant select, insert, update, delete on public.destinations to authenticated;
grant select on public.destinations to anon;
