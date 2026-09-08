import { MISSION_CATALOG } from "../../published-content/adapters/missionCatalog";
import { applyMissionEvent, type MissionProgress } from "../domain/missionProgress";

export const freshProgress: readonly MissionProgress[] = MISSION_CATALOG.missions.map(({ id }) => ({
  missionId: id, state: "AVAILABLE", lastMeaningfulStep: null,
}));

export function prepareProgress(records: readonly MissionProgress[], now = new Date()): readonly MissionProgress[] {
  return freshProgress.map((seed) => {
    let record = records.find((item) => item.missionId === seed.missionId) ?? seed;
    // The map prototype had locks without prerequisites. All topics support free exploration.
    if (record.state === "LOCKED") record = applyMissionEvent(record, { type: "PREREQUISITE_MET" });
    if (record.state === "PROVISIONAL_MASTERY" && record.provisionalMasteryAt &&
        now.getTime() - Date.parse(record.provisionalMasteryAt) >= 7 * 86400000) {
      record = applyMissionEvent(record, { type: "DELAYED_CHECK_BECAME_DUE", occurredAt: now.toISOString() });
    }
    return record;
  });
}

export function challengeIndex(record: MissionProgress): number {
  if (record.state === "PRACTICING") return 1;
  if (["BOSS_READY", "DELAYED_CHECK_DUE", "TARGETED_REVIEW"].includes(record.state)) return 2;
  return 0;
}

export function passChallenge(record: MissionProgress, index: number, now = new Date()): MissionProgress {
  if (index !== challengeIndex(record)) return record;
  if (record.state === "LEARNING") return applyMissionEvent(record, { type: "LEARNING_COMPLETED" });
  if (record.state === "PRACTICING") return applyMissionEvent(record, { type: "PRACTICE_GATES_MET" });
  if (record.state === "BOSS_READY") return applyMissionEvent(record, { type: "BOSS_PASSED", occurredAt: now.toISOString() });
  if (record.state === "TARGETED_REVIEW") record = applyMissionEvent(record, { type: "TARGETED_REVIEW_COMPLETED" });
  if (record.state === "DELAYED_CHECK_DUE") return applyMissionEvent(record, { type: "DELAYED_CHECK_PASSED", occurredAt: now.toISOString() });
  return record; // Replays do not overwrite earned progress or reset the retention clock.
}

export function hasBadge(record: MissionProgress): boolean {
  return Boolean(record.provisionalMasteryAt) || record.state === "MASTERED";
}
