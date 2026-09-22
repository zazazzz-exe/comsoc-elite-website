# Website and CMS Migration Plan

## Current Architecture

- **Framework:** Next.js 16.3.1, React 19.2.4, TypeScript, Tailwind CSS 4.
- **Router:** App Router. The site has one public route, `/`, implemented by `app/page.tsx`.
- **UI:** A client-heavy, animated one-page landing site. It uses Framer Motion, GSAP, Lenis, Lucide, and Tabler icons. Fonts are loaded with `next/font/google`.
- **Content:** Hardcoded TypeScript datasets for COMSOC/CCS Elite officers and advisers, faculty, upcoming events, gallery events, budgets, and image paths. Organization copy, membership copy, contact details, social links, and SEO metadata are inline in components.
- **Assets:** Public local images only, including faculty/officer portraits and event galleries.
- **Backend:** No Supabase, database, Cloudinary, storage provider, authentication, API route, server action, environment variable, form submission, or external integration exists today.
- **SEO/deployment:** Root metadata is defined in `app/layout.tsx`. No sitemap, robots, analytics, or deployment configuration is present. The README is the stock Next.js README.

## Proposed Architecture

```text
root/
  website/   public Next.js application, port 3000
  cms/       independent Next.js application, port 3001, basePath /admin
  supabase/  schema and RLS migration
```

- The root is an npm workspace and starts both applications concurrently.
- `website` rewrites `/admin` and `/admin/:path*` to the CMS development or deployed origin. This preserves the user-facing `/admin` URL while retaining a separate CMS process and build.
- `cms` sets `basePath: "/admin"`; Next.js consequently prefixes generated links, chunks, action endpoints, static assets, and redirects. The proxy only forwards the mounted path.
- Both applications use the same Supabase project. The website performs public reads with the anonymous key; the CMS uses cookie-backed Supabase Auth and server-side administrator checks.
- Public website reads are progressively converted to Supabase while retaining the present local data as a safe fallback until the database is configured. Unpublished records are never requested by the website.

## File Migration Map

| Current path | Destination | Treatment |
| --- | --- | --- |
| `app/` | `website/app/` | Move unchanged, then incrementally connect content reads. |
| `components/` | `website/components/` | Move unchanged. |
| `lib/` | `website/lib/` | Move unchanged, then add public Supabase data access. |
| `public/` | `website/public/` | Move unchanged. |
| `next.config.ts`, TypeScript, ESLint, PostCSS config | `website/` | Move with the public application. |
| Root package manifest | root | Replace with workspace scripts. |
| New `cms/` | `cms/` | Independent admin application and dependencies. |
| New `supabase/migrations/` | root | Schema, RLS, admin authorization policies, and storage policy documentation. |

## CMS Content Model

The model is derived from the existing public sections only:

- **Site settings:** organization name, hero/about/mission/vision/membership copy, contact email/phone, social URLs, and public SEO metadata.
- **Faculty members:** name, department, portrait, display order, publish state.
- **Organization people:** officers and advisers for COMSOC and CCS Elite, role, team, tier, contact details, portrait, display order, and publish state.
- **Events:** upcoming and gallery records, title, start/end dates, location, time, budget, description or gallery summary, cover image, gallery images, display order, and publish state.
- **Media:** Cloudinary-backed records for images used by the above entities. Content records retain delivery URLs and reference their uploaded media records.

No projects, services, testimonials, announcements, or generic pages are added because the current site does not expose them.

## Database Changes

- Add `cms_admins`, `site_settings`, `faculty_members`, `organization_people`, `events`, and `event_media` tables.
- Use a `content_status` enum (`draft`, `published`, `archived`).
- Enable RLS on every CMS table. Public `SELECT` policies are limited to published content and the singleton public settings row. CMS writes are limited to users present in `cms_admins`.
- Store all portraits and event imagery in Cloudinary. The CMS persists Cloudinary delivery URLs and asset metadata in `media_assets`, then references that record from content where applicable.
- A CMS change invokes a protected website revalidation endpoint so the public site invalidates only its `cms-content` cache tag.

## Implementation Plan

1. Convert the repository to an npm workspace and move the public application to `website/` without redesigning or refactoring it.
2. Add the website rewrite proxy and verify the unchanged public site builds independently.
3. Scaffold the isolated `cms/` App Router application with `/admin` base path, shared environment conventions, and a responsive operational UI.
4. Add Supabase Auth, an explicit `cms_admins` authorization layer, protected pages, and server-side Zod-validated mutations.
5. Add CRUD for the audited models, media upload controls, loading/empty/error states, and meaningful dashboard counts.
6. Add the Supabase schema/RLS migration and environment examples. Seed/migrate the current hardcoded content only after real Supabase credentials are supplied.
7. Replace public local content reads incrementally with published Supabase queries and targeted cross-application revalidation, preserving current rendering and local fallback until production data is seeded.
8. Build, lint, typecheck, and manually verify public routes, mounted CMS routes, login redirects, and both independent production builds.
