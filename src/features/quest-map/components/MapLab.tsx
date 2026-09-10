import { useState } from 'react';
import { Modal } from './Modal';
import { LearningMap } from './LearningMap';
import { MAP_QUESTIONS, REGION_LESSONS } from '../../../contexts/published-content/adapters/schoolMaterials';
import { DENSITY_COLORS, DENSITY_RANGES, MAP_TOPICS, POPULATION_PLACES, type MapTopic } from '../../../contexts/published-content/adapters/mapLabData';

function MapPractice({ topic }: { topic: MapTopic }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);
  const q = MAP_QUESTIONS[topic][step];
  const correct = checked && answer === q.answer;
  return <section className="map-practice"><p className="briefing-kicker">Try it yourself · {step + 1} of 3</p><h3>{finished ? 'Map detective discoveries complete!' : q.question}</h3>
    {finished ? <><p>You practiced reading evidence from this map. Choose another map above to keep exploring.</p><button type="button" onClick={() => { setStep(0); setAnswer(null); setChecked(false); setFinished(false); }}>Practice again</button></> : <>
      <div className="map-answers" role="group" aria-label="Map question answers">{q.choices.map((choice, i) => <button key={choice} type="button" aria-pressed={answer === i} disabled={correct} onClick={() => { setAnswer(i); setChecked(false); }}>{choice}</button>)}</div>
      <button className="primary-action" type="button" disabled={answer === null || correct} onClick={() => setChecked(true)}>Check my answer</button>
      {checked ? <p role="status" className={correct ? 'map-feedback' : 'school-warning'}>{correct ? `You found it! ${q.why}` : 'Not quite. Check the map’s title, legend, or explanation, then try another answer.'}</p> : null}
      {correct ? <button className="secondary-action" type="button" onClick={() => { if (step === 2) setFinished(true); else { setStep(step + 1); setAnswer(null); setChecked(false); } }}>{step === 2 ? 'Finish this practice' : 'Next map clue'}</button> : null}
    </>}
  </section>;
}
export function MapLab({ onClose, onScrapbook }: { onClose: () => void; onScrapbook: () => void }) {
  const [topic, setTopic] = useState<MapTopic>('regions');
  const [region, setRegion] = useState(3);
  const [compare, setCompare] = useState(4);
  const [climate, setClimate] = useState<'temperature' | 'snowfall'>('temperature');
  const [place, setPlace] = useState(0);
  const current = MAP_TOPICS.find(t => t.id === topic)!;
  const selected = REGION_LESSONS[region];
  return <Modal label="Virginia map lab" titleId="map-lab-title" className="school-workspace map-lab" onClose={onClose}>
    <p className="briefing-kicker">Look closely · Ask questions · Find evidence</p><h2 id="map-lab-title">Virginia map lab</h2>
    <nav className="map-topic-nav" aria-label="Map lab topics">{MAP_TOPICS.map(t => <button type="button" key={t.id} aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>{t.label}</button>)}</nav>
    <h3 className="map-topic-heading">{current.title}</h3><p className="modal-lead">{current.intro}</p>
    {topic === 'climate' ? <div className="school-actions" role="group" aria-label="Climate map type"><button type="button" aria-pressed={climate === 'temperature'} onClick={() => setClimate('temperature')}>Temperature patterns</button><button type="button" aria-pressed={climate === 'snowfall'} onClick={() => setClimate('snowfall')}>Snowfall patterns</button></div> : null}
    <LearningMap topic={topic} region={region} climate={climate} selectedPlace={place} />
    {topic === 'regions' ? <>
      <p className="field-label">Map key · choose a region, west to east</p>
      <div className="region-selector">{REGION_LESSONS.map((r, i) => <button type="button" key={r.name} aria-label={`Explore ${r.name}`} aria-pressed={region === i} onClick={() => setRegion(i)}><span style={{ background: r.color }}>{i + 1}</span>{r.name}</button>)}</div>
      <article className="region-discovery" style={{ borderColor: selected.color }}><p className="briefing-kicker">Region {region + 1} of 5</p><h3>{selected.name}</h3><p><strong>Where:</strong> {selected.location}</p><p><strong>What the land is like:</strong> {selected.landscape}</p><p>{selected.notice}</p><p className="school-note">{selected.word}</p><p><strong>A place to connect:</strong> {selected.place}</p></article>
      <details className="school-details"><summary>Compare two regions</summary><label>Compare {selected.name} with<select value={compare} onChange={e => setCompare(Number(e.target.value))}>{REGION_LESSONS.map((r, i) => <option key={r.name} value={i}>{r.name}</option>)}</select></label><div className="region-comparison"><div><h4>{selected.name}</h4><p>{selected.landscape}</p></div><div><h4>{REGION_LESSONS[compare].name}</h4><p>{REGION_LESSONS[compare].landscape}</p></div></div><p>Say or sketch one similarity and one difference. Use landforms and relative location as evidence.</p></details>
      <details className="school-details"><summary>Make it with your hands: a relief map</summary><p>Build a raised map using modeling dough and cardboard. With an adult, outline Virginia, shape flat coastal land, rolling Piedmont hills, mountain ridges and valleys, and the southwestern plateau. Let it dry, then use colors and a key to identify the landforms.</p><p>A relief map shows elevation. Label north and the Atlantic Ocean. Explain why a raised plateau can still have valleys carved into it.</p><button type="button" onClick={onScrapbook}>Connect a region to my scrapbook</button></details>
    </> : topic === 'climate' ? <>
      <div className="climate-legend" aria-label="Climate pattern legend">{(climate === 'temperature' ? [['#7eb8bf','Cooler western highlands'],['#e9ce88','Inland transition'],['#db9876','Warmer coastal areas']] : [['#468a92','More snow in highlands'],['#a1c5c2','Inland transition'],['#e6ede1','Less snow near coast']]).map(([color, label]) => <span key={label}><i style={{ background: color }} />{label}</span>)}</div>
      <div className="region-discovery"><h3>{climate === 'temperature' ? 'Read averages, not today’s forecast' : 'Snowfall is one kind of precipitation'}</h3><p>{climate === 'temperature' ? 'The western and northern parts of Virginia tend to be cooler than the eastern coast. Elevation and nearby water help shape these patterns. An annual average combines observations across the year; it does not mean every day has that temperature.' : 'The classroom maps show more snow in many mountain areas and less near the coast. Rain and snow are both precipitation, but snowfall inches are not the same as inches of liquid rain. A warmer coastal area can still receive snow.'}</p><p><strong>Read your classroom map:</strong> temperature uses degrees Fahrenheit (°F); annual snowfall uses inches. Find the matching color range before making a comparison. The supplied climate maps do not show an averaging period, so treat their numbers as classroom reference ranges, not current climate normals.</p><p><strong>Connect to a visit:</strong> What clothing might be useful for a mountain visit? Explain your idea using climate, then check a weather forecast with an adult before the trip.</p></div>
      <p className="school-note"><a href="https://statesummaries.ncics.org/chapter/va/" target="_blank" rel="noreferrer">NOAA Virginia State Climate Summary (2022) ↗</a> explains regional variation. The broad diagram above does not reproduce a NOAA data layer.</p>
    </> : topic === 'population' ? <>
      <p className="field-label">Key · people per square mile (2020)</p><div className="density-legend">{DENSITY_RANGES.map((range, i) => <span key={range}><i style={{ background: DENSITY_COLORS[i] }} />{range}</span>)}</div>
      <div className="school-table-wrap"><table><caption>Select a locality to highlight its numbered marker</caption><thead><tr><th scope="col">Place</th><th scope="col">People / sq. mile</th><th scope="col">Source</th></tr></thead><tbody>{POPULATION_PLACES.map((p, i) => <tr key={p.name}><th scope="row"><button type="button" aria-pressed={place === i} onClick={() => setPlace(i)}>{i + 1}. {p.name}</button></th><td>{p.density.toLocaleString('en-US', { minimumFractionDigits: 1 })}</td><td><a href={p.source} target="_blank" rel="noreferrer" aria-label={`Census source for ${p.name}`}>Census ↗</a></td></tr>)}</tbody></table></div>
      <p className="school-note">2020 Census / Census QuickFacts. Highland’s density is calculated from 2,232 residents and Census land area, rounded to one decimal. Whole-number legend ranges follow your handout; localities include counties and independent cities.</p>
      <div className="region-discovery"><h3>Find a pattern. Then ask why.</h3><p>Arlington’s average density is much higher than Highland’s. A darker symbol means a higher density according to this legend. It does not mean a place is better, larger, or warmer.</p><p>Rivers, ports, roads, jobs, and history can help explain settlement patterns. Comparing climate and population may suggest questions, but those maps alone do not prove what caused a place to grow.</p><p><strong>Try a model:</strong> Imagine two equal squares of land. Draw 5 dots in one and 20 in the other. If each dot is a person, which square has the greater density?</p></div>
    </> : <>
      <div className="map-tools-grid"><article><h3>Title & legend</h3><p>The title says what a map shows. The key explains colors and symbols. Here, ★ marks Richmond, Virginia’s state capital. A political map shows boundaries; a physical map shows landforms.</p></article><article><h3>Compass rose</h3><p>North, east, south, west are cardinal directions. Northeast, southeast, southwest, and northwest lie between them. Virginia is south of Maryland and east of Kentucky.</p></article><article><h3>Relative location</h3><p>Describe one place compared with another. Virginia is in the eastern United States, on the continent of North America. It borders Maryland, West Virginia, Kentucky, Tennessee, and North Carolina.</p></article><article><h3>Practice a scale</h3><div className="practice-scale" aria-label="Practice scale: zero, fifty, one hundred miles"><span>0</span><span>50</span><span>100 miles</span></div><p>This separate practice bar represents 50 miles per segment. Two segments represent about 100 miles. It is an exercise, not a scale for the diagram above.</p></article></div>
    </>}
    <MapPractice key={topic} topic={topic} />
    <details className="school-details"><summary>About these learning materials</summary><p>Original explanations and questions developed from the supplied fourth-grade scrapbook handout and Virginia Studies pages. The scrapbook deadline and checklist follow that assignment. Map practice is separate from mission badges.</p><p>Geography corrections: Piedmont lies east of the Blue Ridge Mountains; Virginia’s highest peak is Mount Rogers in the Blue Ridge, not in the Appalachian Plateau.</p><a href="https://virginiahistory.org/learn/what-are-five-physical-regions-virginias-geography" target="_blank" rel="noreferrer">Virginia Museum of History & Culture: five physical regions ↗</a></details>
  </Modal>;
}
