alter table public.destinations
  add column sort_order integer;

with ordered_destinations as (
  select
    id,
    row_number() over (
      order by region asc, name asc, id asc
    ) - 1 as position
  from public.destinations
)
update public.destinations as destination
set sort_order = ordered_destinations.position
from ordered_destinations
where destination.id = ordered_destinations.id;

alter table public.destinations
  alter column sort_order set default 0,
  alter column sort_order set not null;

create index destinations_sort_order_idx
  on public.destinations (sort_order, name);
