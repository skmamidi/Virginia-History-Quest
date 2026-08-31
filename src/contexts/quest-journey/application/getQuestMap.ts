import {
  MISSION_IDS,
  missionNumber,
  type MissionCatalog,
  type MissionId,
  type PublishedMissionSummary,
} from "../../published-content/domain/mission";
import type {
  MissionProgress,
  MissionState,
} from "../domain/missionProgress";

export type PortalDisplayState =
  | "locked"
  | "available"
  | "in_progress"
  | "restored";

export interface QuestMapPortal
  extends Omit<PublishedMissionSummary, "status"> {
  readonly longitude: number;
  readonly latitude: number;
  readonly precision: PublishedMissionSummary["portal"]["precision"];
  readonly sensitive: boolean;
  readonly displayState: PortalDisplayState;
  readonly progressState: MissionState | "AVAILABLE";
  readonly lastMeaningfulStep: string | null;
  readonly ariaLabel: string;
}

export interface QuestMapProjection {
  readonly catalogVersion: string;
  readonly portals: readonly QuestMapPortal[];
  readonly continueMissionId: MissionId | null;
  readonly restoredCount: number;
}

const IN_PROGRESS_STATES: ReadonlySet<MissionState> = new Set([
  "ORIENTING",
  "LEARNING",
  "PRACTICING",
  "BOSS_READY",
  "PROVISIONAL_MASTERY",
]);

function toDisplayState(state: MissionState): PortalDisplayState {
  if (state === "MASTERED") {
    return "restored";
  }
  if (state === "LOCKED") {
    return "locked";
  }
  if (
    state === "DELAYED_CHECK_DUE" ||
    state === "TARGETED_REVIEW" ||
    IN_PROGRESS_STATES.has(state)
  ) {
    return "in_progress";
  }
  return "available";
}

function statusWords(displayState: PortalDisplayState): string {
  return displayState.replaceAll("_", " ");
}

function toPortal(
  mission: PublishedMissionSummary,
  progress: MissionProgress | undefined,
): QuestMapPortal {
  const progressState = progress?.state ?? "AVAILABLE";
  const displayState = toDisplayState(progressState);

  return Object.freeze({
    id: mission.id,
    title: mission.title,
    shortTitle: mission.shortTitle,
    experienceTitle: mission.experienceTitle,
    essentialQuestion: mission.essentialQuestion,
    heroLocation: mission.heroLocation,
    mapSummary: mission.mapSummary,
    dateLabel: mission.dateLabel,
    eraLabel: mission.eraLabel,
    hook: mission.hook,
    learningFocus: mission.learningFocus,
    portal: mission.portal,
    longitude: mission.portal.longitude,
    latitude: mission.portal.latitude,
    precision: mission.portal.precision,
    sensitive: mission.portal.sensitive,
    displayState,
    progressState,
    lastMeaningfulStep: progress?.lastMeaningfulStep ?? null,
    ariaLabel: `${mission.id}: ${mission.title}; ${statusWords(displayState)}`,
  });
}

function selectContinueMission(
  portals: readonly QuestMapPortal[],
): MissionId | null {
  const activePortal = portals.find(
    (portal) => portal.displayState === "in_progress",
  );
  if (activePortal !== undefined) {
    return activePortal.id;
  }

  return (
    portals.find((portal) => portal.displayState === "available")?.id ?? null
  );
}

/** Build the read model consumed by map, timeline, and standards views. */
export function getQuestMap(
  catalog: MissionCatalog,
  progressRecords: readonly MissionProgress[],
): QuestMapProjection {
  const progressByMission = new Map<MissionId, MissionProgress>();

  for (const progress of progressRecords) {
    if (!MISSION_IDS.includes(progress.missionId)) {
      throw new Error(`Unknown mission progress id: ${progress.missionId}`);
    }
    if (progressByMission.has(progress.missionId)) {
      throw new Error(
        `Quest map cannot project duplicate progress for ${progress.missionId}.`,
      );
    }
    progressByMission.set(progress.missionId, progress);
  }

  const portals = [...catalog.missions]
    .filter((mission) => mission.status === "published")
    .sort((left, right) => missionNumber(left.id) - missionNumber(right.id))
    .map((mission) => toPortal(mission, progressByMission.get(mission.id)));

  const restoredCount = portals.filter(
    (portal) => portal.displayState === "restored",
  ).length;

  return Object.freeze({
    catalogVersion: catalog.version,
    portals: Object.freeze(portals),
    continueMissionId: selectContinueMission(portals),
    restoredCount,
  });
}
