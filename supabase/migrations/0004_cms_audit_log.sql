-- Operational history only. Existing content is intentionally left untouched.
create table if not exists public.cms_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cms_audit_logs_created_at_idx on public.cms_audit_logs (created_at desc);
create index if not exists cms_audit_logs_entity_idx on public.cms_audit_logs (entity_type, entity_id);

alter table public.cms_audit_logs enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'cms_audit_logs' and policyname = 'admins manage cms audit logs'
  ) then
    execute 'create policy "admins manage cms audit logs" on public.cms_audit_logs for all using (public.is_cms_admin()) with check (public.is_cms_admin())';
  end if;
end $$;
