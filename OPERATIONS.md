# MiniURL Operations

## Goal

Define what MiniURL needs to run safely in production.

## Production Requirements

Minimum production requirements:

- application hosting
- PostgreSQL database
- base short domain
- wildcard DNS
- HTTPS certificates
- environment variables
- logging
- backups
- monitoring

## Domain Setup

The platform needs a short base domain controlled by MiniURL.

DNS should support:

```text
*.base-domain -> application
base-domain   -> application or admin entry
```

Reserved subdomains should not be available to customers.

Examples:

- `www`
- `api`
- `admin`
- `app`
- `login`
- `support`
- `status`

## HTTPS

Every public short link must work over HTTPS.

Recommended setup:

- wildcard certificate for subdomains
- certificate renewal automation
- redirect HTTP to HTTPS

## Environment Variables

Expected variables:

- database URL
- auth secret
- base domain
- app URL
- optional email provider credentials
- optional analytics or logging keys

Secrets must not be committed to the repository.

## Backups

The database must be backed up.

Minimum policy:

- daily automated backups
- restore process documented
- periodic restore test before real customers depend on the system

## Monitoring

Monitor:

- redirect error rate
- API error rate
- database connectivity
- app uptime
- slow redirects
- certificate expiration

## Logging

Logs should include enough information to debug failures:

- request path
- company subdomain
- status code
- error reason

Avoid logging:

- passwords
- tokens
- full auth headers
- raw secrets

## Incident Response

The product needs a simple way to:

- disable a malicious link
- disable a company
- inspect recent link activity
- rotate secrets
- restore from backup

## Launch Checklist

Before production launch:

- domain configured
- wildcard DNS works
- HTTPS works for subdomains
- database migrations applied
- backups enabled
- auth configured
- environment variables set
- redirect flow tested
- tenant isolation tested
- abuse controls enabled

