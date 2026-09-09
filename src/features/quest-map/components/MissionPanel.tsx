import { MissionTripClue } from "./FieldTripTrail";
import { MISSION_ACTIVITIES } from "../../../contexts/published-content/adapters/missionActivities";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  HelpCircle,
  LockKeyhole,
  MapPin,
} from "lucide-react";
import type { QuestPortalView } from "../types";

interface MissionPanelProps {
  mission: QuestPortalView;
  onContinue: () => void;
  onTrip: (chapter: number) => void;
  onPractice: () => void;
}

const stateCopy = {
  restored: { label: "Portal restored", Icon: CheckCircle2 },
  in_progress: { label: "Mission in progress", Icon: Clock3 },
  available: { label: "Ready to explore", Icon: MapPin },
  locked: { label: "Preview available", Icon: LockKeyhole },
} as const;

export function MissionPanel({ mission, onContinue, onTrip, onPractice }: MissionPanelProps) {
  const earned = ["PROVISIONAL_MASTERY", "DELAYED_CHECK_DUE", "TARGETED_REVIEW"].includes(mission.progressState);
  const state = earned ? { label: "Badge earned", Icon: CheckCircle2 } : stateCopy[mission.displayState];
  const StateIcon = state.Icon;
  const actionLabel =
    ["DELAYED_CHECK_DUE", "TARGETED_REVIEW"].includes(mission.progressState)
      ? "Play memory check"
      : mission.progressState === "PROVISIONAL_MASTERY"
      ? "Play again"
      : mission.displayState === "restored"
      ? "Review mission"
      : mission.displayState === "in_progress"
        ? "Continue mission"
        : mission.displayState === "locked"
          ? "See prerequisites"
          : "Begin mission";

  return (
    <aside className="mission-panel" aria-labelledby="selected-mission-title">
      <div className="mission-panel-bar">
        <span>{mission.id} · {mission.shortTitle}</span>
        <span className={`mission-state mission-state-${mission.displayState}`}>
          <StateIcon aria-hidden="true" />
          {state.label}
        </span>
      </div>
      <div className="mission-panel-body">
        <p className="mission-location">
          <MapPin aria-hidden="true" />
          {mission.heroLocation}
        </p>
        <h2 id="selected-mission-title">
          <span aria-hidden="true">{mission.experienceTitle}</span>
          <span className="sr-only">{mission.title}</span>
        </h2>
        <p className="mission-reward">{earned || mission.displayState === "restored" ? "Badge earned" : "Your badge to discover"}: <strong>{MISSION_ACTIVITIES[mission.id].badge}</strong></p>

        <button className="primary-action" type="button" onClick={onContinue}>
          <span>{actionLabel}</span>
          <ChevronRight aria-hidden="true" />
        </button>

        <button className="secondary-action practice-launch" type="button" onClick={onPractice}><span>Practice SOL questions<small>Short stories · 3 questions at a time</small></span><ChevronRight aria-hidden="true" /></button>

        <MissionTripClue missionId={mission.id} onOpen={onTrip} />
        <details className="mission-about">
          <summary>More about this mission</summary>
        <div className="essential-question">
          <p className="field-label">Essential question</p>
          <p>{mission.essentialQuestion}</p>
        </div>
        <p className="mission-summary">{mission.hook}</p>
        <dl className="mission-meta">
          <div>
            <dt>Time lens</dt>
            <dd>{mission.dateLabel}</dd>
          </div>
          <div>
            <dt>Era</dt>
            <dd>{mission.eraLabel}</dd>
          </div>
        </dl>

        <details className="evidence-details">
          <summary>
            <HelpCircle aria-hidden="true" />
            How do we know?
          </summary>
          <div className="evidence-copy">
            <p>
              <strong>Map evidence:</strong> The state outline comes from the U.S.
              Census Bureau. Mission markers show public, approximate, or generalized
              places—not private or sensitive coordinates.
            </p>
            <p>
              <strong>Keep investigating:</strong> Open a mission to find its learning sources and explore the evidence with a grown-up.
            </p>
          </div>
        </details>
        </details>
      </div>
    </aside>
  );
}
