-- Switch from Voyage (1024 dims) to Supabase gte-small (384 dims)

-- Drop existing indexes
drop index if exists tours_embedding_idx;
drop index if exists content_embedding_idx;

-- Clear all existing embeddings (wrong dimensions)
update public.tours set embedding = null;
update public.content set embedding = null;

-- Alter columns to vector(384)
alter table public.tours alter column embedding type extensions.vector(384);
alter table public.content alter column embedding type extensions.vector(384);

-- Recreate indexes using HNSW (better for small datasets than IVFFlat)
create index tours_embedding_idx on public.tours
  using hnsw (embedding extensions.vector_cosine_ops);
create index content_embedding_idx on public.content
  using hnsw (embedding extensions.vector_cosine_ops);

-- Recreate RPC functions with 384 dimensions
create or replace function public.match_content(
  query_embedding extensions.vector(384),
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
  query_embedding extensions.vector(384),
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
