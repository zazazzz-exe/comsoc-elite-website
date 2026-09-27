-- Repairs public read access when the initial CMS migration was only partially applied.
-- Writes remain restricted to authorized CMS administrators.
alter table public.site_settings enable row level security;
alter table public.faculty_members enable row level security;
alter table public.organization_people enable row level security;
alter table public.events enable row level security;
alter table public.event_media enable row level security;

grant select on public.site_settings, public.faculty_members, public.organization_people, public.events, public.event_media to anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_settings' and policyname = 'public reads settings') then
    execute 'create policy "public reads settings" on public.site_settings for select to anon, authenticated using (true)';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'faculty_members' and policyname = 'public reads published faculty') then
    execute 'create policy "public reads published faculty" on public.faculty_members for select to anon, authenticated using (status = ''published'')';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'organization_people' and policyname = 'public reads published people') then
    execute 'create policy "public reads published people" on public.organization_people for select to anon, authenticated using (status = ''published'')';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'events' and policyname = 'public reads published events') then
    execute 'create policy "public reads published events" on public.events for select to anon, authenticated using (status = ''published'')';
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'event_media' and policyname = 'public reads media of published events') then
    execute 'create policy "public reads media of published events" on public.event_media for select to anon, authenticated using (exists (select 1 from public.events where events.id = event_media.event_id and events.status = ''published''))';
  end if;
end $$;
