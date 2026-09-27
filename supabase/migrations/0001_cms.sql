-- Run in the shared Supabase project. Add approved auth.users IDs to cms_admins manually.
create type public.content_status as enum ('draft', 'published', 'archived');

create table public.cms_admins (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
create table public.site_settings (id boolean primary key default true check (id), organization_name text not null default 'PLP Computer Society', hero_summary text, about_summary text, mission text, vision text, contact_email text, contact_phone text, facebook_url text, seo_title text, seo_description text, updated_at timestamptz not null default now());
create table public.faculty_members (id uuid primary key default gen_random_uuid(), name text not null, department text not null, image_url text, display_order integer not null default 0, status public.content_status not null default 'draft', updated_at timestamptz not null default now());
create table public.organization_people (id uuid primary key default gen_random_uuid(), name text not null, role text not null, organization text not null check (organization in ('comsoc', 'ccs_elites')), person_kind text not null check (person_kind in ('officer', 'adviser')), tier integer not null default 0, department text, email text, facebook_url text, image_url text, display_order integer not null default 0, status public.content_status not null default 'draft', updated_at timestamptz not null default now());
create table public.events (id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, event_kind text not null check (event_kind in ('upcoming', 'gallery')), starts_at date not null, ends_at date, location text, time_label text, budget numeric(12,2), description text, cover_image_url text, display_order integer not null default 0, status public.content_status not null default 'draft', updated_at timestamptz not null default now());
create table public.event_media (id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade, image_url text not null, alt_text text, display_order integer not null default 0);

alter table public.cms_admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.faculty_members enable row level security;
alter table public.organization_people enable row level security;
alter table public.events enable row level security;
alter table public.event_media enable row level security;

create function public.is_cms_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.cms_admins where user_id = auth.uid()) $$;
create policy "admins read admin list" on public.cms_admins for select using (public.is_cms_admin());
create policy "public reads settings" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings for all using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "public reads published faculty" on public.faculty_members for select using (status = 'published');
create policy "admins manage faculty" on public.faculty_members for all using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "public reads published people" on public.organization_people for select using (status = 'published');
create policy "admins manage people" on public.organization_people for all using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "public reads published events" on public.events for select using (status = 'published');
create policy "admins manage events" on public.events for all using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "public reads media of published events" on public.event_media for select using (exists (select 1 from public.events where events.id = event_media.event_id and events.status = 'published'));
create policy "admins manage event media" on public.event_media for all using (public.is_cms_admin()) with check (public.is_cms_admin());
