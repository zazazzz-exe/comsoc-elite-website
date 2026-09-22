# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Authorized COMSOC CMS administrators maintaining the public organization website.

## Product Purpose

The CMS lets administrators create, update, publish, and organize people, faculty, events, media, and site settings without editing application code.

## Operating Context

Administrators work from a desktop or mobile browser and need to locate a record, make a focused content or media update, and return to their task quickly.

## Capabilities and Constraints

- Supabase Auth validates CMS sessions; `cms_admins` explicitly authorizes access.
- Prisma accesses Supabase Postgres from the server.
- Cloudinary stores uploaded media and Supabase Postgres stores its metadata and content relationships.
- Public content has draft, published, and archived states.

## Brand Commitments

The CMS is the COMSOC Control Room and uses the existing dark, restrained operational interface.

## Evidence on Hand

Existing CMS routes provide management for people, faculty, events, media, settings, and a dashboard. No external brand or product references were supplied.

## Product Principles

- Optimize for fast, confident content updates.
- Keep authorization and publishing state clear.
- Preserve existing content and media unless an administrator intentionally replaces it.
- Make record navigation and editing easy to scan on desktop and mobile.
