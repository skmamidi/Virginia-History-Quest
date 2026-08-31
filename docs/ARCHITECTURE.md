# Architecture

Virginia History Quest is a React and TypeScript prototype organized around domain boundaries, not screens. Vite is the delivery shell for this focused prototype; the production specification's suggested Next.js stack can replace that shell without moving historical or learning rules into the framework layer.

## Dependency direction

```text
features / presentation
          |
          v
context application services
          |
          v
context domain model

adapters / browser / static data --> context ports
```

Dependencies point inward. Domain code is plain TypeScript and must not import React, browser APIs, CSS, storage, network clients, or another context's adapter. Presentation code may render an application view model, but it must not decide whether mastery is earned, content is publishable, or a location is safe to reveal.

## Bounded contexts

### Published Content

Owns the language and invariants of a publishable mission catalog: canonical `MissionId` values, mission metadata, accessible summaries, publication state, and content-version rules. A catalog adapter may supply prototype records, but React components do not own those records.

Production content remains a separate, versioned product. Replacing the prototype adapter with validated mission packages must not change the domain contract. Claim provenance, reviewer approval, expiration, rights records, checksums, and kill-switch status belong at this boundary before content can be treated as published.

### Quest Journey

Owns learner-facing journey state: mission availability, orientation, learning, boss readiness, provisional mastery, retained mastery, and the learner's last meaningful step. `MissionProgress` is the aggregate that guards legal transitions. A same-day boss result cannot silently become retained mastery.

Application services in this context combine published mission records with journey state and return read models such as the quest-map projection. They coordinate domain objects; they do not reimplement their invariants.

### Geography

Owns the safety policy for public map geometry and the vocabulary for location precision. Sensitive cultural landscapes and active or restricted sites must be generalized before they cross the public-map boundary. The map feature receives already-approved public geometry and cannot opt out of this policy.

The bundled Virginia outline is presentation geography, not a historical claim, a navigation product, or permission to expose precise sensitive locations.

### Quest Map feature

Owns rendering and transient interaction state for map, timeline, and standards projections. It composes application read models, implements accessible equivalents, and translates user intent into application commands. It does not own publication, mastery, or location-safety decisions.

### Platform and delivery

The Vite shell, PWA manifest, generated app-shell service worker, static assets, storage adapters, and network clients are replaceable infrastructure. Offline caches must key versioned content separately from learner attempts. Production offline packs require signatures, immutable hashes, idempotent sync, correction invalidation, and a content kill switch; the prototype app-shell cache alone does not provide those guarantees.

## Context contracts

Cross-context collaboration should use explicit values or read models rather than importing another context's internal aggregate. In particular:

- Published Content supplies validated mission records.
- Quest Journey supplies mission progress and map projections.
- Geography supplies geometry that has passed its disclosure policy.
- Presentation consumes those outputs and emits user intent.

The shared vocabulary is deliberately small: mission, portal, progress, mastery, published content, public geometry, and generalized location. UI labels such as panel, tab, and card are not domain concepts.

## Aggregate invariants

The prototype establishes these non-negotiable examples:

- A canonical mission ID is one of `VS.1` through `VS.13`.
- A published catalog contains exactly one accessible entry for every mission.
- Mission state changes occur only through legal domain events.
- Passing a boss activity produces provisional, not retained, mastery.
- Sensitive geometry cannot be emitted at exact public precision.
- Every map projection preserves all thirteen missions in curriculum order.

New rules should be added at the context that owns the language. A component-level conditional is not an acceptable substitute for a domain invariant.

## TDD workflow

Work in one observable behavior at a time:

1. Write the smallest failing test using domain language.
2. Confirm that it fails for the intended reason.
3. Implement the smallest behavior that makes it pass.
4. Run the focused test, then the full suite.
5. Refactor names and boundaries while tests remain green.
6. Run type checking, accessibility checks, and the production build before handoff.

The expected test sequence for a vertical slice is:

1. **Domain contract tests** for IDs, catalog completeness, legal transitions, safety, provenance, and other invariants.
2. **Application tests** for orchestration and deterministic read-model projection.
3. **Adapter contract tests** for parsing, versioning, corruption, and failure behavior.
4. **Feature tests** for keyboard/pointer equivalence, semantic alternatives, feedback, and visible state.
5. **Journey tests** for the complete learner flow, including offline/reconnect behavior when that infrastructure exists.

Tests should use fixed records and clocks, assert outcomes rather than implementation details, and include the failure path. Historical wording is test fixture data until it has passed the publication workflow; tests prove software behavior, not historical truth.

## Verification commands

```bash
npm test
npm run typecheck
npm run build
```

For a focused red-green loop, pass a path to Vitest:

```bash
npm test -- src/contexts/quest-journey/domain/missionProgress.test.ts
```

## Definition of done

A slice is done when its owning context and invariants are clear, a failing test preceded the behavior, the complete suite and production build pass, keyboard and nonvisual equivalents work, and no unreviewed claim is presented as publication-ready. Content-facing slices also need provenance, rights, sensitivity, and reviewer status before production release.
