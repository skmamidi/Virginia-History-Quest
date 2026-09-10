import data from './virginiaExplorePlaces.json';
export type ExplorePlace = typeof data[number];
export const EXPLORE_PLACES: readonly ExplorePlace[] = data;
export const PLACE_KINDS = ['History', 'Museums & culture', 'Nature'] as const;
export const mapPoint = (at: number[]) => ({ x: 40 + (at[0] + 83.7) * 80, y: 40 + (39.5 - at[1]) * 100 });
export function findPlaces(region: number | null, kind: string, search: string) {
  const words = search.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return EXPLORE_PLACES.filter(p => (region === null || p.region === region) && (!kind || p.kind === kind) &&
    words.every(word => `${p.name} ${p.town} ${p.story}`.toLocaleLowerCase().includes(word)));
}
