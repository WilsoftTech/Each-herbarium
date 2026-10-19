# M06 — Performance, SEO, accessibility and security

**Status:** NOT STARTED · **Depends on:** M03, M04, M05

## Goal

Prove the site is fast, discoverable, accessible and secure before release.

## Scope

- **Performance:** Core Web Vitals budgets (LCP < 2.5s, INP < 200ms, CLS < 0.1 on mid-range mobile); image and font audit; bundle analysis of client components and animation.
- **SEO:** metadata review, Open Graph images, `sitemap.ts`, `robots.ts`, structured data (Organization), canonical URLs.
- **Accessibility:** WCAG 2.2 AA audit (automated, plus manual keyboard and screen-reader checks); reduced motion.
- **Security:** security headers and CSP, dependency audit (including the M01 `braces` advisory), authorisation review, secrets review, error handling that does not leak details.

## Acceptance criteria

- [ ] Lighthouse or equivalent results recorded for key routes and meeting budgets.
- [ ] No critical or serious accessibility violations; manual audit recorded.
- [ ] Security headers verified on a production build.
- [ ] No high or critical vulnerabilities in runtime dependencies; dev-only findings triaged.
- [ ] Audit report stored in `docs/audits/`.
- [ ] Full verification suite passes.
