-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create custom types
create type user_role as enum ('user', 'admin', 'super_admin');

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  full_name text,
  avatar_url text,
  plan_tier text default 'free',
  role user_role default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20),
  constraint username_format check (username ~* '^[a-z0-9_]+$')
);

-- Username table for quick lookups (case-insensitive)
create table public.usernames (
  username text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for case-insensitive username lookup
create index usernames_lower_idx on usernames (lower(username));

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email)
  values (new.id, new.raw_user_meta_data->>'username', new.email);
  
  insert into public.usernames (username, user_id)
  values (lower(new.raw_user_meta_data->>'username'), new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.usernames enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Policies for usernames
create policy "Usernames are viewable by everyone."
  on usernames for select
  using ( true );

create policy "Usernames can be inserted during signup."
  on usernames for insert
  with check ( true );

-- Admin policies
create policy "Admins can view all profiles."
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can update any profile."
  on profiles for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role in ('admin', 'super_admin')
    )
  );

-- Function to check username availability
create or replace function public.check_username_available(username_to_check text)
returns boolean as $$
begin
  return not exists (
    select 1 from public.usernames
    where lower(username) = lower(username_to_check)
  );
end;
$$ language plpgsql security definer;

