# EACH — East African Community Herbariums

The website of East African Community Herbariums, an independent initiative for plant conservation, herbarium development, medicinal-plant knowledge and botanical education across East Africa, starting in Uganda.

> **Status:** design system, navigation and cinematic hero (M02). See [ROADMAP.md](ROADMAP.md).

Copy `.env.example` to `.env.local` if you need to override defaults. No variables are required for local development.

## Requirements

- Node.js 24 or later
- npm (the only supported package manager)

## Getting started

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command                                   | Purpose                                                                                                          |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                             | Development server                                                                                               |
| `npm run build`                           | Production build                                                                                                 |
| `npm run start`                           | Serve the production build                                                                                       |
| `npm run typecheck`                       | Generate route types and run `tsc --noEmit`                                                                      |
| `npm run lint`                            | ESLint                                                                                                           |
| `npm run format` / `npm run format:check` | Prettier (with Tailwind class sorting)                                                                           |
| `npm test`                                | Vitest unit tests (`tests/unit`)                                                                                 |
| `npm run test:e2e`                        | Playwright browser tests (`tests/e2e`); run `npm run build` first. First time: `npx playwright install chromium` |

## Documentation

- [AGENTS.md](AGENTS.md) — engineering rules for contributors and AI agents
- [CLAUDE.md](CLAUDE.md) — Claude Code working procedure
- [ROADMAP.md](ROADMAP.md) — progress dashboard
- [docs/](docs/) — architecture, milestones, decisions, components, audits, deployment
