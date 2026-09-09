import { Award, ChevronRight, Compass, Search } from "lucide-react";
import type { QuestPortalView } from "../types";
import { MISSION_ACTIVITIES } from "../../../contexts/published-content/adapters/missionActivities";

export function ExplorerGuide({ mission, onStart, onPractice }: { mission: QuestPortalView; onStart: () => void; onPractice?: () => void }) {
  const isNew = mission.progressState === "AVAILABLE" || mission.progressState === "ORIENTING";
  const isReplay = mission.progressState === "PROVISIONAL_MASTERY" || mission.progressState === "MASTERED";
  const isReview = mission.progressState === "DELAYED_CHECK_DUE" || mission.progressState === "TARGETED_REVIEW";
  const step = mission.progressState === "PRACTICING" ? 2 : mission.progressState === "BOSS_READY" || isReview ? 3 : 1;
  return (
    <section className="explorer-guide" aria-labelledby="explorer-guide-title">
      <div className="guide-compass" aria-hidden="true"><Compass /></div>
      <div className="guide-copy">
        <h2 id="explorer-guide-title" tabIndex={-1}>{isNew ? "Start here, explorer!" : isReplay ? "Ready for another discovery?" : "Let’s pick up where you left off!"}</h2>
        <p>{isNew ? "Your adventure" : isReplay ? "Play again" : isReview ? "Your memory check" : `Next up: challenge ${step} of 3`} <strong>· {mission.shortTitle}</strong></p>
        <ol className="explorer-route" aria-label="How an adventure works">
          <li><span>1</span><Search aria-hidden="true" />Read a clue</li>
          <li><span>2</span><Compass aria-hidden="true" />Solve 3 challenges</li>
          <li><span>3</span><Award aria-hidden="true" />Earn your badge</li>
        </ol>
      </div>
      <div className="guide-launch">
        <button className="primary-action guide-start" type="button" onClick={onStart}>
          {isNew ? "Start my adventure" : isReplay ? "Replay this adventure" : isReview ? "Start my memory check" : "Continue my adventure"}<ChevronRight aria-hidden="true" />
        </button>
        {onPractice ? <button className="guide-practice" type="button" onClick={onPractice}>Practice this topic · SOL questions</button> : null}
        <p><Award aria-hidden="true" />{MISSION_ACTIVITIES[mission.id].badge} badge</p>
      </div>
    </section>
  );
}
