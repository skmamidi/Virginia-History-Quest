import { ArrowLeft, BookOpen, Compass, Map, MapPin, NotebookPen } from 'lucide-react';
import { HOME_ROUTE, parentRoute, routeHash, type JourneyRoute } from '../useJourneyNavigation';
const SECTIONS = [
  { kind: 'home', label: 'Quest map', Icon: Map }, { kind: 'missions', label: 'Missions', Icon: BookOpen },
  { kind: 'maps', label: 'Map lab', Icon: Compass }, { kind: 'trips', label: 'Field trips', Icon: MapPin },
  { kind: 'scrapbook', label: 'Scrapbook', Icon: NotebookPen },
] as const;
export function routeLabel(route: JourneyRoute, missionTitle: (id: string) => string): string {
  if (route.kind === 'mission') return missionTitle(route.missionId);
  if (route.kind === 'practice') return 'SOL practice';
  if (route.kind === 'story') return 'Explore the story';
  return SECTIONS.find(s => s.kind === route.kind)?.label ?? 'Quest map';
}
export function JourneyNavigation({ route, navigate }: { route: JourneyRoute; navigate: (route: JourneyRoute) => void }) {
  const active = ['mission', 'practice', 'story'].includes(route.kind) ? 'missions' : route.kind;
  return <nav className="journey-navigation" aria-label="Explore Virginia">{SECTIONS.map(({ kind, label, Icon }) => <a key={kind} href={routeHash({ kind })} aria-current={kind === active ? 'page' : undefined} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); navigate({ kind }); }}><Icon aria-hidden="true" /><span>{label}</span></a>)}</nav>;
}
export function JourneyWayfinding({ route, from, back, navigate, missionTitle }: { route: JourneyRoute; from: JourneyRoute | null; back: () => void; navigate: (route: JourneyRoute) => void; missionTitle: (id: string) => string }) {
  const parent = from ?? parentRoute(route);
  const trail: JourneyRoute[] = [HOME_ROUTE];
  if (route.kind === 'mission' || route.kind === 'practice' || route.kind === 'story') trail.push({ kind: 'missions' });
  if (route.kind === 'practice' || route.kind === 'story') trail.push({ kind: 'mission', missionId: route.missionId });
  return <div className="journey-wayfinding"><button type="button" className="journey-back" onClick={back}><ArrowLeft aria-hidden="true" />Back to {routeLabel(parent, missionTitle).toLowerCase() === 'quest map' ? 'quest map' : routeLabel(parent, missionTitle)}</button><nav aria-label="You are here"><ol>{trail.map(r => <li key={routeHash(r)}><a href={routeHash(r)} onClick={e => { e.preventDefault(); navigate(r); }}>{routeLabel(r, missionTitle)}</a></li>)}<li aria-current="page">{routeLabel(route, missionTitle)}</li></ol></nav></div>;
}
