# MiniURL Product Definition

## Vision

MiniURL is a business-focused URL shortener where each company gets a branded subdomain under a short shared domain.

Example:

```text
cocacola.y.yy/asfdsd5234
```

The product should feel like a controlled company tool, not a generic public URL shortener.

## Problem

Companies need short, branded, manageable links for campaigns, internal sharing, QR codes, printed material, and customer communication.

Generic shorteners are often weak for companies because:

- the domain is not clearly tied to the company
- link ownership is unclear
- teams cannot manage links in one place
- analytics are either missing, too broad, or disconnected from company workflows
- security and abuse controls are not designed for business use

## Target Users

- company admins who configure the tenant and subdomain
- marketing or operations users who create and manage links
- viewers who click short links and get redirected

## Core Value

MiniURL gives each company a recognizable short link namespace while keeping all links manageable from a central panel.

The initial value is:

- branded company subdomains
- link creation and management
- reliable redirects
- basic visibility into link activity

## Product Scope V1

V1 focuses on redirection plus an administration panel.

Included:

- company or tenant creation
- subdomain assignment per company
- user access to a company panel
- create, edit, pause, and delete links
- redirect from `company.domain/slug` to the destination URL
- basic click count per link
- reserved subdomain validation
- simple error pages for missing or disabled links

## Out Of Scope V1

The following are intentionally deferred:

- advanced analytics
- country, device, browser, and referrer reports
- custom domains owned by customers
- QR code generation
- campaign grouping
- team roles beyond a simple admin/user model
- public API for external integrations
- billing and subscription management

## Product Principles

- Company isolation comes first.
- Redirects must be fast and reliable.
- Link management should be simple enough for non-technical users.
- V1 should prepare the data model for analytics without trying to build the full analytics product immediately.
- Security and abuse controls must be considered from the start.

## Future Direction

After V1, the product should evolve toward a stronger business analytics layer.

Future capabilities may include:

- clicks by date range
- clicks by country
- device and browser breakdown
- referrer tracking
- campaign grouping
- exportable reports
- custom customer-owned domains
- QR code generation
- audit logs

