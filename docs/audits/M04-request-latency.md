# M04 request latency and image warning — 2026-10-21

## Scope and findings

Inspected `main` at `d97c440`. Work fixes the existing M04 CMS reads and the supplied image warning. No production configuration/data, new service, migration, dependency or milestone is introduced. M04 retains its production conditions; M05–M07 remain not started.

The hero requested image quality 70 but Next.js allowed only its default 75. `images.qualities: [70, 75]` fixes the configuration and permits both values at the image optimiser. Startup lines about Cache Components and Partial Prefetching are informational. The `serverActions` experiment summary reports the existing 4.5 MB upload body limit; removing that supported setting would break the intended upload limit. These features remain enabled.

Development requests with `Cache-Control: no-cache` reproduced the application-code delay. Ordinary cached requests were already approximately 0.2 seconds. No cache was disabled or replaced to hide the issue. Read-only development probes identified remote database round trips, additional connections during relation fetches, duplicated metadata reads and sequential independent programme reads. The first SQL connection took 3,224 ms; a subsequent `SELECT 1` took 278 ms. This is not evidence of a missing index or a slow Postgres execution plan.

## Changes

- Prisma's existing client uses `relationJoins` (generator preview feature), fetching relations in SQL. The project list drops from eight statements to one; articles drop from three to one. Model definitions, permissions and publication/media filters remain unchanged. No migration is required. See [ADR 0014](../decisions/0014-cms-relation-loading.md).
- Metadata uses the same cached homepage/landing read as page rendering, avoiding a second page/hero fetch. Prose pages keep their ordinary read.
- Founding programme pages start their independent page, related-project and next-programme reads together.
- Browser checks now report console warnings as well as errors. A real optimiser check requests the existing papyrus image at qualities 70 and 75. Integration tests compare both Prisma strategies through the public project/article mappers; existing tests retain draft/privacy and editorial workflow coverage.

## Measurements

These are local development measurements against Neon dev, not production guarantees. SQL comparisons ran both strategies on one instrumented client with identical selectors. Every mapped result comparison was equal. Times include client/network work, not only database execution.

| Read                                                          | Query strategy | Join strategy | SQL statements |
| ------------------------------------------------------------- | -------------- | ------------- | -------------- |
| Projects, first comparison (additional connections were cold) | 3,216 ms       | 611 ms        | 8 → 1          |
| Projects, repeated comparison                                 | 873 ms         | 533 ms        | 8 → 1          |
| Articles, first comparison                                    | 555 ms         | 278 ms        | 3 → 1          |
| Articles, repeated comparison                                 | 547 ms         | 291 ms        | 3 → 1          |

HTTP probes consumed the full HTML response. Before changes: `/resources` took 3,970 ms with cache bypass and `/our-work/environmental-conservation` took 2,498 ms. After changes, repeated bypassed requests took 1,094/999 ms and 1,416/1,419 ms respectively. Ordinary cached requests after changes took 222/224 ms. The first resources request after the configuration restart still took 5,465 ms; development recompilation and initial connection costs remain. The original supplied 5.1/7.8-second log entries are user observations, not controlled benchmarks. No universal speedup is claimed from a small local sample.

A headless Chromium check of both reported routes on the running development server returned HTTP 200 with no console warnings/errors or uncaught errors. Full navigation (including images, hydration and waiting for network idle) took 4,616/2,232 ms respectively; these are different from the HTML-only timings above.

## Verification

Commands use Windows `npm.cmd`. Unit/integration tests rebuild only the existing dedicated `each_test` schema. Build/browser checks use the existing isolated `each_approved_content_e2e` schema on dev, port 3137. Neither touches production.

| Command                    | Actual result                                      |
| -------------------------- | -------------------------------------------------- |
| `npm.cmd run format:check` | PASS: all matched files use Prettier code style    |
| `npm.cmd run typecheck`    | PASS: generated types, no TypeScript errors        |
| `npm.cmd run lint`         | PASS: no findings                                  |
| `npm.cmd test`             | PASS: 27 files, 477 tests (857.77s)                |
| `npm.cmd run build`        | PASS: compiled successfully; 85/85 pages generated |
| `npm.cmd run test:e2e`     | PASS: 143 passed, 3 opt-in screenshot skips (7.7m) |

The Prisma feature remains preview; reassess it when upgrading Prisma. Initial connection/compute activation and development compilation can still delay cold requests. Existing script/toolchain warnings, if printed during verification, are recorded separately below rather than represented as application warnings being fixed.

Verification harness output includes existing Node DEP0190 warnings from Windows script launchers and a NO_COLOR/FORCE_COLOR environment conflict in Playwright. Neither is an application browser warning. They were not suppressed or described as resolved.

The Prisma CLI also advertised 8.0.0-rc.23 as an available major update; the repository intentionally pins stable 7.10.1. No release-candidate upgrade was made. Playwright reported its serial CMS test file as slow; it exercises dependent approval steps and is separate from application request latency.
