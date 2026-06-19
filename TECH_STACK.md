# MiniURL Technical Stack

## Goal

Choose a practical stack for building MiniURL v1 without overcomplicating the first implementation.

## Recommended Stack

### Application

Use Next.js with TypeScript.

Reasons:

- one codebase can serve the admin panel and API routes
- redirect routes can live in the same app at the beginning
- TypeScript helps protect tenant and link logic
- deployment to Vercel or similar platforms is straightforward

### Database

Use PostgreSQL.

Reasons:

- tenant data is relational
- unique constraints are important
- links, users, memberships, and click counters fit well in SQL
- it leaves room for future analytics tables

### ORM

Use Prisma for v1.

Reasons:

- fast schema iteration
- readable migrations
- strong TypeScript support
- practical for early product development

If query performance becomes critical later, specific redirect queries can be optimized with raw SQL.

### Authentication

Use a managed auth provider or a proven auth library.

Recommended v1 path:

- Auth.js if the team wants app-owned auth
- Clerk, Supabase Auth, or Auth0 if the team wants managed auth

Avoid building custom authentication from scratch unless there is a strong reason.

### Hosting

Recommended simple deployment:

- Vercel for the Next.js app
- managed PostgreSQL from Neon, Supabase, Railway, or similar
- wildcard domain configured at the hosting and DNS level

### DNS and HTTPS

Use:

- wildcard DNS for `*.base-domain`
- HTTPS certificate covering the base domain and wildcard subdomains

The platform must support wildcard domains before production.

## V1 Architecture Shape

Start with one application:

- admin panel
- backend API
- redirect handler

Split later only when traffic or operational needs justify it.

## Future Scaling Options

If redirects become high-traffic:

- move redirect handling to an edge route
- cache company and link lookups
- write click events asynchronously
- separate admin API from redirect service

## Stack Decision

Default decision for implementation:

- Next.js 16
- TypeScript
- PostgreSQL
- Prisma
- managed auth or Auth.js
- Vercel-style hosting with wildcard domain support

## Current Local Implementation

The current basic MVP uses:

- Next.js 16
- TypeScript
- Prisma
- SQLite for local development
- simple signed-cookie login for the demo admin

SQLite is a development convenience. The production target remains PostgreSQL.
