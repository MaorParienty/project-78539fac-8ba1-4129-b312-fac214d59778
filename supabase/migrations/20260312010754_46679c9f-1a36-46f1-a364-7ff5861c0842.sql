
-- Shared accounts system
create table public.shared_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'חשבון משותף',
  created_by uuid not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  created_at timestamptz not null default now()
);

create table public.shared_account_members (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.shared_accounts(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique(account_id, user_id)
);

alter table public.shared_accounts enable row level security;
alter table public.shared_account_members enable row level security;

-- Security definer function for shared data access
create or replace function public.can_access_user_data(_requester_id uuid, _data_owner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select _requester_id = _data_owner_id
  or exists (
    select 1 from public.shared_account_members m1
    join public.shared_account_members m2 on m1.account_id = m2.account_id
    where m1.user_id = _requester_id and m2.user_id = _data_owner_id
  )
$$;

-- RLS on shared_accounts
create policy "Members can view their shared accounts"
on public.shared_accounts for select to authenticated
using (exists (
  select 1 from public.shared_account_members where account_id = id and user_id = auth.uid()
));

create policy "Users can create shared accounts"
on public.shared_accounts for insert to authenticated
with check (auth.uid() = created_by);

create policy "Creators can delete shared accounts"
on public.shared_accounts for delete to authenticated
using (auth.uid() = created_by);

-- RLS on shared_account_members
create policy "Members can view account members"
on public.shared_account_members for select to authenticated
using (exists (
  select 1 from public.shared_account_members m where m.account_id = account_id and m.user_id = auth.uid()
));

create policy "Users can add themselves or creators can add"
on public.shared_account_members for insert to authenticated
with check (
  auth.uid() = user_id
  or exists (
    select 1 from public.shared_accounts where id = account_id and created_by = auth.uid()
  )
);

create policy "Users can remove themselves or creators can remove"
on public.shared_account_members for delete to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.shared_accounts where id = account_id and created_by = auth.uid()
  )
);

-- Update transactions RLS for shared access
drop policy if exists "Users can view their own transactions" on public.transactions;
drop policy if exists "Users can create their own transactions" on public.transactions;
drop policy if exists "Users can update their own transactions" on public.transactions;
drop policy if exists "Users can delete their own transactions" on public.transactions;

create policy "View accessible transactions" on public.transactions for select to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Create own transactions" on public.transactions for insert to authenticated
with check (auth.uid() = user_id);
create policy "Update accessible transactions" on public.transactions for update to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Delete accessible transactions" on public.transactions for delete to authenticated
using (public.can_access_user_data(auth.uid(), user_id));

-- Update payments RLS
drop policy if exists "Users can view their own payments" on public.payments;
drop policy if exists "Users can create their own payments" on public.payments;
drop policy if exists "Users can update their own payments" on public.payments;
drop policy if exists "Users can delete their own payments" on public.payments;

create policy "View accessible payments" on public.payments for select to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Create own payments" on public.payments for insert to authenticated
with check (auth.uid() = user_id);
create policy "Update accessible payments" on public.payments for update to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Delete accessible payments" on public.payments for delete to authenticated
using (public.can_access_user_data(auth.uid(), user_id));

-- Update budgets RLS
drop policy if exists "Users can view their own budgets" on public.budgets;
drop policy if exists "Users can create their own budgets" on public.budgets;
drop policy if exists "Users can update their own budgets" on public.budgets;
drop policy if exists "Users can delete their own budgets" on public.budgets;

create policy "View accessible budgets" on public.budgets for select to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Create own budgets" on public.budgets for insert to authenticated
with check (auth.uid() = user_id);
create policy "Update accessible budgets" on public.budgets for update to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Delete accessible budgets" on public.budgets for delete to authenticated
using (public.can_access_user_data(auth.uid(), user_id));

-- Update profiles RLS
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

create policy "View accessible profiles" on public.profiles for select to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Update own profile" on public.profiles for update to authenticated
using (auth.uid() = user_id);
create policy "Insert own profile" on public.profiles for insert to authenticated
with check (auth.uid() = user_id);

-- Update categories RLS
drop policy if exists "Users can view their own categories" on public.categories;
drop policy if exists "Users can create their own categories" on public.categories;
drop policy if exists "Users can update their own categories" on public.categories;
drop policy if exists "Users can delete their own categories" on public.categories;

create policy "View accessible categories" on public.categories for select to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Create own categories" on public.categories for insert to authenticated
with check (auth.uid() = user_id);
create policy "Update accessible categories" on public.categories for update to authenticated
using (public.can_access_user_data(auth.uid(), user_id));
create policy "Delete accessible categories" on public.categories for delete to authenticated
using (public.can_access_user_data(auth.uid(), user_id));

-- Exchange rates cache
create table public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  currency_code text not null unique,
  rate_to_ils numeric not null,
  last_updated timestamptz not null default now()
);

alter table public.exchange_rates enable row level security;
create policy "Anyone can read rates" on public.exchange_rates for select to authenticated using (true);

-- Enable realtime
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.payments;
alter publication supabase_realtime add table public.budgets;
