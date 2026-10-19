# Features

Each folder here is one module of the modular monolith, for example `conservation-projects`, `inquiries` or `volunteering`. No feature exists yet. The first ones arrive in M03–M05.

## Module layout

Create only the parts a feature actually needs:

```text
src/features/<feature>/
  components/    Feature-specific UI (Server Components by default)
  actions.ts     Server Actions — validate input, call requireAdmin() where needed
  queries.ts     Server-only reads ("server-only"; Cache Components caching)
  schema.ts      Zod schemas and inferred types for this feature
  index.ts       Public API: the only file other modules may import
```

## Rules

- Other modules import a feature only through its `index.ts`. Never reach into another feature's internals.
- Features may use `@/components`, `@/services`, `@/validation`, `@/config` and `@/lib`. Those shared layers never import from features.
- Shared UI moves to `@/components` only once a second feature needs it.
- Routes in `src/app` stay thin: they compose feature components and set metadata.

See [docs/architecture/overview.md](../../docs/architecture/overview.md).
