# Neon backend setup verification — 2026-10-20

Project: `spring-mountain-58753825`, organization `org-small-moon-96855697`, region `aws-us-east-2`.

## Changes

- `neon.ts` declares Managed Auth, the private `assets` bucket and the `hello` Function (now a data-free backend liveness probe). AI Gateway was removed with the owner's approval after Neon rejected it on the Free plan.
- Production services were deployed. Both additive Prisma migrations were applied, followed by the existing create-only seed: 16 media records, 4 programmes, 3 projects, 3 articles, 1 partner and 3 pages.
- Local `.env.local` and `.neon` now point to `production`, as requested. Tests ran on `dev` before this final checkout. Production credentials are also in the separate ignored `.env.neon-production`. These paths were confirmed ignored by Git. No secrets were committed or printed in this report. Before running database/browser tests again, use `npx.cmd --yes neon@latest checkout dev` and rebuild; the tests refuse production.
- Staff authentication, account creation, password changes/resets and session revocation use Managed Auth. CMS membership and roles remain in the application database. Revoked sessions are read without attempting cookie writes in Server Components. See [ADR 0010](../decisions/0010-neon-managed-backend.md).
- Uploads, reads and deletion use Neon's S3 environment variables through `aws4fetch`. The additive `NEON` media storage enum retains the legacy `R2` value without dropping data.
- The protected settings page checks the deployed Function. `npm run neon:check` provides repeatable, read-only probes for all four services.
- Tests refuse `production`/`main` branches. Browser fixtures provision managed identities on dev; teardown removes their managed admin role and deactivates their CMS access. CI's local-Postgres job explicitly runs public browser checks; the complete admin suite requires live Neon services and an authenticated CLI.

## Production read-only probes

Command:

```powershell
node --env-file=.env.neon-production --import tsx scripts/check-neon.ts
```

Exit code: **0**. Output:

```text
Neon branch: production
Managed Auth: HTTP 200 (anonymous session)
Functions: HTTP 200 (each-backend)
Object Storage: HTTP 200 (private assets bucket)
Postgres: SELECT 1 = 1
```

`npm run neon:check` also returned exit code 0 for dev with the same four successful probes.

## Verification

`npm test` completed with exit code **0**:

```text
Test Files 22 passed (22)
Tests 350 passed (350)
Duration 1101.97s
```

After the authorization cache fix, `npm test -- tests/integration/managed-auth.test.ts` also returned exit code **0** with **5 passed** tests (136.23s). The full 350-test run above predates this additional regression test.

Formatting, type checking and lint also passed. `npm run build` generated all 71 pages successfully on dev.

The complete browser command `$env:E2E_PORT='3129'; npm.cmd run test:e2e` returned exit code **0** against that final dev build:

```text
3 skipped
134 passed (3.7m)
```

The three skipped cases are opt-in screenshot captures. The passing suite includes managed account creation, password reset, session revocation/deactivation, reload/sign-out, role restrictions, protected Function access, byte-for-byte image upload/read/delete, and draft/review/publish/unpublish with immediate public cache updates. Fixtures were deactivated and their managed admin roles removed during teardown.

After checking out production, `npm run neon:check` again returned all four successful probes above with exit code **0**. The final production `npm run build` returned exit code **0**:

```text
✓ Compiled successfully in 4.1s
Finished TypeScript in 6.0s
✓ Generating static pages using 5 workers (71/71) in 3.6s
```

`npm run start -- --port 3200` started the app:

```text
▲ Next.js 16.4.2
- Local: http://localhost:3200
✓ Ready in 228ms
```

The production administrator smoke check returned exit code **0**, using the ignored credential file without printing its contents:

```text
Production administrator sign-in and protected dashboard: PASS
Production managed session after reload: PASS
Production Function through protected settings: PASS
Production sign-out and protected redirect: PASS
```

The app is left running at `http://localhost:3200`. The smoke script was removed after verification; the temporary credential file remains available for the owner.

## Failures encountered and corrected

- PowerShell blocked `npm.ps1` because scripts are disabled. The requested `npx.cmd neon@latest` fallback worked after network access was allowed.
- The first deploy was rejected because AI Gateway requires a paid plan. The owner approved proceeding without it.
- The initial build could not access the database inside the network-restricted sandbox (`EACCES`); the network-enabled retry identified missing CMS tables (`P2021`). Reviewed migrations and the create-only seed resolved that.
- CLI Managed Auth signup required a trusted Origin and callback URL. The bootstrap helper now provides both.
- Revoked sessions exposed an SDK cookie-write error in Server Components. A read-only SDK context now handles session reads; Server Actions retain cookie writes.
- SDK 0.6 compares its local cache-bypass flag to a string despite a boolean API type. The read context excludes the optional cached session-data cookie so authorization always reaches Managed Auth; a focused regression test covers this behavior.
- The first full unit/integration run reported 23 failed and 323 passed tests. Twenty-one failures came from a test resolver selecting the generic programme route ahead of static routes; one came from Prisma pg-adapter duplicate-key metadata; one was a remote seed check exceeding 60 seconds. The resolver, metadata handling and the seed check were corrected.
- Browser selectors were corrected for required-field labels. Remote auth and multi-query media actions needed longer assertion deadlines; successful upload and byte-for-byte public download were observed before the earlier delete assertion timed out.
- Browser assertions now scope the sign-in alert away from Next.js's route announcer. The editor-access check asserts the denied page, no admin forms and `noindex`: the installed Next.js guide documents HTTP 200 when `notFound()` resolves after streaming begins.
- The preview assertion now targets its banner rather than both elements with `role="note"`. The cache regression mock also needed an explicit signature and captured-call guard for strict TypeScript indexing; the subsequent build passed.

## Remaining operational notes

- The Neon SDK occasionally logs a three-second `mintSessionDataCookie` timeout for its optional session cache. The identity session token remains the source of authentication; full flow results are recorded separately above.
- npm emitted transitive peer warnings and engine warnings because the local Node version is 24.13 while jsdom dependencies request 24.15 or newer. `npm audit --omit=dev` returned `found 0 vulnerabilities`; npm still reports the existing five high-severity development advisories. No force audit fix or legacy peer flag was used.
- The requested production administrator `admin@each.com` (display name `Admin`) was created. Its generated temporary password is saved only in the Git-ignored `.env.neon-admin-once`; change it under Your account after signing in. The bootstrap helper explicitly targets the loaded branch.
- Local dev inherits the CLI's seven-day branch-expiry policy. Recreate/refresh it from production when needed, or deliberately change the policy before relying on it as a permanent development environment.
- Production auth email configuration, MFA, frontend hosting and existing R2/identity data migrations are outside this setup. No frontend production deployment or Git commit was made. M04 remains in progress.
