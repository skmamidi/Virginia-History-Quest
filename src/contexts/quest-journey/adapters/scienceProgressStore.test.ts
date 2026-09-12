import { expect, it } from 'vitest';
import { loadScienceProgress, saveScienceProgress, SCIENCE_PROGRESS_KEY } from './scienceProgressStore';

it('accepts only known, unique science discoveries and preserves unrelated keys', () => {
  const data = new Map([['history', 'unchanged']]);
  const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
  data.set(SCIENCE_PROGRESS_KEY, '["watersheds:land", "unknown", "watersheds:land", null]');
  expect(loadScienceProgress(storage)).toEqual(['watersheds:land']);
  expect(saveScienceProgress(storage, ['energy:solar', 'energy:solar', 'unknown'])).toBe(true);
  expect(loadScienceProgress(storage)).toEqual(['energy:solar']);
  expect(data.get('history')).toBe('unchanged');
  data.set(SCIENCE_PROGRESS_KEY, '{');
  expect(loadScienceProgress(storage)).toEqual([]);
});
it('keeps unavailable storage from interrupting learning', () => {
  expect(loadScienceProgress(undefined)).toEqual([]);
  expect(saveScienceProgress(undefined, [])).toBe(false);
  const denied = { getItem() { throw Error('denied'); }, setItem() { throw Error('denied'); } };
  expect(loadScienceProgress(denied)).toEqual([]);
  expect(saveScienceProgress(denied, ['watersheds:land'])).toBe(false);
});
