# MiniURL API

## Goal

Define the initial API surface for MiniURL v1.

This is a product-level API outline, not a final framework-specific contract.

## Auth

### `POST /api/auth/login`

Authenticates a user.

### `POST /api/auth/logout`

Ends the current session.

### `GET /api/auth/me`

Returns the current user and company memberships.

## Companies

### `POST /api/companies`

Creates a company.

Required:

- `name`
- `subdomain`

### `GET /api/companies/:companyId`

Returns company details if the current user belongs to the company.

### `PATCH /api/companies/:companyId`

Updates company details.

V1 should limit this to admins.

## Links

### `GET /api/companies/:companyId/links`

Returns links for a company.

### `POST /api/companies/:companyId/links`

Creates a link.

Required:

- `destination_url`

Optional:

- `title`
- `slug`

### `GET /api/companies/:companyId/links/:linkId`

Returns one link.

### `PATCH /api/companies/:companyId/links/:linkId`

Updates a link.

Editable fields:

- `title`
- `destination_url`
- `status`

### `DELETE /api/companies/:companyId/links/:linkId`

Archives or deletes a link.

Archiving is safer for v1 because it preserves history.

## Redirects

### `GET /:slug`

Public redirect route.

This route depends on the request host.

Example:

```text
Host: cocacola.y.yy
Path: /summer
```

Behavior:

- extract company from host
- extract slug from path
- find active link
- record basic click data
- return `302`

## Metrics

### `GET /api/companies/:companyId/links/:linkId/metrics`

Returns v1 metrics.

Response should include:

- total clicks
- last clicked timestamp

Advanced analytics endpoints are deferred.

## API Rules

- every company API route must verify membership
- every link query must be scoped by `company_id`
- invalid input returns `400`
- unauthorized access returns `401`
- forbidden company access returns `403`
- missing resources return `404`

