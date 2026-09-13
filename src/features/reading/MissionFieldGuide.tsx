import { SOL_PRACTICE } from '../../contexts/published-content/adapters/solPractice';
import { MISSION_ACTIVITIES } from '../../contexts/published-content/adapters/missionActivities';
import type { MissionId } from '../../contexts/published-content/domain/mission';
import { RegionDiscovery } from './RegionDiscovery';
import './reading.css';

export function MissionFieldGuide({ missionId, motionPaused = false }: { missionId: MissionId; motionPaused?: boolean }) {
  return <section className="mission-field-guide" aria-label="Deeper background reading">
    <h3>Open your field guide</h3><p>The three story stops are the beginning. Explore these field notes to learn the places, people, and ideas behind this topic’s questions.</p>
    {missionId === 'VS.1' ? <RegionDiscovery motionPaused={motionPaused} /> : null}
    <div className="reading-chapters">{SOL_PRACTICE[missionId].map(t => <details key={t.id}><summary>{t.title}</summary><p>{t.lesson}</p><h4>Look closer</h4>{t.questions.map(q => <p key={q.prompt}>{q.explanation}</p>)}</details>)}</div>
    <details className="reading-more"><summary>More connections for your mission</summary>{MISSION_ACTIVITIES[missionId].challenges.map(q => <article key={q.prompt}><p><strong>{q.clue}</strong></p><p>{q.explanation}</p></article>)}</details>
  </section>;
}
