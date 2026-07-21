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

-- Seed default settings for new users
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

-- Backfill settings for existing users
insert into public.user_budget_settings (user_id)
select id from auth.users
where id not in (select user_id from public.user_budget_settings)
on conflict (user_id) do nothing;
