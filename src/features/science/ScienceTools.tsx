import { useEffect, useState } from 'react';
import { ArrowRight, Droplets, Leaf, Mountain, Volume2, Waves } from 'lucide-react';
import type { ScienceSource } from '../../contexts/published-content/domain/science';

export function ScienceSources({ sources }: { sources: readonly ScienceSource[] }) {
  return <ul className="science-sources">{sources.map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>;
}

export function ReadScienceAloud({ text }: { text: string }) {
  const [reading, setReading] = useState(false);
  const available = typeof window.speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';
  useEffect(() => {
    setReading(false);
    return () => { window.speechSynthesis?.cancel(); };
  }, [text]);
  if (!available) return null;
  return <button type="button" className="science-text-button" onClick={() => {
    window.speechSynthesis.cancel();
    if (reading) { setReading(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setReading(false);
    utterance.onerror = () => setReading(false);
    setReading(true);
    window.speechSynthesis.speak(utterance);
  }}><Volume2 aria-hidden="true" />{reading ? 'Stop reading' : 'Read aloud'}</button>;
}

const routes = [
  { title: 'James River', destination: 'Chesapeake Bay', path: ['Hillside runoff', 'A tributary', 'James River', 'Chesapeake Bay'], note: 'Land draining into the James is connected to the Chesapeake Bay. A small stream can carry water and sediment toward a much larger estuary.' },
  { title: 'Roanoke River', destination: 'North Carolina sounds', path: ['Hillside runoff', 'Roanoke River', 'Albemarle Sound', 'Atlantic Ocean'], note: 'The Roanoke system flows toward the North Carolina sounds. Virginia’s state boundary does not stop water or the materials it carries.' },
  { title: 'New River', destination: 'Mississippi River system', path: ['New River', 'Kanawha River', 'Ohio River', 'Mississippi River'], note: 'The New River flows north into West Virginia and joins a system that reaches the Mississippi. Water flows downhill, which is not always south or east.' },
];
export function WatershedExplorer() {
  const [route, setRoute] = useState(0);
  const [protectedBank, setProtectedBank] = useState(true);
  const selected = routes[route];
  return <section className="science-watershed" aria-labelledby="watershed-model-title">
    <div className="science-model-heading"><p className="science-eyebrow">Explore a connection</p><h3 id="watershed-model-title">Where will the water go?</h3></div>
    <div className="science-river-scene" aria-hidden="true">
      <svg viewBox="0 0 600 170" preserveAspectRatio="xMidYMid slice"><path d="M0 110 75 25 160 112 242 52 348 139 470 106 600 142V170H0Z" fill="#b8c4a1"/><path d="M0 149 103 106 224 144 362 95 475 144 600 108V170H0Z" fill="#6d906a"/><path d="M173 107C170 134 301 121 328 144S440 145 509 162H600V170H360C345 149 231 158 219 141S168 133 163 112Z" fill={protectedBank ? '#91c8d2' : '#b29671'}/><circle cx="500" cy="32" r="17" fill="#e9be69"/></svg>
      <Mountain className="scene-mountain" /><Leaf className="scene-leaf" /><Waves className="scene-water" />
    </div>
    <div className="science-segmented" role="group" aria-label="Choose a river system">{routes.map((r, i) => <button type="button" key={r.title} aria-pressed={route === i} onClick={() => setRoute(i)}>{r.title}</button>)}</div>
    <div className="science-model-result" aria-live="polite"><p><strong>{selected.destination}</strong></p><ol className="science-flow" aria-label="Water pathway">{selected.path.map((step, i) => <li key={step}><span>{step}</span>{i < selected.path.length - 1 ? <ArrowRight aria-hidden="true" /> : null}</li>)}</ol><p>{selected.note}</p></div>
    <button type="button" className="science-bank-toggle" aria-pressed={protectedBank} onClick={() => setProtectedBank(!protectedBank)}><Leaf aria-hidden="true" />Streamside plants: {protectedBank ? 'present' : 'removed'}<span>Tap to compare</span></button>
    <p className="science-model-explanation" aria-live="polite"><Droplets aria-hidden="true" />{protectedBank ? 'Roots hold soil and vegetation slows runoff, helping less sediment reach the water.' : 'Bare ground is more exposed to rain. More loose soil may wash into the stream as sediment.'}</p>
    <p className="science-small">Simplified process model, not a geographic map or a measured prediction.</p>
  </section>;
}
