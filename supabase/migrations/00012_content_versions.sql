-- Content versioning for rollback support
create table if not exists content_versions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references content(id) on delete cascade,
  version int not null,
  title text,
  body text,
  type text,
  region_tags text[],
  status text,
  created_by text,
  change_note text,
  created_at timestamptz default now()
);

create index idx_content_versions on content_versions (content_id, version desc);

-- RLS
alter table content_versions enable row level security;

create policy "Authenticated users can read content versions"
  on content_versions for select
  to authenticated
  using (true);
