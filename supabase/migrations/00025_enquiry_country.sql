-- Add country capture to enquiries for geographic analytics
alter table public.enquiries
  add column if not exists country text;

create index if not exists enquiries_country_idx on public.enquiries (country);
