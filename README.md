# COMSOC Platform

Two independent Next.js applications share one Supabase project:

- `website/`: public COMSOC landing site on port 3000.
- `cms/`: administrator interface on port 3001, mounted at `/admin` through the website proxy.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the website and `http://localhost:3000/admin` for the mounted CMS. `http://localhost:3001/admin` also serves the CMS directly.

```bash
npm run dev:website
npm run dev:cms
npm run build
npm run lint
npm run typecheck
```

## Environment

Copy `website/.env.example` and `cms/.env.example` to their respective `.env.local` files.

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are shared public Supabase settings.
- `CMS_ORIGIN` is website-only and points to the separate CMS deployment.
- `SUPABASE_SERVICE_ROLE_KEY` is CMS-only and server-only. Do not expose it with a `NEXT_PUBLIC_` prefix.
- `DATABASE_URL` is CMS-only and connects Prisma to Supabase Postgres. Do not expose it with a `NEXT_PUBLIC_` prefix.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are CMS-only credentials for media uploads.

Apply `supabase/migrations/0001_cms.sql` and `supabase/migrations/0002_cms_schema_alignment.sql` to the shared project, then add approved `auth.users.id` values to `public.cms_admins`. A valid Supabase account has no CMS access unless it is explicitly authorized in that table.

See `MIGRATION_PLAN.md` for the audit, content model, and rollout plan.
