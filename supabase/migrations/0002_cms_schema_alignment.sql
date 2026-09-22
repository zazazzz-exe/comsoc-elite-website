-- Align the production schema with the Prisma CMS client without discarding existing content.
create type public.organization as enum ('comsoc', 'ccs_elites');
create type public.person_kind as enum ('officer', 'adviser');
create type public.event_kind as enum ('upcoming', 'gallery');

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  public_id text unique not null,
  url text not null,
  resource_type text not null,
  format text,
  bytes integer,
  width integer,
  height integer,
  alt_text text,
  created_at timestamptz not null default now()
);

alter table public.organization_people
  drop constraint organization_people_organization_check,
  drop constraint organization_people_person_kind_check;

alter table public.organization_people
  alter column organization type public.organization using organization::public.organization,
  alter column person_kind type public.person_kind using person_kind::public.person_kind,
  add column image_asset_id uuid references public.media_assets(id) on delete set null;

alter table public.events drop constraint events_event_kind_check;

alter table public.events
  alter column event_kind type public.event_kind using event_kind::public.event_kind,
  add column cover_image_asset_id uuid references public.media_assets(id) on delete set null;

alter table public.event_media
  add column media_asset_id uuid references public.media_assets(id) on delete set null;

alter table public.faculty_members
  add column image_asset_id uuid references public.media_assets(id) on delete set null;

create index organization_people_image_asset_id_idx on public.organization_people (image_asset_id);
create index events_cover_image_asset_id_idx on public.events (cover_image_asset_id);
create index event_media_event_id_idx on public.event_media (event_id);
create index event_media_media_asset_id_idx on public.event_media (media_asset_id);

alter table public.media_assets enable row level security;
create policy "admins manage media assets" on public.media_assets for all using (public.is_cms_admin()) with check (public.is_cms_admin());
