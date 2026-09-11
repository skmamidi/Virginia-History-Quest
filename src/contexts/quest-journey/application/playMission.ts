import { MISSION_CATALOG } from "../../published-content/adapters/missionCatalog";
import { MISSION_ACTIVITIES } from "../../published-content/adapters/missionActivities";
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
  const last = MISSION_ACTIVITIES[record.missionId].challenges.length - 1;
  if (["DELAYED_CHECK_DUE", "TARGETED_REVIEW"].includes(record.state)) return last;
  const checkpoint = /^mission-question:(\d+)$/.exec(record.lastMeaningfulStep ?? '');
  const next = checkpoint ? Number(checkpoint[1]) : null;
  if (record.state === "PRACTICING") return next !== null && next >= 1 && next < last ? next : 1;
  // Old three-question records have solved the first two questions. Those stay
  // in place; new questions are inserted before the original final challenge.
  if (record.state === "BOSS_READY") return next === last ? last : 2;
  return 0;
}

export function passChallenge(record: MissionProgress, index: number, now = new Date()): MissionProgress {
  if (index !== challengeIndex(record)) return record;
  const last = MISSION_ACTIVITIES[record.missionId].challenges.length - 1;
  if (record.state === "BOSS_READY" && index < last) {
    record = applyMissionEvent(record, { type: "BOSS_RETRY_NEEDED" });
  }
  if (record.state === "LEARNING" || record.state === "PRACTICING") {
    if (record.state === "LEARNING") record = applyMissionEvent(record, { type: "LEARNING_COMPLETED" });
    if (index === last - 1) record = applyMissionEvent(record, { type: "PRACTICE_GATES_MET" });
    return applyMissionEvent(record, { type: "MEANINGFUL_STEP_REACHED", step: `mission-question:${index + 1}` });
  }
  if (record.state === "BOSS_READY") return applyMissionEvent(record, { type: "BOSS_PASSED", occurredAt: now.toISOString() });
  if (record.state === "TARGETED_REVIEW") record = applyMissionEvent(record, { type: "TARGETED_REVIEW_COMPLETED" });
  if (record.state === "DELAYED_CHECK_DUE") return applyMissionEvent(record, { type: "DELAYED_CHECK_PASSED", occurredAt: now.toISOString() });
  return record; // Replays do not overwrite earned progress or reset the retention clock.
}

export function hasBadge(record: MissionProgress): boolean {
  return Boolean(record.provisionalMasteryAt) || record.state === "MASTERED";
}
