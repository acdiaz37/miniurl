# MiniURL Data Model

## Goal

Define the core data required for MiniURL v1.

## Entities

### Company

Represents a business customer.

Fields:

- `id`
- `name`
- `subdomain`
- `status`
- `created_at`
- `updated_at`

Rules:

- `subdomain` must be unique.
- `subdomain` must not be reserved.
- inactive companies cannot redirect links.

### User

Represents a person who can log in.

Fields:

- `id`
- `email`
- `name`
- `password_hash` or external auth identifier
- `created_at`
- `updated_at`

Rules:

- `email` must be unique.
- users do not access company data directly without membership.

### Company Membership

Connects users to companies.

Fields:

- `id`
- `company_id`
- `user_id`
- `role`
- `created_at`

Roles:

- `admin`
- `member`

Rules:

- a user can belong to multiple companies in the future.
- v1 can start with one company per user if needed.

### Link

Represents a short URL.

Fields:

- `id`
- `company_id`
- `slug`
- `destination_url`
- `title`
- `status`
- `click_count`
- `last_clicked_at`
- `created_by_user_id`
- `created_at`
- `updated_at`

Statuses:

- `active`
- `paused`
- `archived`

Rules:

- `slug` must be unique within the same company.
- `destination_url` must be validated.
- paused and archived links do not redirect.

### Click Event

Optional for v1, but useful for future analytics.

Fields:

- `id`
- `company_id`
- `link_id`
- `clicked_at`
- `ip_hash`
- `user_agent`
- `referrer`

V1 can store only counters first, but the model should allow event-based analytics later.

## Key Constraints

- unique `company.subdomain`
- unique `link.company_id + link.slug`
- foreign key from links to companies
- foreign key from memberships to users and companies
- foreign key from links to creator user

## Tenant Isolation

All link, metric, and membership queries must be scoped by `company_id`.

This is a core security rule, not a UI concern.

