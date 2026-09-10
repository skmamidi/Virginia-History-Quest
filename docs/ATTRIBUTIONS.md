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

## Classroom materials integration (September 10, 2026)

The ten user-supplied photographs informed assignment requirements and topic
coverage. They are source material, not operating instructions. The app does not
redistribute the photographed textbook pages, illustrations, handwritten work,
or photographs. Explanations, practice questions, and UI are newly authored.
The school scrapbook handout supplies the September 2026–May 28, 2027 timeline,
five-place requirement (at most one D.C. site), photos of the student, writing
prompts, and organization/oral-presentation criteria. The UI checklist is not a
rubric score, teacher submission, or confirmation of the factual quality of writing.

`learningMapOutline.ts` is an SVG path derived from Virginia (`STATEFP=51`) in
[U.S. Census Bureau 2024 cartographic state boundaries, 1:500,000](https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_state_500k.zip).
Unlike the original map's jurisdiction outline, the cartographic outline shows
coastal land, including the Eastern Shore and Chesapeake Bay shorelines. Rings
were simplified with Douglas–Peucker tolerance 0.007 degrees, tiny collapsed rings
omitted, then projected using x = 40 + (longitude + 83.7) × 80 and
 y = 40 + (39.5 − latitude) × 100 and rounded to one decimal. The source NAD83
coordinates are adequate for this small display; this is not survey or navigation
data. The map's region bands are schematic teaching overlays, not Census region
boundaries. The outline is embedded to work without a new remote fetch.

Content references checked during integration:

