import { useEffect, useId, useRef, useState } from 'react';
import { Compass, MapPin, Plus, Minus, Shuffle, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, BookOpen, ExternalLink } from 'lucide-react';
import { EXPLORE_PLACES, PLACE_KINDS, findPlaces, mapPoint, type ExplorePlace } from '../../../contexts/published-content/adapters/explorePlaces';
import { REGION_LESSONS } from '../../../contexts/published-content/adapters/schoolMaterials';
import regionPaths from '../../../contexts/published-content/adapters/virginiaRegionPaths.json';
import { LEARNING_MAP_OUTLINE } from '../../../contexts/published-content/adapters/learningMapOutline';

const HOME = { x: 380, y: 205, zoom: 1 };
type Camera = typeof HOME;
export function ScrapbookExplorer({ actionFor, onChoose }: { actionFor: (place: ExplorePlace) => { label: string; disabled: boolean }; onChoose: (place: ExplorePlace) => void }) {
  const [region, setRegion] = useState<number | null>(null);
  const [kind, setKind] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ExplorePlace | null>(null);
  const [discovered, setDiscovered] = useState<number[]>([]);
  const [nearby, setNearby] = useState<ExplorePlace[]>([]);
  const [camera, setCamera] = useState(HOME);
  const [size, setSize] = useState({ width: 760, height: 400 });
  const stage = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; camera: Camera } | null>(null);
  const clip = `${useId().replaceAll(':', '')}-explore-land`;
  const places = findPlaces(region, kind, search);
  const viewWidth = 760 / camera.zoom;
  const viewHeight = viewWidth * size.height / size.width;
  useEffect(() => {
    if (!stage.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width || 760, height: entry.contentRect.height || 400 }));
    observer.observe(stage.current); return () => observer.disconnect();
  }, []);
  function select(place: ExplorePlace) {
    setSelected(place); setNearby([]);
    setDiscovered(old => old.includes(place.region) ? old : [...old, place.region]);
    requestAnimationFrame(() => detail.current?.focus());
  }
  function changeRegion(value: number | null) {
    setRegion(value); setSelected(null); setNearby([]);
    if (value === null) { setCamera(HOME); return; }
    const points = EXPLORE_PLACES.filter(p => p.region === value).map(p => mapPoint(p.at));
    const xs = points.map(p => p.x), ys = points.map(p => p.y);
    const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
    setCamera({ x: (left + right) / 2, y: (top + bottom) / 2, zoom: Math.min(4, 650 / Math.max(right - left + 95, (bottom - top + 95) * size.width / size.height)) });
  }
  function zoom(factor: number) { setCamera(c => ({ ...c, zoom: Math.max(1, Math.min(12, c.zoom * factor)) })); }
  function pan(x: number, y: number) { setCamera(c => ({ ...c, x: Math.max(0, Math.min(760, c.x + x * viewWidth)), y: Math.max(0, Math.min(400, c.y + y * viewHeight)) })); }
  // Cluster in screen pixels so pins stay large enough to tap at every zoom level.
  const clusters: { x: number; y: number; members: ExplorePlace[] }[] = [];
  for (const place of places) {
    const point = mapPoint(place.at);
    const x = ((point.x - camera.x) / viewWidth + .5) * size.width;
    const y = ((point.y - camera.y) / viewHeight + .5) * size.height;
    if (x < 24 || x > size.width - 24 || y < 24 || y > size.height - 24) continue;
    const existing = clusters.find(c => Math.hypot(c.x - x, c.y - y) < 50);
    if (existing) existing.members.push(place); else clusters.push({ x, y, members: [place] });
  }
  const action = selected ? actionFor(selected) : null;
  return <section className="scrapbook-explorer" aria-label="Virginia place explorer">
    <div className="explorer-intro"><div><p className="briefing-kicker">A little curiosity. A whole Commonwealth.</p><h3>Where shall we explore?</h3><p>Follow a region, open a pin, and find a story worth remembering.</p></div><Compass className="explorer-compass" aria-hidden="true" /></div>
    <div className="explorer-region-buttons" role="group" aria-label="Choose a geographic region">
      <button type="button" aria-pressed={region === null} onClick={() => changeRegion(null)}>All Virginia <small>{EXPLORE_PLACES.length} places</small></button>
      {REGION_LESSONS.map((r, i) => <button type="button" key={r.name} aria-label={`Browse ${r.name}`} aria-pressed={region === i} onClick={() => changeRegion(i)}><span className="explorer-region-dot" style={{ background: r.color }}>{i + 1}</span><span>{r.name}<small>{EXPLORE_PLACES.filter(p => p.region === i).length} places</small></span></button>)}
    </div>
    {region !== null ? <p className="explorer-region-note"><strong>{REGION_LESSONS[region].name}:</strong> {REGION_LESSONS[region].landscape}</p> : null}
    <div className="explorer-filters"><label>Find a place<input type="search" value={search} placeholder="Try Leesburg, music, or a river…" onChange={e => { setSearch(e.target.value); setCamera(HOME); setSelected(null); setNearby([]); }} /></label><label>My interests<select value={kind} onChange={e => { setKind(e.target.value); setCamera(HOME); setSelected(null); setNearby([]); }}><option value="">Everything</option>{PLACE_KINDS.map(k => <option key={k}>{k}</option>)}</select></label><button type="button" className="secondary-action" disabled={!places.length} onClick={() => { const pool = places.filter(p => p.id !== selected?.id); const p = pool.length ? pool[Math.floor(Math.random() * pool.length)] : places[0]; select(p); setCamera({ ...mapPoint(p.at), zoom: 4 }); }}><Shuffle aria-hidden="true" />Surprise me!</button></div>
    <div className="explorer-map-layout">
      <div className="explorer-map-card">
        <div className="explorer-map-toolbar"><strong>Virginia discovery map</strong><div><button type="button" aria-label="Zoom out" disabled={camera.zoom <= 1} onClick={() => zoom(1 / 1.6)}><Minus /></button><span aria-live="polite">{camera.zoom.toFixed(1)}×</span><button type="button" aria-label="Zoom in" disabled={camera.zoom >= 12} onClick={() => zoom(1.6)}><Plus /></button><button type="button" onClick={() => { setCamera(HOME); setNearby([]); }}>Fit Virginia</button></div></div>
        <div className="explorer-map-stage" ref={stage} role="group" aria-label="Interactive Virginia map" onPointerDown={e => { if ((e.target as HTMLElement).closest('button') || e.button !== 0) return; drag.current = { x: e.clientX, y: e.clientY, camera }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { const d = drag.current; if (!d) return; const dx = (e.clientX - d.x) / size.width * viewWidth, dy = (e.clientY - d.y) / size.height * viewHeight; setCamera({ ...d.camera, x: Math.max(0, Math.min(760, d.camera.x - dx)), y: Math.max(0, Math.min(400, d.camera.y - dy)) }); }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
          <svg viewBox={`${camera.x - viewWidth / 2} ${camera.y - viewHeight / 2} ${viewWidth} ${viewHeight}`} aria-hidden="true">
            <defs><clipPath id={clip}><path d={LEARNING_MAP_OUTLINE} fillRule="evenodd" /></clipPath></defs>
            <path d={LEARNING_MAP_OUTLINE} fill="#e8dec5" fillRule="evenodd" />
            <g clipPath={`url(#${clip})`}>{regionPaths.map((path, i) => <path key={i} d={path} fill={REGION_LESSONS[i].color} opacity={region === null || region === i ? 1 : .26} stroke="#fffcf1" strokeWidth={1 / camera.zoom} />)}</g>
            <path d={LEARNING_MAP_OUTLINE} fill="none" stroke="#526855" strokeWidth={1.5 / camera.zoom} />
          </svg>
          <span className="explorer-north" aria-hidden="true">N ↑</span>
          {clusters.map(c => { const isGroup = c.members.length > 1; const p = c.members[0]; const isSelected = c.members.some(p => p.id === selected?.id); return <button type="button" className={`explorer-pin ${isGroup ? 'is-cluster' : ''} ${isSelected ? 'is-selected' : ''}`} key={p.id} style={{ left: c.x, top: c.y }} aria-label={isGroup ? `Explore ${c.members.length} nearby places near ${p.town}` : `Learn about ${p.name}`} title={isGroup ? c.members.map(p => p.name).join(' · ') : p.name} aria-pressed={isSelected} onClick={() => { if (!isGroup) { select(p); return; } const points = c.members.map(p => mapPoint(p.at)); setCamera({ x: points.reduce((sum, p) => sum + p.x, 0) / points.length, y: points.reduce((sum, p) => sum + p.y, 0) / points.length, zoom: Math.min(12, camera.zoom * 2) }); setNearby(c.members); }}>
            {isGroup ? <>{c.members.length}<span className="sr-only"> places</span></> : <MapPin aria-hidden="true" size={19} />}
          </button>; })}
        </div>
        <div className="explorer-map-bottom"><span>Tap a pin. Numbered circles open nearby places.</span><div className="explorer-pan" role="group" aria-label="Move around the map">{[[ArrowLeft, -0.2, 0, 'west'], [ArrowUp, 0, -0.2, 'north'], [ArrowDown, 0, 0.2, 'south'], [ArrowRight, 0.2, 0, 'east']].map(([Icon, x, y, label]) => { const DirectionIcon = Icon as typeof ArrowLeft; return <button type="button" key={String(label)} aria-label={`Move map ${label}`} onClick={() => pan(Number(x), Number(y))}><DirectionIcon aria-hidden="true" size={16} /></button>; })}</div></div>
        {nearby.length ? <div className="explorer-nearby"><strong>Close neighbors — pick a story</strong>{nearby.map(p => <button type="button" key={p.id} onClick={() => select(p)}>{p.name} →</button>)}</div> : null}
        <p className="school-note explorer-map-credit">Region colors match the buttons above. Drag or use the arrows to move. Overview boundaries: <a href="https://cmap22.vims.edu/arcgis/rest/services/WetCAT/PhysiographicRegions/MapServer/0" target="_blank" rel="noreferrer">USGS via VIMS ↗</a>; land: Census. Pins are approximate; use the official site for directions. Places near region edges may share features of both.</p>
      </div>
      <article className="explorer-story" ref={detail} tabIndex={-1} aria-label={selected ? `About ${selected.name}` : 'Choose a place to discover'}>
        {selected ? <><p className="briefing-kicker">{selected.kind} · {selected.town}</p><h4>{selected.name}</h4><p className="explorer-story-region"><span style={{ background: REGION_LESSONS[selected.region].color }} />{REGION_LESSONS[selected.region].name}</p><p>{selected.story}</p>{selected.regionNote ? <p className="school-note">{selected.regionNote}</p> : null}<details className="explorer-quest" key={selected.id}><summary>🔎 Your detective mission</summary><p>{selected.quest}</p><small>Keep one detail for your own scrapbook story.</small></details>{selected.kind === 'Nature' ? <p className="school-note">For your history project, connect this natural place to a human story. Ask a ranger or use a historical exhibit.</p> : null}<a className="explorer-official" href={selected.url} target="_blank" rel="noreferrer">Learn more & plan a visit <ExternalLink size={15} aria-hidden="true" /></a><small className="school-note">Official visitor information. Check hours, access, and trip plans with an adult.</small><button type="button" className="primary-action" disabled={action?.disabled} onClick={() => onChoose(selected)}><BookOpen aria-hidden="true" />{action?.label}</button><p className="school-note">Planning a place does not mark it as visited.</p></> : <div className="explorer-story-empty"><Compass size={52} aria-hidden="true" /><h4>Every pin holds a story.</h4><p>Open a place on the map or in the list below. Meet inventors, follow rivers, uncover history, and choose your next discovery.</p><span>Five regions. So many ways to wonder.</span></div>}
      </article>
    </div>
    <div className="explorer-passport"><strong>Regions discovered here: {discovered.length}/5</strong><span>{REGION_LESSONS.map((r, i) => <span key={r.name} title={r.name} className={discovered.includes(i) ? 'is-discovered' : ''} aria-label={`${r.name}: ${discovered.includes(i) ? 'story opened' : 'waiting to explore'}`}>{discovered.includes(i) ? '✓' : i + 1}</span>)}</span><small>{discovered.length === 5 ? 'All five! You have traveled across Virginia through its stories.' : 'Open a story from each region. These are reading discoveries, not real-world visits.'}</small></div>
    <section className="explorer-directory" aria-label="Places by region"><div className="explorer-directory-title"><h4>Your places to explore</h4><p role="status">{places.length} of {EXPLORE_PLACES.length} places match</p></div>
      {!places.length ? <div className="school-details"><p>No places match yet. Try a different name or interest.</p><button type="button" onClick={() => { setSearch(''); setKind(''); changeRegion(null); }}>Show all places</button></div> : null}
      {REGION_LESSONS.map((r, i) => { const matches = places.filter(p => p.region === i).sort((a, b) => a.name.localeCompare(b.name)); return matches.length ? <section className="explorer-directory-region" key={r.name}><h5><span className="explorer-region-dot" style={{ background: r.color }}>{i + 1}</span>{r.name} <small>{matches.length} places</small></h5><div className="explorer-place-list">{matches.map(p => <button type="button" key={p.id} aria-pressed={selected?.id === p.id} onClick={() => { select(p); setCamera({ ...mapPoint(p.at), zoom: 4 }); }}><MapPin aria-hidden="true" size={18} /><span><strong>{p.name}</strong><small>{p.town} · {p.kind}</small></span><span aria-hidden="true">→</span></button>)}</div></section> : null; })}
    </section>
    <div className="explorer-more"><strong>Keep exploring beyond these 70 places</strong><p>This collection covers prominent historical, cultural, and natural places across all five geographic regions. It is not every historic property in Virginia.</p><a href="https://www.dhr.virginia.gov/historic-registers/" target="_blank" rel="noreferrer">Search Virginia's full historic register ↗</a><a href="https://www.virginia.org/things-to-do/attractions/museums-and-exhibits/history/" target="_blank" rel="noreferrer">Find more museums and historic places ↗</a><p className="school-note">A register listing does not mean a property is open to visitors. You can type another site's name on any scrapbook page.</p></div>
  </section>;
}
