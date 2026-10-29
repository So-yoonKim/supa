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
