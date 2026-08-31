# Attributions and provenance

This file records prototype asset origins. It is not a substitute for the specification's production media-rights registry or claim-level source register.

## Generated visual assets

The following original prototype visuals were created with OpenAI image generation on August 24, 2026:

| Asset | Role | Notes |
|---|---|---|
| `public/assets/quest-compass.png` | Product mark and compass artwork | Original generated illustration; not historical evidence. |
| `public/assets/virginia-atlas-terrain.jpg` | Compressed illustrated terrain backdrop shipped by the app | Stylized artwork, not an authoritative geographic or historical map. |
| `docs/design/virginia-atlas-terrain-source.png` | Lossless source for the shipped terrain backdrop | Design-source file; not loaded by the app. |
| `docs/design/quest-map-desktop-concept.png` | Desktop design reference | Design-only generated concept; UI text and map details require implementation and content review. |
| `docs/design/quest-map-mobile-concept.png` | Mobile design reference | Design-only generated concept; UI text and map details require implementation and content review. |

The files in `public/icons/` are mechanically resized derivatives of `public/assets/quest-compass.png` created for the web app manifest and Apple touch icon. They introduce no additional source artwork.

Generated artwork must not be treated as documentary evidence or used to infer clothing, architecture, boundaries, people, artifacts, or events. Before production publication, each visual needs a complete rights record, prompt/tool provenance, accessibility text, historical review status, and any required sensitivity or community review.

## Virginia boundary

`public/data/virginia-outline.geojson` is adapted from the U.S. Census Bureau's [TIGERweb States layer](https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/USLandmass/MapServer/0), which identifies itself as the January 1, 2025 vintage and credits the U.S. Census Bureau. The source feature is Virginia, state FIPS code `51`, requested as simplified GeoJSON in WGS 84 with only `STATE` and `BASENAME` retained for the client display.

Source query:

```text
https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/USLandmass/MapServer/0/query?where=STATE%3D%2751%27&outFields=STATE%2CBASENAME&returnGeometry=true&outSR=4326&maxAllowableOffset=0.005&geometryPrecision=5&f=geojson
```

Suggested display credit:

> Virginia state boundary source: U.S. Census Bureau, 2025 TIGERweb States layer (January 1, 2025 vintage); adapted for display.

The U.S. Census Bureau explains that works created by its employees generally are not eligible for U.S. copyright protection and [asks users to cite the Bureau as the source](https://www.census.gov/about/policies/citation.html). Census names and marks must not be used to imply endorsement. See the Bureau's [2025 TIGER/Line page](https://www.census.gov/geographies/mapping-files/2025/geo/tiger-line-file.html) and the service metadata linked above.

The bundled outline is a lightweight visual boundary. It is not suitable for surveying, navigation, determining jurisdiction, representing historical borders, or locating protected cultural landscapes. Historical and Indigenous geography requires time-bounded, reviewed layers with uncertainty and sensitivity metadata.

## Non-endorsement

Virginia History Quest is not approved by, endorsed by, or officially affiliated with the Virginia Department of Education, the U.S. Census Bureau, or any historical, tribal, museum, park, or community organization unless written authorization is recorded.
