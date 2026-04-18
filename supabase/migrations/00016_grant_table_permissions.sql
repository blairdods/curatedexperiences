-- Grant table-level permissions to Supabase roles
-- Tables created by migrations need explicit GRANTs for API access

grant all on user_roles to service_role;
grant select on user_roles to authenticated;

grant all on audit_log to service_role;
grant select on audit_log to authenticated;

grant all on email_templates to service_role;
grant select on email_templates to authenticated;

grant all on content_versions to service_role;
grant select on content_versions to authenticated;

grant all on journey_availability to service_role;
grant select, insert, update, delete on journey_availability to authenticated;
