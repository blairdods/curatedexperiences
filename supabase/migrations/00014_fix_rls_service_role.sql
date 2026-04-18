-- Fix RLS: allow service_role full access to new tables
-- The service_role should bypass RLS by default, but we need explicit policies
-- for tables where only select was granted to authenticated

-- user_roles: service_role needs insert/update/delete
create policy "Service role can manage user_roles"
  on user_roles for all
  to service_role
  using (true)
  with check (true);

-- audit_log: service_role needs insert
create policy "Service role can insert audit_log"
  on audit_log for insert
  to service_role
  with check (true);

-- email_templates: service_role needs update
create policy "Service role can manage email_templates"
  on email_templates for all
  to service_role
  using (true)
  with check (true);

-- content_versions: service_role needs insert
create policy "Service role can manage content_versions"
  on content_versions for all
  to service_role
  using (true)
  with check (true);

-- journey_availability: service_role needs full access
create policy "Service role can manage journey_availability"
  on journey_availability for all
  to service_role
  using (true)
  with check (true);

-- Add Blair as admin
insert into user_roles (email, role, display_name)
values ('blairdods@gmail.com', 'admin', 'Blair')
on conflict (email) do nothing;
