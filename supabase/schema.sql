-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 하세요.

-- 1) 프로필 테이블 (auth.users 와 1:1)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz not null default now()
);

-- 2) 좋아요 테이블
create table if not exists public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, ip_id)
);

-- 3) 가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) RLS
alter table public.profiles enable row level security;
alter table public.likes enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "likes_select_own" on public.likes;
create policy "likes_select_own" on public.likes
  for select using (auth.uid() = user_id);

drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own" on public.likes
  for insert with check (auth.uid() = user_id);

drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own" on public.likes
  for delete using (auth.uid() = user_id);

-- 5) 장바구니
create table if not exists public.cart_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_id text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, ip_id)
);

create or replace function public.set_cart_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_cart_updated_at();

alter table public.cart_items enable row level security;

drop policy if exists "cart_select_own" on public.cart_items;
create policy "cart_select_own" on public.cart_items
  for select using (auth.uid() = user_id);

drop policy if exists "cart_insert_own" on public.cart_items;
create policy "cart_insert_own" on public.cart_items
  for insert with check (auth.uid() = user_id);

drop policy if exists "cart_update_own" on public.cart_items;
create policy "cart_update_own" on public.cart_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_delete_own" on public.cart_items
  for delete using (auth.uid() = user_id);

-- 6) 테이블을 만들기 전에 이미 가입한 사용자의 프로필 채우기 (트리거는 새 가입자에게만 동작)
insert into public.profiles (id, nickname)
select id, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

-- 7) API 가 새 테이블을 바로 인식하도록 스키마 캐시 새로고침
--    ("Could not find the table ... in the schema cache" 오류 방지)
notify pgrst, 'reload schema';
