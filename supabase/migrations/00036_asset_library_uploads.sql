-- Admin-managed platform asset library. The existing TNZ catalogue remains
-- file-backed; this table stores assets uploaded through the admin dashboard.

create table if not exists public.asset_library_assets (
  id uuid primary key default gen_random_uuid(),
  asset_id text unique not null,
  title text not null,
  alt_text text,
  description text,
  region text,
  location text,
  licence text not null,
  ad_status text not null default 'pending'
    check (ad_status in ('approved', 'not_approved', 'pending')),
  tags text[] not null default '{}',
  credit text,
  copyright text,
  usage_notes text,
  source_url text,
  original_filename text not null,
  storage_path text unique not null,
  public_url text not null,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  image_metadata jsonb not null default '{}'::jsonb,
  uploaded_by uuid references auth.users(id) on delete set null,
  uploaded_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_asset_library_created
  on public.asset_library_assets (created_at desc);
create index if not exists idx_asset_library_region
  on public.asset_library_assets (region);
create index if not exists idx_asset_library_tags
  on public.asset_library_assets using gin (tags);

create or replace function public.update_asset_library_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists asset_library_updated_at on public.asset_library_assets;
create trigger asset_library_updated_at
  before update on public.asset_library_assets
  for each row execute function public.update_asset_library_updated_at();

alter table public.asset_library_assets enable row level security;

create policy "service role manages asset library"
  on public.asset_library_assets for all
  to service_role
  using (true)
  with check (true);

create policy "authenticated users read asset library"
  on public.asset_library_assets for select
  to authenticated
  using (true);

grant all on public.asset_library_assets to service_role;
grant select on public.asset_library_assets to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'asset-library',
  'asset-library',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
