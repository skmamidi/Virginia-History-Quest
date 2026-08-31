# Virginia History Quest

Virginia History Quest is an accessible React and TypeScript prototype that helps fourth- and fifth-grade learners explore Virginia history through a mission-based map. The current slice focuses on the VS.1–VS.13 quest-map experience and the software boundaries needed to grow it safely.

> **Prototype historical-review caveat:** Historical copy, locations, relationships, and generated artwork in this repository have not completed the specification's claim-level sourcing, historian review, tribal/community review, sensitivity review, or publication sign-off. Do not treat the prototype as a production classroom source. “SOL-aligned” does not mean approved by, endorsed by, or officially affiliated with the Virginia Department of Education.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Run locally

```bash
npm ci
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

## Test and build

```bash
npm test
npm run typecheck
npm run build
npm run preview
```

`npm test` runs the Vitest suite once. Use `npm run test:watch` while developing.

## Project structure

```text
src/
  contexts/          domain models, application services, and adapters
  features/          accessible UI composition and interaction state
  test/              shared test environment
public/
  assets/            prototype artwork
  data/              display geography
  icons/             install and touch icons
docs/
  design/            generated visual concepts
  ARCHITECTURE.md     DDD boundaries and TDD workflow
  ATTRIBUTIONS.md     asset and geographic-data provenance
  FIDELITY_LEDGER.md  concept comparison and exact copy diff
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for dependency rules and the red-green-refactor sequence. See [docs/ATTRIBUTIONS.md](docs/ATTRIBUTIONS.md) before reusing any visual or map data. The final concept comparison is recorded in [docs/FIDELITY_LEDGER.md](docs/FIDELITY_LEDGER.md).

## PWA scope

The production build includes a web app manifest, install icons, and a generated service worker that precaches this local map vertical slice after the first successful visit. The production specification's signed offline mission packs, immutable content hashes, idempotent attempt sync, cache correction workflow, and content kill switch are separate acceptance requirements; this prototype shell must not be treated as an offline classroom release without those controls.

## Content publication

Prototype mission records are software fixtures, not approved curriculum packages. Production content must remain versioned outside React components and may publish only after IDs resolve, factual claims have approved sources, rights and accessibility metadata are complete, and required historical and community reviewers have signed off.
