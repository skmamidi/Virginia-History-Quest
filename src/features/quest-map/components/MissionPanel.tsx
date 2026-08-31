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
}

const stateCopy = {
  restored: { label: "Portal restored", Icon: CheckCircle2 },
  in_progress: { label: "Mission in progress", Icon: Clock3 },
  available: { label: "Ready to explore", Icon: MapPin },
  locked: { label: "Preview available", Icon: LockKeyhole },
} as const;

export function MissionPanel({ mission, onContinue }: MissionPanelProps) {
  const state = stateCopy[mission.displayState];
  const StateIcon = state.Icon;
  const actionLabel =
    mission.displayState === "restored"
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
        <div className="essential-question">
          <p className="field-label">Essential question</p>
          <p>{mission.essentialQuestion}</p>
        </div>
        <p className="mission-summary">{mission.mapSummary}</p>

        <button className="primary-action" type="button" onClick={onContinue}>
          <span>{actionLabel}</span>
          <ChevronRight aria-hidden="true" />
        </button>

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
              <strong>Keep investigating:</strong> Published history still needs
              claim-level sources and reviewer approval.
            </p>
          </div>
        </details>
      </div>
    </aside>
  );
}
