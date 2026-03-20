-- RPC function for cosine similarity search on content
create or replace function public.match_content(
  query_embedding extensions.vector(1536),
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

-- RPC function for cosine similarity search on tours
create or replace function public.match_tours(
  query_embedding extensions.vector(1536),
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
