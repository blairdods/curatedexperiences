-- Fix critical security issues flagged by Supabase security advisor (May 2026)
--
-- Issue 1: Migration 00015 disabled RLS on 5 tables to work around a
--   service_role access problem. The real fix was migration 00016 (table-level
--   GRANTs). Now that GRANTs are in place, RLS can be safely re-enabled.
--
-- Issue 2: Migration 00021 granted anon SELECT on sensitive tables
--   (enquiries, bookings, lead_activities) that contain customer PII and
--   financial data. The anon key is public (NEXT_PUBLIC_SUPABASE_ANON_KEY),
--   so this exposed that data to anyone. Revoke those grants.

-- ============================================================
-- Fix 1: Re-enable RLS on the 5 tables from migration 00015
-- ============================================================

alter table public.user_roles enable row level security;
alter table public.audit_log enable row level security;
alter table public.email_templates enable row level security;
alter table public.content_versions enable row level security;
alter table public.journey_availability enable row level security;

-- Policies already exist from migrations 00009–00013 and 00014,
-- so no new policies needed — RLS is the only missing piece.

-- ============================================================
-- Fix 2: Revoke anon SELECT from sensitive tables
-- ============================================================

-- enquiries: customer PII (name, email, phone). Anon INSERT is correct
--   (public lead form), but anon SELECT is not.
revoke select on public.enquiries from anon;

-- bookings: financial data (total_value_usd, cost_breakdown, guests).
--   Should never be anon-readable.
revoke select on public.bookings from anon;

-- lead_activities: CRM activity log. Internal only.
revoke select on public.lead_activities from anon;

-- email_templates: email body HTML. No reason for public access.
revoke select on public.email_templates from anon;

-- agent_outputs: internal AI agent results. Internal only.
revoke select on public.agent_outputs from anon;

-- tours and content: intentionally public-read — leave anon SELECT in place.
-- (These are backed by RLS policies "Public can read active tours/content"
--  so anon can only read active, published records.)
