import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { SCIENCE_TOPICS } from '../../contexts/published-content/adapters/scienceLessons';
import { isScienceAnswerCorrect, type ScienceQuestion, type ScienceTopicId } from '../../contexts/published-content/domain/science';
import { ReadScienceAloud } from './ScienceTools';

export interface ScienceSession { questions: readonly ScienceQuestion[]; mode: 'practice' | 'review'; title: string; scope: string }
interface Props {
  session: ScienceSession;
  onSolved: (ids: string[]) => void;
  onExit: () => void;
  onTopic: (id: ScienceTopicId) => void;
  onRetry: (questions: readonly ScienceQuestion[]) => void;
}
const answerText = (q: ScienceQuestion, answer: readonly number[]) => answer.map(i => q.choices[i]).join(q.kind === 'order' ? ' → ' : '; ');

export function ScienceQuiz({ session, onSolved, onExit, onTopic, onRetry }: Props) {
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, number[]>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const question = session.questions[index];
  const review = session.mode === 'review';
  const correct = checked && isScienceAnswerCorrect(question, selection);
  const last = index === session.questions.length - 1;
  const ready = selection.length > 0 && (question.kind !== 'order' || selection.length === question.choices.length);
  const missed = session.questions.filter(q => !isScienceAnswerCorrect(q, attempts[q.id] ?? []));
  useEffect(() => { heading.current?.focus(); }, [index, finished]);

  function select(next: number[]) { setSelection(next); setChecked(false); }
  function check() {
    setChecked(true);
    if (!attempts[question.id]) setAttempts({ ...attempts, [question.id]: [...selection] });
    if (isScienceAnswerCorrect(question, selection)) onSolved([question.id]);
  }
  function next() {
    if (review) {
      const nextAttempts = { ...attempts, [question.id]: [...selection] };
      setAttempts(nextAttempts);
      if (last) onSolved(session.questions.filter(q => isScienceAnswerCorrect(q, nextAttempts[q.id] ?? [])).map(q => q.id));
    }
    if (last) setFinished(true);
    else { setIndex(index + 1); setSelection([]); setChecked(false); setHint(false); }
  }

  if (finished) return <div className="science-quiz">
    <p className="science-eyebrow">{review ? 'Mixed review complete' : 'Practice complete'}</p>
    <h2 ref={heading} tabIndex={-1} data-page-title="true">{review ? `${session.questions.length - missed.length} of ${session.questions.length} correct` : 'Your science discoveries are growing!'}</h2>
    <p>{review ? 'Use the explanations to decide what to study next. This practice score is not an official SOL score.' : `You solved all ${session.questions.length} questions. ${session.questions.length - missed.length} were correct on your first check; retries helped you learn the rest.`}</p>
    <div className="science-actions">{missed.length ? <button type="button" className="primary-action" onClick={() => onRetry(missed)}>Practice {missed.length} missed {missed.length === 1 ? 'question' : 'questions'}</button> : null}<button type="button" className="science-button" onClick={onExit}>Back to {session.scope === 'overview' ? 'science topics' : 'lesson'}</button><button type="button" className="science-text-button" onClick={() => onRetry(session.questions)}><RotateCcw aria-hidden="true" />Practice these again</button></div>
    <section className="science-review-topics" aria-label="Results by topic">{SCIENCE_TOPICS.filter(t => session.questions.some(q => q.topicId === t.id)).map(topic => {
      const questions = session.questions.filter(q => q.topicId === topic.id);
      const score = questions.filter(q => isScienceAnswerCorrect(q, attempts[q.id] ?? [])).length;
      return <button type="button" key={topic.id} onClick={() => onTopic(topic.id)}><span>{topic.title}</span><strong>{score}/{questions.length} {review ? 'correct' : 'on first check'}</strong><small>{score < questions.length ? 'Revisit lesson →' : 'Explore lesson →'}</small></button>;
    })}</section>
    <section aria-label="Review your answers" className="science-answer-review"><h3>Review your answers</h3>{session.questions.map((q, i) => <details key={q.id}><summary>{i + 1}. {q.prompt}<span>{isScienceAnswerCorrect(q, attempts[q.id] ?? []) ? 'Correct' : 'Review this'}</span></summary><p className="science-small">Science SOL {q.standard}</p><p><strong>{review ? 'Your answer:' : 'Your first answer:'}</strong> {answerText(q, attempts[q.id] ?? [])}</p><p><strong>Correct answer:</strong> {answerText(q, q.answer)}</p><p>{q.explanation}</p><button type="button" className="science-text-button" onClick={() => onTopic(q.topicId)}>Study this topic</button></details>)}</section>
  </div>;

  return <div className="science-quiz">
    <div className="science-quiz-top"><p className="science-eyebrow">{review ? 'Mixed SOL-style review' : session.title} · Question {index + 1} of {session.questions.length}</p><button type="button" className="science-text-button" onClick={onExit}>Back to {session.scope === 'overview' ? 'science topics' : 'lesson'}</button></div>
    <progress value={index} max={session.questions.length} aria-label="Questions finished" />
    <p className="science-small">Science SOL {question.standard} · {question.kind === 'single' ? 'Choose one answer' : question.kind === 'multiple' ? `Select ${question.answer.length} answers` : 'Put all steps in order'}</p>
    <h3 ref={heading} tabIndex={-1} data-page-title="true" className="science-question-title">{question.prompt}</h3>
    {question.context ? <p>{question.context}</p> : null}
    {question.table ? <div className="science-table-scroll"><table><caption>{question.table.caption}</caption><thead><tr>{question.table.headings.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{question.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div> : null}
    <ReadScienceAloud text={[question.prompt, question.table ? `${question.table.caption}. ${question.table.rows.map(row => row.map((cell, i) => `${question.table!.headings[i]}: ${cell}`).join(', ')).join('. ')}` : '', ...question.choices.map((c, i) => `${i + 1}. ${c}`)].join('. ')} />
    {question.kind === 'order' ? <div className="science-order">
      <p>Add each step in order. Use the arrows to rearrange your answer.</p>
      <div className="science-step-bank">{question.choices.map((choice, i) => <button type="button" key={choice} disabled={selection.includes(i) || correct} aria-label={`Add step: ${choice}`} onClick={() => select([...selection, i])}>{choice}</button>)}</div>
      <ol aria-label="Your ordered steps">{selection.map((value, position) => <li key={value}><span>{question.choices[value]}</span><div><button type="button" aria-label={`Move ${question.choices[value]} earlier`} disabled={position === 0 || correct} onClick={() => { const next = [...selection]; [next[position - 1], next[position]] = [next[position], next[position - 1]]; select(next); }}><ArrowUp aria-hidden="true" /></button><button type="button" aria-label={`Move ${question.choices[value]} later`} disabled={position === selection.length - 1 || correct} onClick={() => { const next = [...selection]; [next[position + 1], next[position]] = [next[position], next[position + 1]]; select(next); }}><ArrowDown aria-hidden="true" /></button><button type="button" aria-label={`Remove ${question.choices[value]}`} disabled={correct} onClick={() => select(selection.filter(i => i !== value))}><X aria-hidden="true" /></button></div></li>)}</ol>
    </div> : <fieldset className="science-choices"><legend className="sr-only">{question.kind === 'single' ? 'Choose one answer' : `Select ${question.answer.length} answers`}</legend>{question.choices.map((choice, i) => <label key={choice} className={selection.includes(i) ? 'selected' : ''}><input type={question.kind === 'single' ? 'radio' : 'checkbox'} name={question.id} checked={selection.includes(i)} disabled={correct} onChange={() => select(question.kind === 'single' ? [i] : selection.includes(i) ? selection.filter(value => value !== i) : [...selection, i])} /><span>{choice}</span></label>)}</fieldset>}
    {!review ? <><button type="button" className="science-text-button" aria-expanded={hint} onClick={() => setHint(!hint)}>{hint ? 'Hide clue' : 'Give me a clue'}</button>{hint ? <p className="science-clue">{question.hint}</p> : null}</> : <p className="science-small">Answers and explanations appear at the end. Choose carefully before continuing. Leaving starts a new review next time.</p>}
    {!review && checked ? <div className={`science-feedback ${correct ? 'correct' : ''}`} role="status"><strong>{correct ? 'You found it!' : 'Keep investigating.'}</strong><p>{question.explanation}</p>{correct ? <CheckCircle2 aria-hidden="true" /> : <p>Change your answer and check again.</p>}</div> : null}
    <div className="science-actions">{review ? <button type="button" className="primary-action" disabled={!ready} onClick={next}>{last ? 'Finish review' : 'Save answer & next'}</button> : correct ? <button type="button" className="primary-action" onClick={next}>{last ? 'Finish practice' : 'Next question'}</button> : <button type="button" className="primary-action" disabled={!ready} onClick={check}>Check my answer</button>}</div>
  </div>;
}
