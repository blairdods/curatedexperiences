-- Grant table-level SELECT to anon role for agent-accessible tables
-- The anon key is used by AI agents (CMO, Content, Analytics) to query marketing data
-- RLS policies already exist for content (public read active), but table-level GRANTs are also needed

grant usage on schema public to anon;

grant select on public.enquiries to anon;
grant select on public.content to anon;
grant select on public.email_templates to anon;
grant select on public.agent_outputs to anon;
grant select on public.lead_activities to anon;
grant select on public.bookings to anon;
grant select on public.tours to anon;

-- Grant insert on agent_outputs so agents can save their briefs
grant insert on public.agent_outputs to anon;

-- Grant execute on analytics RPCs for anon
grant execute on function public.leads_over_time to anon;
grant execute on function public.bookings_revenue_over_time to anon;
