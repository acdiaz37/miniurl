# MiniURL Security

## Goal

Define the minimum security posture for MiniURL v1.

URL shorteners are high-risk because they can hide malicious destinations. Security must be part of the MVP, not an afterthought.

## Tenant Isolation

Users must only access companies where they have a membership.

Rules:

- every dashboard query must include `company_id`
- API authorization must be enforced server-side
- one company cannot read, edit, pause, or delete another company's links

## Authentication

V1 needs login for the admin panel.

Acceptable approaches:

- email and password
- magic link
- managed authentication provider

The chosen approach must support secure session handling and password reset or equivalent account recovery.

## Authorization

V1 roles:

- `admin`: manage company settings and links
- `member`: manage links only

More complex roles are out of scope for v1.

## URL Validation

Destination URLs must be validated before saving.

Minimum rules:

- allow only `http` and `https`
- reject empty URLs
- reject malformed URLs
- reject private network targets when possible
- reject dangerous schemes like `javascript:`, `data:`, and `file:`

## Abuse Prevention

Minimum controls:

- rate limit link creation
- rate limit redirects if abuse appears
- block reserved subdomains
- allow links or companies to be disabled
- keep enough audit data to investigate abuse

Future controls:

- malware or phishing URL scanning
- report abuse endpoint
- denylist for domains
- manual review for suspicious activity

## Secrets

Production secrets must not live in the repository.

Examples:

- database URL
- auth secrets
- API keys
- certificate provider tokens

## Logging

Logs should help debug production issues without storing sensitive data unnecessarily.

Avoid logging:

- passwords
- session tokens
- full auth headers
- raw secrets

## Privacy

V1 metrics should stay minimal.

Recommended:

- total click count
- last clicked timestamp

Advanced analytics should define privacy rules before storing IP addresses, user agents, referrers, or location data.

