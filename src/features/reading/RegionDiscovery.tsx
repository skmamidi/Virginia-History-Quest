import { useState } from 'react';
import { LearningMap } from '../quest-map/components/LearningMap';
import { REGION_LESSONS } from '../../contexts/published-content/adapters/schoolMaterials';
import './reading.css';

export function RegionDiscovery({ motionPaused = false }: { motionPaused?: boolean }) {
  const [region, setRegion] = useState(4);
  const [wet, setWet] = useState(true);
  const [reveal, setReveal] = useState(false);
  const selected = REGION_LESSONS[region];
  return <section className="region-discovery-guide" aria-labelledby="region-discovery-title">
    <p className="briefing-kicker">A field trip in your imagination</p>
    <h3 id="region-discovery-title">From mountain ridges to a lake in a swamp</h3>
    <p>Virginia’s regions are neighborhoods of landforms. Start in the west with high land, travel across ridges and rolling hills, and finish on the low Coastal Plain beside the Atlantic. A place’s landforms help you locate it—even when its name is new.</p>
    <LearningMap topic="regions" region={region} landmark={{ lon: -76.46, lat: 36.60, label: 'Lake Drummond' }} />
    <div className="reading-tabs" role="group" aria-label="Explore the five regions">{REGION_LESSONS.map((r, i) => <button type="button" key={r.name} aria-pressed={region === i} onClick={() => setRegion(i)}>{i + 1}. {r.name}</button>)}</div>
    <article className="reading-field-note" aria-live="polite"><h4>{selected.name}</h4><p><strong>Find it:</strong> {selected.location}</p><p>{selected.landscape} {selected.notice}</p><p><strong>Picture a visit:</strong> {selected.place}. {selected.word}</p></article>
    <div className="reading-swamp-layout">
      <div><h4>Meet Lake Drummond and the Great Dismal Swamp</h4>
        <p>Lake Drummond is a shallow, natural freshwater lake inside the Great Dismal Swamp in southeastern Virginia, near Suffolk and Chesapeake. Both belong to the <strong>Coastal Plain, also called Tidewater</strong>. The swamp extends across the Virginia–North Carolina border.</p>
        <p>A lake is an open body of water surrounded by land. A swamp is a wetland with trees and shrubs. So a lake can sit inside a much larger swamp! “Coastal Plain” describes the surrounding region; it does not mean that every place there is an ocean beach.</p>
        <p>Connect the names: <strong>Lake Drummond → Great Dismal Swamp → Coastal Plain → southeastern Virginia</strong>. The lake is not in the Blue Ridge mountains or the long valleys farther west.</p>
      </div>
      <div className={`swamp-model ${wet ? 'swamp-wet' : 'swamp-dry'} ${motionPaused ? 'swamp-paused' : ''}`}>
        <h4>A wetland holds water</h4>
        <svg viewBox="0 0 420 240" role="img" aria-label={wet ? 'Water held above wet peat beneath a forest' : 'Lower water level after a drainage ditch carries water away'}>
          <rect width="420" height="240" rx="16" fill="#e6f0df" />
          <path d="M0 145 Q110 130 220 148 T420 140 V240 H0Z" fill="#6d553c" />
          <g fill="#2e6950" stroke="#254d39" strokeWidth="5">{[50,125,285,365].map(x => <g key={x}><path d={`M${x} 80 V155`} /><ellipse cx={x} cy="66" rx="33" ry="44" /></g>)}</g>
          <rect className="swamp-water" x="0" y={wet ? 150 : 194} width="420" height={wet ? 60 : 16} fill="#77b5bd" opacity=".88" />
          <path className="swamp-ripple" d="M150 161 Q170 153 190 161 T230 161 M158 179 Q180 171 202 179 T244 179" fill="none" stroke="#fff" strokeWidth="3" />
          <text x="16" y="230" fill="white" fontSize="17">Peat: partly decayed plant material</text>
        </svg>
        <div className="reading-tabs" role="group" aria-label="Change the wetland model"><button type="button" aria-pressed={wet} onClick={() => setWet(true)}>Hold water</button><button type="button" aria-pressed={!wet} onClick={() => setWet(false)}>Drain a ditch</button></div>
        <p aria-live="polite">{wet ? 'Wet peat stores water. Keeping water in the swamp helps protect wetland habitat.' : 'A ditch lets water escape. Drier peat can burn, and the habitat changes. Try holding the water again.'}</p><small>A simplified model of water storage—not a prediction of water levels.</small>
      </div>
    </div>
    <div className="reading-facts"><h4>Three discoveries to take with you</h4><ul>
      <li><strong>Soil can hold a history.</strong> Peat contains partly decayed plants from the past. Scientists study it to learn how the environment changed.</li>
      <li><strong>Wetlands are habitats.</strong> Forests and water support animals such as river otters and turtles.</li>
      <li><strong>This landscape has human stories, too.</strong> The Nansemond people have a long connection with the swamp. People escaping slavery also formed communities there, seeking freedom despite difficult conditions.</li>
    </ul></div>
    <button type="button" className="secondary-action" aria-expanded={reveal} onClick={() => setReveal(!reveal)}>Think it through: does “Coastal Plain” mean salt water?</button>
    {reveal ? <p className="reading-field-note">No. The Coastal Plain includes freshwater lakes, forested wetlands, rivers, and shores. Lake Drummond is freshwater; its region tells you about its location and landforms, not that its water is salty.</p> : null}
    <p className="reading-sources">Explore the evidence: <a href="https://www.fws.gov/refuge/great-dismal-swamp/about-us" target="_blank" rel="noreferrer">U.S. Fish & Wildlife Service: the refuge</a> · <a href="https://www.fws.gov/story/2024-01/water-lifeblood-swamp" target="_blank" rel="noreferrer">Water and peat</a> · <a href="https://www.usgs.gov/media/images/great-dismal-swamp-lake-drummond" target="_blank" rel="noreferrer">USGS: studying Lake Drummond</a></p>
  </section>;
}
