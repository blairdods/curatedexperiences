-- Fix vector dimensions from 1536 to 1024 (voyage-3-large supported dimensions)

-- Drop existing indexes
drop index if exists tours_embedding_idx;
drop index if exists content_embedding_idx;

-- Alter columns to vector(1024)
alter table public.tours alter column embedding type extensions.vector(1024);
alter table public.content alter column embedding type extensions.vector(1024);

-- Recreate indexes
create index tours_embedding_idx on public.tours
  using ivfflat (embedding extensions.vector_cosine_ops) with (lists = 10);
create index content_embedding_idx on public.content
  using ivfflat (embedding extensions.vector_cosine_ops) with (lists = 10);

-- Recreate RPC functions with correct dimensions
create or replace function public.match_content(
  query_embedding extensions.vector(1024),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  type text,
  title text,
  body text,
  region_tags text[],
  journey_ids uuid[],
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    c.id,
    c.type,
    c.title,
    c.body,
    c.region_tags,
    c.journey_ids,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.content c
  where c.status = 'active'
    and c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;

create or replace function public.match_tours(
  query_embedding extensions.vector(1024),
  match_threshold float default 0.7,
  match_count int default 5
)
returns table (
  id uuid,
  slug text,
  title text,
  tagline text,
  regions text[],
  experience_tags text[],
  duration_days int,
  price_from_usd int,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    t.id,
    t.slug,
    t.title,
    t.tagline,
    t.regions,
    t.experience_tags,
    t.duration_days,
    t.price_from_usd,
    1 - (t.embedding <=> query_embedding) as similarity
  from public.tours t
  where t.active = true
    and t.embedding is not null
    and 1 - (t.embedding <=> query_embedding) > match_threshold
  order by t.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Grant service_role full access (fixes permission denied for scripts)
grant all on public.content to service_role;
grant all on public.tours to service_role;
grant all on public.enquiries to service_role;
grant all on public.bookings to service_role;
grant all on public.agent_outputs to service_role;
