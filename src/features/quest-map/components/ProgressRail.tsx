import { BookOpenCheck, Compass, Lightbulb, Search } from "lucide-react";
import type { RetrievalChallenge } from "../../../contexts/published-content/domain/retrieval";

interface ProgressRailProps {
  restoredCount: number;
  total: number;
  answer: string | null;
  onAnswer: (answer: string) => void;
  reviewOpen: boolean;
  onToggleReviews: () => void;
  challenge: RetrievalChallenge;
}

export function ProgressRail({
  restoredCount,
  total,
  answer,
  onAnswer,
  reviewOpen,
  onToggleReviews,
  challenge,
}: ProgressRailProps) {
  const progress = Math.round((restoredCount / total) * 100);
  const feedback = answer === null ? null : challenge.feedbackByChoice[answer];

  return (
    <aside className="status-rail" aria-label="Quest progress and review">
      <section className="status-card progress-card" aria-labelledby="progress-title">
        <Compass aria-hidden="true" className="status-icon" />
        <div>
          <p id="progress-title" className="status-number">
            {restoredCount} of {total}
          </p>
          <p>portals restored</p>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Portal restoration progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={restoredCount}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="status-card strength-card" aria-label="Learning strength">
        <Lightbulb aria-hidden="true" className="status-icon" />
        <p>
          You’re getting stronger at <strong>connecting place to choices.</strong>
        </p>
      </section>

      <section className="status-card challenge-card" aria-labelledby="map-clue-title">
        <div className="challenge-heading">
          <Search aria-hidden="true" className="status-icon" />
          <div>
            <h2 id="map-clue-title">{challenge.heading}</h2>
            <p>{challenge.prompt}</p>
          </div>
        </div>
        <fieldset className="answer-list">
          <legend className="sr-only">Choose the river beside Jamestown</legend>
          {challenge.choices.map((choice) => (
            <label key={choice} className={answer === choice ? "answer-selected" : ""}>
              <input
                type="radio"
                name="map-clue"
                value={choice}
                checked={answer === choice}
                onChange={() => onAnswer(choice)}
              />
              <span>{choice}</span>
            </label>
          ))}
        </fieldset>
        <p className="answer-feedback" aria-live="polite">
          {feedback}
        </p>
        <button
          className="review-toggle"
          type="button"
          aria-expanded={reviewOpen}
          aria-controls="quick-reviews"
          onClick={onToggleReviews}
        >
          <BookOpenCheck aria-hidden="true" />
          <span>2 quick reviews</span>
          <span aria-hidden="true">{reviewOpen ? "−" : "+"}</span>
        </button>
        {reviewOpen ? (
          <ol id="quick-reviews" className="review-list">
            <li>Put Virginia’s five regions in east-to-west order.</li>
            <li>Explain why the Fall Line helped cities grow.</li>
          </ol>
        ) : null}
      </section>
    </aside>
  );
}