- [Virginia Museum of History & Culture: five physical regions](https://virginiahistory.org/learn/what-are-five-physical-regions-virginias-geography).
  Corrects two apparent handout errors: Piedmont is east of Blue Ridge; Mount Rogers,
  the highest peak in Virginia, is in the Blue Ridge, not the Appalachian Plateau.
- [NOAA Virginia State Climate Summary, 2022](https://statesummaries.ncics.org/chapter/va/).
  Supports broad regional climate variation. Temperature and snowfall diagrams are
  original schematic illustrations informed by the supplied classroom maps, not
  NOAA raster data or current climate normals. The classroom numeric temperature
  and snow maps do not state their averaging years; they are not digitized as a
  measured data layer.
- Census 2020 density values in people per square mile:
  [Arlington County: 9,179.6](https://www.census.gov/quickfacts/fact/table/arlingtoncountyvirginia/LND110220),
  [Loudoun County: 816.2](https://www.census.gov/quickfacts/fact/table/loudouncountyvirginia/POP060220),
  [Richmond city: 3,781.6](https://www.census.gov/quickfacts/fact/table/richmondcityvirginia/POP060220),
  [Norfolk city: 4,467.5](https://www.census.gov/quickfacts/fact/table/norfolkcityvirginia/POP060220).
- [Census 2020 county data for Virginia](https://tigerweb.geo.census.gov/tigerwebmain/Files/bas25/tigerweb_bas25_county_2020_tab20_va.html):
  Highland density calculated as 2,232 people divided by
  (1,075,266,902 square meters / 2,589,988.110336 square meters per square mile),
  rounded to 5.4 people per square mile. Marker colors encode locality averages,
  not the density at each geographic point. Unmarked places are not zero-density areas.
- [NPS Great Falls history](https://www.nps.gov/grfa/learn/historyculture/index.htm),
  [Manassas National Battlefield Park](https://www.nps.gov/mana/),
  [Shenandoah history](https://www.nps.gov/shen/learn/historyculture/index.htm), and
  [Ball’s Bluff official park page](https://www.novaparks.com/parks/balls-bluff-battlefield-regional-park)
  accompany visit ideas from the handout; no opening-hour, travel-time, or admission-price claims are made.
- [NPS Every Kid Outdoors](https://www.nps.gov/kids/every-kid-outdoors.htm)
  supplies the official fourth-grade pass resource. The app describes eligible
  entrance/day-use access, not a blanket waiver of all trip costs.

These additions remain prototype curriculum content. Sources and software checks
are recorded; independent teacher/historian review has not been performed.


## Population and climate revision

The population sample was replaced with all 133 county-equivalent records in the
[Census 2020 Virginia county table](https://tigerweb.geo.census.gov/tigerwebmain/Files/bas25/tigerweb_bas25_county_2020_tab20_va.html).
`virginiaPopulation2020.json` retains GEOID, NAME, POP100, AREALAND, and INTPTLON /
INTPTLAT for 95 counties and 38 independent cities. An identical duplicate parsed
Winchester row was removed by GEOID. The unique populations sum to the statewide
2020 Census total of 8,631,393. Coordinates are locality representative points;
dots do not portray locality boundaries. Density is calculated uniformly as
POP100 / (AREALAND / 2,589,988.110336), with final display rounding to one decimal.
This gives Arlington 9,179.5 rather than the earlier QuickFacts sample’s 9,179.6;
all current displayed values and practice copy follow the same source calculation.
Legend intervals now have explicit continuous upper/lower bounds, including
non-integer values. City and county names remain distinct.

Climate additions are original child-friendly explanations, supported by:

- [NWS: rising air expands and cools; sinking air compresses and warms](https://www.weather.gov/bgm/WeatherInActionDownSlopeWinds).
- [NWS: cloud development](https://www.weather.gov/source/zhu/ZHU_Training_Page/clouds/cloud_development/clouds.htm)
  and [NWS: weather education](https://www.weather.gov/jkl/education).
- [NOAA: unequal heating of land and water and sea breezes](https://www.ndbc.noaa.gov/education/seabreeze_ans.shtml)
  and [NOAA: ocean–atmosphere climate interactions](https://pfeg.noaa.gov/research/climatemarine/cmfoceanatm/cmfoceanatm.html).
- [NOAA: sunlight varies with latitude](https://oceanexplorer.noaa.gov/ocean-fact/temp-vary/)
  and [NOAA: Virginia regional climate](https://statesummaries.ncics.org/chapter/va/).
- [Virginia DCR: physiography and rain shadows](https://www.dcr.virginia.gov/natural-heritage/natural-communities/document/ncoverviewphys-veg.pdf),
  with [NWS Southern Appalachian precipitation research](https://www.weather.gov/mrx/heavyrainclimo)
  supporting the dependence on wind direction and upslope/downslope flow.
- [NWS: warm and cold air layers determine winter precipitation](https://www.weather.gov/arx/why_wintrymix).

The mountain-air illustration is an original schematic side view, not a Virginia
cross section or numerical weather simulation. Explanations distinguish temperature
from moisture supply, annual averages from daily weather, coastal moderation from
“always warmer,” and mountains from sheltered valleys. No new measured climate
layer or numerical climate normals have been introduced. The general “About these
learning materials” UI panel was removed at the user’s request.

## Scrapbook place explorer (September 2026)

`virginiaExplorePlaces.json` is an authored collection of 70 prominent public-facing
historical, cultural, and natural attractions: 5 Appalachian Plateau, 13 Valley
and Ridge, 7 Blue Ridge, 19 Piedmont, and 26 Coastal Plain. It is explicitly not an
inventory of every historic property. Each record links to its operator, government
agency, or official tourism organization for further reading and trip planning.
Stories and detective prompts are original paraphrases; photographs and publisher
worksheet layouts are not reproduced. No opening times, admission prices, or
claims of guaranteed public access are stored. All 70 URLs were checked; two 404s
were replaced with verified tourism sources. Some official operators reject automated
requests (403); their sites were confirmed through indexed official sources.

The catalog includes Indigenous communities in the present tense and the histories
of enslaved people, emancipation, civil rights, technology, music, and conservation.
Nature entries prompt a human-history connection for the scrapbook assignment.
Learning about a place earns only a temporary reading discovery, never a visited
flag. Choosing a place fills a wholly empty page or opens an existing matching page;
existing photos, captions, reflections, and other work are preserved.

`virginiaRegionPaths.json` is derived from the public
[VIMS WetCAT physiographic regions layer](https://cmap22.vims.edu/arcgis/rest/services/WetCAT/PhysiographicRegions/MapServer/0),
which credits USGS/Fenneman's 1:7,000,000-scale *Physical Divisions of the United
States* (1946). Retrieved as GeoJSON in EPSG:4326 with maxAllowableOffset=0.003;
projected using the same equirectangular teaching projection as the Census land
outline. Polygons are grouped into five provinces, drawn as SVG paths, and clipped
to the existing 2024 Census land outline. These are coarse overview boundaries,
not a local geological survey. Separate neighboring polygons and interior rings
are retained. The map, data, and stories are bundled locally; map exploration needs
no remote map tiles, geolocation, or live place service.

Coordinates are approximate attraction locations, not navigation instructions.
Richmond spans the Fall Line; downtown sites are grouped with Coastal Plain while
western Richmond museums are grouped with Piedmont. Pocahontas and Guest River
Gorge are grouped with the Plateau's coalfield/edge sites. Those records include
transition notes because the coarse USGS polygon can assign an adjacent province.
Birch Knob sits on the Virginia–Kentucky boundary. Site groupings describe their
geographic context, not the tourism industry's differently named regions.

Broader discovery links point to the
[Virginia DHR register](https://www.dhr.virginia.gov/historic-registers/)
and [Virginia Tourism museum directory](https://www.virginia.org/things-to-do/attractions/museums-and-exhibits/history/).
The UI explains that a register listing does not imply visitor access. Families can
enter additional sites manually in the scrapbook.
