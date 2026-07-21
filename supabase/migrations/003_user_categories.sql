-- Custom per-user budget categories (replaces fixed user_budget_settings columns)
create table if not exists public.user_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  slug text,
  label text not null,
  color text not null default '#84cc16',
  percentage int not null check (percentage >= 0 and percentage <= 100),
  sort_order int not null default 0,
  is_custom boolean not null default false,
  created_at timestamptz default now() not null,
  unique (user_id, slug)
);

create index if not exists user_categories_user_id_idx on public.user_categories (user_id);

alter table public.user_categories enable row level security;

create policy "Users can view own categories"
  on public.user_categories for select
  using (auth.uid() = user_id);

create policy "Users can insert own categories"
  on public.user_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.user_categories for update
  using (auth.uid() = user_id);

create policy "Users can delete own custom categories"
  on public.user_categories for delete
  using (auth.uid() = user_id and is_custom = true);

-- Link expenses to category rows
alter table public.expenses
  add column if not exists category_id uuid references public.user_categories(id);

-- Migrate from legacy text category column when present
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'expenses'
      and column_name = 'category'
  ) then
    insert into public.user_categories (user_id, slug, label, color, percentage, sort_order, is_custom)
    select distinct
      u.id,
      v.slug,
      v.label,
      v.color,
      v.percentage,
      v.sort_order,
      false
    from auth.users u
    cross join (
      values
        ('household', 'Household Expenses', '#DFFF00', 35, 0),
        ('car', 'Car Expenses', '#B8E600', 15, 1),
        ('investments', 'Investments', '#9ACC00', 25, 2),
        ('lifestyle', 'Dine Outs & Shopping', '#E5FF4D', 15, 3),
        ('savings', 'Savings / Emergency', '#C4FF00', 10, 4)
    ) as v(slug, label, color, percentage, sort_order)
    where not exists (
      select 1 from public.user_categories uc
      where uc.user_id = u.id and uc.slug = v.slug
    );

    -- Override percentages from user_budget_settings if that table exists
    if exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = 'user_budget_settings'
    ) then
      update public.user_categories uc
      set percentage = s.household_pct
      from public.user_budget_settings s
      where uc.user_id = s.user_id and uc.slug = 'household';

      update public.user_categories uc
      set percentage = s.car_pct
      from public.user_budget_settings s
      where uc.user_id = s.user_id and uc.slug = 'car';

      update public.user_categories uc
      set percentage = s.investments_pct
      from public.user_budget_settings s
      where uc.user_id = s.user_id and uc.slug = 'investments';

      update public.user_categories uc
      set percentage = s.lifestyle_pct
      from public.user_budget_settings s
      where uc.user_id = s.user_id and uc.slug = 'lifestyle';

      update public.user_categories uc
      set percentage = s.savings_pct
      from public.user_budget_settings s
      where uc.user_id = s.user_id and uc.slug = 'savings';
    end if;

    update public.expenses e
    set category_id = uc.id
    from public.user_categories uc
    where uc.user_id = e.user_id
      and uc.slug = e.category
      and e.category_id is null;

    alter table public.expenses drop constraint if exists expenses_category_check;
    alter table public.expenses drop column if exists category;
  end if;
end $$;

-- Seed defaults for users without categories
insert into public.user_categories (user_id, slug, label, color, percentage, sort_order, is_custom)
select
  u.id,
  v.slug,
  v.label,
  v.color,
  v.percentage,
  v.sort_order,
  false
from auth.users u
cross join (
  values
    ('household', 'Household Expenses', '#DFFF00', 35, 0),
    ('car', 'Car Expenses', '#B8E600', 15, 1),
    ('investments', 'Investments', '#9ACC00', 25, 2),
    ('lifestyle', 'Dine Outs & Shopping', '#E5FF4D', 15, 3),
    ('savings', 'Savings / Emergency', '#C4FF00', 10, 4)
) as v(slug, label, color, percentage, sort_order)
where not exists (
  select 1 from public.user_categories uc where uc.user_id = u.id
);

-- Updated signup handler
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

  insert into public.user_categories (user_id, slug, label, color, percentage, sort_order, is_custom)
  values
    (new.id, 'household', 'Household Expenses', '#DFFF00', 35, 0, false),
    (new.id, 'car', 'Car Expenses', '#B8E600', 15, 1, false),
    (new.id, 'investments', 'Investments', '#9ACC00', 25, 2, false),
    (new.id, 'lifestyle', 'Dine Outs & Shopping', '#E5FF4D', 15, 3, false),
    (new.id, 'savings', 'Savings / Emergency', '#C4FF00', 10, 4, false);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
