import { useState } from 'react';
import { QUESTION_BANK } from '../quizzes/questionBank';
import { readingFor, supportingReading } from './readingCatalog';
import { PageContent } from '../quest-map/components/PageContent';
import { StoryAnimation } from '../quest-map/components/StoryAnimation';
import { RegionDiscovery } from './RegionDiscovery';
import { ReadScienceAloud, WatershedExplorer } from '../science/ScienceTools';
import { MapLab } from '../quest-map/components/MapLab';
import '../science/science.css';
import './reading.css';

export default function QuizReading({ questionId, motionPaused = false }: { questionId: string; motionPaused?: boolean }) {
  const q = QUESTION_BANK.find(q => q.id === questionId);
  const [scene, setScene] = useState(0);
  const [query, setQuery] = useState('');
  if (!q) return <PageContent label="Reading not found" titleId="reading-title"><h2 id="reading-title">Let’s find another reading</h2><p>This question link is no longer available.</p><a href="#/quizzes">Browse all quizzes</a></PageContent>;
  const reading = readingFor(q);
  const related = QUESTION_BANK.filter(other => other.topic === q.topic && other.id !== q.id && `${other.prompt} ${other.explanation}`.toLowerCase().includes(query.toLowerCase()));
  return <PageContent label="Question background" titleId="reading-title" className="quiz-reading">
    <p className="briefing-kicker">Read · Explore · Connect</p>
    <h2 id="reading-title">{q.lessonTitle}</h2>
    <p className="reading-intro">A closer look at {q.topic}. Read the idea behind your question, then explore the larger story.</p>
    <nav className="reading-jump" aria-label="Reading sections"><a href="#reading-focus" onClick={e => { e.preventDefault(); document.getElementById('reading-focus')?.scrollIntoView(); }}>Your question’s background</a><a href="#reading-explore" onClick={e => { e.preventDefault(); document.getElementById('reading-explore')?.scrollIntoView(); }}>Explore the lesson</a><a href="#reading-connections" onClick={e => { e.preventDefault(); document.getElementById('reading-connections')?.scrollIntoView(); }}>More discoveries</a></nav>
    <section id="reading-focus" className="reading-focus" aria-labelledby="reading-focus-title"><p className="briefing-kicker">Start here</p><h3 id="reading-focus-title">{q.prompt}</h3>{supportingReading(q).map(s => <div key={s.title}><h4>{s.title}</h4><p>{s.text}</p></div>)}<ReadScienceAloud text={supportingReading(q).map(s => s.text).join('. ')} /><p className="reading-prompt">Before returning to the quiz, explain this connection in your own words. Which detail helped you understand it?</p></section>
    <section id="reading-explore" aria-label="Explore the lesson">
      {reading.missionId === 'VS.1' || reading.map?.id === 'regions' ? <RegionDiscovery motionPaused={motionPaused} /> : null}
      {reading.story && reading.missionId ? <section className="reading-story"><h3>Watch the story unfold</h3><div className="reading-tabs" role="group" aria-label="Choose an animated story stop">{reading.story.scenes.map((s, i) => <button type="button" key={s.title} aria-pressed={scene === i} onClick={() => setScene(i)}>{s.label}</button>)}</div><div className="reading-story-layout"><StoryAnimation key={`${reading.missionId}-${scene}`} missionId={reading.missionId} scene={scene} motionPaused={motionPaused} /><article aria-live="polite"><h4>{reading.story.scenes[scene].title}</h4><p>{reading.story.scenes[scene].narrative}</p><p>{reading.story.scenes[scene].discovery}</p><p><strong>{reading.story.scenes[scene].word}:</strong> {reading.story.scenes[scene].definition}</p></article></div></section> : null}
      {reading.science && ['watersheds', 'chesapeake', 'conservation'].includes(reading.science.id) ? <WatershedExplorer /> : null}
      {reading.map && reading.map.id !== 'regions' ? <MapLab initialTopic={reading.map.id} onClose={() => {}} onScrapbook={() => { window.location.hash = '#/scrapbook'; }} /> : null}
      <h3>Keep exploring: your topic field notes</h3><div className="reading-chapters">{reading.sections.slice(reading.story ? 3 : 0).map((s, i) => <details key={`${s.title}-${i}`}><summary>{s.title}</summary><p>{s.text}</p></details>)}</div>
      {reading.science ? <section className="reading-field-note"><h3>{reading.science.fieldwork.title}</h3><ol>{reading.science.fieldwork.steps.map(s => <li key={s}>{s}</li>)}</ol><p>{reading.science.fieldwork.explain}</p></section> : null}
    </section>
    <section id="reading-connections"><h3>More discoveries in this topic</h3><p>Follow a connection that interests you. Every note includes the evidence behind another question.</p><label className="reading-search">Find a place, person, or idea<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search these discoveries" /></label><div className="reading-chapters">{related.map(other => <details key={other.id}><summary>{other.prompt}</summary><p>{other.explanation}</p><a href={other.href}>Explore this background</a></details>)}</div>{related.length === 0 ? <p>No matching discoveries. Try another word.</p> : null}</section>
    <section className="reading-sources"><h3>Where these ideas come from</h3><ul>{Array.from(new Map(reading.sources.map(s => [s.url, s])).values()).map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ul><a href={reading.originalHref}>Open the original topic lesson</a></section>
    <p className="reading-return">Ready to try? Return to your quiz tab to keep your place. <a href="#/quizzes">Or start a new quiz here.</a></p>
  </PageContent>;
}
