# ADR 006 — Hexagonal architecture within domain packages

- Status: Accepted
- Date: 2026-07-05

## Context

Domain packages (starting with `@forge/knowledge`) must hold business logic that
stays independent of frameworks, persistence, and transport. ADR 005 places
domains in their own packages; this ADR defines their internal shape so business
rules never leak into infrastructure and infrastructure never leaks into the
domain.

## Decision

Structure each domain package with **Hexagonal (ports & adapters)** layering:

- A pure `domain/` core: entities, value objects, invariants, and event
  builders. No I/O, no framework, no persistence imports.
- An `application/` layer exposing use-cases as the package's public API. It
  orchestrates the domain and returns serializable snapshots and contract events.
- Infrastructure lives outside the core and is plugged in behind the
  application API. For Sprint 002 the only "adapter" is an in-memory collection
  owned by the use-case factory; a persistent adapter can replace it later
  without touching the domain.

Domains depend on `@forge/kernel` for shared primitives and on
`@forge/contracts` for events. They never depend on other domains directly.

## Consequences

- The domain core is fully unit-testable without a database or framework.
- Persistence and transport can be added later as adapters, with no change to
  domain rules or the public API.
- The public surface stays small (use-cases + DTOs); internals remain private.
- Contributors must respect the direction of dependencies: infrastructure may
  depend on the domain, never the reverse.
