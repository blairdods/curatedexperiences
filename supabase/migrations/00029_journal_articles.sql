create table public.journal_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  category text,
  author text,
  published_at date,
  read_time text,
  hero_image text,
  related_journey_slugs text[] default '{}',
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.journal_articles enable row level security;

create policy "service role full access"
  on public.journal_articles for all
  to service_role
  using (true)
  with check (true);

create policy "authenticated users can read"
  on public.journal_articles for select
  to authenticated
  using (true);

create policy "authenticated users can insert"
  on public.journal_articles for insert
  to authenticated
  with check (true);

create policy "authenticated users can update"
  on public.journal_articles for update
  to authenticated
  using (true);

create policy "authenticated users can delete"
  on public.journal_articles for delete
  to authenticated
  using (true);

create policy "anon can read articles"
  on public.journal_articles for select
  to anon
  using (true);

create or replace function update_journal_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger journal_articles_updated_at
  before update on public.journal_articles
  for each row execute function update_journal_updated_at();
