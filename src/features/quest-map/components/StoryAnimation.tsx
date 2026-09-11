import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { MissionId } from '../../../contexts/published-content/domain/mission';
import { STORY_ANIMATIONS } from '../../../contexts/published-content/adapters/storyAnimations';
import { StoryAnimationArt } from './StoryAnimationArt';
import './StoryAnimation.css';

const DURATION = 18;
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query?.matches ?? false);
    query?.addEventListener('change', update);
    return () => query?.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** A finite, pausable illustration. It never marks a story stop or question complete.
 * A key in MissionStory resets the player when the learner selects another stop.
 * Only this small subtree updates while playing; the mission page does not render per frame.
 */
export function StoryAnimation({ missionId, scene, motionPaused }: { missionId: MissionId; scene: number; motionPaused: boolean }) {
  const lesson = STORY_ANIMATIONS[missionId][scene];
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const reduced = useReducedMotion();
  const blocked = reduced || motionPaused;
  const running = playing && !blocked && visible && pageVisible && time < DURATION;
  const step = Math.min(2, Math.floor(time / 6));

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !root.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now(), elapsed = Math.min(.25, (now - last) / 1000);
      last = now;
      setTime(value => Math.min(DURATION, Math.round((value + elapsed) * 1000) / 1000));
    }, 40);
    return () => window.clearInterval(timer);
  }, [running]);

  function jump(value: number) { setPlaying(false); setTime(value); }
  function play() {
    if (running) { setPlaying(false); return; }
    if (time >= DURATION) setTime(0);
    setPlaying(true);
  }
  // Reduced-motion mode shows completed still frames for each teaching step.
  // A global pause freezes the exact current frame instead of jumping ahead.
  const drawingTime = reduced ? Math.min(DURATION, (step + 1) * 6 - .001) : time;
  return <section className="story-animation" ref={root} aria-labelledby={`${id}-title`}>
    <div className="animation-heading"><span className="animation-eyebrow">See the idea in action</span><span className="animation-count">{step + 1} / 3</span></div>
    <h4 id={`${id}-title`}>{lesson.title}</h4>
    <div className="animation-stage">
      <svg viewBox="0 0 640 360" role="img" aria-labelledby={`${id}-svg-title`} aria-describedby={`${id}-caption`}>
        <title id={`${id}-svg-title`}>{lesson.title}</title>
        <g aria-hidden="true"><StoryAnimationArt missionId={missionId} scene={scene} time={drawingTime} /></g>
      </svg>
    </div>
    <div className="animation-caption" role="note" aria-label="Current explanation" id={`${id}-caption`} aria-live="off"><span className="animation-step-number" aria-hidden="true">{step + 1}</span><div><strong>{lesson.steps[step][0]}</strong><p>{lesson.steps[step][1]}</p></div></div>
    <div className="animation-controls">
      <button type="button" className="animation-play" aria-label={running ? 'Pause animation' : 'Play animation'} disabled={blocked} onClick={play}>{running ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}<span>{running ? 'Pause' : 'Play'}</span></button>
      <button type="button" className="animation-replay" aria-label="Replay animation" onClick={() => { setTime(0); setPlaying(!blocked); }}><RotateCcw aria-hidden="true" /></button>
      <label className="animation-scrubber"><span className="sr-only">Animation progress</span><input type="range" min="0" max={DURATION} step="0.04" value={time} onChange={event => jump(Number(event.target.value))} aria-valuetext={`Step ${step + 1} of 3: ${lesson.steps[step][0]}`} /></label>
      <span className="animation-duration" aria-hidden="true">{Math.floor(time)} / {DURATION}s</span>
    </div>
    {blocked ? <p className="animation-motion-note">{reduced ? 'Reduced motion is on.' : 'Motion is paused in the top bar.'} Choose a step below to explore the explanation.</p> : <p className="animation-motion-note">Watch once, replay, or choose a step. There’s no timer to beat.</p>}
    <div className="animation-steps" role="group" aria-label="Explanation steps">{lesson.steps.map(([label], i) => <button type="button" key={label} aria-pressed={i === step} onClick={() => jump(i * 6)}><span>{i + 1}.</span> {label}</button>)}</div>
    <details className="animation-transcript"><summary>Read the whole explanation</summary><ol>{lesson.steps.map(([label, text]) => <li key={label}><strong>{label}</strong><p>{text}</p></li>)}</ol></details>
    <p className="animation-model-note">An illustrated model. Places, routes, symbols, and timing are simplified.</p>
  </section>;
}
