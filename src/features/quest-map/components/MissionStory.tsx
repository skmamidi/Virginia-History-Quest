import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Factory, Flag, Globe, GraduationCap, Lightbulb, Mountain, Search, ShieldCheck, Ship, Sprout, TrainFront, Users, Volume2, VolumeX, Waves, Waypoints } from 'lucide-react';
import { MISSION_STORIES, type StoryIcon } from '../../../contexts/published-content/adapters/missionStories';
import { MISSION_ACTIVITIES } from '../../../contexts/published-content/adapters/missionActivities';
import type { MissionId } from '../../../contexts/published-content/domain/mission';
import type { StoryProgress } from '../storyProgress';
import { PageContent } from './PageContent';

const ICONS = { mountain: Mountain, water: Waves, people: Users, search: Search, ship: Ship, plant: Sprout, document: BookOpen, flag: Flag, rights: ShieldCheck, bridge: Waypoints, train: TrainFront, factory: Factory, school: GraduationCap, globe: Globe } satisfies Record<StoryIcon, typeof Mountain>;

export function MissionStory({ missionId, title, progress, onExplore, onComplete, onPractice, replay = false }: {
  missionId: MissionId; title: string; progress: StoryProgress; onExplore: (index: number) => void;
  onComplete: () => void; onPractice: () => void; replay?: boolean;
}) {
  const story = MISSION_STORIES[missionId];
  const scene = story.scenes[progress.scene];
  const Icon = ICONS[scene.icon];
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const uniqueId = useId();
  const allExplored = progress.explored.length === 3;
  const canSpeak = typeof window.speechSynthesis?.speak === 'function' && typeof window.SpeechSynthesisUtterance === 'function';
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  function explore(index: number, focus = false) {
    window.speechSynthesis?.cancel(); setSpeaking(false); setDiscoveryOpen(false); onExplore(index);
    if (focus) requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'nearest' }); });
  }
  function speak() {
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(`${scene.title}. ${scene.narrative}. ${scene.word}. ${scene.definition}.${discoveryOpen ? ` ${scene.discovery}` : ''}`);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false); utterance.onerror = () => setSpeaking(false);
    setSpeaking(true); window.speechSynthesis.speak(utterance);
  }
  return <PageContent label={`${title} story`} titleId="briefing-title" className={`mission-story story-${story.diagram}`}>
    <header className="story-header">
      <p className="briefing-kicker">{missionId} · Explore the story · At your pace</p>
      <h2 id="briefing-title">Your mission: {title}</h2>
      <p className="story-invitation">{story.invitation}</p>
      <div className="story-stage-label"><span><BookOpen aria-hidden="true" />Story first</span><ChevronRight aria-hidden="true" /><span>Then {MISSION_ACTIVITIES[missionId].challenges.length} questions</span></div>
    </header>
    <div className="story-experience">
      <section className="story-map" aria-labelledby={`${uniqueId}-map-title`}>
        <div className="story-map-heading"><p className="briefing-kicker">Tap a stop. Make a connection.</p><h3 id={`${uniqueId}-map-title`}>{story.title}</h3></div>
        <div className={`story-diagram diagram-${story.diagram}`} role="group" aria-label={story.diagramLabel}>
          <svg className="story-scenery" viewBox="0 0 720 280" preserveAspectRatio="none" aria-hidden="true">
            {story.diagram === 'landscape' ? <>
              <path className="story-mountains-back" d="M0 240L100 35 200 150 270 65 380 210 490 175 720 220V280H0Z" />
              <path className="story-mountains-front" d="M0 280V210L90 145 165 230 255 145 345 230 480 210 600 260 720 250V280Z" />
              <path className="story-river" d="M225 170Q300 165 325 220T470 245T710 272" />
            </> : <>
              <path className="story-horizon" d={story.diagram === 'network' ? 'M0 260Q150 170 290 235T720 220V280H0Z' : 'M0 250Q170 220 360 245T720 230V280H0Z'} />
              <circle cx="640" cy="48" r="30" className="story-sun" />
            </>}
          </svg>
          <ol className="story-stops">
            {story.scenes.map((stop, index) => {
              const StopIcon = ICONS[stop.icon];
              return <li key={stop.label} className={`${index === progress.scene ? 'story-stop-current' : ''} ${progress.explored.includes(index) ? 'story-stop-explored' : ''}`}>
                <button type="button" className="story-stop" aria-pressed={index === progress.scene} aria-label={`${stop.label} · ${stop.time}`} aria-controls={`${uniqueId}-scene`} onClick={() => explore(index, window.matchMedia?.('(max-width: 1000px)').matches ?? false)}>
                  <span className="story-stop-icon"><StopIcon aria-hidden="true" /><span className="story-stop-number" aria-hidden="true">{progress.explored.includes(index) ? <Check aria-hidden="true" /> : index + 1}</span></span>
                  <strong>{stop.label}</strong><span>{stop.time}</span>
                </button>
                {index < 2 ? <span className="story-connection"><ArrowRight aria-hidden="true" /><span>{story.connections[index]}</span></span> : null}
              </li>;
            })}
          </ol>
        </div>
        <p className="story-diagram-note">{story.diagram === 'timeline' ? 'Timeline of selected events; spacing does not represent time.' : story.diagram === 'landscape' ? 'A landscape diagram, not a map. Shapes and distances are simplified.' : 'A connection diagram; it shows relationships, not exact locations.'}</p>
        <p className="story-explored" role="status"><Check aria-hidden="true" />{progress.explored.length} of 3 stops explored{allExplored ? ' · Your challenges are ready when you are.' : ' · Explore all three to unlock the challenges.'}</p>
      </section>
      <article className="story-scene" id={`${uniqueId}-scene`} aria-labelledby={`${uniqueId}-scene-title`}>
        <div className="story-scene-top"><span className="story-scene-icon" aria-hidden="true"><Icon /></span><p className="briefing-kicker">Stop {progress.scene + 1} of 3 · {scene.time}</p>{canSpeak ? <button type="button" className="story-listen" onClick={speak}>{speaking ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}{speaking ? 'Stop reading' : 'Read to me'}</button> : null}</div>
        <h3 id={`${uniqueId}-scene-title`} ref={heading} tabIndex={-1}>{scene.title}</h3>
        <p className="story-narrative">{scene.narrative}</p>
        <p className="story-vocabulary"><strong>{scene.word}</strong><span>{scene.definition}</span></p>
        <button className="story-discovery-toggle" type="button" aria-expanded={discoveryOpen} aria-controls={`${uniqueId}-discovery`} onClick={() => { window.speechSynthesis?.cancel(); setSpeaking(false); setDiscoveryOpen(!discoveryOpen); }}><Search aria-hidden="true" />{scene.discoveryLabel}<span aria-hidden="true">{discoveryOpen ? '−' : '+'}</span></button>
        {discoveryOpen ? <div className="story-discovery" id={`${uniqueId}-discovery`}><p>{scene.discovery}</p></div> : null}
        <div className="story-scene-navigation"><button type="button" className="secondary-action" disabled={progress.scene === 0} onClick={() => explore(progress.scene - 1, true)}><ArrowLeft aria-hidden="true" />Previous stop</button>{progress.scene < 2 ? <button type="button" className="primary-action" onClick={() => explore(progress.scene + 1, true)}>Next story stop<ArrowRight aria-hidden="true" /></button> : !allExplored ? <button type="button" className="primary-action" onClick={() => explore([0, 1, 2].find(n => !progress.explored.includes(n))!, true)}>Explore the missing stop<ArrowRight aria-hidden="true" /></button> : <span className="story-ready"><Check aria-hidden="true" />Story explored</span>}</div>
      </article>
    </div>
    <footer className="story-finish">
      <div className="story-wonder"><Lightbulb aria-hidden="true" /><div><h3>Pause and wonder</h3><p>{story.think}</p><small>Think it through or talk with someone. No answer to submit.</small></div></div>
      <div className="story-launch"><button type="button" className="primary-action" disabled={!allExplored} onClick={onComplete}>{replay ? 'Return to my challenges' : 'Try the challenges'}<ChevronRight aria-hidden="true" /></button><p>{allExplored ? 'You can revisit this story during the challenges.' : 'Visit each story stop first. There’s no timer.'}</p><button type="button" className="text-button" onClick={onPractice}>Practice this topic · SOL questions</button></div>
    </footer>
    <p className="story-source">Keep exploring: <a href={story.source.url} target="_blank" rel="noreferrer">{story.source.label}<span className="sr-only"> (opens a new tab)</span></a></p>
  </PageContent>;
}
