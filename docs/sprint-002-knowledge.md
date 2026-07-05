# Sprint 002 — Knowledge Engine

## Purpose

Knowledge is the brain of Forge. It owns every business entity Forge knows about
the world. This sprint delivers the **domain model and clean architecture** of
the Knowledge domain — nothing else.

Explicitly **not** built this sprint: AI, scraping, search, database,
repositories, persistence. Only the domain and its public operations.

The first entity types owned by Knowledge are:

- `Company`
- `Product`
- `Category`
- `AffiliateProgram`

They share one flat entity shape — there is **no inheritance**.

## Architecture

The domain follows the existing ADRs: DDD (ADR 005), event-driven communication
(ADR 004), and Hexagonal architecture (ADR 006). It never bypasses the kernel
and contains no framework or persistence code.

```
packages/knowledge/src/
  domain/                     Pure domain — no I/O, no framework
    entity-type.ts            EntityType (Company, Product, Category, AffiliateProgram)
    entity-status.ts          Status (DRAFT, ACTIVE, ARCHIVED) + transition rules
    knowledge-entity.ts       KnowledgeEntity + create/update/archive behaviors
    snapshot.ts               Serializable view at the package boundary
    events.ts                 Builds @forge/contracts events from entities
    value-objects/
      slug.ts                 Slug — normalization + validation
      entity-name.ts          EntityName — non-empty, whitespace-normalized
      knowledge-source.ts     KnowledgeSource — provenance label
  application/
    knowledge-module.ts       The four use-cases over an in-memory collection
  index.ts                    Public API (module factory + supporting types)
```

### Kernel primitives

Shared primitives live in `@forge/kernel` so every future domain reuses them:

- `Id` / `generateId()`
- `IsoTimestamp` / `now()`
- `DomainError` / `ValidationError`

### Value objects (no primitive obsession)

`Slug`, `EntityName`, and `KnowledgeSource` are immutable value objects with
private constructors and validating factories. Entities hold value objects
internally; primitives only appear at the boundary via `KnowledgeEntitySnapshot`.

### Base entity

Every knowledge entity has: `id`, `type`, `name`, `slug`, `aliases[]`, `source`,
`status`, `createdAt`, `updatedAt`.

Status lifecycle:

```
DRAFT ──▶ ACTIVE ──▶ ARCHIVED
  └───────────────▶ ARCHIVED
```

`ARCHIVED` is terminal. Archived entities cannot be updated or re-archived.

### Events

Domain events are **registered in `@forge/contracts`** and built from entities
in `domain/events.ts`:

- `KnowledgeEntityCreated`
- `KnowledgeEntityUpdated`
- `KnowledgeEntityArchived`

Each mutation returns `{ entity, event }`. There is no dispatcher yet
(ADR 004 defers transport); returning the event is the seam a future event bus
will publish through.

### Public API

`createKnowledgeModule()` returns exactly the four Knowledge operations, closing
over an in-memory collection:

- `createKnowledgeEntity(input)`
- `updateKnowledgeEntity(id, changes)`
- `archiveKnowledgeEntity(id)`
- `findBySlug(slug)`

The factory owns its collection, so there is no global mutable state and each
instance is independent (which also keeps tests isolated).

## Tests

Unit tests (Vitest, node environment) cover:

- **Entity creation** — id/timestamps, derived slug, default status, aliases, events
- **Slug normalization** — casing, punctuation, edge separators, diacritics
- **Validation** — empty/oversized values, unknown type, missing entity
- **Status transitions** — allowed/forbidden moves, archive rules, archived immutability

## Future evolution

The domain is deliberately closed to the outside so it can grow without churn:

- **Persistence** — replace the in-memory collection with a driven adapter
  (e.g. `@forge/persistence`) behind the same `KnowledgeModule` API.
- **Eventing** — publish the returned contract events through a real bus.
- **More entity types & attributes** — extend `EntityType` and entity fields
  without inheritance.
- **Enrichment** — AI, scraping, and search will consume Knowledge, not live
  inside it.
- **Reuse** — Opportunity, Brand, Content, Revenue, and AI modules build on the
  entities and events defined here.
