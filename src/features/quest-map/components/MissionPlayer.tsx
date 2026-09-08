import { useEffect, useRef, useState } from "react";
import { Award, CheckCircle2, ChevronRight, Lightbulb, RotateCcw, Sparkles, Star, Volume2 } from "lucide-react";
import { ACTIVITY_SOURCES, MISSION_ACTIVITIES } from "../../../contexts/published-content/adapters/missionActivities";
import { challengeIndex } from "../../../contexts/quest-journey/application/playMission";
import type { MissionProgress } from "../../../contexts/quest-journey/domain/missionProgress";
import type { QuestPortalView } from "../types";
import { Modal } from "./Modal";

interface Props {
  mission: QuestPortalView;
  record: MissionProgress;
  audioEnabled: boolean;
  onPass: (index: number) => void;
  onClose: () => void;
  onNext: () => void;
}

export function MissionPlayer({ mission, record, audioEnabled, onPass, onClose, onNext }: Props) {
  const activity = MISSION_ACTIVITIES[mission.id];
  const [index, setIndex] = useState(() => challengeIndex(record));
  const [selected, setSelected] = useState<number | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "retry" | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const challenge = activity.challenges[index];
  const success = feedback === "correct";
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
    if (index === 2) { setFinished(true); return; }
    setIndex(index + 1); setSelected(null); setSequence([]); setFeedback(null); setHintOpen(false);
  }

  return (
    <Modal label={`${mission.shortTitle} adventure`} titleId="adventure-title" className="mission-player" onClose={onClose}>
      <p className="briefing-kicker">{mission.id} · {mission.shortTitle}</p>
      {finished ? (
        <div className="mission-celebration">
          <div className="earned-badge"><Award aria-hidden="true" /></div>
          <h2 id="adventure-title" ref={heading} tabIndex={-1}>You did it, explorer!</h2>
          <p className="badge-name">{activity.badge}</p>
          <div className="earned-stars" aria-label="Three challenges complete">
            {[1, 2, 3].map((star) => <Star key={star} aria-hidden="true" />)}
          </div>
          <p>You used evidence, made connections, and solved the final challenge.</p>
          <p className="completion-note">{record.state === "MASTERED" ? "Memory check complete. This portal is restored!" : "Your badge is earned! Come back in seven days for a memory check to restore this portal. You can explore another mission right now."}</p>
          <button className="primary-action" type="button" onClick={onNext}>Choose another adventure <ChevronRight aria-hidden="true" /></button>
          <button className="secondary-action" type="button" onClick={onClose}>Back to my map</button>
        </div>
      ) : (
        <>
          <div className="adventure-progress" aria-label={`Challenge ${index + 1} of 3`}>
            {["Find a clue", "Connect the story", "Final challenge"].map((label, step) => (
              <span key={label} className={step <= index ? "step-active" : ""} aria-current={step === index ? "step" : undefined}>
                {step < index ? <CheckCircle2 aria-hidden="true" /> : <span>{step + 1}</span>}{label}
              </span>
            ))}
          </div>
          <h2 id="adventure-title" ref={heading} tabIndex={-1}>{isReview ? "Memory check: " : ""}{challenge.prompt}</h2>
          <p className="mission-instructions">{challenge.kind === "order" ? "Tap the pieces in order, starting with the first. Use Start over to rearrange them." : "Choose your answer, then check your discovery. Take your time!"}</p>
          {index === 0 ? <div className="clue-card"><Lightbulb aria-hidden="true" /><p>{challenge.clue}</p></div> : (
            <button className="hint-button" type="button" aria-expanded={hintOpen} onClick={() => setHintOpen(!hintOpen)}><Lightbulb aria-hidden="true" />{hintOpen ? "Hide clue" : "Need a clue?"}</button>
          )}
          {hintOpen && index !== 0 ? <p className="clue-card">{challenge.clue}</p> : null}
          {"speechSynthesis" in window ? <button type="button" className="hint-button" onClick={() => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${challenge.prompt}. ${challenge.clue}. ${challenge.choices.join(". ")}`));
          }}><Volume2 aria-hidden="true" />Read it to me</button> : null}
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
              {sequence.map((value) => <li key={value}>{challenge.choices[value]}</li>)}
            </ol>
            {!success ? <button className="hint-button" type="button" disabled={!sequence.length} onClick={() => { setSequence([]); setFeedback(null); }}><RotateCcw aria-hidden="true" />Start over</button> : null}
          </> : null}
          <div className={`challenge-feedback ${success ? "feedback-correct" : ""}`} role="status">
            {feedback === "correct" ? <><strong><Sparkles aria-hidden="true" />{index === 2 ? "Final challenge solved!" : "Discovery made!"}</strong><p>{challenge.explanation}</p></> : feedback === "retry" ? <><strong>Keep investigating—you can try again!</strong><p>{challenge.clue}</p></> : null}
          </div>
          {success ? <button className="primary-action" type="button" onClick={advance}>{index === 2 ? "Reveal my badge" : "Next challenge"}<ChevronRight aria-hidden="true" /></button> : (
            <button className="primary-action" type="button" disabled={challenge.kind === "order" ? sequence.length !== challenge.choices.length : selected === null} onClick={checkAnswer}>Check my discovery <ChevronRight aria-hidden="true" /></button>
          )}
          <p className="checkpoint-note">Each solved challenge saves your place. No timer. No lost lives.</p>
        </>
      )}
      <details className="activity-sources"><summary>Sources for curious explorers and grown-ups</summary><ul>{ACTIVITY_SOURCES.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></details>
    </Modal>
  );
}
