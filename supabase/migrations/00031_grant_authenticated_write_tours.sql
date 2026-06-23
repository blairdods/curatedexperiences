-- Grant authenticated users write access to the tours table.
-- The RLS policy "Authenticated users can manage tours" already exists
-- (migration 00002) but without a table-level GRANT the policy is never
-- reached — Postgres blocks the operation before evaluating RLS.

grant select, insert, update, delete on public.tours to authenticated;
