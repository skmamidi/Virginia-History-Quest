import { MISSION_STORIES } from '../../contexts/published-content/adapters/missionStories';
import { SOL_PRACTICE, SOL_FACT_CHECK_SOURCES } from '../../contexts/published-content/adapters/solPractice';
import { MISSION_IDS, type MissionId } from '../../contexts/published-content/domain/mission';
import { SCIENCE_TOPICS } from '../../contexts/published-content/adapters/scienceLessons';
import { FIELD_TRIP_CHAPTERS } from '../../contexts/published-content/adapters/fieldTrips';
import { MAP_TOPICS } from '../../contexts/published-content/adapters/mapLabData';
import { REGION_LESSONS } from '../../contexts/published-content/adapters/schoolMaterials';
import { CLIMATE_CAUSES } from '../../contexts/published-content/adapters/climateLessons';
import type { QuizQuestion } from '../quizzes/questionBank';

export interface ReadingSection { title: string; text: string }
export function readingFor(q: QuizQuestion) {
  const originalHref = q.lessonHref ?? q.href;
  const [, kind, id] = originalHref.split('/');
  const missionId = kind === 'story' && MISSION_IDS.includes(id as MissionId) ? id as MissionId : undefined;
  const science = kind === 'science' ? SCIENCE_TOPICS.find(t => t.id === id) : undefined;
  const trip = kind === 'trips' ? FIELD_TRIP_CHAPTERS[Number(id)] : undefined;
  const map = kind === 'maps' ? MAP_TOPICS.find(t => t.id === id) : undefined;
  const story = missionId ? MISSION_STORIES[missionId] : undefined;
  const sections: ReadingSection[] = story ? [
    ...story.scenes.map(s => ({ title: s.title, text: `${s.narrative} ${s.discovery} ${s.word}: ${s.definition}` })),
    ...SOL_PRACTICE[missionId!].map(t => ({ title: t.title, text: t.lesson })),
  ] : science ? [
    { title: science.question, text: science.intro }, ...science.sections,
    { title: 'Words to know', text: science.vocabulary.map(v => `${v.term}: ${v.meaning}`).join(' ') },
    { title: 'Clear up a mix-up', text: `${science.misconception.idea} ${science.misconception.explanation}` },
  ] : trip ? [
    ...trip.places.map(p => ({ title: `${p.name} · ${p.date}`, text: `${p.clue} ${p.notice}` })),
    { title: 'Connect the places', text: trip.connection },
  ] : map ? [
    { title: map.title, text: map.intro },
    ...(map.id === 'regions' ? REGION_LESSONS.map(r => ({ title: r.name, text: `${r.location} ${r.landscape} ${r.notice} ${r.word}` })) : []),
    ...(map.id === 'climate' ? Object.values(CLIMATE_CAUSES).flat().map(c => ({ title: c.title, text: `${c.why} ${c.connection}` })) : []),
    ...(map.id === 'population' ? [{ title: 'Compare equal areas', text: 'Population is the number of residents. Density divides that number by land area, so a smaller place can have fewer residents but a higher density. Compare equal squares on a map, then check the date and legend. The map lab uses 2020 Census data. Independent cities in Virginia are separate from counties.' }] : []),
    ...(map.id === 'tools' ? [{ title: 'A map detective’s toolkit', text: 'Read the title to learn what the map shows. A legend explains symbols and colors. The compass rose gives directions. A scale connects map distance to ground distance. Check the date before comparing data. A physical map shows landforms; a political map emphasizes borders. A diagram is not necessarily drawn to scale.' }] : []),
  ] : [];
  const sources = story ? [story.source, ...(SOL_FACT_CHECK_SOURCES[missionId!] ?? [])] : science ? science.sources : trip ? trip.places.map(p => p.source) : map?.id === 'climate' ? Object.values(CLIMATE_CAUSES).flat().map(c => ({ label: c.sourceLabel, url: c.source })) : map ? [{ label: 'USGS: Virginia’s regions and groundwater', url: 'https://pubs.usgs.gov/ha/ha730/ch_l/L-text1.html' }, { label: 'U.S. Census Bureau: 2020 Virginia population', url: 'https://tigerweb.geo.census.gov/tigerwebmain/Files/bas25/tigerweb_bas25_county_2020_tab20_va.html' }] : [];
  return { originalHref, missionId, science, trip, map, story, sections, sources };
}

/** Each question keeps its published supporting explanation and original lesson.
 * This is a coverage contract, not a substitute for historical/scientific review. */
export function supportingReading(q: QuizQuestion): ReadingSection[] {
  return [
    ...(q.context ? [{ title: 'Set the scene', text: q.context }] : []),
    { title: 'The connection to understand', text: q.explanation },
  ];
}
