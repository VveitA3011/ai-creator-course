-- Cơ sở dữ liệu cho web khóa học AI Creator.
-- Chạy toàn bộ tệp này một lần trong Supabase: SQL Editor → New query → dán → Run.
-- Chạy lại nhiều lần vẫn an toàn.

-- 1. Hồ sơ học viên. Các trường ở đây hiện trên trang portfolio công khai.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique check (handle ~ '^[a-z0-9-]{3,30}$'),
  display_name text not null default '' check (char_length(display_name) <= 80),
  headline text not null default '' check (char_length(headline) <= 160),
  bio text not null default '' check (char_length(bio) <= 1200),
  contact text not null default '' check (char_length(contact) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Dữ liệu học tập riêng tư: tiến độ bài học và dữ liệu các công cụ, lưu thành một khối JSON.
create table if not exists public.user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 3. Đầu ra nộp theo từng tuần. Riêng tư.
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_slug text not null check (char_length(module_slug) <= 40),
  url text not null default '' check (char_length(url) <= 500),
  note text not null default '' check (char_length(note) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists submissions_user_idx on public.submissions (user_id, module_slug);

-- 4. Sản phẩm portfolio với case study 7 phần.
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  category text not null default 'commercial' check (category in ('commercial', 'storytelling', 'social', 'process')),
  video_url text not null default '' check (char_length(video_url) <= 500),
  brief text not null default '' check (char_length(brief) <= 3000),
  direction text not null default '' check (char_length(direction) <= 3000),
  script text not null default '' check (char_length(script) <= 6000),
  storyboard text not null default '' check (char_length(storyboard) <= 6000),
  workflow text not null default '' check (char_length(workflow) <= 6000),
  notes text not null default '' check (char_length(notes) <= 3000),
  is_spec boolean not null default true,
  is_public boolean not null default false,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_user_idx on public.portfolio_items (user_id, sort);

-- Bật bảo mật theo dòng: không ai đọc hay sửa được dữ liệu của người khác.
alter table public.profiles enable row level security;
alter table public.user_state enable row level security;
alter table public.submissions enable row level security;
alter table public.portfolio_items enable row level security;

-- Hồ sơ: ai cũng xem được hồ sơ đã đặt handle (để trang portfolio công khai hoạt động); chỉ chủ hồ sơ được tạo và sửa.
drop policy if exists "profiles_read_public" on public.profiles;
create policy "profiles_read_public" on public.profiles for select using (handle is not null or auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- Dữ liệu học tập: chỉ chủ tài khoản.
drop policy if exists "state_own" on public.user_state;
create policy "state_own" on public.user_state for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bài nộp: chỉ chủ tài khoản.
drop policy if exists "submissions_own" on public.submissions;
create policy "submissions_own" on public.submissions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Portfolio: chủ tài khoản toàn quyền; người khác chỉ xem được sản phẩm đã bật công khai.
drop policy if exists "portfolio_own" on public.portfolio_items;
create policy "portfolio_own" on public.portfolio_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "portfolio_read_public" on public.portfolio_items;
create policy "portfolio_read_public" on public.portfolio_items for select using (is_public);

-- Tự cập nhật updated_at khi sửa.
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists portfolio_touch on public.portfolio_items;
create trigger portfolio_touch before update on public.portfolio_items for each row execute function public.touch_updated_at();
drop trigger if exists state_touch on public.user_state;
create trigger state_touch before update on public.user_state for each row execute function public.touch_updated_at();

-- Tự tạo hồ sơ trống khi có người đăng ký.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Quyền cho vai trò của Supabase.
grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.portfolio_items to anon;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_state, public.submissions, public.portfolio_items to authenticated;
