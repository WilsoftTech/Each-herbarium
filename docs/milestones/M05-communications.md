# M05 — Forms, communication and community engagement

**Status:** NOT STARTED · **Depends on:** M03, M04

## Goal

Reliable, secure ways for the public to contact EACH, volunteer and propose partnerships.

## Scope

- Forms: contact, volunteer application, partnership enquiry (and newsletter, if approved).
- Server Actions with server-side schema validation and accessible error messages.
- Spam and abuse protection: honeypot, rate limiting, and optionally a privacy-respecting challenge.
- Email via Resend: staff notification and submitter acknowledgement, from a verified domain.
- Persist submissions (M04 database) so no enquiry is lost if email fails; admin view of submissions.
- Privacy notice for collected personal data.

## Acceptance criteria

- [ ] Invalid input is rejected on the server, whatever the client does.
- [ ] Submissions are stored before email is sent; email failures are logged and visible to admins.
- [ ] Rate limiting verified.
- [ ] Forms are fully keyboard and screen-reader accessible.
- [ ] No API keys in client bundles; `.env.example` updated.
- [ ] Unit tests for validation; e2e for successful and failing submission paths (email mocked).
- [ ] Full verification suite passes.

## Risks

Content prerequisites from the M04 remediation: verify official contact channels; approve actual volunteer roles, supervision and safeguarding arrangements; agree partnership responsibilities; confirm the data controller and notice for each collection flow before public forms are enabled. Proposed wording is in [client content review](../content/CLIENT-CONTENT-REVIEW.md). Forms and delivery remain M05 work; none was implemented by that workstream.

Spam; email deliverability (SPF, DKIM and DMARC); personal-data handling.
