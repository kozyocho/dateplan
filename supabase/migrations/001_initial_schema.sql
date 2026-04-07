-- ==========================================
-- dateplan 初期スキーマ
-- Supabase SQL Editorで実行してください
-- ==========================================

-- ユーザープロファイル
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan_count integer default 0,
  plan_reset_at timestamptz default now(),
  is_pro boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- 生成済みデートプラン
create table if not exists date_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  conditions jsonb not null,
  plan_content text not null,
  area text not null check (area in ('nagoya', 'tokyo')),
  created_at timestamptz default now()
);

-- RLS有効化
alter table profiles enable row level security;
alter table date_plans enable row level security;

-- profiles ポリシー
create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- date_plans ポリシー
create policy "Users can read own plans"
  on date_plans for select using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on date_plans for insert with check (auth.uid() = user_id);

create policy "Users can delete own plans"
  on date_plans for delete using (auth.uid() = user_id);

-- 新規ユーザー登録時にprofileを自動作成するTrigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- plan_countをインクリメントする関数（RLSの制約を超えて更新するため）
create or replace function public.increment_plan_count(user_id uuid)
returns void as $$
begin
  update public.profiles
  set plan_count = plan_count + 1
  where id = user_id;
end;
$$ language plpgsql security definer;
