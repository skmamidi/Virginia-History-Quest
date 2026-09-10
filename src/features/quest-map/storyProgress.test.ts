import { expect, it } from 'vitest';
import { createStoryStore, STORY_STORAGE_KEY } from './storyProgress';
it('saves and restores story position without touching quiz or scrapbook storage', () => {
  const values = new Map([['quiz', 'existing badges'], ['scrapbook', 'existing photos']]);
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const store = createStoryStore(storage);
  const progress = { 'VS.2': { scene: 1, explored: [0, 1], finished: false }, 'VS.11': { scene: 2, explored: [0, 1, 2], finished: true } };
  expect(store.save(progress)).toBe(true);
  expect(createStoryStore(storage).load()).toEqual(progress);
  expect(values.get('quiz')).toBe('existing badges');
  expect(values.get('scrapbook')).toBe('existing photos');
  expect([...values.keys()]).toHaveLength(3);
  expect(values.has(STORY_STORAGE_KEY)).toBe(true);
});
it('rejects corrupt data and invalid completion while tolerating blocked storage', () => {
  expect(createStoryStore({ getItem: () => '{oops', setItem: () => {} }).load()).toEqual({});
  const raw = { 'VS.1': { scene: 0, explored: [0, 0, 99, '1'], finished: true }, 'VS.2': { scene: 900, explored: [0] }, 'VS.99': { scene: 0, explored: [0] } };
  expect(createStoryStore({ getItem: () => JSON.stringify(raw), setItem: () => {} }).load()).toEqual({ 'VS.1': { scene: 0, explored: [0], finished: false } });
  const blocked = createStoryStore({ getItem: () => { throw Error('blocked'); }, setItem: () => { throw Error('full'); } });
  expect(blocked.load()).toEqual({});
  expect(blocked.save({})).toBe(false);
  expect(createStoryStore().save({})).toBe(false);
});
