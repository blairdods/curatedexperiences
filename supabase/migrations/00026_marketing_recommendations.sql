create table public.marketing_recommendations (
  id uuid primary key default gen_random_uuid(),
  recommendation text not null,
  rationale text,
  action_type text check (action_type in ('reallocate_budget', 'increase_spend', 'decrease_spend', 'pause_campaign', 'other')),
  from_market text,
  to_market text,
  amount_usd numeric,
  status text default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  approved_by_email text,
  approved_at timestamptz,
  generated_at timestamptz default now(),
  data_snapshot jsonb
);

grant all on public.marketing_recommendations to service_role;
grant select, insert, update on public.marketing_recommendations to authenticated;
