# M05 verification — 2026-10-21 (in progress)

First M05 increment: public enquiry forms ([ADR 0015](../decisions/0015-public-enquiries.md)). Windows 11, Node 24.12.0, npm 11.6.2, Neon `dev` branch. Production untouched.

## Database

- Migration `20261023090000_public_enquiries` (additive: two enums, six `inquiries` columns, one index, `site_settings.accept_enquiries` default `false`) applied to **dev only** with `prisma migrate deploy`.
- `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` printed `-- This is an empty migration.` (schema and dev database match).
- `npm run db:check-migrations`: "Migrations checked: no unapproved destructive statements."
- Production now needs 5 migrations (4 from M04 plus this one); applying them still requires owner approval.

## Results

| Check                    | Command                                                                                 | Result                                                                                                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format                   | `npm run format:check`                                                                  | Pass                                                                                                                                                                                      |
| Typecheck                | `npm run typecheck`                                                                     | Pass                                                                                                                                                                                      |
| Lint                     | `npm run lint`                                                                          | Pass, no findings                                                                                                                                                                         |
| Unit + integration       | `npm test`                                                                              | 501 passed, 2 failed of 503 (29 files). Both failures: `P1017 Server has closed the connection` (Neon connection dropped), in an unchanged project page test and one rate-limit test      |
| New tests, re-run        | `npx vitest run tests/integration/enquiries.test.ts …`                                  | `enquiries.test.ts` 12/12 pass; earlier run of the new unit, permission and integration files: 32/32 pass                                                                                 |
| Page tests, re-run       | `npx vitest run tests/unit/pages.test.tsx`                                              | 176 passed, 1 failed (a different test each run); further re-runs stopped in the test-database seed with `P1017`                                                                          |
| Build                    | `npm run build`                                                                         | Pass: 88/88 static pages                                                                                                                                                                  |
| Secrets in client bundle | `grep -rlE "RESEND_API_KEY\|api\.resend\.com\|ENQUIRY_NOTIFICATION_EMAIL" .next/static` | 0 files (the Resend endpoint appears only in `.next/server`)                                                                                                                              |
| E2E (public)             | `E2E_PUBLIC_ONLY=1 npx playwright test`                                                 | 127 passed, 1 failed, 3 skipped. The failure is `net::ERR_NETWORK_IO_SUSPENDED` loading a localhost page in the 390px layout sweep; re-run: 47 passed, 1 failed (same error, another URL) |
| E2E (admin, forms on)    | `npm run test:e2e`                                                                      | **NOT VERIFIED**: global setup needs an interactive Neon CLI login (`npx neon auth`)                                                                                                      |

`ERR_NETWORK_IO_SUSPENDED` on localhost and the repeated dropped Neon connections point to the machine suspending network I/O during long runs (power settings), not to the application. The suite must be re-run on a stable connection before M05 can pass.

## What the tests cover

- **Server validation** (unit): every field per form, choices outside the offered options, lengths, consent, unknown form kinds, extra fields dropped.
- **Store before email** (integration): stored with `NOT_CONFIGURED` when Resend is not set up; `SENT` for both emails when it is; with Resend returning 403 the enquiry is stored, both emails are `FAILED`, the error is recorded and logged, and the submitter still sees the confirmation.
- **Abuse controls** (integration): honeypot submissions are not stored; 6th submission from one address in 15 minutes refused; 4th from one email address in an hour refused (case-insensitive); nothing accepted while the forms are switched off.
- **Authorisation** (integration): editors get not-found on `/admin/enquiries` and permission errors from both actions; reviewers change status with an audit event that omits the submitter's address; administrators retry unsent email.
- **Emails** (unit): staff notification carries the submission with reply-to; the acknowledgement repeats none of the submitted text.
- **Public pages** (e2e, public): contact, volunteer, partnerships and get-involved show the "not available" notices and no form while switched off.
- **Written, not yet run:** the admin e2e flow "public forms" (switch on, axe check of the contact form, server-side field errors with browser validation bypassed, successful submission listed for staff, editor denied, switch off).
