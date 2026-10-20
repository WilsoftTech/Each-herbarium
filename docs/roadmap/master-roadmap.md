# Master roadmap

The detailed implementation plan. Live status is in [ROADMAP.md](../../ROADMAP.md). Executable scope and acceptance criteria are in [docs/milestones/](../milestones/README.md).

## Sequence

```text
M01 Foundation
  └─► M02 Design system, animation, mega menus
        └─► M03 Cinematic homepage and public pages
              ├─► M04 Database, CMS, editorial workflow
              │     └─► M05 Forms, communication, engagement
              └──────────► M06 Performance, SEO, a11y, security audit
                                └─► M07 Staging, deployment, release
```

M05 depends on M03 (pages hosting the forms) and M04 (persisting submissions). M06 audits everything built in M03–M05.

## Plan

### M01 — Engineering foundation

Next.js, TypeScript strict mode, Tailwind tokens, testing (Vitest, Playwright), CI, agent rules, documentation system. **No product features.**

### M02 — Premium UI, animation system and mega menus

Brand verification against the logo; typography; spacing tokens; shadcn/ui initialisation and primitives (Button, SectionHeading, media); GSAP and Motion leaves per ADR 0003; header with animated desktop mega menus; premium mobile navigation; footer.

### M03 — Cinematic homepage and public pages

Cinematic homepage; About, Conservation, Herbarium, Medicinal Plants, Research and Education, Get Involved, Partners (including Bitwiire as an independent partner), Contact. Content is static and typed in this milestone.

Delivered (2026-10-19). The route list in the M03 brief was adopted unchanged (25 routes, including `/projects/[slug]` and `/resources/[slug]`). The navigation now has six top-level sections: Home, About EACH, Our Work, Herbarium & Research, Projects & Impact, Get Involved. Policy pages are linked from the footer. Every linked route exists. Content is typed and static behind async queries ([ADR 0006](../decisions/0006-content-contracts-and-placeholders.md)). Everything EACH has not supplied is a labelled placeholder listed in [awaiting-approval.md](../content/awaiting-approval.md).

### M04 — Database, CMS and editorial workflows

Content models (pages, programmes, projects, articles, resources, partners, team, media, settings), Prisma + Neon persistence, Neon Managed Auth and Object Storage, admin authorisation behind `requireAdmin()`, draft, review and publish workflow with pending revisions. Static content moves to the CMS, including the designed sections of every landing page and founding programme page (ADR 0013, confirmed by the owner on 2026-10-20). Production migration and seeding need owner approval.

### M05 — Forms, communication and community engagement

Contact, volunteer and partnership forms; server-side validation; spam protection; Resend email; delivery reliability and admin visibility.

### M06 — Performance, SEO, accessibility and security

Core Web Vitals budgets, image strategy, metadata, sitemap, structured data, WCAG 2.2 AA audit, security headers, CSP, dependency audit, threat review.

### M07 — Staging, deployment and release

Vercel project and preview/staging environments, secrets management, CI on GitHub, release checklist, monitoring, rollback plan, production launch audit.

## Out of scope until explicitly planned

Full Digital Herbarium specimen database, AI plant identification, researcher accounts, payments.
