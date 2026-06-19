# MiniURL Architecture

## Goal

Define the technical shape of MiniURL v1: a multi-company URL shortener with company subdomains, an admin panel, reliable redirects, and basic click metrics.

## High-Level System

MiniURL has four main parts:

- public redirect service
- admin web app
- backend API
- database

The redirect service and backend API can start as the same application if the framework supports fast route handling. They can be split later if traffic grows.

## Domain Model

MiniURL depends on a short base domain controlled by the platform.

Example:

```text
y.yy
```

Each company gets a subdomain:

```text
cocacola.y.yy
```

The full short link uses:

```text
{company-subdomain}.{base-domain}/{slug}
```

## DNS

The base domain should support wildcard subdomains.

Required DNS shape:

```text
*.y.yy -> MiniURL infrastructure
y.yy   -> MiniURL infrastructure or landing/admin entry
```

The application must maintain a reserved subdomain list for names like `www`, `api`, `admin`, `app`, `login`, `support`, and `status`.

## HTTPS

Production should use HTTPS for all company subdomains.

Recommended v1 approach:

- wildcard certificate for `*.y.yy`
- certificate for `y.yy`
- automatic renewal

Customer-owned custom domains are not part of v1.

## Request Flow

Redirect request:

```text
GET https://cocacola.y.yy/summer
```

Flow:

1. Read the host.
2. Extract `cocacola` as the company subdomain.
3. Read `summer` as the slug.
4. Find the active company.
5. Find the active link for that company and slug.
6. Record basic click data.
7. Return a `302` redirect to the destination URL.

## Application Components

### Redirect Handler

Responsible for:

- host parsing
- tenant lookup
- slug lookup
- link status validation
- destination URL redirect
- basic click recording
- controlled error responses

### Admin Web App

Responsible for:

- login
- company dashboard
- link list
- link creation
- link editing
- link pause/reactivation
- basic click count display

### Backend API

Responsible for:

- authentication
- authorization
- company management
- link management
- metrics retrieval
- validation rules

### Database

Stores:

- companies
- users
- company memberships
- links
- click counters or click events

## Redirect Status

Use `302` by default.

Reason: companies may edit destination URLs after a link is created, and `301` can be cached too aggressively.

## Error Handling

The redirect service should return controlled pages for:

- unknown company
- inactive company
- unknown slug
- inactive link
- invalid destination URL

## Deployment Notes

The first production deployment needs:

- base domain
- wildcard DNS
- HTTPS certificates
- database
- application hosting
- environment variables
- logging
- backups

## Future Scaling

If traffic grows, the redirect path can be optimized by:

- caching company and link lookups
- using edge middleware
- separating redirect service from admin API
- recording click events asynchronously

