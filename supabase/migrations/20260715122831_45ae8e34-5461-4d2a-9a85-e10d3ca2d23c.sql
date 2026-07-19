
-- Roles enum + user_roles table
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Users manage own profile" on public.profiles for all
  to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Saved travellers
create table public.saved_travellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  first_name text not null,
  last_name text not null,
  dob date,
  id_number text,
  nationality text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.saved_travellers to authenticated;
grant all on public.saved_travellers to service_role;
alter table public.saved_travellers enable row level security;
create policy "Users manage own travellers" on public.saved_travellers for all
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reference text not null unique,
  from_station text not null,
  to_station text not null,
  travel_date date not null,
  travel_time text,
  class text,
  status text not null default 'confirmed',
  price_egp numeric(10,2),
  passenger_count int not null default 1,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "Users manage own bookings" on public.bookings for all
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Saved journeys
create table public.saved_journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  from_station text not null,
  to_station text not null,
  last_searched timestamptz not null default now(),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.saved_journeys to authenticated;
grant all on public.saved_journeys to service_role;
alter table public.saved_journeys enable row level security;
create policy "Users manage own journeys" on public.saved_journeys for all
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null default 'info',
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "Users view own notifications" on public.notifications for select
  to authenticated using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications for update
  to authenticated using (auth.uid() = user_id);
