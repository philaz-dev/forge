# ADR 004 — Event-driven cross-domain communication

- Status: Accepted
- Date: 2026-07-05

## Context

Forge is organized into distinct domains (e.g. brand). These domains must react
to one another's changes without becoming tightly coupled through direct calls
into each other's internals. A shared, explicit contract for what happens in the
system helps keep domains independent and testable.

## Decision

Adopt an **event-driven** approach for cross-domain communication. Shared event
and command contracts live in the `@forge/contracts` package, which also holds
cross-domain interfaces. Domains publish events (e.g. `BrandCreated`,
`BrandUpdated`) and react to events from other domains rather than calling into
them directly.

For now `@forge/contracts` contains only placeholder event examples
(`BrandCreated`, `BrandUpdated`); no dispatching or transport is implemented.

## Consequences

- Domains are decoupled: they depend on shared contracts, not each other.
- Event and command shapes are defined in one place and versioned together.
- New consumers can subscribe to existing events without changing producers.
- An eventing/transport mechanism must be chosen and implemented later.
- Contract changes are cross-cutting and require care to remain
  backward-compatible.
