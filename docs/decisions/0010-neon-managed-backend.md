# 0010. Neon Managed Auth, Object Storage and Functions

- **Status:** Accepted by the owner on 2026-10-20
- **Milestone:** M04
- Supersedes the identity hosting and R2 provider choices in ADRs 0008 and 0009.

The owner requested Neon provisioning for project `spring-mountain-58753825`, production branch, and explicitly chose Managed Auth over the existing self-hosted Better Auth implementation. AI Gateway was omitted with the owner's approval because the organization is on the Free plan.

## Decision

- Keep Prisma 7 and its `pg` adapter: the Next.js app uses the Node runtime and pooled Postgres; migrations use the direct URL. No Data API or replacement ORM.
- Declare Auth, the private `assets` bucket and a liveness Function in `neon.ts`. Neon hosts the backend services; it does not host this Next.js frontend.
- Use `@neondatabase/auth` through its Next server API. Sign-in, sign-out and password changes remain Server Actions. The SDK handles cookies; session cache TTL is one second and session reads explicitly bypass the upstream cookie cache.
- Session reads use the SDK's framework-neutral server adapter with a read-only request context and `disableRefresh`. The context excludes the optional local session-data cookie: SDK 0.6's internal cache-bypass comparison expects a string despite its boolean API type. Revoked sessions can return deletion cookies; those are discarded during Server Component rendering, where Next.js prohibits cookie writes. Mutating auth calls use the Next adapter and persist cookies normally.
- Managed Auth stores identities, passwords and sessions in `neon_auth`. CMS membership remains in `public.users`, keyed by the managed identity ID. Every protected request reads current CMS roles and active state. A managed account alone grants no CMS access.
- CMS administrators also have the managed `admin` role; editors and reviewers have the managed `user` role. Account creation, password resets and session revocation use the managed Admin API. The application permission matrix remains authoritative for CMS operations.
- Bootstrap the first identity with `npm run admin:create -- --email EMAIL --name NAME`, while authenticated in the Neon CLI on the intended branch. It generates a temporary password and promotes the managed identity. `--id` links an existing managed identity only after verifying its ID/email against the directory. Existing self-hosted users with different IDs require an explicit migration; they are never silently relinked.
- Managed identity mutations and CMS writes cannot share a transaction. A failed CMS creation may leave a managed identity without CMS membership; it has no CMS access. Investigate before retrying a failed account mutation.
- Use the existing `aws4fetch` signer with Neon's `AWS_*` variables, the actual region, and path-style bucket addressing. New media rows use the additive `NEON` storage enum. Legacy `R2` rows are retained in the schema, but old R2 objects are not migrated or served through the Neon client.
- The historical Function slug `hello` is retained as a public, data-free liveness endpoint. The protected settings page checks it from the server. It accepts only GET and accesses no credentials or database records.
- Local development and destructive test-schema setup use the `dev` branch. `NEON_BRANCH=production` or `main` blocks database tests. Production migration/seed follows development validation; tests never run against production.

## Operational limits

- Managed Auth owns session lifetimes and supported plugins; the previous eight-hour self-hosted session policy and custom session hooks no longer apply. Audit events now come from the application Server Actions.
- The SDK currently installs optional UI dependencies transitively; the app uses its own forms and does not import their UI.
- Managed Auth's upstream signup endpoint can create identities; this app mounts no public signup UI and rejects identities without explicit CMS membership.
- No SMTP configuration, MFA, frontend hosting deployment, R2 data transfer or AI Gateway is included in this change. Production auth email configuration remains an operational follow-up.
