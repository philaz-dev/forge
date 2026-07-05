# ADR 005 — Domain-Driven Design package structure

- Status: Accepted
- Date: 2026-07-05

## Context

As Forge grows, business logic risks leaking into the UI or persistence layers,
making the system hard to reason about and change. The team wants clear
boundaries between domains and between domain logic and infrastructure.

## Decision

Structure the codebase around **Domain-Driven Design** principles:

- `@forge/kernel` — framework-agnostic domain primitives shared across domains.
- Domain packages (e.g. `@forge/brand`) own their own types and rules.
- `@forge/contracts` — shared events, commands, and cross-domain interfaces.
- `@forge/persistence` — infrastructure for storage, isolated from domains.
- `@forge/config` — shared configuration.

Domain types live inside their own domain packages rather than in a single
shared `types` package (which was removed for this reason). Generic shared
utilities may later live in `@forge/shared`, to be created only when required.

## Consequences

- Each domain is self-contained and owns its own language and types.
- Infrastructure (persistence, config) is separated from domain logic.
- Cross-domain coupling is funneled through explicit contracts.
- More packages mean more boundaries to maintain, but clearer ownership.
- Contributors must place code in the correct package by responsibility rather
  than by technical type.
