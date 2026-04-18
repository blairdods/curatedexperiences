-- User roles for RBAC
create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text unique not null,
  role text not null check (role in ('admin', 'curator', 'analyst')),
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Seed Tony & Liam as admins (update emails when confirmed)
insert into user_roles (email, role, display_name)
values
  ('tony@curatedexperiences.com', 'admin', 'Tony'),
  ('liam@curatedexperiences.com', 'admin', 'Liam')
on conflict (email) do nothing;

-- RLS: authenticated users can read
alter table user_roles enable row level security;

create policy "Authenticated users can read roles"
  on user_roles for select
  to authenticated
  using (true);
