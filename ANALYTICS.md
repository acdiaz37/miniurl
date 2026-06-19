# MiniURL Analytics

## Goal

Define what analytics belong in v1 and what should be deferred to the future analytics phase.

## V1 Analytics

V1 should include only basic metrics:

- total clicks per link
- last clicked timestamp

This is enough to confirm whether a link is being used without turning the MVP into a full analytics product.

## V1 Storage Approach

The simplest v1 approach is to store counters directly on the link record:

- `click_count`
- `last_clicked_at`

This keeps the dashboard simple and avoids building charts, aggregation jobs, and event pipelines too early.

## Optional Event Compatibility

The data model may include a `click_events` table, but the product should not depend on advanced analytics in v1.

If click events are stored, keep them minimal:

- `link_id`
- `company_id`
- `clicked_at`

Avoid storing sensitive data until privacy rules are defined.

## Deferred Analytics

These are not part of v1:

- clicks by date range
- country
- city
- device
- browser
- operating system
- referrer
- campaign grouping
- exportable reports
- dashboards with charts

## Privacy Position

V1 should avoid collecting more than needed.

Before adding advanced analytics, define:

- what data is collected
- how long it is retained
- whether IP addresses are stored, hashed, or discarded
- whether customers need consent language
- how users can request deletion if required

## Future Phase

The future analytics phase should transform MiniURL from a basic link manager into a business measurement tool.

Potential future features:

- charted clicks over time
- top links
- top referrers
- device breakdown
- geographic breakdown
- campaign performance
- CSV export
- API access for reporting

