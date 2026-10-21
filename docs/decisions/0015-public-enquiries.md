# ADR 0015 — Public enquiry forms: store first, email second, off by default

**Status:** Accepted · **Date:** 2026-10-21 · **Milestone:** M05

## Context

M05 adds the public contact, volunteer and partnership forms. Approved copy (M04 content review) says no recruitment process exists yet, and the privacy notice says the website does not collect enquiries. The data controller, retention and official contact channels are still being confirmed. Resend is the planned email provider, but no API key or verified sending domain exists yet.

## Decision

1. **One feature module**, `src/features/enquiries/`, using the existing `inquiries` table (added in M04 for this purpose). A migration adds `kind`, form-specific `details` (JSON), per-email delivery status, the last delivery error and an attempt counter. It is additive only.
2. **Store first, email second.** `submitEnquiry` validates on the server (Zod discriminated union), stores the row, then sends the staff notification and the submitter acknowledgement. Each email's outcome is recorded as `SENT`, `FAILED` or `NOT_CONFIGURED`. An email failure never loses an enquiry and never shows an error to the submitter. Staff see the status and the error in `/admin/enquiries` and can retry.
3. **Resend through `fetch`, not the SDK.** Sending is one authenticated POST, so native `fetch` (with a 10-second timeout) covers it and no dependency is added (AGENTS.md §3). Email is optional: without all three variables (`RESEND_API_KEY`, `EMAIL_FROM`, `ENQUIRY_NOTIFICATION_EMAIL`) enquiries are still stored.
4. **Off by default.** `site_settings.accept_enquiries` (default `false`) controls whether the forms are shown and accepted. The action re-reads the switch from the database, so a stale cached page cannot submit while it is off. Administrators turn it on at `/admin/settings/forms` after the privacy notice is updated.
5. **Abuse controls:** a honeypot field (the submission is reported as received but not stored), and the existing PostgreSQL rate limiter: 5 per 15 minutes per hashed client address, and 3 per hour per hashed email address. The acknowledgement repeats none of the submitted text, so the form cannot relay chosen content to someone else's inbox.
6. **Access:** a new `enquiries:manage` permission for administrators and reviewers, not editors (the rows hold personal data). Status changes and email retries are audited without the submitter's address.
7. **Volunteer form is an expression of interest**, limited to the four approved contribution areas, not an application.

## Consequences

- Enabling the forms is an owner decision that also requires privacy-notice wording (fields, purpose, who reads them, retention). The engineering is complete without it.
- Email deliverability (SPF, DKIM, DMARC on the sending domain) is configured outside the codebase when Resend is set up.
- No retention job yet: enquiries stay until an administrator deletes them through a future flow or the database. Retention is recorded as an open M05 condition.
- The newsletter in the M05 scope is not built; it is conditional on approval that has not been given.
