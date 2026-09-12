import { SCIENCE_QUESTIONS } from '../../published-content/adapters/scienceQuestions';

export const SCIENCE_PROGRESS_KEY = 'virginia-history-quest:science:v1';
const knownIds = new Set(SCIENCE_QUESTIONS.map(q => q.id));
export interface ScienceStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export function loadScienceProgress(storage: ScienceStorage | undefined): string[] {
  try {
    const value: unknown = JSON.parse(storage?.getItem(SCIENCE_PROGRESS_KEY) ?? '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && knownIds.has(id)))] : [];
  } catch { return []; }
}
export function saveScienceProgress(storage: ScienceStorage | undefined, ids: readonly string[]): boolean {
  try {
    if (!storage) return false;
    storage.setItem(SCIENCE_PROGRESS_KEY, JSON.stringify([...new Set(ids.filter(id => knownIds.has(id)))]));
    return true;
  } catch { return false; }
}
export function browserScienceStorage(): ScienceStorage | undefined {
  try { return window.localStorage; } catch { return undefined; }
}
