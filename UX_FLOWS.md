# MiniURL UX Flows

## Goal

Define the core user flows for the v1 admin panel.

The panel should prioritize clarity and speed. Users should be able to create and manage links without technical knowledge.

## Flow 1: Login

1. User opens the admin app.
2. User authenticates.
3. System loads the user's company context.
4. User lands on the links dashboard.

Success state:

- user sees links for their company only

Error states:

- invalid credentials
- user has no company membership
- company is inactive

## Flow 2: Create Company

1. Admin enters company name.
2. Admin chooses a subdomain.
3. System validates availability.
4. System creates the company.
5. Admin lands in the company dashboard.

Validation:

- subdomain is required
- subdomain must be unique
- subdomain must not be reserved
- subdomain must use allowed characters

## Flow 3: Create Link

1. User opens the company dashboard.
2. User enters destination URL.
3. User optionally enters custom slug.
4. System validates destination and slug.
5. System creates the link.
6. User sees the full short URL.

Success state:

- link appears in the link list
- user can open or copy the short URL

Error states:

- invalid destination URL
- slug already exists
- slug contains invalid characters

## Flow 4: Edit Link

1. User selects an existing link.
2. User edits title, destination URL, or status.
3. System validates changes.
4. System saves the update.

Rules:

- slug editing can be deferred if it complicates auditing
- destination changes should keep redirects as `302`

## Flow 5: Pause Link

1. User selects an active link.
2. User pauses it.
3. System stops redirects for that link.

Redirect behavior:

- paused link shows a controlled unavailable page

## Flow 6: View Basic Metrics

1. User opens the link list or link detail.
2. User sees total clicks and last clicked timestamp.

Advanced charts are not part of v1.

## Dashboard Content

The v1 dashboard should show:

- short URL
- destination URL
- status
- total clicks
- last clicked timestamp
- actions to edit, pause, reactivate, or archive

