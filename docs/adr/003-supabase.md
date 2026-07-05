# ADR 003 — Supabase and Drizzle ORM for persistence

- Status: Accepted
- Date: 2026-07-05

## Context

Forge will need a relational data store, authentication, and storage. The team
prefers a managed Postgres platform to avoid operating infrastructure early,
while retaining type-safe, code-first schema management and migrations.

## Decision

Use **Supabase** (managed Postgres, auth, storage) as the backing platform and
**Drizzle ORM** for type-safe schema definitions and queries. Persistence
concerns live in the `@forge/persistence` package.

No database connection, schema, or Supabase integration is implemented yet —
this ADR records the intended direction. The `@forge/persistence` package
currently exposes only a placeholder surface.

## Consequences

- Postgres access is standardized through Drizzle, keeping queries type-safe.
- Supabase provides auth and storage without self-hosted infrastructure.
- Domain packages depend on `@forge/persistence` rather than on a database
  driver directly, keeping persistence details isolated.
- Adopting Supabase couples hosted concerns (auth, RLS) to that provider;
  the Drizzle layer mitigates lock-in at the query level.
