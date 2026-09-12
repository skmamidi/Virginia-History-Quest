import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Layers3,
  List,
  Map as MapIcon,
  Mountain,
  MapPin,
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
import { freshProgress, prepareProgress, passChallenge, hasBadge } from "../../contexts/quest-journey/application/playMission";
import { MISSION_ACTIVITIES } from "../../contexts/published-content/adapters/missionActivities";
import { Scrapbook } from "./components/Scrapbook";
import { MapLab } from "./components/MapLab";
import { SolPractice } from "./components/SolPractice";
import { FieldTripTrail } from "./components/FieldTripTrail";
import { ExplorerGuide } from "./components/ExplorerGuide";
import { MissionPlayer } from "./components/MissionPlayer";
import { MissionStory } from "./components/MissionStory";
import { createStoryStore, freshStory, type StoryProgressMap } from "./storyProgress";
import { MissionPanel } from "./components/MissionPanel";
import { TimelineView, StandardsView } from "./components/MissionViews";
import { Modal } from "./components/Modal";
import { PageContent } from "./components/PageContent";
import { JourneyNavigation, JourneyWayfinding, routeLabel } from "./components/JourneyNavigation";
import { useJourneyNavigation } from "./useJourneyNavigation";
import { ProgressRail } from "./components/ProgressRail";
import { QuestDock, type DockAction } from "./components/QuestDock";
import { QuestHeader } from "./components/QuestHeader";
import type { MapLayers, QuestPortalView, QuestViewMode } from "./types";
import { VirginiaMap } from "./VirginiaMap";

const SciencePage = lazy(() => import('../science/SciencePage'));

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
    return new BrowserProgressStore({
      getItem: () => null,
      setItem: () => { throw new Error("Browser storage is unavailable"); },
      removeItem: () => {},
    }, MISSION_CATALOG.version);
  }
}

function findMission(
  portals: readonly QuestPortalView[],
  missionId: string,
): QuestPortalView {
  return portals.find((portal) => portal.id === missionId) ?? portals[0];
}

