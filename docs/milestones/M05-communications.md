# M05 — Forms, communication and community engagement

**Status:** IN PROGRESS (started 2026-10-21 with the owner's approval) · **Depends on:** M03, M04

Design: [ADR 0015](../decisions/0015-public-enquiries.md). Evidence: [M05 verification](../audits/M05-verification.md).

## Goal

Reliable, secure ways for the public to contact EACH, volunteer and propose partnerships.

## Scope

- Forms: contact, volunteer application, partnership enquiry (and newsletter, if approved).
- Server Actions with server-side schema validation and accessible error messages.
- Spam and abuse protection: honeypot, rate limiting, and optionally a privacy-respecting challenge.
- Email via Resend: staff notification and submitter acknowledgement, from a verified domain.
- Persist submissions (M04 database) so no enquiry is lost if email fails; admin view of submissions.
- Privacy notice for collected personal data.

## Implemented (first increment, 2026-10-21)

- `src/features/enquiries/`: contact, volunteer-interest and partnership forms (`EnquiryForm`), one public Server Action (`submitEnquiry`) with Zod validation, a honeypot and two rate limits (per hashed client address and per hashed email address).
- Storage in the existing `inquiries` table (migration `20261023090000_public_enquiries`, additive; applied to dev only). Delivery status per email: `PENDING`, `SENT`, `FAILED`, `NOT_CONFIGURED`.
- Email through Resend's HTTP API with `fetch` (`src/services/email.ts`; no new dependency). Optional: without `RESEND_API_KEY`, `EMAIL_FROM` and `ENQUIRY_NOTIFICATION_EMAIL`, enquiries are still stored.
- Admin: `/admin/enquiries` (filters by form and unsent staff email) and `/admin/enquiries/[id]` (status, email outcome and error, retry). New permission `enquiries:manage` (administrators and reviewers).
- Switch: `/admin/settings/forms` (`site_settings.accept_enquiries`, **off by default**). While off, pages keep their "not available yet" notices and the action refuses submissions.
- Not built: newsletter (not approved).

## Acceptance criteria

- [x] Invalid input is rejected on the server, whatever the client does (unit and integration tests).
- [x] Submissions are stored before email is sent; email failures are logged and visible to admins (integration tests; the admin page is covered by the not-yet-run admin e2e).
- [x] Rate limiting verified (integration tests: per address and per email).
- [ ] **NOT VERIFIED:** forms are fully keyboard and screen-reader accessible. Native labels, `aria-describedby` errors and focus on the result reuse the M04 admin form components; the axe check of the live form is in the admin e2e, which has not run. Manual screen-reader pass remains M06.
- [x] No API keys in client bundles (0 matches in `.next/static`); `.env.example` updated.
- [ ] **PARTIAL:** unit tests for validation pass; e2e for successful and failing submission paths is written but **NOT VERIFIED** (needs a Neon CLI login). Email is mocked in the integration tests.
- [ ] **NOT VERIFIED:** full verification suite passes. Last run: 501/503 tests (2 dropped database connections), public e2e 127 passed, 1 failed (`ERR_NETWORK_IO_SUSPENDED`).

## Owner decisions before the forms are switched on

1. Privacy notice wording for the forms (fields, purpose, who reads them, retention). The approved privacy page currently says no enquiry forms are provided.
2. Resend account, a verified sending domain (SPF, DKIM, DMARC), and the staff inbox for notifications.
3. A retention period for enquiries (no deletion job exists yet).
4. Production migration and seed (5 migrations pending).

## Risks

Content prerequisites from the M04 remediation: verify official contact channels; approve actual volunteer roles, supervision and safeguarding arrangements; agree partnership responsibilities; confirm the data controller and notice for each collection flow before public forms are enabled. Proposed wording is in [client content review](../content/CLIENT-CONTENT-REVIEW.md). Forms and delivery remain M05 work; none was implemented by that workstream.

Spam; email deliverability (SPF, DKIM and DMARC); personal-data handling.
