import { useState } from 'react';
import { DENSITY_COLORS, DENSITY_RANGES, POPULATION_PLACES, POPULATION_SOURCE } from '../../../contexts/published-content/adapters/mapLabData';

export function PopulationExplorer({ selectedPlace, onSelect }: { selectedPlace: number; onSelect: (index: number) => void }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const shown = POPULATION_PLACES.map((place, index) => ({ ...place, index })).filter(place =>
    (kind === 'all' || kind === place.kind) && place.name.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = POPULATION_PLACES[selectedPlace];
  return <>
    <p className="field-label">Key · people per square mile (2020)</p>
    <div className="density-legend">{DENSITY_RANGES.map((range, i) => <span key={range}><i style={{ background: DENSITY_COLORS[i] }} />{range}</span>)}</div>
    <div className="population-selection" role="status"><strong>Highlighted on the map: {selected.name}</strong><span>{selected.population.toLocaleString('en-US')} residents · {selected.density.toLocaleString('en-US', { minimumFractionDigits: 1 })} people per square mile</span></div>
    <p>Explore all 95 counties and 38 independent cities. Virginia’s independent cities are separate from counties—even when they share a name. Select a row to highlight that locality on the map.</p>
    <div className="population-filters">
      <label>Find a county or city<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try Loudoun, Fairfax, or Richmond" /></label>
      <label>Show<select value={kind} onChange={e => setKind(e.target.value)}><option value="all">All counties & cities</option><option value="county">Counties only</option><option value="city">Independent cities only</option></select></label>
    </div>
    <p className="school-note" role="status">{shown.length} of 133 localities shown · alphabetical order</p>
    <div className="school-table-wrap population-table" role="region" aria-label="Virginia population table" tabIndex={0}>
      <table><caption>2020 population and density for Virginia counties and independent cities</caption><thead><tr><th scope="col">County / city</th><th scope="col">Residents</th><th scope="col">People / sq. mile</th></tr></thead>
        <tbody>{shown.map(p => <tr key={p.id}><th scope="row"><button type="button" aria-pressed={selectedPlace === p.index} onClick={() => onSelect(p.index)}>{p.name}</button></th><td>{p.population.toLocaleString('en-US')}</td><td>{p.density.toLocaleString('en-US', { minimumFractionDigits: 1 })}</td></tr>)}</tbody>
      </table>
      {shown.length === 0 ? <p>No matching places. Try a different name or choose all counties & cities.</p> : null}
    </div>
    <p className="school-note"><a href={POPULATION_SOURCE} target="_blank" rel="noreferrer">Source: U.S. Census Bureau, 2020 county and independent-city records ↗</a>. Density = residents ÷ land area in square miles, rounded to one decimal. Water area is excluded. The colors describe each locality’s average, not every neighborhood.</p>
    <div className="region-discovery"><h3>Find a pattern. Then ask why.</h3><p>Compare Arlington County with Highland County. A darker symbol means a higher density according to this legend. A place can have more residents but a lower density if its land area is much larger.</p><p>Rivers, ports, roads, jobs, and history help explain settlement patterns. Climate and population maps can suggest questions, but those maps alone do not prove what caused a place to grow.</p><p><strong>Try a model:</strong> Draw two equal squares of land. Put 5 people in one and 20 in the other. Which square has the greater density?</p></div>
  </>;
}
