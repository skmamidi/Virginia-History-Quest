# Virginia History Quest

Virginia History Quest is an accessible React and TypeScript prototype that helps fourth- and fifth-grade learners explore Virginia history through a mission-based map. The app includes 13 playable missions with clue questions, tap-to-order challenges, final challenges, and collectible explorer badges.

> **Prototype historical-review caveat:** Historical copy, locations, relationships, and generated artwork in this repository have not completed the specification's claim-level sourcing, historian review, tribal/community review, sensitivity review, or publication sign-off. Do not treat the prototype as a production classroom source. “SOL-aligned” does not mean approved by, endorsed by, or officially affiliated with the Virginia Department of Education.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm

## Run locally

```bash
npm ci
npm run dev
```

Open [http://127.0.0.1:5173/Virginia-History-Quest/](http://127.0.0.1:5173/Virginia-History-Quest/).

Every topic is available to new explorers. Correct answers save checkpoints in this browser; incorrect answers offer clues and unlimited retries. A final challenge earns a badge immediately. Seven days later, a memory check can establish retained mastery and restore the portal. Replays preserve earned badges and the original completion date. A visible notice appears if browser storage cannot save progress.

The sound toggle enables short discovery chimes. Read-aloud uses browser speech synthesis when available. Mission sources are linked inside each activity; the historical-review caveat still applies.

## Test and build

```bash
npm test
npm run typecheck
npm run build
npm run preview
```

`npm test` runs the Vitest suite once. Use `npm run test:watch` while developing.

## Deploy to GitHub Pages

Push `main` to GitHub. The Pages workflow builds the app with its repository
base path and publishes `dist/` to
[https://skmamidi.github.io/Virginia-History-Quest/](https://skmamidi.github.io/Virginia-History-Quest/).

In the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

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


## Field-trip connections

“Connect our field trips” links Yorktown, Harpers Ferry and the John Brown Museum,
Norfolk, Hampton / Hampton Roads, Sailor’s Creek, High Bridge Trail, and Appomattox
through three short stories. Fort Monroe is presented as a nearby Hampton connection,
without assuming the learners visited the fort. The place sequence represents historical
connections, not driving directions or one army’s exact route.

Children read place clues, optionally discuss or sketch memories, and solve connection
questions. Three discovery stamps save locally under a separate versioned key; no names,
location tracking, or personal recollections are collected. Related missions link to the
trail, and the Civil War timeline and industry activity include visited places.
Historical source links are included at each stop. The prototype review caveat above
still applies.

## Virginia Studies SOL practice expansion

The app includes **96 original questions in 32 three-question trails**, distributed
across VS.1–VS.13. Select a mission and choose **Practice this topic · SOL questions**
in the guide, **Practice SOL questions** in its panel, or the practice action after
earning a badge. Each trail has a short teaching passage, four-choice questions,
optional clues and browser read-aloud, explanations, retries, and a recommended
next trail. Practice does not alter mission badges or the seven-day memory check.

Coverage review (September 9, 2026): all thirteen SOLpass 2023 Virginia Studies
study guides were reviewed in the browser, with sample questions inspected from
the geography, Indigenous, Jamestown, and Reconstruction activities. This was not
an exhaustive playthrough of every SOLpass game. The app contains newly authored
questions addressing the reviewed concepts, not a reproduction of the subscription
question bank or official released SOL test items. No school credentials are
embedded in code, browser storage created by the app, or links.

| Sections | Added teaching and practice |
| --- | --- |
| VS.1 | Five regions, four river/town pairs, neighbors, Eastern Shore, Lake Drummond |
| VS.2 | Language families, Werowocomoco, environment, living tribal nations |
| VS.3 | Company/charter, settlement motives, survival, 1619 assembly and Point Comfort, women |
| VS.4 | Barter/credit/debt, settlement patterns, labor systems, hereditary slavery, capital move |
| VS.5 | Representation, political choices, leaders, Yorktown alliance and spy, Richmond |
| VS.6 | Founders/documents, representative government, westward movement, Nat Turner |
| VS.7 | Harpers Ferry, Tubman, West Virginia, battles/ironclads, diverse military and intelligence roles |
| VS.8 | Rebuilding, schools, sharecropping, amendments, Langston, Plessy, voting barriers |
| VS.9 | Resources and transport, industrial cities, farm machinery, migration and urbanization |
| VS.10 | Rationing, gardens, bonds, Wilson, military service and remembrance |
| VS.11 | Students/courts, economic and civic activists, voting, Holton and Wilder |
| VS.12 | All eight Virginia-born presidents, sequence, roles, birthplace versus later home |
| VS.13 | Industries/resources, goods/services, tourism, imports/exports, technology and innovation |

Each section links to its SOLpass guide and the VDOE standards page. Additional
primary sources qualify details: Langston took his seat in 1890 after a contested
election; the Confederate ironclad was **CSS Virginia**; Mary Jane Richards's
intelligence story is distinguished from later legends about “Mary Bowser.”
Appomattox remains the surrender of Lee's particular army, not every Confederate army.
This practice broadens learning coverage; completion is not a prediction of an SOL score.

Practice discoveries are stored separately under
`virginia-history-quest:sol-practice:v1`. Only known question IDs are accepted;
invalid entries and duplicate IDs are ignored. Correct answers save a checkpoint.
Closing and returning resumes at the first unanswered question after the lesson.
Replay does not increase the discovery count. Unavailable storage leaves practice
usable and displays a save warning. Progress is local to this browser; no account
or server is required.

## Classroom scrapbook and map lab

Two classroom connections sit below the explorer guide:

- **My Virginia scrapbook** supports the supplied September 2026–May 28, 2027
  assignment: five distinct visited historical sites, at most one in Washington,
  D.C., student photos, reasons for choosing each place, historical importance,
  reflections, organization, and oral-presentation rehearsal. A checklist supports
  review rather than assigning a grade. Four official-site ideas connect local
  trips with historical questions. The other field-trip stories remain available.
- **Virginia map lab** adds five selectable region explanations and comparison,
  temperature/snowfall concept maps, a dated population-density map with a numeric
  table and source links, compass/relative-location/scale practice, an optional
  raised-relief activity, and twelve original questions with explanations and retries.

Scrapbook drafts save under `virginia-history-quest:scrapbook:v1` in localStorage,
separately from all mission progress. Photo processing happens locally: supported
JPG/PNG/WebP images are decoded, reduced to at most 1,000 pixels on the longest
side, and re-encoded as JPEG without the original camera metadata. Photos are not
uploaded. Students may instead confirm a photo in a physical scrapbook. Storage
failures show a warning and retain the current in-memory draft. JSON download and
validated, explicitly confirmed restoration provide backups; no account, teacher
submission, or cross-device synchronization is implied. Preview includes a print
layout usable with the browser's Save as PDF option. Browser storage can be cleared,
so download backups for durable retention.

The five map-lab population values describe whole localities in 2020, not current
estimates or counts at individual points. Climate diagrams show broad teaching
patterns, not measured ranges or forecasts; the supplied climate maps do not
identify an averaging period. Region bands are approximate. Practice is transient
and does not award or change mission badges. See `docs/ATTRIBUTIONS.md` for sources,
map derivation, and the two corrected handout statements. Existing prototype
content-review limitations still apply.
