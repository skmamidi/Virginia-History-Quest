import { useState } from 'react';
import { CLIMATE_CAUSES, MOUNTAIN_STEPS } from '../../../contexts/published-content/adapters/climateLessons';

export function ClimateExplanation({ climate }: { climate: 'temperature' | 'snowfall' }) {
  const [step, setStep] = useState(0);
  return <>
    <h3>{climate === 'temperature' ? 'Why does temperature change from place to place?' : 'Why do some places get more snow?'}</h3>
    <div className="climate-causes">{CLIMATE_CAUSES[climate].map((cause, i) => <article key={cause.title}><span className="climate-cause-number" aria-hidden="true">{i + 1}</span><h4>{cause.title}</h4><p>{cause.why}</p><p className="climate-connection"><strong>In Virginia:</strong> {cause.connection}</p><a href={cause.source} target="_blank" rel="noreferrer">{cause.sourceLabel} ↗</a></article>)}</div>
    <section className="mountain-weather"><h3>Follow moist air over a mountain</h3><p>A simplified side view. In this example, the wind blows from left to right.</p>
      <svg viewBox="0 0 640 230" role="img" aria-label="Moist air rises and cools on the left slope, may form clouds near the peak, then sinks and warms on the right slope.">
        <rect width="640" height="230" rx="12" fill="#e9f3f4" /><path d="M0 215L125 195L290 70L350 85L505 195L640 215Z" fill="#b6c4a0" /><path d="M245 105L290 70L350 85L380 109L326 97L295 103L280 93Z" fill="#f9faf4" />
        <path d="M55 155Q155 145 218 85" stroke={step === 0 ? '#164b5e' : '#8aa8ad'} strokeWidth="7" fill="none" /><path d="M203 84L226 78L219 101" fill="#164b5e" />
        <path d="M409 85Q480 130 571 153" stroke={step === 2 ? '#9b552b' : '#bea389'} strokeWidth="7" fill="none" /><path d="M559 140L582 156L558 163" fill="#9b552b" />
        <g fill={step === 1 ? '#fff' : '#d9e6e7'} stroke="#608a97" strokeWidth="2"><ellipse cx="287" cy="46" rx="58" ry="22" /><circle cx="262" cy="36" r="20" /><circle cx="290" cy="28" r="27" /><circle cx="319" cy="39" r="22" /></g>
        <g fill="#27493f" fontFamily="system-ui" fontWeight="700" fontSize="16"><text x="40" y="188">1 · Rise & cool</text><text x="336" y="36">2 · Clouds may form</text><text x="415" y="188">3 · Sink & warm</text></g>
      </svg>
      <div className="mountain-steps" role="group" aria-label="Follow mountain air">{MOUNTAIN_STEPS.map((s, i) => <button key={s.title} type="button" aria-pressed={step === i} onClick={() => setStep(i)}>{s.title}</button>)}</div>
      <p className="map-feedback" role="status">{MOUNTAIN_STEPS[step].text}</p>
      <p className="school-note">The wind can also blow the other way. A real storm’s wind, moisture, and temperatures determine which slope gets more precipitation.</p>
    </section>
    <div className="region-discovery"><h3>Use a pattern, then check the details</h3><p>Climate summarizes many years of weather; a climate normal usually covers 30 years. These map colors show broad patterns, not a forecast or measured temperature bands. High and low places within one region can have different climates.</p><p><strong>Read your classroom map:</strong> temperature uses degrees Fahrenheit (°F); snowfall uses inches of snow. Inches of snow are not the same as inches of liquid rain. Check the title, legend, and averaging years before comparing numbers.</p><p><strong>Explain a visit:</strong> “I would pack a warmer layer for a high mountain because…” Finish the sentence using one of the causes above, then check the weather forecast with an adult.</p></div>
  </>;
}
