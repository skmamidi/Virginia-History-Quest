import { SOL_PRACTICE } from "../../published-content/adapters/solPractice";
import type { MissionId } from "../../published-content/domain/mission";

export const PRACTICE_STORAGE_KEY = "virginia-history-quest:sol-practice:v1";
export const practiceKey = (missionId: MissionId, trailId: string, index: number) =>
  [missionId, trailId, index].join(":");

const validKeys = new Set(Object.entries(SOL_PRACTICE).flatMap(([mission, trails]) =>
  trails.flatMap(trail => trail.questions.map((_, index) => practiceKey(mission as MissionId, trail.id, index)))));
export function readPracticeProgress(storage: Pick<Storage, "getItem">): string[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(PRACTICE_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? [...new Set(value.filter((key): key is string => typeof key === "string" && validKeys.has(key)))] : [];
  } catch { return []; }
}
