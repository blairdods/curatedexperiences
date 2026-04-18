-- Audit log for tracking all admin actions
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  changes jsonb,
  user_email text,
  created_at timestamptz default now()
);

create index idx_audit_entity on audit_log (entity_type, entity_id);
create index idx_audit_created on audit_log (created_at desc);
create index idx_audit_user on audit_log (user_email);

-- RLS: authenticated users can read, service client writes
alter table audit_log enable row level security;

create policy "Authenticated users can read audit log"
  on audit_log for select
  to authenticated
  using (true);
