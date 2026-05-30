-- Add narrative field to tours table (the long-form editorial description shown on public journey pages)
alter table public.tours add column if not exists narrative text;
