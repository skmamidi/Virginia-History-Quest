import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, FlaskConical, Leaf, Mountain, Sprout, Trees, Waves, Wind } from 'lucide-react';
import { SCIENCE_SOURCES, SCIENCE_TOPICS } from '../../contexts/published-content/adapters/scienceLessons';
import { SCIENCE_QUESTIONS } from '../../contexts/published-content/adapters/scienceQuestions';
import { mixedScienceReview, type ScienceGrade, type ScienceQuestion, type ScienceTopicId } from '../../contexts/published-content/domain/science';
import { browserScienceStorage, loadScienceProgress, saveScienceProgress } from '../../contexts/quest-journey/adapters/scienceProgressStore';
import { PageContent } from '../quest-map/components/PageContent';
import { ScienceQuiz, type ScienceSession } from './ScienceQuiz';
import { ReadScienceAloud, ScienceSources, WatershedExplorer } from './ScienceTools';
import './science.css';

const ICONS = { watersheds: Waves, chesapeake: Waves, forests: Trees, soil: Sprout, rocks: Mountain, energy: Wind, conservation: Leaf, investigations: FlaskConical };
export default function SciencePage({ topicId, onTopic }: { topicId?: ScienceTopicId; onTopic: (id?: ScienceTopicId) => void }) {
  const storage = useMemo(browserScienceStorage, []);
  const [solved, setSolved] = useState(() => loadScienceProgress(storage));
  const [saveWarning, setSaveWarning] = useState('');
  const [grade, setGrade] = useState<ScienceGrade | 'all'>('all');
  const [session, setSession] = useState<ScienceSession | null>(null);
  const [sessionRun, setSessionRun] = useState(0);
  const topic = SCIENCE_TOPICS.find(t => t.id === topicId);
  const scope = topicId ?? 'overview';
  const activeSession = session?.scope === scope ? session : null;
  const topicQuestions = SCIENCE_QUESTIONS.filter(q => q.topicId === topicId);
  const remaining = topicQuestions.filter(q => !solved.includes(q.id));
  function launch(questions: readonly ScienceQuestion[], mode: ScienceSession['mode'] = 'practice') {
    setSession({ questions, mode, scope, title: topic?.title ?? 'Science discoveries' });
    setSessionRun(value => value + 1);
    document.getElementById('science-title')?.scrollIntoView({ block: 'start' });
  }
  function openTopic(id?: ScienceTopicId) { setSession(null); onTopic(id); }
  function markSolved(ids: string[]) {
    const next = [...new Set([...solved, ...ids])];
    setSolved(next);
    setSaveWarning(saveScienceProgress(storage, next) ? '' : 'Your discoveries are safe for this visit, but this browser could not save them for next time.');
  }
  return <PageContent label="Science & natural resources" titleId="science-title" className="science-page">
    <div className="science-page-top"><p className="science-eyebrow"><FlaskConical aria-hidden="true" />Virginia science field guide · Grades 4 & 5</p><span className="science-saved"><CheckCircle2 aria-hidden="true" />{solved.length} of {SCIENCE_QUESTIONS.length} discoveries saved{saveWarning ? ' for this visit' : ''}</span></div>
    {saveWarning ? <p className="science-save-warning" role="alert">{saveWarning}</p> : null}
    <h2 id="science-title">{activeSession ? 'Science SOL practice' : topic?.title ?? 'Science & natural resources'}</h2>
    {activeSession ? <ScienceQuiz key={sessionRun} session={activeSession} onSolved={markSolved} onExit={() => { setSession(null); requestAnimationFrame(() => document.getElementById('science-title')?.focus()); }} onTopic={openTopic} onRetry={questions => launch(questions)} /> : topic ? <>
      <div className="science-lesson-top"><button type="button" className="science-text-button" onClick={() => openTopic()}>← All science topics</button><span className="science-small">Grades {topic.grades.join(' & ')} · {topic.standards.map(s => s.code).join(' · ')}</span></div>
      <p className="science-lesson-question">{topic.question}</p>
      <p className="science-intro">{topic.intro}</p>
      <div className="science-actions"><button type="button" className="primary-action" onClick={() => launch(remaining.length ? remaining : topicQuestions)}>{remaining.length === 0 ? 'Replay 6 questions' : remaining.length === 6 ? 'Practice 6 questions' : `Continue practice · ${remaining.length} remaining`}<ArrowRight aria-hidden="true" /></button><ReadScienceAloud text={[topic.title, topic.intro, ...topic.sections.map(s => `${s.title}. ${s.text}`)].join('. ')} /></div>
      <div className="science-lesson-layout"><article className="science-lesson-reading" aria-label="Lesson">
        {topic.sections.map((section, i) => <section key={section.title}><p className="science-eyebrow">Field note {String(i + 1).padStart(2, '0')}</p><h3>{section.title}</h3><p>{section.text}</p></section>)}
        {topic.id === 'watersheds' ? <WatershedExplorer /> : null}
        <div className="science-misconception"><p className="science-eyebrow">Clear up a common mix-up</p><h3>{topic.misconception.idea}</h3><p>{topic.misconception.explanation}</p></div>
        <section className="science-fieldwork"><p className="science-eyebrow"><FlaskConical aria-hidden="true" />Try a mini investigation</p><h3>{topic.fieldwork.title}</h3><ol>{topic.fieldwork.steps.map(step => <li key={step}>{step}</li>)}</ol><p><strong>Explain your evidence:</strong> {topic.fieldwork.explain}</p></section>
        <div className="science-practice-invite"><h3>Put your discoveries to work</h3><p>Read a question carefully, use evidence, and explain why an answer makes sense. Clues and retries are always available in lesson practice.</p><button type="button" className="primary-action" onClick={() => launch(remaining.length ? remaining : topicQuestions)}>Try this lesson’s questions<ArrowRight aria-hidden="true" /></button>{remaining.length > 0 && remaining.length < 6 ? <button type="button" className="science-text-button" onClick={() => launch(topicQuestions)}>Replay all 6 questions</button> : null}</div>
      </article><aside className="science-notebook" aria-label="Science vocabulary and standards"><div><p className="science-eyebrow"><BookOpen aria-hidden="true" />Your field notebook</p><h3>Words to know</h3><dl>{topic.vocabulary.map(v => <div key={v.term}><dt>{v.term}</dt><dd>{v.meaning}</dd></div>)}</dl></div><div><h3>Your SOL connections</h3><ul className="science-standards">{topic.standards.map(s => <li key={s.code}><strong>{s.code}</strong>{s.focus}</li>)}</ul><p className="science-small">Study the ideas and how to use them, not just the standard numbers.</p></div><div><h3>Explore the sources</h3><ScienceSources sources={topic.sources} /></div></aside></div>
      <nav className="science-next-lesson" aria-label="More science lessons"><button type="button" className="science-button" onClick={() => openTopic()}>All science topics</button><button type="button" className="science-button" onClick={() => openTopic(SCIENCE_TOPICS[(SCIENCE_TOPICS.indexOf(topic) + 1) % SCIENCE_TOPICS.length].id)}>Next: {SCIENCE_TOPICS[(SCIENCE_TOPICS.indexOf(topic) + 1) % SCIENCE_TOPICS.length].title}<ArrowRight aria-hidden="true" /></button></nav>
    </> : <>
      <div className="science-hero"><div className="science-hero-copy"><span className="science-pill">Look closer. Ask why.</span><h3>One state.<br />A world of discoveries.</h3><p>Follow a raindrop, investigate a forest, and uncover the resources that power Virginia. Learn the science, then put your evidence to the test.</p><div className="science-hero-stats"><span><strong>8</strong>deep-dive lessons</span><span><strong>48</strong>practice questions</span><span><strong>2</strong>grade levels</span></div><button type="button" className="primary-action" onClick={() => openTopic('watersheds')}>Start with Virginia’s water<ArrowRight aria-hidden="true" /></button></div><WatershedExplorer /></div>
      <div className="science-section-heading"><div><p className="science-eyebrow">Your learning trail</p><h3>Choose a discovery</h3></div><div className="science-segmented" role="group" aria-label="Filter science lessons by grade">{(['all', 4, 5] as const).map(g => <button type="button" key={g} aria-pressed={grade === g} onClick={() => setGrade(g)}>{g === 'all' ? 'Both grades' : `Grade ${g}`}</button>)}</div></div>
      <div className="science-topic-grid">{SCIENCE_TOPICS.filter(t => grade === 'all' || t.grades.includes(grade)).map(t => {
        const Icon = ICONS[t.id];
        const count = SCIENCE_QUESTIONS.filter(q => q.topicId === t.id && solved.includes(q.id)).length;
        return <button type="button" className={`science-topic-card science-topic-${t.id}`} key={t.id} aria-label={`Explore lesson: ${t.title}`} onClick={() => openTopic(t.id)}><span className="science-topic-card-top"><Icon aria-hidden="true" /><small>{t.grades.length > 1 ? 'Grades 4 & 5' : `Grade ${t.grades[0]}`}</small></span><strong>{t.title}</strong><span>{t.subtitle}</span><small className="science-topic-codes">SOL {t.standards.map(s => s.code).join(' · ')}</small><span className="science-topic-card-bottom"><small>{count === 6 ? 'All 6 discoveries saved' : `${count}/6 discoveries · Learn & practice`}</small>{count === 6 ? <CheckCircle2 aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}</span></button>;
      })}</div>
      <section className="science-review-invite" aria-labelledby="science-review-title"><div><p className="science-eyebrow">Ready to connect the ideas?</p><h3 id="science-review-title">Try a mixed SOL-style review</h3><p>16 questions from all eight topics and both grades. Choose answers, select multiple answers, order steps, and read data tables. See explanations and topics to revisit when you finish.</p><p className="science-small">Untimed · Original practice questions · Start fresh each time</p></div><button type="button" className="primary-action" onClick={() => launch(mixedScienceReview(SCIENCE_QUESTIONS), 'review')}>Start 16-question review<ArrowRight aria-hidden="true" /></button></section>
      <section className="science-study-tips" aria-labelledby="science-tips-title"><h3 id="science-tips-title">Prepare with a scientist’s habits</h3><ol><li><strong>Notice the task.</strong> Check whether it asks for one answer, several answers, or an order.</li><li><strong>Read the evidence.</strong> Look at table headings, units, arrows, and what stayed the same in an investigation.</li><li><strong>Explain the cause.</strong> Ask why the evidence supports your answer. Watch for claims such as “always” or “every.”</li><li><strong>Revisit and retry.</strong> Read the explanation for a missed question, then return to the lesson and try again.</li></ol></section>
      <section className="science-alignment" aria-labelledby="science-alignment-title"><h3 id="science-alignment-title">Connected to Virginia’s science standards</h3><p>This section uses the 2018 science SOL and VDOE’s 2026 grade 4 and grade 5 instructional guides, checked September 11, 2026. The grade 5 science SOL test includes content from both grades.</p><p>These lessons focus on Virginia’s natural resources and related science. They are a topic review, not a complete course or full-length SOL test. Questions are newly written practice, not official released test items or a prediction of an SOL score.</p><ScienceSources sources={[SCIENCE_SOURCES.standards, SCIENCE_SOURCES.blueprint]} /><details><summary>See the lesson-to-standard guide</summary><div className="science-table-scroll"><table><caption>Content addressed in this section</caption><thead><tr><th scope="col">Lesson</th><th scope="col">Science SOL connections</th></tr></thead><tbody>{SCIENCE_TOPICS.map(t => <tr key={t.id}><th scope="row">{t.title}</th><td>{t.standards.map(s => `${s.code}: ${s.focus}`).join('; ')}</td></tr>)}</tbody></table></div><p className="science-small">Some lessons use selected parts of a broader standard. Grade 4 rock/mineral distinctions are labeled as an extra connection. Astronomy and remaining physical-science topics need additional review.</p><ScienceSources sources={[SCIENCE_SOURCES.grade4, SCIENCE_SOURCES.grade5]} /></details><p className="science-small">Correct-answer discoveries save in this browser only. Review scores are for the current session. No student account is needed.</p></section>
    </>}
  </PageContent>;
}
