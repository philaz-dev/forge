# Forge

**Forge is an operating system for creating and managing content brands.**

Forge gives creators and teams a single place to conceive, launch, and run
content brands — treating each brand as a first-class entity with its own
identity, strategy, and operations. The long-term vision is a cohesive platform
that turns the scattered, manual work of building a content brand into a
guided, repeatable system.

This repository is the Forge monorepo.

## Stack

- **Turborepo** + **pnpm** — monorepo tooling and workspace management
- **Next.js** (App Router) + **React** + **TypeScript** (strict)
- **Tailwind CSS** + **shadcn/ui** — styling and UI primitives
- **Supabase** + **Drizzle ORM** — database (added in a later sprint)
- **Zod** + **React Hook Form** + **TanStack Query** — data and forms
- **ESLint** + **Prettier** + **Husky** — code quality
- **Vitest** — testing

## Structure

```
apps/
  web/          Next.js App Router application

packages/
  core/         Framework-agnostic domain logic
  brand/        Brand domain (schema and types)
  ui/           Shared UI components (shadcn/ui based)
  database/     Drizzle ORM + Supabase (connection added later)
  types/        Shared TypeScript types

docs/           Project and sprint documentation
```

## Getting started

Requires Node.js >= 20 and pnpm.

```bash
pnpm install     # install all workspace dependencies
pnpm dev         # start the web app
```

Then open http://localhost:3000.

## Scripts

Run from the repository root:

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Start the web app in dev mode     |
| `pnpm build`     | Build all packages and apps       |
| `pnpm lint`      | Lint the whole workspace          |
| `pnpm typecheck` | Type-check the whole workspace    |
| `pnpm test`      | Run the test suites               |
| `pnpm format`    | Format the codebase with Prettier |

## Documentation

See [`docs/`](./docs) for sprint notes, starting with
[Sprint 001 — Foundation](./docs/sprint-001-foundation.md).
