import { MISSION_IDS, type MissionId } from '../../contexts/published-content/domain/mission';
export const STORY_STORAGE_KEY = 'virginia-history-quest:stories:v1';
export interface StoryProgress { scene: number; explored: number[]; finished: boolean }
export type StoryProgressMap = Partial<Record<MissionId, StoryProgress>>;
export const freshStory = (): StoryProgress => ({ scene: 0, explored: [0], finished: false });
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;
export function createStoryStore(storage?: Storage) {
  return {
    load(): StoryProgressMap {
      try {
        const raw: unknown = JSON.parse(storage?.getItem(STORY_STORAGE_KEY) ?? '{}');
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
        const result: StoryProgressMap = {};
        for (const id of MISSION_IDS) {
          const value = (raw as Record<string, unknown>)[id];
          if (!value || typeof value !== 'object') continue;
          const v = value as Record<string, unknown>;
          if (!Number.isInteger(v.scene) || Number(v.scene) < 0 || Number(v.scene) > 2 || !Array.isArray(v.explored)) continue;
          const explored = [...new Set(v.explored.filter((n): n is number => Number.isInteger(n) && n >= 0 && n <= 2))];
          if (!explored.includes(Number(v.scene))) explored.push(Number(v.scene));
          result[id] = { scene: Number(v.scene), explored, finished: v.finished === true && explored.length === 3 };
        }
        return result;
      } catch { return {}; }
    },
    save(value: StoryProgressMap): boolean {
      try { if (!storage) return false; storage.setItem(STORY_STORAGE_KEY, JSON.stringify(value)); return true; }
      catch { return false; }
    },
  };
}
