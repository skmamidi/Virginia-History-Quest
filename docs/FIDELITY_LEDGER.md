# Quest Map fidelity ledger

Compared against:

- `docs/design/quest-map-desktop-concept.png` at 1505 × 1045
- `docs/design/quest-map-mobile-concept.png` at 852 × 1846

## Visual checkpoints

| Checkpoint | Result | Notes |
| --- | --- | --- |
| Navy atlas header and compass identity | Matched | The working controls use explicit state labels and 44 px minimum targets. |
| Large memory-map heading and instructional lead | Matched | The lead is intentionally hidden on the narrow mobile layout. |
| Map, Timeline, and Standards segmented views | Matched | Each segment is a working, keyboard-accessible tab projection. |
| Terrain, Rivers, and Then & now controls | Matched | Each layer control changes the rendered map and its accessible description. |
| Progress, retrieval clue, selected mission, and dock | Matched | All are working projections instead of decorative concept elements. |
| Atlas terrain, physical regions, rivers, and portal states | Matched in intent | The implementation uses the official Census Virginia outline and safe generalized mission points; the generated terrain remains illustrative. |
| Coral selected portal and selected-mission hierarchy | Matched | VS.3 uses “Choices, survival & change” as the child-facing heading while retaining the canonical title for assistive technology. |
| Responsive mission sheet and persistent learner dock | Matched in intent | The smaller viewport uses a 208 px pannable map window that automatically centers the selected portal and keeps it clear of the sheet. |

## Exact copy diff

Concept copy retained exactly:

- “Virginia History Quest”
- “Your Virginia Memory Map”
- “Choose a portal to uncover how place shaped the story.”
- “Map”, “Timeline”, “Standards”
- “Terrain”, “Rivers”, “Then & now”
- “5 of 13 portals restored”
- “You’re getting stronger at connecting place to choices.”
- “Today’s map clue”
- “Which river carried ships to Jamestown?”
- “James River”, “York River”, “Potomac River”
- “2 quick reviews”
- “VS.3 · Jamestown”
- “Choices, survival & change”
- “Why did Jamestown survive despite severe risk?”
- “Continue mission”
- Desktop dock labels: “Quest Map”, “Time Portals”, “Timeline Lab”, “People Deck”, “Chain Lab”, “Review”

Intentional copy differences:

- “Pause” became “Pause motion” so the control names the behavior it changes.
- “Audio on” is rendered as the current state (“Audio off” by default); nothing plays automatically.
- “Menu” became “All missions” so its destination is explicit.
- The working mission panel adds a generalized location, short map summary, time lens, era, and source-review disclosure.
- The mobile dock shortens labels to “Quest Map”, “Time Portals”, “Timeline Lab”, “People Deck”, and “Review” so five targets remain legible without horizontal scrolling.

## Deliberate implementation deviations

- The concept's decorative portal subjects were replaced with canonical VS.1–VS.13 mission numbers and color-independent status icons.
- The detailed outline is based on U.S. Census TIGERweb geometry, rather than treating generated concept geography as authoritative.
- On mobile, the atlas is a focused two-axis viewport instead of scaling all thirteen controls below a safe touch size.
- Retrieval content remains in the progress/review projection instead of being duplicated inside the mobile mission sheet.

