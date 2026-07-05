# ADR 001 — Monorepo with Turborepo and pnpm

- Status: Accepted
- Date: 2026-07-05

## Context

Forge is composed of a web application and several shared domain and
infrastructure packages (kernel, brand, ui, persistence, contracts, config).
These parts evolve together and share TypeScript types, tooling, and
conventions. Managing them as separate repositories would fragment tooling,
make cross-cutting changes painful, and complicate local development.

## Decision

Use a single monorepo managed with **pnpm workspaces** and orchestrated by
**Turborepo**. Applications live under `apps/*` and shared libraries under
`packages/*`. A shared strict `tsconfig.base.json`, ESLint, and Prettier
configuration are applied across the workspace. Turborepo defines the
`dev`, `build`, `lint`, `typecheck`, and `test` pipelines.

Packages are consumed directly from their TypeScript source and transpiled by
the consuming app (Next.js `transpilePackages`), avoiding a separate build step
during development.

## Consequences

- Cross-package changes land in a single, atomic commit and pull request.
- Tooling and conventions are defined once and shared everywhere.
- Turborepo caching keeps `lint`/`typecheck`/`test` fast as the repo grows.
- Contributors must understand workspace conventions (`workspace:*` deps,
  shared configs) rather than per-repo setups.
- Consuming source directly means apps are responsible for transpiling shared
  packages; a published build step may be introduced later if needed.
