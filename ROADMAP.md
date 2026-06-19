# MiniURL Roadmap

## Goal

Define the product phases so development stays focused.

## Phase 0: Foundation

Purpose:

- finalize product definition
- choose technical stack
- prepare repository structure
- define environment and deployment requirements

Deliverables:

- product documents
- stack decision
- initial app scaffold
- database schema draft

## Phase 1: MVP Build

Purpose:

Build the first usable version.

Status:

Basic version implemented locally.

Scope:

- company creation
- subdomain assignment
- login
- company dashboard
- create and manage links
- public redirect route
- basic click count
- controlled error pages

Exit criteria:

- a company can create a link
- the short URL redirects correctly
- click count updates
- tenant isolation is enforced

## Phase 2: Hardening

Purpose:

Make the MVP reliable enough for external users.

Scope:

- validation improvements
- abuse controls
- rate limits
- production logging
- monitoring
- backups
- error handling
- domain and HTTPS verification

Exit criteria:

- production deployment is stable
- abuse controls exist
- critical paths are monitored

## Phase 3: Analytics Product

Purpose:

Expand MiniURL from link management into business analytics.

Scope:

- clicks over time
- referrer tracking
- device and browser breakdown
- geographic breakdown
- campaign grouping
- exportable reports

Exit criteria:

- companies can understand link performance beyond total clicks
- analytics data has clear privacy and retention rules

## Phase 4: Enterprise Features

Purpose:

Support larger company needs.

Potential scope:

- custom customer-owned domains
- advanced roles
- audit logs
- public API
- SSO
- billing
- team management
- QR codes
