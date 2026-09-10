import { useEffect, useRef, useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, Lightbulb, Sparkles, Star, Volume2 } from "lucide-react";
import { SOL_PRACTICE, SOL_FACT_CHECK_SOURCES, solGuideUrl, type PracticeTrail } from "../../../contexts/published-content/adapters/solPractice";
import type { MissionId } from "../../../contexts/published-content/domain/mission";
import { PRACTICE_STORAGE_KEY, practiceKey, readPracticeProgress } from "../../../contexts/quest-journey/adapters/solPracticeStore";
import { PageContent } from "./PageContent";

interface Props {
  missionId: MissionId;
  title: string;
  onClose: () => void;
}
export function SolPractice({ missionId, title, onClose }: Props) {
  const trails = SOL_PRACTICE[missionId];
  const [solved, setSolved] = useState<string[]>(() => {
    try { return readPracticeProgress(window.localStorage); } catch { return []; }
  });
  const [active, setActive] = useState<PracticeTrail | null>(null);
  const [step, setStep] = useState<"lesson" | "question" | "complete">("lesson");
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const [hint, setHint] = useState(false);
  const [saveWarning, setSaveWarning] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const trailCount = (trail: PracticeTrail) => trail.questions.filter((_, i) => solved.includes(practiceKey(missionId, trail.id, i))).length;
  const total = trails.reduce((sum, trail) => sum + trail.questions.length, 0);
  const found = trails.reduce((sum, trail) => sum + trailCount(trail), 0);
  const recommended = trails.find(trail => trailCount(trail) < trail.questions.length);
  const question = active?.questions[index];

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    heading.current?.closest(".modal-shell")?.scrollTo?.({ top: 0 });
    window.speechSynthesis?.cancel();
  }, [active, step, index]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function openTrail(trail: PracticeTrail) {
    setActive(trail); setStep("lesson"); setFeedback(null); setSelection(null); setHint(false);
    const next = trail.questions.findIndex((_, i) => !solved.includes(practiceKey(missionId, trail.id, i)));
    setIndex(next < 0 ? 0 : next);
  }
  function check() {
    if (!question || !active || selection === null || feedback === "correct") return;
    if (selection !== question.answer) { setFeedback("retry"); return; }
    setFeedback("correct");
    const key = practiceKey(missionId, active.id, index);
    const updated = [...new Set([...solved, key])];
    setSolved(updated);
    try { window.localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(updated)); setSaveWarning(""); }
    catch { setSaveWarning("Your discoveries are safe for this visit, but this browser could not save them for next time."); }
  }
  function next() {
    if (!active) return;
    if (index + 1 >= active.questions.length) { setStep("complete"); return; }
    setIndex(index + 1); setSelection(null); setFeedback(null); setHint(false);
  }
  function readAloud() {
    if (!active) return;
    const text = step === "lesson" ? active.title + ". " + active.lesson
      : question ? question.prompt + ". " + question.choices.join(". ") + (hint || feedback === "retry" ? ". " + question.clue : "") : "Practice trail complete!";
    window.speechSynthesis?.cancel();
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(text));
  }

  return <PageContent label={title + " SOL practice"} titleId="practice-title" className="sol-practice" onClose={onClose}>
    <p className="briefing-kicker">{missionId} · Virginia Studies practice</p>
    {!active ? <>
      <h2 id="practice-title" ref={heading} tabIndex={-1}>Practice: {title}</h2>
      <p className="modal-lead">Choose a short trail. Learn a little, solve 3 questions, and collect discoveries!</p>
      <p className="practice-count"><Star aria-hidden="true" />{found} of {total} discoveries saved</p>
      <div className="practice-trails">
        {trails.map(trail => <button type="button" className="practice-trail" key={trail.id} onClick={() => openTrail(trail)}>
          <span className="practice-trail-icon" aria-hidden="true">{trailCount(trail) === trail.questions.length ? <CheckCircle2 /> : <BookOpen />}</span>
          <span><small>{trail === recommended ? (trailCount(trail) ? "CONTINUE HERE" : "START HERE") : trailCount(trail) === trail.questions.length ? "READY TO REPLAY" : "EXPLORE ANY TIME"}</small><strong>{trail.title}</strong><span>{trailCount(trail)} of {trail.questions.length} discovered</span></span>
          <ChevronRight aria-hidden="true" />
        </button>)}
      </div>
      <p className="checkpoint-note">No timer. Hints are welcome. These discoveries are separate from your mission badge.</p>
    </> : <>
      <button className="hint-button" type="button" onClick={() => setActive(null)}>← Choose another trail</button>
      <p className="practice-count">{active.title} · {step === "lesson" ? "First, read the story" : step === "complete" ? "Trail complete" : "Question " + (index + 1) + " of " + active.questions.length}</p>
      <h2 id="practice-title" ref={heading} tabIndex={-1}>{step === "lesson" ? "Collect your clues" : step === "complete" ? "Three discoveries made!" : question?.prompt}</h2>
      {step === "lesson" ? <>
        <div className="practice-lesson"><BookOpen aria-hidden="true" /><p>{active.lesson}</p></div>
        <p className="next-step-cue">Read or listen to the story. Then try a question—you can reopen the story any time.</p>
        <button className="primary-action" type="button" onClick={() => setStep("question")}>{index ? "Continue at question " + (index + 1) : "Try the first question"}<ChevronRight aria-hidden="true" /></button>
      </> : step === "complete" ? <>
        <div className="earned-stars" aria-label="Three questions discovered">{[0, 1, 2].map(i => <Star key={i} aria-hidden="true" />)}</div>
        <p className="modal-lead">You connected the evidence. {found === total ? "You’ve explored every practice trail in this section!" : "Another short trail is ready when you are."}</p>
        <p className="practice-count">{found} of {total} discoveries saved in {title}</p>
        {recommended ? <button className="primary-action" type="button" onClick={() => openTrail(recommended)}>Next trail: {recommended.title}<ChevronRight aria-hidden="true" /></button>
          : <button className="primary-action" type="button" onClick={onClose}>Back to my mission<ChevronRight aria-hidden="true" /></button>}
        <button className="secondary-action" type="button" onClick={() => openTrail(active)}>Replay this trail</button>
      </> : question ? <>
        <p className="next-step-cue" aria-live="polite">{feedback === "correct" ? "Discovery saved! Follow the next button below." : feedback === "retry" ? "Use the clue below, then try another answer." : selection === null ? "Tap one answer. Open a clue if you need help." : "Now tap Check my answer."}</p>
        <div className="challenge-choices" role="group" aria-label="Practice answer choices">
          {question.choices.map((answer, i) => <button type="button" key={answer} className={"challenge-choice " + (selection === i ? "choice-selected" : "")} aria-pressed={selection === i} disabled={feedback === "correct"} onClick={() => { setSelection(i); setFeedback(null); }}>
            <span className="choice-marker" aria-hidden="true">{String.fromCharCode(65 + i)}</span>{answer}
          </button>)}
        </div>
        <button className="hint-button" type="button" aria-expanded={hint} onClick={() => setHint(!hint)}><Lightbulb aria-hidden="true" />{hint ? "Hide clue" : "Need a clue?"}</button>
        {hint ? <p className="clue-card">{question.clue}</p> : null}
        <div className={"challenge-feedback " + (feedback === "correct" ? "feedback-correct" : "")} role="status">
          {feedback ? <><strong>{feedback === "correct" ? <><Sparkles aria-hidden="true" />Discovery saved!</> : "Keep investigating!"}</strong><p>{question.explanation}</p></> : null}
        </div>
        <div className="mission-action-bar">
          {feedback === "correct" ? <button className="primary-action" type="button" onClick={next}>{index === active.questions.length - 1 ? "Finish this trail" : "Next question"}<ChevronRight aria-hidden="true" /></button>
            : <button className="primary-action" type="button" disabled={selection === null} onClick={check}>Check my answer<ChevronRight aria-hidden="true" /></button>}
        </div>
        <details className="practice-story"><summary>Read the story again</summary><p>{active.lesson}</p></details>
      </> : null}
      {step !== "complete" && typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined"
        ? <button className="hint-button" type="button" onClick={readAloud}><Volume2 aria-hidden="true" />Read it to me</button> : null}
    </>}
    {saveWarning ? <p className="save-warning" role="alert">{saveWarning}</p> : null}
    <details className="activity-sources"><summary>About this practice & sources</summary>
      <p>Original practice for the 2023 Virginia Studies topics. These are not official test questions or a copy of the SOLpass question bank.</p>
      <ul>{(SOL_FACT_CHECK_SOURCES[missionId] ?? []).map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}<li><a href={solGuideUrl(missionId)} target="_blank" rel="noreferrer">SOLpass: {missionId} study guide (school login may be needed)</a></li>
        <li><a href="https://www.doe.virginia.gov/teaching-learning-assessment/k-12-standards-instruction/history-and-social-science/standards-of-learning" target="_blank" rel="noreferrer">Virginia Department of Education: 2023 standards</a></li></ul>
    </details>
  </PageContent>;
}
