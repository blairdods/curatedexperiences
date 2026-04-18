-- ============================================================
-- lead_activities — audit trail for lead interactions
-- ============================================================
create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  type text not null,  -- 'status_change', 'note', 'email_sent', 'assignment', 'score_change'
  description text not null,
  metadata jsonb,      -- e.g. { "from": "new", "to": "nurturing" }
  created_by text,     -- user email or 'system'
  created_at timestamptz default now()
);

create index lead_activities_enquiry_idx on public.lead_activities (enquiry_id, created_at desc);

-- RLS
alter table public.lead_activities enable row level security;

create policy "Authenticated users can manage lead activities"
  on public.lead_activities for all
  to authenticated
  using (true)
  with check (true);
