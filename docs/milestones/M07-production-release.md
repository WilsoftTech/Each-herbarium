# M07 — Staging, deployment and release audit

**Status:** NOT STARTED · **Depends on:** M06

## Goal

Ship EACH to production safely, with a tested way back.

## Scope

- ADR: hosting platform (Vercel or Cloudflare), media and CDN, database hosting, domain and DNS.
- GitHub remote and CI running on GitHub (requires approval), with branch protection.
- Staging environment with production-like configuration.
- Secrets management per environment.
- Release checklist, smoke tests against staging, monitoring and error reporting, uptime checks.
- Rollback procedure, rehearsed on staging.
- Backups for the database and media.

## Acceptance criteria

- [ ] CI is green on GitHub for the release commit.
- [ ] Staging deployed and smoke-tested.
- [ ] Rollback rehearsed and documented.
- [ ] Production deployed **with explicit approval**; post-deploy smoke tests pass.
- [ ] Release audit stored in `docs/audits/`; [deployment docs](../deployment/README.md) updated to the real configuration.
