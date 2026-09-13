import { useId, useState } from 'react';
import { LEARNING_MAP_OUTLINE } from '../../../contexts/published-content/adapters/learningMapOutline';
import { REGION_LESSONS } from '../../../contexts/published-content/adapters/schoolMaterials';
import { DENSITY_COLORS, POPULATION_PLACES, type MapTopic } from '../../../contexts/published-content/adapters/mapLabData';
const point = (lon: number, lat: number) => ({ x: 40 + (lon + 83.7) * 80, y: 40 + (39.5 - lat) * 100 });
const line = (points: number[][]) => points.map(([lon, lat], i) => { const p = point(lon, lat); return `${i ? 'L' : 'M'}${p.x},${p.y}`; }).join(' ') + ' Z';
// Broad teaching bands, not surveyed physiographic boundaries.
const BANDS = [
  [[-84,40],[-81.6,40],[-81.6,37.3],[-82.0,37],[-82.5,36.6],[-84,36]],
  [[-84,36],[-82.5,36.6],[-82,37],[-81.6,37.3],[-81.6,40],[-78.2,40],[-78.5,39.2],[-79.2,38.2],[-80.3,37.1],[-81.1,36.5]],
  [[-81.1,36.5],[-80.3,37.1],[-79.2,38.2],[-78.5,39.2],[-78.2,40],[-77.6,40],[-77.85,39.2],[-78.7,38.2],[-79.6,37.1],[-80.9,36.3]],
  [[-80.9,36.3],[-79.6,37.1],[-78.7,38.2],[-77.85,39.2],[-77.6,40],[-76.9,40],[-77.1,38.8],[-77.4,37.6],[-77.5,36.3]],
  [[-77.5,36.3],[-77.4,37.6],[-77.1,38.8],[-76.9,40],[-74,40],[-74,36.3]],
];
const LABELS = [[-82.55,37.0],[-80.6,37.45],[-79.3,37.6],[-78.1,37.8],[-76.8,37.1]];
export function LearningMap({ topic, region = 0, climate = 'temperature', selectedPlace = 0, landmark }: { landmark?: { lon: number; lat: number; label: string }; topic: MapTopic; region?: number; climate?: 'temperature' | 'snowfall'; selectedPlace?: number }) {
  const id = useId().replaceAll(':', '');
  const [enlarged, setEnlarged] = useState(false);
  const title = topic === 'regions' ? 'Virginia’s five geographic regions' : topic === 'climate' ? `Virginia ${climate === 'temperature' ? 'temperature' : 'snowfall'} patterns` : topic === 'population' ? 'Virginia county & city population density · 2020' : 'Virginia and its neighbors · relative location';
  const climateColors = climate === 'temperature' ? ['#7eb8bf','#7eb8bf','#7eb8bf','#e9ce88','#db9876'] : ['#468a92','#468a92','#468a92','#a1c5c2','#e6ede1'];
  return <figure className="learning-map">
    <figcaption>{title}</figcaption>
    <button className="map-enlarge" type="button" aria-expanded={enlarged} aria-controls={`${id}-viewport`} onClick={() => setEnlarged(!enlarged)}>{enlarged ? "Fit map" : "Enlarge map"}</button>
    <div id={`${id}-viewport`} className={`learning-map-viewport ${enlarged ? "map-enlarged" : ""}`} tabIndex={enlarged ? 0 : undefined} role={enlarged ? "region" : undefined} aria-label={enlarged ? "Enlarged map; scroll to explore" : undefined}>
    <svg viewBox="0 0 760 400" role="img" aria-label={title}>
      <title>{title}</title><desc>{topic === 'regions' ? 'Numbered regions run west to east: 1 Appalachian Plateau, 2 Valley and Ridge, 3 Blue Ridge Mountains, 4 Piedmont, 5 Coastal Plain. Full descriptions and selection buttons follow the map.' : topic === 'climate' ? 'Simplified pattern: western highlands tend to be cooler and snowier; the eastern coast tends to be warmer with less snowfall. These are broad patterns, not measured boundaries.' : topic === 'population' ? 'Dots locate all 95 counties and 38 independent cities. Their colors show 2020 population density categories. The selected locality has a larger outlined marker. The searchable table lists every locality and its exact displayed value.' : 'Maryland north, West Virginia northwest, Kentucky west, Tennessee southwest, North Carolina south, Atlantic Ocean east. Virginia is on the east side of the United States, in North America.'}</desc>
      {landmark ? <desc>{landmark.label} is marked at an approximate location in southeastern Virginia.</desc> : null}
      <defs><clipPath id={`${id}-clip`}><path d={LEARNING_MAP_OUTLINE} fillRule="evenodd" /></clipPath></defs>
      <rect width="760" height="400" rx="16" fill="#eef4ed" />
      <path d={LEARNING_MAP_OUTLINE} fill="#e6ddbb" fillRule="evenodd" />
      {(topic === 'regions' || topic === 'climate') ? <g clipPath={`url(#${id}-clip)`}>{BANDS.map((band, i) => <path key={i} d={line(band)} fill={topic === 'regions' ? REGION_LESSONS[i].color : climateColors[i]} stroke={topic === 'regions' ? '#fff8e5' : 'none'} strokeWidth="2" opacity={topic === 'regions' && i !== region ? 0.65 : 1} />)}</g> : null}
      <path d={LEARNING_MAP_OUTLINE} fill="none" stroke="#455d56" strokeWidth="1.8" />
      {landmark ? <g><circle cx={point(landmark.lon, landmark.lat).x} cy={point(landmark.lon, landmark.lat).y} r="7" fill="#123e59" stroke="white" strokeWidth="3" /><path d={`M${point(landmark.lon, landmark.lat).x} ${point(landmark.lon, landmark.lat).y} l-28 -40 h-112`} fill="none" stroke="#123e59" strokeWidth="2" /><text x={point(landmark.lon, landmark.lat).x - 140} y={point(landmark.lon, landmark.lat).y - 46} fontSize="16" fontWeight="700" fill="#123e59">{landmark.label}</text></g> : null}
      <g fill="#28433e" fontSize="13" fontFamily="system-ui" fontWeight="650">
        <text x="540" y="28">Maryland</text><text x="215" y="105">West Virginia</text><text x="60" y="230">Kentucky</text><text x="85" y="370">Tennessee</text><text x="365" y="370">North Carolina</text>
        <text x="685" y="285">Atlantic</text><text x="685" y="303">Ocean</text>
      </g>
      <g transform="translate(80 70)" stroke="#27493f" fill="#27493f"><path d="M0 25V-20M-20 3H20" strokeWidth="2" /><path d="M0 -25L-5 -15H5Z" /><text x="0" y="-32" textAnchor="middle" stroke="none" fontSize="14">N</text><text x="31" y="8" stroke="none" fontSize="13">E</text><text x="-32" y="8" stroke="none" fontSize="13">W</text><text x="0" y="42" textAnchor="middle" stroke="none" fontSize="13">S</text></g>
      {topic === 'regions' ? LABELS.map(([lon, lat], i) => { const p = point(lon, lat); return <g key={i}><circle cx={p.x} cy={p.y} r="15" fill={i === region ? '#183c37' : '#fffaf0'} stroke="#183c37" strokeWidth="2" /><text x={p.x} y={p.y + 5} textAnchor="middle" fill={i === region ? '#fff' : '#183c37'} fontSize="16" fontWeight="700">{i + 1}</text></g>; }) : null}
      {topic === 'climate' ? <g fontSize="15" fontWeight="700" fill="#193b35" stroke="#fff" strokeWidth="4" paintOrder="stroke"><text x="265" y="240">{climate === 'temperature' ? 'Generally cooler' : 'Generally more snow'}</text><text x="520" y="310">{climate === 'temperature' ? 'Generally warmer' : 'Generally less snow'}</text></g> : null}
      {topic === 'population' ? <>
        {POPULATION_PLACES.map(place => { const p = point(place.at[0], place.at[1]); return <circle key={place.id} cx={p.x} cy={p.y} r="4.5" fill={DENSITY_COLORS[place.category]} stroke="#fff" strokeWidth="0.8" />; })}
        {(() => { const place = POPULATION_PLACES[selectedPlace]; const p = point(place.at[0], place.at[1]); return <g><circle cx={p.x} cy={p.y} r="10" fill={DENSITY_COLORS[place.category]} stroke="#102d2b" strokeWidth="3" /><circle cx={p.x} cy={p.y} r="13" fill="none" stroke="#fff" strokeWidth="2" /><text x="380" y="20" textAnchor="middle" fontSize="15" fontWeight="700" fill="#193b35" stroke="#eef4ed" strokeWidth="4" paintOrder="stroke">{place.name}</text></g>; })()}
      </> : null}
      {topic === 'tools' ? <><text x="390" y="230" fontSize="28" fill="#27493f" fontWeight="700">Virginia</text><text x="530" y="235" fontSize="23" fill="#a44633">★</text><text x="490" y="265" fontSize="14" fill="#27493f">Richmond</text></> : null}
    </svg>
    </div>
    {enlarged ? <p className="school-note">Scroll across the enlarged map to read its labels.</p> : null}
    <p className="school-note">{topic === 'regions' ? 'Simplified region bands; boundaries are approximate. Numbers match the region buttons below.' : topic === 'climate' ? 'Concept map adapted from the classroom patterns. Colors do not represent measured temperature or snowfall ranges; local conditions vary.' : topic === 'population' ? 'Each dot locates a county or independent city; color shows its average density, not its total population. All dots start the same size; the outlined dot is your selection. They do not show county borders or individual neighborhoods.' : 'Neighbor labels show direction, not state shapes or exact border positions. ★ marks the state capital.'} Land outline: U.S. Census Bureau, 2024.</p>
  </figure>;
}
