import { MissionTripClue } from "./FieldTripTrail";
import { useEffect, useRef, useState } from "react";
import { Award, BookOpen, CheckCircle2, ChevronRight, Hand, Lightbulb, RotateCcw, Sparkles, Star, Volume2 } from "lucide-react";
import { ACTIVITY_SOURCES, MISSION_ACTIVITIES } from "../../../contexts/published-content/adapters/missionActivities";
import { challengeIndex } from "../../../contexts/quest-journey/application/playMission";
import type { MissionProgress } from "../../../contexts/quest-journey/domain/missionProgress";
import type { QuestPortalView } from "../types";
import { PageContent } from "./PageContent";

interface Props {
  mission: QuestPortalView;
  record: MissionProgress;
  audioEnabled: boolean;
  onPass: (index: number) => void;
  onClose: () => void;
  onPause?: () => void;
  onMap?: () => void;
  onNext: () => void;
  onPractice?: () => void;
  onStory?: () => void;
  nextMissionTitle?: string;
}

export function MissionPlayer({ mission, record, audioEnabled, onPass, onClose, onPause, onMap, onNext, onPractice, onStory, nextMissionTitle }: Props) {
  const activity = MISSION_ACTIVITIES[mission.id];
  const [index, setIndex] = useState(() => challengeIndex(record));
  const [selected, setSelected] = useState<number | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [finished, setFinished] = useState(() => ["PROVISIONAL_MASTERY", "MASTERED"].includes(record.state));
  const heading = useRef<HTMLHeadingElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const challenge = activity.challenges[index];
  const count = activity.challenges.length;
  const isLastQuestion = index === count - 1;
  const trailStage = index === 0 ? 0 : isLastQuestion ? 2 : 1;
  const success = feedback === "correct";
  const readyToCheck = challenge.kind === "order" ? sequence.length === challenge.choices.length : selected !== null;
  const nextCue = success ? (isLastQuestion ? "Tap Reveal my badge to see what you earned!" : "Nice work! Tap Next challenge to keep going.")
    : feedback === "retry" ? (challenge.kind === "order" ? "Read the clue, then tap Start over to try a new order." : "Read the clue, then tap a different answer.")
    : readyToCheck ? "Ready! Tap Check my discovery below."
    : challenge.kind === "order" ? `Tap the ${["first", "second", "third"][sequence.length]} piece. ${sequence.length} of 3 placed.`
    : index === 0 ? "Read the clue, then tap one answer below." : "Tap one answer below. Need help? Open a clue.";
  const isReview = ["DELAYED_CHECK_DUE", "TARGETED_REVIEW"].includes(record.state);

  useEffect(() => {
    heading.current?.focus();
  }, [index, finished]);
  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    void audio.current?.close();
  }, []);

  function checkAnswer() {
    if (success) return;
    const correct = challenge.kind === "order"
      ? sequence.length === challenge.choices.length && sequence.every((value, position) => value === position)
      : selected === challenge.answer;
    setFeedback(correct ? "correct" : "retry");
    if (correct) {
      onPass(index);
      if (audioEnabled && typeof window.AudioContext === "function") {
        try {
          const context = audio.current ?? new AudioContext();
          audio.current = context;
          void context.resume().catch(() => {});
          [523.25, 659.25, 783.99].forEach((frequency, i) => {
            const tone = context.createOscillator();
            const gain = context.createGain();
            tone.connect(gain); gain.connect(context.destination);
            tone.frequency.value = frequency;
            const start = context.currentTime + i * 0.12;
            gain.gain.setValueAtTime(0.045, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
            tone.start(start); tone.stop(start + 0.23);
          });
        } catch { /* Audio is optional; blocked audio must never block a mission. */ }
      }
    }
  }

  function advance() {
    window.speechSynthesis?.cancel();
    if (isLastQuestion) { setFinished(true); return; }
    setIndex(index + 1); setSelected(null); setSequence([]); setFeedback(null); setHintOpen(false);
  }

  return (
    <PageContent label={`${mission.shortTitle} adventure`} titleId="adventure-title" className="mission-player" onClose={onClose}>
      <div className="mission-learning-layout">
      <aside className="mission-journey" aria-label="Your mission trail">
        <h2>{mission.shortTitle}</h2><p className="mission-code">{mission.id}</p>
        <p className="mission-goal">{activity.goal}</p>
          <div className="adventure-progress" aria-label={`Challenge ${index + 1} of ${count}`}>
            {["Find a clue", "Connect the story", "Final challenge"].map((label, step) => (
              <span key={label} className={finished || step <= trailStage ? "step-active" : ""} aria-current={!finished && step === trailStage ? "step" : undefined}>
                {finished || step < trailStage ? <CheckCircle2 aria-hidden="true" /> : <span>{step + 1}</span>}{label}
              </span>
            ))}
          </div>

        {finished ? <p className="mission-trail-complete"><CheckCircle2 aria-hidden="true" />Badge earned</p> : null}
        <div className="mission-journey-links">
          {onPause ? <button type="button" onClick={onPause}>Pause & return</button> : null}
          <button type="button" onClick={onMap ?? onClose}>Back to quest map</button>
        </div>
      </aside>
      <div className="mission-reading">
      {onStory ? <button type="button" className="story-revisit" onClick={onStory}><BookOpen aria-hidden="true" />Revisit the story</button> : null}
      {finished ? (
        <div className="mission-celebration">
          <div className="earned-badge"><Award aria-hidden="true" /></div>
          <h2 id="adventure-title" ref={heading} tabIndex={-1}>You did it, explorer!</h2>
          <p className="badge-name">{activity.badge}</p>
          <div className="earned-stars" aria-label="Mission badge earned">
            {[1, 2, 3].map((star) => <Star key={star} aria-hidden="true" />)}
          </div>
          <p>You used evidence, made connections, and solved the final challenge.</p>
          <MissionTripClue missionId={mission.id} />
          <p className="completion-note">{record.state === "MASTERED" ? "Memory check complete. This portal is restored!" : "Your badge is earned! Come back in seven days for a memory check to restore this portal. You can explore another mission right now."}</p>
          <button className="primary-action" type="button" onClick={onNext}>{nextMissionTitle ? `Next adventure: ${nextMissionTitle}` : "See all my badges"} <ChevronRight aria-hidden="true" /></button>
          {onPractice ? <button className="secondary-action" type="button" onClick={onPractice}>Practice SOL questions</button> : null}
          <button className="secondary-action" type="button" onClick={onClose}>Back to my map</button>
          <button className="secondary-action" type="button" onClick={() => {
            setIndex(0); setSelected(null); setSequence([]); setFeedback(null); setHintOpen(false); setFinished(false);
          }}>Replay all {count} questions</button>
        </div>
      ) : (
        <>
          <p className="briefing-kicker">Question {index + 1} of {count}</p>
          <h2 id="adventure-title" ref={heading} tabIndex={-1}>{isReview ? "Memory check: " : ""}{challenge.prompt}</h2>
          <p className="mission-instructions">{challenge.kind === "order" ? "Build the story from first to last." : "Find the answer using the clue. It’s okay to try again!"}</p>
          {index === 0 ? <div className="clue-card"><Lightbulb aria-hidden="true" /><p>{challenge.clue}</p></div> : (
            <button className="hint-button" type="button" aria-expanded={hintOpen} onClick={() => setHintOpen(!hintOpen)}><Lightbulb aria-hidden="true" />{hintOpen ? "Hide clue" : "Need a clue?"}</button>
          )}
          {hintOpen && index !== 0 ? <p className="clue-card">{challenge.clue}</p> : null}
          {"speechSynthesis" in window ? <button type="button" className="hint-button" onClick={() => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${challenge.prompt}. ${challenge.clue}. ${challenge.choices.join(". ")}`));
          }}><Volume2 aria-hidden="true" />Read it to me</button> : null}
          <p className="next-step-cue" aria-live="polite"><Hand aria-hidden="true" /><span>{nextCue}</span></p>
          <div className="challenge-choices" role="group" aria-label={challenge.kind === "order" ? "Timeline pieces" : "Answer choices"}>
            {(challenge.kind === "order" ? [2, 0, 1] : challenge.choices.map((_, i) => i)).map((value) => (
              <button
                key={value} type="button" aria-label={`${challenge.kind === "order" ? (sequence.includes(value) ? sequence.indexOf(value) + 1 : "?") : String.fromCharCode(65 + value)} ${challenge.choices[value]}`} className={`challenge-choice ${selected === value ? "choice-selected" : ""}`}
                aria-pressed={challenge.kind === "order" ? sequence.includes(value) : selected === value}
                disabled={success || (challenge.kind === "order" && sequence.includes(value))}
                onClick={() => {
                  setFeedback(null);
                  if (challenge.kind === "order") setSequence([...sequence, value]);
                  else setSelected(value);
                }}
              >
                <span className="choice-marker">{challenge.kind === "order" ? (sequence.includes(value) ? sequence.indexOf(value) + 1 : "?") : String.fromCharCode(65 + value)}</span>
                {challenge.choices[value]}
              </button>
            ))}
          </div>
          {challenge.kind === "order" ? <>
            <ol className="timeline-answer" aria-label="Your timeline">
              {[0, 1, 2].map((position) => <li key={position} className={sequence[position] === undefined ? "empty-slot" : "filled-slot"}><span className="slot-number" aria-hidden="true">{position + 1}</span>{sequence[position] === undefined ? ["First piece goes here", "Then…", "Last…"][position] : challenge.choices[sequence[position]]}</li>)}
            </ol>
            {!success ? <button className="hint-button" type="button" disabled={!sequence.length} onClick={() => { setSequence([]); setFeedback(null); }}><RotateCcw aria-hidden="true" />Start over</button> : null}
          </> : null}
          <div className={`challenge-feedback ${success ? "feedback-correct" : ""}`} role="status">
            {feedback === "correct" ? <><strong><Sparkles aria-hidden="true" />{isLastQuestion ? "Final challenge solved!" : "Discovery made!"}</strong><p>{challenge.explanation}</p></> : feedback === "retry" ? <><strong>Keep investigating—you can try again!</strong><p>{challenge.clue}</p></> : null}
          </div>
          <div className={`mission-action-bar ${readyToCheck || success ? "action-ready" : ""}`}>
          {success ? <button className="primary-action" type="button" onClick={advance}>{isLastQuestion ? "Reveal my badge" : "Next challenge"}<ChevronRight aria-hidden="true" /></button> : (
            <button className="primary-action" type="button" disabled={challenge.kind === "order" ? sequence.length !== challenge.choices.length : selected === null} onClick={checkAnswer}>Check my discovery <ChevronRight aria-hidden="true" /></button>
          )}
          </div>
          <p className="checkpoint-note">{["PROVISIONAL_MASTERY", "MASTERED"].includes(record.state) ? "Your earned badge is safe. Replay practice starts from question 1 when reopened." : "Each solved challenge saves your place. No timer. No lost lives."}</p>
        </>
      )}
      <details className="activity-sources"><summary>Sources for curious explorers and grown-ups</summary><ul>{ACTIVITY_SOURCES.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
      </div></div>
    </PageContent>
  );
}
