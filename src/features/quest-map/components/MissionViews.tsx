import { CheckCircle2, Clock3, LockKeyhole, MapPin } from "lucide-react";
import type { QuestPortalView } from "../types";

interface MissionViewProps {
  portals: readonly QuestPortalView[];
  selectedId: string;
  onSelect: (missionId: string) => void;
}

function StatusGlyph({ state }: { state: QuestPortalView["displayState"] }) {
  if (state === "restored") return <CheckCircle2 aria-hidden="true" />;
  if (state === "in_progress") return <Clock3 aria-hidden="true" />;
  if (state === "locked") return <LockKeyhole aria-hidden="true" />;
  return <MapPin aria-hidden="true" />;
}

export function TimelineView({ portals, selectedId, onSelect }: MissionViewProps) {
  return (
    <section className="alternate-view timeline-view" aria-label="Mission timeline">
      <div className="alternate-view-heading">
        <p className="field-label">Thirteen connected stories</p>
        <h2>Travel across Virginia’s timeline</h2>
        <p>
          Dates are guideposts. Select a portal to connect its era, place, people,
          and evidence.
        </p>
      </div>
      <ol className="timeline-list">
        {portals.map((portal) => (
          <li key={portal.id} className={`timeline-item state-${portal.displayState}`}>
            <button
              type="button"
              aria-current={portal.id === selectedId ? "step" : undefined}
              onClick={() => onSelect(portal.id)}
            >
              <span className="timeline-marker">
                <StatusGlyph state={portal.displayState} />
              </span>
              <span className="timeline-date">{portal.dateLabel}</span>
              <span className="timeline-copy">
                <strong>{portal.id}</strong>
                <span>{portal.title}</span>
                <small>{portal.heroLocation}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function StandardsView({ portals, selectedId, onSelect }: MissionViewProps) {
  return (
    <section className="alternate-view standards-view" aria-label="Standards mission list">
      <div className="alternate-view-heading">
        <p className="field-label">Virginia Studies · VS.1–VS.13</p>
        <h2>See how every portal builds your skills</h2>
        <p>
          Each mission practices chronology, people, place, cause and effect, and
          evidence. Fifth-grade explorers can open the deeper “why it matters” clues.
        </p>
      </div>
      <ul className="standards-list">
        {portals.map((portal) => (
          <li key={portal.id}>
            <button
              type="button"
              className={portal.id === selectedId ? "standard-selected" : ""}
              onClick={() => onSelect(portal.id)}
            >
              <span className={`standard-code state-${portal.displayState}`}>
                <StatusGlyph state={portal.displayState} />
                {portal.id}
              </span>
              <span>
                <strong>{portal.shortTitle}</strong>
                <small>{portal.learningFocus.join(" · ")}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
