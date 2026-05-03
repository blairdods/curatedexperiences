"use client";

import { useState } from "react";
import { TextArea } from "@/components/admin/ui/form-field";

const MIGRATION_SQL = `-- COSTING TEMPLATES
create table if not exists public.costing_templates (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references public.bookings(id) on delete cascade,
  version           integer not null default 1,
  fx_rate           numeric not null default 0.60,
  global_margin_pct numeric not null default 25.00,
  market            text default 'USA',
  season            text,
  grade             text,
  pax               integer,
  rooms             integer,
  notes             text,
  prepared_by       text,
  tour_code         text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  constraint unique_booking_version unique (booking_id, version)
);
create index if not exists costing_templates_booking_idx on public.costing_templates (booking_id);
create or replace trigger costing_templates_updated_at
  before update on public.costing_templates
  for each row execute function public.handle_updated_at();

-- COSTING SECTIONS
create table if not exists public.costing_sections (
  id            uuid primary key default gen_random_uuid(),
  template_id   uuid not null references public.costing_templates(id) on delete cascade,
  name          text not null,
  sort_order    integer not null default 0,
  created_at    timestamptz default now()
);
create index if not exists costing_sections_template_idx on public.costing_sections (template_id);

-- COSTING LINE ITEMS
create table if not exists public.costing_line_items (
  id                  uuid primary key default gen_random_uuid(),
  section_id          uuid not null references public.costing_sections(id) on delete cascade,
  day_number          integer,
  supplier_name       text not null,
  service_description text not null,
  quote_type          text not null check (quote_type in ('per_person', 'per_room', 'flat_rate')),
  quantity            integer not null default 1,
  unit_cost_nzd       numeric not null default 0,
  item_margin_pct     numeric,
  total_net_nzd       numeric not null default 0,
  total_gross_nzd     numeric not null default 0,
  notes               text,
  sort_order          integer not null default 0,
  source_option_id    uuid,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index if not exists costing_line_items_section_idx on public.costing_line_items (section_id);
create or replace trigger costing_line_items_updated_at
  before update on public.costing_line_items
  for each row execute function public.handle_updated_at();

-- RLS
alter table public.costing_templates enable row level security;
alter table public.costing_sections enable row level security;
alter table public.costing_line_items enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can manage costing templates' and tablename = 'costing_templates') then
    create policy "Authenticated users can manage costing templates" on public.costing_templates for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can manage costing sections' and tablename = 'costing_sections') then
    create policy "Authenticated users can manage costing sections" on public.costing_sections for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can manage costing line items' and tablename = 'costing_line_items') then
    create policy "Authenticated users can manage costing line items" on public.costing_line_items for all to authenticated using (true) with check (true);
  end if;
end $$;`;

export default function DatabaseAdminPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSupabase = () => {
    window.open(
      "https://supabase.com/dashboard/project/bwpbvdmdwjqguiliymnq/sql/new",
      "_blank",
    );
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight mb-2">
        Database Migrations
      </h1>
      <p className="text-sm text-foreground-muted mb-6">
        Run pending migrations or copy SQL to run in the Supabase SQL Editor.
      </p>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-5 border border-warm-200">
          <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
            Migration 00019 — Tour Costing Module
          </h2>
          <p className="text-sm text-foreground-muted mb-4">
            Creates costing_templates, costing_sections, and costing_line_items tables
            with indexes, triggers, and RLS policies.
          </p>
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleOpenSupabase}
              className="text-xs px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
            >
              Open Supabase SQL Editor
            </button>
            <button
              onClick={handleCopy}
              className="text-xs px-4 py-2 border border-navy/20 text-navy rounded-lg hover:bg-navy/5 transition-colors"
            >
              {copied ? "Copied!" : "Copy SQL"}
            </button>
          </div>
          <TextArea
            value={MIGRATION_SQL}
            onChange={() => {}}
            rows={16}
          />
          <p className="text-xs text-foreground-muted mt-2">
            Paste this SQL into the Supabase SQL Editor and click Run. All statements
            use IF NOT EXISTS, so it's safe to re-run.
          </p>
        </div>
      </div>
    </div>
  );
}
