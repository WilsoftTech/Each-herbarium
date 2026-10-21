# ADR 0014 — Fetch related CMS content with database joins

Status: Accepted
Date: 2026-10-21

## Context

Cache-bypassing development requests for resources and programmes spent seconds in application code. The existing Prisma relation strategy fetched a project list in eight SQL statements and an article list in three. A warm database round trip measured 278 ms from this workstation. Independently fetched metadata and sequential programme reads added avoidable waiting. Normal cached requests were already fast.

## Decision

Enable Prisma 7.10.1's `relationJoins` generator preview feature, which makes database joins the default for relation reads. Keep Prisma, its pg adapter, existing bounded connection pool, models, selectors, content mapping, publication predicates and tagged caches. No migration or dependency change is needed. The `query` strategy remains available per query if a specific workload regresses.

Reuse cached home/landing reads for metadata. Start independent founding-programme, project and next-programme reads together. Configure Next.js image qualities `[70, 75]`, matching the existing hero and default images.

## Consequences

Project and article lists each use one SQL statement. Joins move relation assembly to Postgres; they do not imply every possible query is faster. The feature is still a Prisma preview and must be reconsidered during ORM upgrades. Integration checks compare joined and query-strategy public results; existing workflow tests exercise previews, drafts, permissions and publication invalidation. No custom process cache or TTL is added, so unpublished content and stale approval decisions cannot be retained by a new cache layer.

An initial process connection, development compilation and Neon activation can still delay a first request. Measurements distinguish warm caches, bypassed caches and SQL strategy comparisons. This fixes existing M04 CMS reads; it does not start the M06 quality milestone or alter production infrastructure.

Sources: [Prisma relation load strategies](https://docs.prisma.io/docs/orm/v7/prisma-client/queries/relation-queries), [Neon database latency](https://neon.com/blog/how-to-minimise-the-impact-of-database-latency), installed Next.js documentation for `use cache`, image qualities and Server Actions.
