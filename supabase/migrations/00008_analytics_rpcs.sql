-- ============================================================
-- Analytics RPC functions for dashboard charts
-- ============================================================

-- Leads grouped by time period
create or replace function public.leads_over_time(
  period_type text default 'week',
  from_date timestamptz default now() - interval '90 days',
  to_date timestamptz default now()
)
returns table(period timestamptz, count bigint)
language sql stable
as $$
  select date_trunc(period_type, created_at) as period, count(*)
  from public.enquiries
  where created_at >= from_date and created_at <= to_date
  group by 1 order by 1;
$$;

-- Bookings revenue grouped by time period
create or replace function public.bookings_revenue_over_time(
  period_type text default 'month',
  from_date timestamptz default now() - interval '365 days',
  to_date timestamptz default now()
)
returns table(period timestamptz, total_revenue numeric, booking_count bigint)
language sql stable
as $$
  select date_trunc(period_type, created_at) as period,
         coalesce(sum(total_value_usd), 0) as total_revenue,
         count(*) as booking_count
  from public.bookings
  where created_at >= from_date and created_at <= to_date
  group by 1 order by 1;
$$;
