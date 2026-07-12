-- Supplier-directory Property ID is the stable identifier used by spreadsheet imports.
alter table public.accommodations
  add column if not exists property_id text;

-- Backfill IDs written into notes by the historical command-line importer.
with extracted as (
  select
    id,
    upper(btrim(substring(notes from 'Supplier directory ID:[[:space:]]*([^|]+)'))) as candidate
  from public.accommodations
  where property_id is null
    and notes like '%Supplier directory ID:%'
), ranked as (
  select
    id,
    candidate,
    row_number() over (partition by candidate order by id) as duplicate_rank
  from extracted
  where candidate is not null and candidate <> ''
)
update public.accommodations as accommodation
set property_id = ranked.candidate
from ranked
where accommodation.id = ranked.id
  and ranked.duplicate_rank = 1;

alter table public.accommodations
  drop constraint if exists accommodations_property_id_key;

alter table public.accommodations
  add constraint accommodations_property_id_key unique (property_id);
