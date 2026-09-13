import { useEffect, useRef, useState } from 'react';
import { PageContent } from '../quest-map/components/PageContent';
import { QUESTION_BANK, isCorrect, shuffle, type QuizQuestion } from './questionBank';
import './quizzes.css';

function ContextLink({ question }: { question: QuizQuestion }) {
  return <a className="quiz-context" href={question.href} target="_blank" rel="noopener noreferrer">Read the background: {question.lessonTitle} <span>(opens in a new tab)</span></a>;
}
const answerText = (q: QuizQuestion, values: readonly number[]) => values.map(i => q.choices[i]).join(q.kind === 'order' ? ' → ' : '; ');

function Question({ question: q, last, onAnswer }: { question: QuizQuestion; last: boolean; onAnswer: (answer: number[]) => void }) {
  const [selection, setSelection] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  const correct = isCorrect(q, selection);
  useEffect(() => { if (checked) feedback.current?.focus(); }, [checked]);
  const [choices] = useState(() => {
    const indices = q.choices.map((_, i) => i);
    const mixed = shuffle(indices);
    return q.kind === 'order' && isCorrect(q, mixed) ? mixed.reverse() : mixed;
  });
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const ready = q.kind === 'single' ? selection.length === 1 : selection.length === q.answer.length;
  return <>
    <p className="briefing-kicker">{q.topic} · {q.source}</p>
    <h3 ref={heading} tabIndex={-1}>{q.prompt}</h3>
    <ContextLink question={q} />
    {q.context ? <details className="quiz-background"><summary>Read the supporting context</summary><p>{q.context}</p></details> : null}
    {q.table ? <div className="quiz-table"><table><caption>{q.table.caption}</caption><thead><tr>{q.table.headings.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{q.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div> : null}
    <p>{q.kind === 'order' ? 'Tap each step in order. Clear your steps to try a different order.' : q.kind === 'multiple' ? `Choose ${q.answer.length} answers.` : 'Choose one answer.'}</p>
    {q.kind === 'order' ? <>
      <div className="quiz-options">{choices.map(i => <button type="button" key={i} disabled={checked || selection.includes(i)} onClick={() => setSelection([...selection, i])}>{q.choices[i]}</button>)}</div>
      <ol aria-label="Your ordered steps">{selection.map(i => <li key={i}>{q.choices[i]}</li>)}</ol>
      <button type="button" className="secondary-action" disabled={checked || !selection.length} onClick={() => setSelection([])}>Clear steps</button>
    </> : <fieldset className="quiz-options" disabled={checked}><legend className="sr-only">Answer choices</legend>{choices.map(i => <label key={i}><input type={q.kind === 'single' ? 'radio' : 'checkbox'} name={q.id} checked={selection.includes(i)} onChange={() => setSelection(q.kind === 'single' ? [i] : selection.includes(i) ? selection.filter(v => v !== i) : [...selection, i])} /><span>{q.choices[i]}</span></label>)}</fieldset>}
    {checked ? <>
      <div ref={feedback} tabIndex={-1} role="status" className={`quiz-feedback ${correct ? 'quiz-feedback-correct' : 'quiz-feedback-wrong'}`}>
        <strong>{correct ? 'Correct! You found it.' : 'Not quite — this answer is incorrect.'}</strong>
        {!correct ? <p><strong>Your answer:</strong> {answerText(q, selection)}</p> : null}
        <p><strong>{q.kind === 'order' ? 'Correct order:' : 'Correct answer:'}</strong> {answerText(q, q.answer)}</p>
        <p><strong>Why:</strong> {q.explanation}</p>
      </div>
      <button type="button" className="primary-action" onClick={() => onAnswer(selection)}>{last ? 'See quiz summary' : 'Next question'}</button>
    </> : <button type="button" className="primary-action" disabled={!ready} onClick={() => setChecked(true)}>Check my answer</button>}
  </>;
}

export default function QuizHub({ questions = QUESTION_BANK }: { questions?: readonly QuizQuestion[] }) {
  const [bank, setBank] = useState(() => shuffle(questions));
  const [topic, setTopic] = useState('all');
  const [session, setSession] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [run, setRun] = useState(0);
  const [notice, setNotice] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const filtered = bank.filter(q => topic === 'all' || q.topic === topic);
  const finished = session !== null && answers.length === session.length;
  const wrong = finished ? session.filter((q, i) => !isCorrect(q, answers[i])) : [];
  useEffect(() => { heading.current?.focus(); }, [finished, run]);
  function start(items: readonly QuizQuestion[]) {
    setSession(shuffle(items)); setAnswers([]); setRun(r => r + 1); setNotice('');
  }
  function reset() {
    setSession(null); setAnswers([]); setBank(shuffle(questions)); setRun(r => r + 1);
    setNotice('Quiz reset. Your answers and results have been cleared.');
  }
  return <PageContent label="All quizzes" titleId="quiz-hub-title" className="quiz-hub">
    <p className="briefing-kicker">Your question collection</p>
    <h2 id="quiz-hub-title" ref={heading}>{finished ? 'Your quiz summary' : 'All quizzes'}</h2>
    <p>Explore every quiz question in one place. Questions shuffle for each new quiz. Results stay only in this visit; reloading or resetting clears them.</p>
    <div className="quiz-toolbar"><label htmlFor="quiz-topic">Filter by topic<select id="quiz-topic" value={topic} onChange={e => { setTopic(e.target.value); setSession(null); setAnswers([]); setNotice('Topic changed. Ready for a fresh quiz.'); }}>{['all', ...new Set(questions.map(q => q.topic))].map(t => <option key={t} value={t}>{t === 'all' ? `All topics (${questions.length})` : `${t} (${questions.filter(q => q.topic === t).length})`}</option>)}</select></label><button type="button" className="secondary-action" onClick={reset}>Reset quiz & clear results</button></div>
    <p className="quiz-note">Changing topics starts fresh. Background links open another tab so you can keep your place. This practice has its own results, separate from saved lesson discoveries and badges.</p>
    {notice ? <p role="status">{notice}</p> : null}
    {!session ? <>
      <div className="quiz-start"><strong>{filtered.length} {filtered.length === 1 ? 'question' : 'questions'} ready</strong><button type="button" className="primary-action" disabled={!filtered.length} onClick={() => start(filtered)}>Start quiz</button></div>
      <details className="quiz-directory"><summary>Browse all {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}</summary>{filtered.map(q => <article key={q.id}><p className="briefing-kicker">{q.topic} · {q.source}</p><h3>{q.prompt}</h3><ContextLink question={q} /><button type="button" className="secondary-action" onClick={() => start([q])}>Try this question</button></article>)}</details>
    </> : finished ? <>
      <div className="quiz-score" role="status"><strong>{wrong.length === 0 ? 'You got every question right!' : `${wrong.length} ${wrong.length === 1 ? 'question' : 'questions'} to practice again`}</strong><p>{session.length - wrong.length} correct · {wrong.length} wrong · {session.length} total</p></div>
      <div className="quiz-toolbar">{wrong.length ? <button type="button" className="primary-action" onClick={() => start(wrong)}>Retake just the {wrong.length} wrong {wrong.length === 1 ? 'question' : 'questions'}</button> : null}<button type="button" className="secondary-action" onClick={() => start(filtered)}>Start a fresh quiz</button></div>
      <section aria-label="Review your answers">{session.map((q, i) => <details className="quiz-review" key={q.id}><summary>{isCorrect(q, answers[i]) ? 'Correct' : 'Review this'} · {q.prompt}</summary><p><strong>Your answer:</strong> {answerText(q, answers[i])}</p><p><strong>Correct answer:</strong> {answerText(q, q.answer)}</p><p>{q.explanation}</p><ContextLink question={q} /></details>)}</section>
    </> : <div className="quiz-question"><p>Question {answers.length + 1} of {session.length}</p><progress aria-label="Questions completed" value={answers.length} max={session.length} /><Question key={`${run}:${answers.length}`} question={session[answers.length]} last={answers.length === session.length - 1} onAnswer={answer => setAnswers(previous => [...previous, answer])} /><p className="quiz-note">Check your answer, read why, then continue when you’re ready.</p></div>}
  </PageContent>;
}
