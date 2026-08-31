import { useCallback, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Layers3,
  List,
  Map as MapIcon,
  Mountain,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { DAILY_MAP_RETRIEVAL } from "../../contexts/published-content/adapters/retrievalCatalog";
import { MISSION_CATALOG } from "../../contexts/published-content/adapters/missionCatalog";
import type { MissionId } from "../../contexts/published-content/domain/mission";
import { BrowserProgressStore } from "../../contexts/quest-journey/adapters/browserProgressStore";
import { getQuestMap } from "../../contexts/quest-journey/application/getQuestMap";
import {
  applyMissionEvent,
  type MissionProgress,
} from "../../contexts/quest-journey/domain/missionProgress";
import { MissionPanel } from "./components/MissionPanel";
import { TimelineView, StandardsView } from "./components/MissionViews";
import { Modal } from "./components/Modal";
import { ProgressRail } from "./components/ProgressRail";
import { QuestDock, type DockAction } from "./components/QuestDock";
import { QuestHeader } from "./components/QuestHeader";
import type { MapLayers, QuestPortalView, QuestViewMode } from "./types";
import { VirginiaMap } from "./VirginiaMap";

const SEED_PROGRESS: readonly MissionProgress[] = [
  { missionId: "VS.1", state: "MASTERED", lastMeaningfulStep: "region-map" },
  { missionId: "VS.2", state: "MASTERED", lastMeaningfulStep: "evidence" },
  { missionId: "VS.3", state: "LEARNING", lastMeaningfulStep: "site-map" },
  { missionId: "VS.4", state: "MASTERED", lastMeaningfulStep: "five-boxes" },
  { missionId: "VS.5", state: "MASTERED", lastMeaningfulStep: "route-map" },
  { missionId: "VS.6", state: "MASTERED", lastMeaningfulStep: "rights-chain" },
  { missionId: "VS.7", state: "AVAILABLE", lastMeaningfulStep: null },
  { missionId: "VS.8", state: "AVAILABLE", lastMeaningfulStep: null },
  { missionId: "VS.9", state: "LOCKED", lastMeaningfulStep: null },
  { missionId: "VS.10", state: "AVAILABLE", lastMeaningfulStep: null },
  { missionId: "VS.11", state: "LOCKED", lastMeaningfulStep: null },
  { missionId: "VS.12", state: "AVAILABLE", lastMeaningfulStep: null },
  { missionId: "VS.13", state: "LOCKED", lastMeaningfulStep: null },
];

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function createProgressStore() {
  if (import.meta.env.MODE === "test") {
    return new BrowserProgressStore(createMemoryStorage(), MISSION_CATALOG.version);
  }
  try {
    const storage = (
      document.defaultView as unknown as { localStorage?: StorageLike } | null
    )?.localStorage;
    if (!storage || typeof storage.getItem !== "function") {
      throw new Error("Browser storage is unavailable");
    }
    return new BrowserProgressStore(storage, MISSION_CATALOG.version);
  } catch {
    return new BrowserProgressStore(createMemoryStorage(), MISSION_CATALOG.version);
  }
}

function findMission(
  portals: readonly QuestPortalView[],
  missionId: string,
): QuestPortalView {
  return portals.find((portal) => portal.id === missionId) ?? portals[0];
}

function missionNumber(missionId: string) {
  return Number(missionId.replace("VS.", ""));
}

export function QuestMapScreen() {
  const progressStore = useMemo(createProgressStore, []);
  const [progress, setProgress] = useState<readonly MissionProgress[]>(() =>
    progressStore.load(SEED_PROGRESS),
  );
  const [selectedId, setSelectedId] = useState<MissionId>("VS.3");
  const [view, setView] = useState<QuestViewMode>("map");
  const [layers, setLayers] = useState<MapLayers>({
    terrain: true,
    rivers: true,
    thenNow: false,
  });
  const [motionPaused, setMotionPaused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [allMissionsOpen, setAllMissionsOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [connectionMode, setConnectionMode] = useState<"people" | "chains" | null>(
    null,
  );
  const [retrievalAnswer, setRetrievalAnswer] = useState<string | null>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const projection = useMemo(
    () => getQuestMap(MISSION_CATALOG, progress),
    [progress],
  );
  const portals = projection.portals as readonly QuestPortalView[];
  const selectedMission = findMission(portals, selectedId);
  const progressPercent = Math.round((projection.restoredCount / portals.length) * 100);

  const saveProgress = useCallback(
    (nextProgress: readonly MissionProgress[]) => {
      setProgress(nextProgress);
      progressStore.save(nextProgress);
    },
    [progressStore],
  );

  const selectMission = useCallback((missionId: string) => {
    setSelectedId(missionId as MissionId);
    setAllMissionsOpen(false);
  }, []);

  const startSelectedMission = useCallback(() => {
    const record = progress.find((item) => item.missionId === selectedId);
    if (!record) return;

    if (record.state === "AVAILABLE") {
      const next = progress.map((item) =>
        item.missionId === selectedId
          ? applyMissionEvent(item, { type: "MISSION_OPENED" })
          : item,
      );
      saveProgress(next);
      setStatusMessage(`${selectedMission.shortTitle} is ready. Your place is saved.`);
    }
    setBriefingOpen(true);
  }, [progress, saveProgress, selectedId, selectedMission.shortTitle]);

  const completeBriefing = useCallback(() => {
    const record = progress.find((item) => item.missionId === selectedId);
    if (record?.state === "ORIENTING") {
      const next = progress.map((item) =>
        item.missionId === selectedId
          ? applyMissionEvent(
              applyMissionEvent(item, {
                type: "MEANINGFUL_STEP_REACHED",
                step: "mission-briefing",
              }),
              { type: "ORIENTATION_COMPLETED" },
            )
          : item,
      );
      saveProgress(next);
    }
    setBriefingOpen(false);
    setView("map");
    setStatusMessage("Briefing complete. Select map evidence to keep exploring.");
  }, [progress, saveProgress, selectedId]);

  const toggleLayer = (layer: keyof MapLayers) => {
    setLayers((current) => ({ ...current, [layer]: !current[layer] }));
  };

  const handleDockAction = (action: DockAction) => {
    if (action === "map") {
      setView("map");
    } else if (action === "missions") {
      setAllMissionsOpen(true);
    } else if (action === "timeline") {
      setView("timeline");
    } else if (action === "people" || action === "chains") {
      setConnectionMode(action);
    } else if (action === "review") {
      setReviewsOpen(true);
      document.getElementById("map-clue-title")?.focus?.();
    }
  };

  return (
    <div className={`quest-app ${motionPaused ? "motion-paused" : ""}`}>
      <a className="skip-link" href="#quest-map">
        Skip to the quest map
      </a>
      <QuestHeader
        motionPaused={motionPaused}
        audioEnabled={audioEnabled}
        onToggleMotion={() => {
          setMotionPaused((current) => !current);
          setStatusMessage(motionPaused ? "Map motion resumed." : "Map motion paused.");
        }}
        onToggleAudio={() => {
          setAudioEnabled((current) => !current);
          setStatusMessage(audioEnabled ? "Audio is off." : "Audio is on. Nothing plays automatically.");
        }}
        onOpenMissions={() => setAllMissionsOpen(true)}
      />

      <main className="quest-main" id="quest-map">
        <div className="quest-intro">
          <div>
            <h1>Your Virginia Memory Map</h1>
            <p>Choose a portal to uncover how place shaped the story.</p>
          </div>
          <button
            className="all-missions-shortcut"
            type="button"
            onClick={() => setAllMissionsOpen(true)}
          >
            <List aria-hidden="true" />
            <span>All missions</span>
          </button>
        </div>

        <div className="mobile-progress" aria-hidden="true">
          <span>{projection.restoredCount} of 13 restored</span>
          <span className="mobile-progress-track">
            <span style={{ width: `${progressPercent}%` }} />
          </span>
        </div>

        <div className="quest-toolbar">
          <div className="view-tabs" role="tablist" aria-label="Quest views">
            <button
              type="button"
              role="tab"
              aria-selected={view === "map"}
              aria-controls="map-view"
              onClick={() => setView("map")}
            >
              <MapIcon aria-hidden="true" />
              Map
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "timeline"}
              aria-controls="timeline-view"
              onClick={() => setView("timeline")}
            >
              <Layers3 aria-hidden="true" />
              Timeline
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "standards"}
              aria-controls="standards-view"
              onClick={() => setView("standards")}
            >
              <BookOpen aria-hidden="true" />
              Standards
            </button>
          </div>

          {view === "map" ? (
            <div className="layer-controls" aria-label="Map layers">
              <button
                type="button"
                aria-pressed={layers.terrain}
                onClick={() => toggleLayer("terrain")}
              >
                <Mountain aria-hidden="true" />
                Terrain
              </button>
              <button
                type="button"
                aria-pressed={layers.rivers}
                onClick={() => toggleLayer("rivers")}
              >
                <Waves aria-hidden="true" />
                Rivers
              </button>
              <button
                type="button"
                aria-pressed={layers.thenNow}
                onClick={() => toggleLayer("thenNow")}
              >
                <Layers3 aria-hidden="true" />
                Then &amp; now
              </button>
            </div>
          ) : null}
        </div>

        <div className="quest-grid">
          <ProgressRail
            restoredCount={projection.restoredCount}
            total={portals.length}
            answer={retrievalAnswer}
            onAnswer={setRetrievalAnswer}
            reviewOpen={reviewsOpen}
            onToggleReviews={() => setReviewsOpen((current) => !current)}
            challenge={DAILY_MAP_RETRIEVAL}
          />

          <div className="map-stage">
            {view === "map" ? (
              <div id="map-view" role="tabpanel" aria-label="Map view">
                <VirginiaMap
                  portals={portals}
                  selectedId={selectedId}
                  layers={layers}
                  onSelect={selectMission}
                />
              </div>
            ) : view === "timeline" ? (
              <div id="timeline-view" role="tabpanel" aria-label="Timeline view">
                <TimelineView
                  portals={portals}
                  selectedId={selectedId}
                  onSelect={selectMission}
                />
              </div>
            ) : (
              <div id="standards-view" role="tabpanel" aria-label="Standards view">
                <StandardsView
                  portals={portals}
                  selectedId={selectedId}
                  onSelect={selectMission}
                />
              </div>
            )}
          </div>

          <MissionPanel mission={selectedMission} onContinue={startSelectedMission} />
        </div>
      </main>

      <QuestDock active={view} onAction={handleDockAction} />
      <p className="sr-only" aria-live="polite">
        {statusMessage}
      </p>

      {allMissionsOpen ? (
        <Modal
          label="All missions"
          titleId="mission-directory-title"
          className="mission-directory"
          onClose={() => setAllMissionsOpen(false)}
        >
          <p className="briefing-kicker">13 time portals</p>
          <h2 id="mission-directory-title">All missions</h2>
          <p className="modal-lead">
            Every portal links time, people, place, cause and effect, and evidence.
            Pick the list or the map—the learning is the same.
          </p>
          <ol className="mission-directory-list">
            {portals.map((portal) => (
              <li key={portal.id}>
                <button type="button" onClick={() => selectMission(portal.id)}>
                  <span className="mission-directory-code">{portal.id}</span>
                  <span className="mission-directory-title">
                    <strong>{portal.title}</strong>
                    <small>{portal.heroLocation}</small>
                  </span>
                  {portal.displayState === "restored" ? (
                    <CheckCircle2 aria-label="Restored" />
                  ) : portal.displayState === "locked" ? (
                    <ShieldCheck aria-label="Preview" />
                  ) : (
                    <ChevronRight aria-hidden="true" />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </Modal>
      ) : null}

      {briefingOpen ? (
        <Modal
          label={`${selectedMission.shortTitle} mission briefing`}
          titleId="briefing-title"
          onClose={() => setBriefingOpen(false)}
        >
          <p className="briefing-kicker">
            {selectedMission.id} · About 4 minutes
          </p>
          <h2 id="briefing-title">{selectedMission.title}</h2>
          <p className="modal-lead">{selectedMission.hook}</p>
          <p className="briefing-question">{selectedMission.essentialQuestion}</p>
          <p className="field-label">Your investigation</p>
          <ol className="briefing-steps">
            {selectedMission.learningFocus.map((focus) => (
              <li key={focus}>{focus}</li>
            ))}
          </ol>
          <button className="primary-action" type="button" onClick={completeBriefing}>
            <span>Start map evidence</span>
            <ChevronRight aria-hidden="true" />
          </button>
        </Modal>
      ) : null}

      {connectionMode ? (
        <Modal
          label={connectionMode === "people" ? "People connections" : "Cause and effect connections"}
          titleId="connection-title"
          onClose={() => setConnectionMode(null)}
        >
          <p className="briefing-kicker">{selectedMission.id} connections</p>
          <h2 id="connection-title">
            {connectionMode === "people" ? "People act together" : "History has more than one arrow"}
          </h2>
          <p className="modal-lead">
            {connectionMode === "people"
              ? `Open ${selectedMission.shortTitle} to meet people, groups, communities, and institutions through their actions and evidence.`
              : `Open ${selectedMission.shortTitle} to connect background conditions, choices, immediate results, long-term effects, and what did not change.`}
          </p>
          <div className="connection-options">
            {selectedMission.learningFocus.slice(0, 2).map((focus) => (
              <div className="connection-option" key={focus}>
                <h3>{focus}</h3>
                <p>
                  Ask who made choices here, what evidence survives, and how place
                  influenced—but did not determine—the outcome.
                </p>
              </div>
            ))}
          </div>
          <button
            className="primary-action"
            type="button"
            onClick={() => {
              setConnectionMode(null);
              startSelectedMission();
            }}
          >
            <span>Open this mission</span>
            <ChevronRight aria-hidden="true" />
          </button>
        </Modal>
      ) : null}
    </div>
  );
}
