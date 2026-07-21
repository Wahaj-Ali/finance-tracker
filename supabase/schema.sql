-- Personal Finance Tracker Schema
-- Run this in your Supabase SQL Editor

-- Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Per-user budget category percentages
create table if not exists public.user_budget_settings (
  user_id uuid references auth.users on delete cascade primary key,
  household_pct int not null default 35 check (household_pct >= 0 and household_pct <= 100),
  car_pct int not null default 15 check (car_pct >= 0 and car_pct <= 100),
  investments_pct int not null default 25 check (investments_pct >= 0 and investments_pct <= 100),
  lifestyle_pct int not null default 15 check (lifestyle_pct >= 0 and lifestyle_pct <= 100),
  savings_pct int not null default 10 check (savings_pct >= 0 and savings_pct <= 100),
  updated_at timestamptz default now() not null,
  check (
    household_pct + car_pct + investments_pct + lifestyle_pct + savings_pct = 100
  )
);

alter table public.user_budget_settings enable row level security;

create policy "Users can view own budget settings"
  on public.user_budget_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own budget settings"
  on public.user_budget_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own budget settings"
  on public.user_budget_settings for update
  using (auth.uid() = user_id);

-- Auto-create profile and default budget settings on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.user_budget_settings (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Monthly budgets
create table if not exists public.monthly_budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  year int not null,
  month int not null check (month between 1 and 12),
  salary_pkr numeric not null check (salary_pkr > 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, year, month)
);

alter table public.monthly_budgets enable row level security;

create policy "Users can view own budgets"
  on public.monthly_budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert own budgets"
  on public.monthly_budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own budgets"
  on public.monthly_budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete own budgets"
  on public.monthly_budgets for delete
  using (auth.uid() = user_id);

-- Expenses
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  monthly_budget_id uuid references public.monthly_budgets on delete cascade not null,
  category text not null check (category in ('household', 'car', 'investments', 'lifestyle', 'savings')),
  amount numeric not null check (amount > 0),
  description text,
  expense_date date not null default current_date,
  created_at timestamptz default now() not null
);

create index if not exists expenses_budget_id_idx on public.expenses (monthly_budget_id);
create index if not exists expenses_user_date_idx on public.expenses (user_id, expense_date);

alter table public.expenses enable row level security;

create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);
