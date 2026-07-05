# Sprint 001 — Foundation

## Goal

Create the initial Forge monorepo foundation.

Forge is an operating system for creating and managing content brands.

## Stack

- Turborepo
- pnpm
- Next.js App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Supabase
- Drizzle ORM
- Zod
- React Hook Form
- TanStack Query
- ESLint
- Prettier
- Husky
- Vitest

## Structure

```
apps/
  web/

packages/
  core/
  brand/
  ui/
  database/
  types/

docs/
```

## Scope

Create only the project foundation.

The web app homepage displays:

- **Forge**
- **No Brand yet**
- **[ Create Brand ]** — the button does nothing for now.

### Explicitly out of scope for this sprint

- Brand creation is **not** implemented.
- The database connection is **not** implemented.
- Authentication is **not** implemented.
- No features beyond the foundation are added.

## What was built

### Monorepo tooling

- Turborepo (`turbo.json`) orchestrates `dev`, `build`, `lint`, `typecheck`,
  and `test` across the workspace.
- pnpm workspaces (`pnpm-workspace.yaml`) link `apps/*` and `packages/*`.
- A shared strict `tsconfig.base.json` is extended by every package and app.
- ESLint, Prettier, and Husky (pre-commit) enforce code quality.

### `apps/web`

- Next.js App Router application with TypeScript strict mode.
- Tailwind CSS configured with shadcn/ui design tokens.
- Homepage (`app/page.tsx`) renders **Forge**, **No Brand yet**, and a
  **Create Brand** button (inert by design).
- Vitest + Testing Library cover the homepage contents.

### Packages

| Package           | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `@forge/core`     | Framework-agnostic domain logic.                     |
| `@forge/brand`    | Brand domain — Zod schema and `Brand` type only.     |
| `@forge/ui`       | Shared UI (shadcn/ui `Button`, `cn` helper).         |
| `@forge/database` | Drizzle ORM + Supabase surface (no connection yet).  |
| `@forge/types`    | Shared TypeScript types.                             |

Packages are consumed directly from source and transpiled by Next.js via
`transpilePackages`, so no separate build step is required during development.

## Acceptance criteria

- [x] `pnpm install` works
- [x] `pnpm dev` starts the web app
- [x] Homepage shows exactly: Forge / No Brand yet / Create Brand button
- [x] TypeScript has no errors (`pnpm typecheck`)
- [x] Lint passes (`pnpm lint`)
- [x] Tests run (`pnpm test`)
- [x] No unnecessary features are added
