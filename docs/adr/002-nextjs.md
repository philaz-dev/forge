# ADR 002 — Next.js App Router for the web application

- Status: Accepted
- Date: 2026-07-05

## Context

Forge needs a web application that supports server-rendered pages, modern React
features, and a clear routing model. The team wants strong TypeScript support,
a large ecosystem, and first-class support for React Server Components to keep
client bundles small as the product grows.

## Decision

Build the web app with **Next.js using the App Router** (`apps/web`), on React
with TypeScript in strict mode. Styling uses **Tailwind CSS** with
**shadcn/ui**-style primitives provided by the shared `@forge/ui` package.

## Consequences

- Server Components and server actions are available for future data flows.
- File-system routing under `app/` gives a predictable structure.
- Shared UI is centralized in `@forge/ui` and transpiled by the app.
- The app is coupled to Next.js conventions and its release cadence.
- Some Next.js APIs (e.g. `next lint`) evolve over time and may require
  migration in later sprints.
