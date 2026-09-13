import { MAP_TOPICS, type MapTopic } from '../../contexts/published-content/adapters/mapLabData';
import { FIELD_TRIP_CHAPTERS } from '../../contexts/published-content/adapters/fieldTrips';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MISSION_IDS, type MissionId } from '../../contexts/published-content/domain/mission';
import { SCIENCE_TOPIC_IDS, type ScienceTopicId } from '../../contexts/published-content/domain/science';
export type JourneyRoute = { kind: 'home' | 'missions' | 'quizzes' | 'scrapbook' } | { kind: 'maps'; topicId?: MapTopic } | { kind: 'trips'; chapter?: number } | { kind: 'science'; topicId?: ScienceTopicId } | { kind: 'mission' | 'practice' | 'story'; missionId: MissionId };
export const HOME_ROUTE: JourneyRoute = { kind: 'home' };
export function routeHash(route: JourneyRoute) {
  return `#/${route.kind}${'missionId' in route ? `/${route.missionId}` : (route.kind === 'science' || route.kind === 'maps') && route.topicId ? `/${route.topicId}` : route.kind === 'trips' && route.chapter !== undefined ? `/${route.chapter}` : ''}`;
}
export function parseRoute(hash: string): JourneyRoute {
  const [kind, id] = hash.replace(/^#\//, '').split('/');
  if (kind === 'maps') return MAP_TOPICS.some(t => t.id === id) ? { kind, topicId: id as MapTopic } : { kind };
  if (kind === 'trips') return id !== undefined && /^\d+$/.test(id) && Number(id) < FIELD_TRIP_CHAPTERS.length ? { kind, chapter: Number(id) } : { kind };
  if (kind === 'science') return SCIENCE_TOPIC_IDS.includes(id as ScienceTopicId) ? { kind, topicId: id as ScienceTopicId } : { kind };
  if ((kind === 'mission' || kind === 'practice' || kind === 'story') && MISSION_IDS.includes(id as MissionId)) return { kind, missionId: id as MissionId };
  if (['missions', 'quizzes', 'scrapbook'].includes(kind)) return { kind: kind as 'missions' | 'quizzes' | 'scrapbook' };
  return HOME_ROUTE;
}
export function parentRoute(route: JourneyRoute): JourneyRoute {
  if (route.kind === 'science' && route.topicId) return { kind: 'science' };
  if (route.kind === 'practice' || route.kind === 'story') return { kind: 'mission', missionId: route.missionId };
  if (route.kind === 'mission') return { kind: 'missions' };
  return HOME_ROUTE;
}
type Entry = { route: JourneyRoute; from: JourneyRoute | null; scroll: number; focus: string | null; token: string };
const entryKey = 'virginiaJourney';
function readEntry(): Entry | null {
  const value = window.history.state?.[entryKey];
  return value && typeof value.token === 'string' && value.route?.kind && routeHash(value.route) === routeHash(parseRoute(window.location.hash)) ? value : null;
}
export function useJourneyNavigation() {
  const [route, setRoute] = useState<JourneyRoute>(() => parseRoute(window.location.hash));
  const [from, setFrom] = useState<JourneyRoute | null>(() => readEntry()?.from ?? null);
  const current = useRef(route);
  const pendingRestore = useRef<Entry | null>(null);
  useEffect(() => {
    const existing = readEntry();
    if (!existing) window.history.replaceState({ ...window.history.state, [entryKey]: { route: current.current, from: null, scroll: 0, focus: null, token: crypto.randomUUID() } }, '', routeHash(current.current));
    const oldRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    const sync = () => { const next = parseRoute(window.location.hash); current.current = next; pendingRestore.current = readEntry(); setFrom(readEntry()?.from ?? null); setRoute(next); };
    window.addEventListener('popstate', sync); window.addEventListener('hashchange', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); window.history.scrollRestoration = oldRestoration; };
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const restore = pendingRestore.current; pendingRestore.current = null;
      const target = (restore?.focus ? document.getElementById(restore.focus) : null) ?? document.querySelector<HTMLElement>(route.kind === 'home' ? '#quest-map h1' : '#journey-content [data-page-title]' );
      if (target) { if (!target.hasAttribute('tabindex')) target.tabIndex = -1; target.focus({ preventScroll: true }); }
      window.scrollTo({ top: restore?.scroll ?? 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [route]);
  const navigate = useCallback((next: JourneyRoute, replace = false) => {
    if (routeHash(next) === routeHash(current.current)) return;
    const focused = document.activeElement as HTMLElement | null;
    if (focused && !focused.id) focused.id = `journey-return-${crypto.randomUUID()}`;
    const old = readEntry();
    window.history.replaceState({ ...window.history.state, [entryKey]: { ...old, route: current.current, scroll: window.scrollY, focus: focused?.id ?? null, token: old?.token ?? crypto.randomUUID() } }, '');
    const origin = replace ? old?.from ?? null : current.current;
    window.history[replace ? 'replaceState' : 'pushState']({ [entryKey]: { route: next, from: origin, scroll: 0, focus: null, token: crypto.randomUUID() } }, '', routeHash(next));
    pendingRestore.current = null; current.current = next; setFrom(origin); setRoute(next);
  }, []);
  const back = useCallback(() => {
    if (readEntry()?.from) window.history.back();
    else navigate(parentRoute(current.current), true);
  }, [navigate]);
  return { route, from, navigate, back };
}
