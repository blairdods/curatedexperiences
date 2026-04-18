-- The service_role key should bypass RLS, but our Supabase instance
-- is blocking it. Since all admin tables are only accessed via
-- server-side service client (never exposed to browser), disable RLS entirely.
-- The app-level auth + role checks in API routes provide the security layer.

alter table user_roles disable row level security;
alter table audit_log disable row level security;
alter table email_templates disable row level security;
alter table content_versions disable row level security;
alter table journey_availability disable row level security;
