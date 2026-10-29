-- 장바구니 기능 추가: Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 하세요.
-- (schema.sql 을 이미 실행한 DB 에 그대로 추가로 실행해도 안전합니다.)

-- 1) 장바구니 테이블: 사용자 한 명이 IP 하나를 한 줄로 담고, 수량을 관리합니다.
create table if not exists public.cart_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  ip_id text not null,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, ip_id)
);

-- 2) 수정 시 updated_at 자동 갱신
create or replace function public.set_updated_at()
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
  for each row execute function public.set_updated_at();

-- 3) RLS: 본인 장바구니만 보고, 담고, 수정하고, 지울 수 있습니다.
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

-- 프론트엔드 사용 예 (supabase-js):
--   담기/수량 변경:  await supabase.from('cart_items').upsert({ user_id, ip_id, quantity }, { onConflict: 'user_id,ip_id' })
--   목록 조회:       await supabase.from('cart_items').select('ip_id, quantity').order('created_at')
--   삭제:            await supabase.from('cart_items').delete().eq('ip_id', ip_id)
--   비우기:          await supabase.from('cart_items').delete().eq('user_id', user_id)
