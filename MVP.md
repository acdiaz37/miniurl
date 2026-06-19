# MiniURL MVP

## Goal

Build the first usable version of MiniURL as a multi-company URL shortener with company subdomains, a basic administration panel, and reliable redirects.

The MVP corresponds to option 2:

- redirection
- admin panel
- company-based management

It should also include only the minimum metrics needed to confirm link usage: total click count per link.

## Main User Flow

1. An admin creates or configures a company.
2. The company receives a subdomain, such as `cocacola.y.yy`.
3. A user creates a short link in the company panel.
4. The system generates or accepts a slug.
5. A viewer opens `cocacola.y.yy/slug`.
6. The system finds the company and link.
7. The system records a basic click event or increments a click counter.
8. The viewer is redirected to the destination URL.

## MVP Features

### Companies

- create company
- assign subdomain
- prevent duplicate subdomains
- block reserved subdomains such as `www`, `api`, `admin`, `app`, `login`, and `support`
- mark company as active or inactive

### Users

- login
- access only assigned company data
- simple roles:
  - admin
  - member

### Links

- create link
- edit destination URL
- generate random slug
- allow custom slug when available
- pause or reactivate link
- delete link or mark as archived
- show total clicks

### Redirects

- read company from subdomain
- read slug from path
- return `302` redirect by default
- show an error page when the company, slug, or link is unavailable
- reject invalid or unsafe destination URLs

### Basic Metrics

- total clicks per link
- last clicked timestamp

Advanced analytics are not part of the MVP.

## Acceptance Criteria

- A company can be created with a unique subdomain.
- A user can log in and manage links for the assigned company.
- A link can be created with a generated slug.
- A custom slug cannot collide inside the same company.
- A paused link does not redirect.
- An unknown subdomain returns a controlled error.
- An unknown slug returns a controlled error.
- A valid short link redirects with `302`.
- A successful redirect increments the click count.
- One company cannot access or modify another company's links.

## Non-Goals

- no advanced analytics dashboard
- no custom customer-owned domains
- no billing
- no external public API
- no complex role system
- no campaign management
- no QR code generation

## Technical Notes

- `slug` uniqueness should be scoped per company, not global.
- redirects should use `302` by default because destinations may change.
- destination URLs must be validated before saving.
- tenant isolation must be enforced at the database query level.
- click tracking should be simple in V1 but compatible with future event-based analytics.

## Risks

- URL shorteners can be abused for malicious redirects.
- Wildcard subdomain and HTTPS setup must be solved before production.
- Basic metrics may need careful design to avoid expensive writes at high traffic.
- The admin panel scope can grow quickly if roles, teams, and reporting are added too early.