export function QuestMapScreen() {
  const progressStore = useMemo(createProgressStore, []);
  const [progress, setProgress] = useState<readonly MissionProgress[]>(() =>
    prepareProgress(progressStore.load(freshProgress)),
  );
  const storyStore = useMemo(() => {
    if (import.meta.env.MODE === 'test') return createStoryStore(createMemoryStorage());
    try { return createStoryStore(window.localStorage); } catch { return createStoryStore(); }
  }, []);
  const [stories, setStories] = useState<StoryProgressMap>(() => storyStore.load());
  const { route, from, navigate, back } = useJourneyNavigation();
  const [mapSelectedId, setSelectedId] = useState<MissionId>(() => getQuestMap(MISSION_CATALOG, progress).continueMissionId ?? "VS.1");
  const [view, setView] = useState<QuestViewMode>("map");
  const [layers, setLayers] = useState<MapLayers>({
    terrain: true,
    rivers: true,
    thenNow: false,
  });
  const [motionPaused, setMotionPaused] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [tripChapter, setTripChapterIndex] = useState(0);
  const selectedId = 'missionId' in route ? route.missionId : mapSelectedId;
  const selectedRecord = progress.find(p => p.missionId === selectedId)!;
  const allMissionsOpen = route.kind === 'missions';
  const selectedStory = stories[selectedId] ?? freshStory();
  const briefingOpen = route.kind === 'story' || (route.kind === 'mission' && (!selectedStory.finished || ['AVAILABLE', 'ORIENTING'].includes(selectedRecord.state)));
  const playerOpen = route.kind === 'mission' && !briefingOpen;
  const practiceOpen = route.kind === 'practice';
  const schoolWorkspace = route.kind === 'maps' || route.kind === 'scrapbook' ? route.kind : null;
  const setAllMissionsOpen = (open: boolean) => open ? navigate({ kind: 'missions' }) : back();
  const setPracticeOpen = (open: boolean) => open ? navigate({ kind: 'practice', missionId: selectedId }) : back();
  const setSchoolWorkspace = (kind: 'scrapbook' | 'maps' | null) => kind ? navigate({ kind }) : back();
  const setTripChapter = (chapter: number | null) => { if (chapter === null) back(); else { setTripChapterIndex(chapter); navigate({ kind: 'trips' }); } };
  const [saveWarning, setSaveWarning] = useState("");
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
  const badgeCount = progress.filter(hasBadge).length;
  const progressPercent = Math.round((badgeCount / portals.length) * 100);

  const saveProgress = useCallback(
    (nextProgress: readonly MissionProgress[]) => {
      setProgress(nextProgress);
      setSaveWarning(progressStore.save(nextProgress) ? "" : "Your progress is safe for this visit, but this browser could not save it for next time.");
    },
    [progressStore],
  );

  const selectMission = useCallback((missionId: string) => {
    setSelectedId(missionId as MissionId);
    if (window.matchMedia?.("(max-width: 900px)").matches) {
      requestAnimationFrame(() => document.getElementById("explorer-guide-title")?.scrollIntoView({ block: "center" }));
    }
  }, []);

  const openMission = useCallback((missionId: MissionId) => {
    setSelectedId(missionId);
    const prepared = prepareProgress(progress);
    if (prepared.some((record, index) => record !== progress[index])) saveProgress(prepared);
    const record = prepared.find((item) => item.missionId === missionId);
    if (!record) return;

    if (record.state === "AVAILABLE") {
      const next = prepared.map((item) =>
        item.missionId === missionId
          ? applyMissionEvent(item, { type: "MISSION_OPENED" })
          : item,
      );
      saveProgress(next);
      setStatusMessage(`${findMission(portals, missionId).shortTitle} is ready. Your place is saved.`);
    }
    navigate({ kind: "mission", missionId });
  }, [progress, saveProgress, portals, navigate]);

  const startSelectedMission = () => openMission(selectedId);
  useEffect(() => {
    if (route.kind === 'mission' && selectedRecord.state === 'AVAILABLE') openMission(route.missionId);
  }, [route, selectedRecord.state, openMission]);
  useEffect(() => {
    document.title = `${routeLabel(route, id => findMission(portals, id).shortTitle)} · Virginia History Quest`;
    window.speechSynthesis?.cancel();
  }, [route, portals]);


  const completeBriefing = useCallback(() => {
    const record = progress.find((item) => item.missionId === selectedId);
    if (record && ["AVAILABLE", "ORIENTING"].includes(record.state)) {
      const next = progress.map((item) =>
        item.missionId === selectedId
          ? applyMissionEvent(
              applyMissionEvent(item.state === "AVAILABLE" ? applyMissionEvent(item, { type: "MISSION_OPENED" }) : item, {
                type: "MEANINGFUL_STEP_REACHED",
                step: "mission-briefing",
              }),
              { type: "ORIENTATION_COMPLETED" },
            )
          : item,
      );
      saveProgress(next);
    }
    setStatusMessage(`Your investigation is ready. Solve ${MISSION_ACTIVITIES[selectedId].challenges.length} questions to earn a badge.`);
  }, [progress, saveProgress, selectedId]);

  const toggleLayer = (layer: keyof MapLayers) => {
    setLayers((current) => ({ ...current, [layer]: !current[layer] }));
  };

  const handleDockAction = (action: DockAction) => {
    if (action === "guide") {
      document.getElementById("explorer-guide-title")?.focus();
      document.getElementById("explorer-guide-title")?.scrollIntoView({ block: "center" });
    } else if (action === "map") {
      setView("map");
      requestAnimationFrame(() => document.getElementById("map-view")?.scrollIntoView({ block: "start" }));
    } else if (action === "missions") {
      setAllMissionsOpen(true);
    } else if (action === "timeline") {
      setView("timeline");
    } else if (action === "people" || action === "chains") {
      setConnectionMode(action);
    } else if (action === "review") {
      setReviewsOpen(true);
      const bonus = document.getElementById("bonus-activities") as HTMLDetailsElement | null;
      if (bonus) bonus.open = true;
      document.getElementById("map-clue-title")?.focus();
    }
  };

  return (
    <div className={`quest-app ${motionPaused ? "motion-paused" : ""}`}>
      <a className="skip-link" onClick={event => { event.preventDefault(); const main = document.getElementById(route.kind === "home" ? "quest-map" : "journey-content"); main?.focus(); main?.scrollIntoView({ block: "start" }); }} href={route.kind === "home" ? "#quest-map" : "#journey-content"}>
        Skip to learning content
      </a>
      <QuestHeader
        onHome={() => navigate({ kind: "home" })}
        motionPaused={motionPaused}
        audioEnabled={audioEnabled}
        onToggleMotion={() => {
          setMotionPaused((current) => !current);
          setStatusMessage(motionPaused ? "Motion resumed." : "Motion paused.");
        }}
        onToggleAudio={() => {
          setAudioEnabled((current) => !current);
          setStatusMessage(audioEnabled ? "Discovery sounds are off." : "Discovery sounds are on. Solve a challenge to hear a chime.");
        }}
        onOpenMissions={() => setAllMissionsOpen(true)}
      />

      <JourneyNavigation route={route} navigate={navigate} />
      <main className="quest-main" id="quest-map" tabIndex={-1} hidden={route.kind !== "home"}>
        <div className="quest-intro">
          <div>
            <h1 tabIndex={-1}>Your Virginia Memory Map</h1>
            <p>Your next adventure is ready below.</p>
          </div>
          <button
            className="all-missions-shortcut"
            aria-label="All missions"
            type="button"
            onClick={() => setAllMissionsOpen(true)}
          >
            <List aria-hidden="true" />
            <span>All missions</span>
          </button>
        </div>

        <ExplorerGuide mission={selectedMission} record={selectedRecord} onStart={startSelectedMission} onPractice={() => setPracticeOpen(true)} />
        <button className="field-trip-launch" type="button" onClick={() => setTripChapter(0)}>
          <MapPin aria-hidden="true" /><span><strong>Connect our field trips</strong><small>Yorktown, Harpers Ferry, Hampton Roads & the road to Appomattox</small></span><ChevronRight aria-hidden="true" />
        </button>
        <div className="school-launchers" aria-label="Classroom connections">
          <button type="button" onClick={() => setSchoolWorkspace("scrapbook")}><BookOpen aria-hidden="true" /><span><strong>My Virginia scrapbook</strong><small>Plan five visits. Collect photos. Tell your stories.</small></span><ChevronRight aria-hidden="true" /></button>
          <button type="button" onClick={() => setSchoolWorkspace("maps")}><MapIcon aria-hidden="true" /><span><strong>Virginia map lab</strong><small>Explore regions, climate, population & map tools.</small></span><ChevronRight aria-hidden="true" /></button>
        </div>
        <button className="field-trip-launch science-launch" type="button" onClick={() => navigate({ kind: 'science' })}>
          <FlaskConical aria-hidden="true" /><span><strong>Science & natural resources</strong><small>Explore Virginia’s water, wildlife, rocks & energy. Practice grade 4–5 science SOL questions.</small></span><ChevronRight aria-hidden="true" />
        </button>
        <p className="map-choice-hint">Want a different adventure? Tap a numbered portal on the map or choose All missions.</p>

        <div className="mobile-progress" aria-hidden="true">
          <span>{badgeCount} of 13 badges</span>
          <span className="mobile-progress-track">
            <span style={{ width: `${progressPercent}%` }} />
          </span>
        </div>

        <details className="explorer-tools">
          <summary>Map tools & other views <span>(optional)</span></summary>
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

          <div className="extra-explorer-tools" aria-label="Extra explorer tools">
            <button type="button" onClick={() => handleDockAction("people")}>People connections</button>
            <button type="button" onClick={() => handleDockAction("chains")}>Cause & effect</button>
            <button type="button" onClick={() => handleDockAction("review")}>Practice a bonus clue</button>
          </div>
        </details>

        <div className="quest-grid">
          <ProgressRail
            restoredCount={badgeCount}
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
                <p className="mobile-map-hint">Swipe the map sideways to find more portals</p>
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

          <MissionPanel mission={selectedMission} onContinue={startSelectedMission} onTrip={setTripChapter}
            onPractice={() => setPracticeOpen(true)} />
        </div>
      </main>

      {saveWarning ? <p className="save-warning" role="status">{saveWarning}</p> : null}
      {route.kind === "home" ? <QuestDock active={view} onAction={handleDockAction} /> : null}
      <p className="sr-only" aria-live="polite">
        {statusMessage}
      </p>

      {route.kind !== "home" ? <main id="journey-content" tabIndex={-1} className="journey-main">
      <JourneyWayfinding route={route} from={from} back={back} navigate={navigate} missionTitle={id => findMission(portals, id).shortTitle} />
      {allMissionsOpen ? (
        <PageContent
          label="All missions"
          titleId="mission-directory-title"
          className="mission-directory"
          onClose={() => setAllMissionsOpen(false)}
        >
          <p className="briefing-kicker">13 time portals</p>
          <h2 id="mission-directory-title">All missions</h2>
          <p className="modal-lead">
            Pick a topic you’re curious about. We’ll show you how to start.
          </p>
          <ol className="mission-directory-list">
            {portals.map((portal) => (
              <li key={portal.id}>
                <button type="button" aria-label={`${portal.id} ${portal.title}`} onClick={() => openMission(portal.id)}>
                  <span className="mission-directory-code">{portal.id}</span>
                  <span className="mission-directory-title">
                    <strong>{portal.title}</strong>
                    <small>{hasBadge(progress.find((record) => record.missionId === portal.id)!) ? `Badge: ${MISSION_ACTIVITIES[portal.id].badge}` : portal.heroLocation}</small>
                  </span>
                  {hasBadge(progress.find((record) => record.missionId === portal.id)!) ? (
                    <CheckCircle2 aria-label="Badge earned" />
                  ) : portal.displayState === "locked" ? (
                    <ShieldCheck aria-label="Preview" />
                  ) : (
                    <ChevronRight aria-hidden="true" />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </PageContent>
      ) : null}

      {schoolWorkspace === "scrapbook" ? <Scrapbook onClose={() => setSchoolWorkspace(null)} /> : null}
      {schoolWorkspace === "maps" ? <MapLab onClose={() => setSchoolWorkspace(null)} onScrapbook={() => setSchoolWorkspace("scrapbook")} /> : null}
      {route.kind === 'science' ? <Suspense fallback={<p role="status">Opening your science field guide…</p>}><SciencePage topicId={route.topicId} onTopic={topicId => navigate({ kind: 'science', ...(topicId ? { topicId } : {}) })} /></Suspense> : null}
      {practiceOpen ? <SolPractice key={selectedId} missionId={selectedId} title={selectedMission.shortTitle} onClose={() => (from?.kind === "mission" || from?.kind === "story") && from.missionId === selectedId ? back() : navigate({ kind: "mission", missionId: selectedId }, true)} /> : null}

      {route.kind === "trips" ? <FieldTripTrail initialChapter={tripChapter} onClose={() => setTripChapter(null)} onMission={openMission} /> : null}

      {briefingOpen ? <MissionStory key={selectedId} missionId={selectedId} title={selectedMission.shortTitle}
        motionPaused={motionPaused} progress={selectedStory} replay={route.kind === 'story' && selectedStory.finished}
        onExplore={index => {
          const next = { ...stories, [selectedId]: { ...selectedStory, scene: index, explored: [...new Set([...selectedStory.explored, index])] } };
          setStories(next);
          if (!storyStore.save(next)) setSaveWarning("Your story place is safe for this visit, but this browser could not save it for next time.");
        }}
        onComplete={() => {
          const next = { ...stories, [selectedId]: { ...selectedStory, finished: true } };
          setStories(next);
          completeBriefing();
          if (!storyStore.save(next)) setSaveWarning("Your story place is safe for this visit, but this browser could not save it for next time.");
          if (route.kind === 'story') {
            if (from?.kind === 'mission' && from.missionId === selectedId) back();
            else navigate({ kind: 'mission', missionId: selectedId }, true);
          }
        }} onPractice={() => setPracticeOpen(true)} /> : null}

      {(playerOpen || ((practiceOpen || route.kind === "story") && !["AVAILABLE", "ORIENTING"].includes(selectedRecord.state))) ? (
        <div hidden={!playerOpen}><MissionPlayer
          key={selectedId}
          mission={selectedMission}
          record={progress.find((item) => item.missionId === selectedId)!}
          audioEnabled={audioEnabled}
          onClose={() => navigate({ kind: 'home' })}
          onPause={back}
          onMap={() => navigate({ kind: 'home' })}
          onStory={() => navigate({ kind: 'story', missionId: selectedId })}

          onPass={(index) => saveProgress(progress.map((record) =>
            record.missionId === selectedId ? passChallenge(record, index) : record))}
          onPractice={() => setPracticeOpen(true)}
          nextMissionTitle={portals.find((portal) => portal.id !== selectedId && !hasBadge(progress.find((record) => record.missionId === portal.id)!))?.shortTitle}
          onNext={() => {
            const remaining = portals.find((portal) => portal.id !== selectedId && !hasBadge(progress.find((record) => record.missionId === portal.id)!));
            if (remaining) openMission(remaining.id);
            else setAllMissionsOpen(true);
          }}
        /></div>
      ) : null}

      </main> : null}

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
