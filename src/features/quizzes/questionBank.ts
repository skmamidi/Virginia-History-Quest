import { MISSION_CATALOG } from '../../contexts/published-content/adapters/missionCatalog';
import { MISSION_ACTIVITIES } from '../../contexts/published-content/adapters/missionActivities';
import { SOL_PRACTICE } from '../../contexts/published-content/adapters/solPractice';
import { SCIENCE_QUESTIONS } from '../../contexts/published-content/adapters/scienceQuestions';
import { SCIENCE_TOPICS } from '../../contexts/published-content/adapters/scienceLessons';
import { FIELD_TRIP_CHAPTERS } from '../../contexts/published-content/adapters/fieldTrips';
import { MAP_QUESTIONS } from '../../contexts/published-content/adapters/schoolMaterials';
import { MAP_TOPICS } from '../../contexts/published-content/adapters/mapLabData';
import { DAILY_MAP_RETRIEVAL } from '../../contexts/published-content/adapters/retrievalCatalog';
import type { ScienceTable } from '../../contexts/published-content/domain/science';

export interface QuizQuestion {
  id: string; topic: string; source: string; prompt: string;
  kind: 'single' | 'multiple' | 'order'; choices: readonly string[]; answer: readonly number[];
  explanation: string; href: string; lessonTitle: string; lessonHref?: string; context?: string; table?: ScienceTable;
}
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function isCorrect(q: QuizQuestion, selection: readonly number[]) {
  return selection.length === q.answer.length && new Set(selection).size === selection.length &&
    q.answer.every((value, i) => q.kind === 'order' ? selection[i] === value : selection.includes(value));
}
const publishedQuestions: readonly QuizQuestion[] = [
  ...MISSION_CATALOG.missions.flatMap(m => {
    const shared = { topic: `${m.id} · ${m.shortTitle}`, href: `#/story/${m.id}`, lessonTitle: m.title };
    return [
      ...MISSION_ACTIVITIES[m.id].challenges.map((q, i): QuizQuestion => ({ ...shared, ...q, id: `mission:${m.id}:${i}`, source: 'Mission', kind: q.kind ?? 'single', answer: q.kind === 'order' ? q.choices.map((_, j) => j) : [q.answer] })),
      ...SOL_PRACTICE[m.id].flatMap(t => t.questions.map((q, i): QuizQuestion => ({ ...shared, ...q, id: `practice:${m.id}:${t.id}:${i}`, source: `SOL practice · ${t.title}`, kind: q.kind ?? 'single', answer: q.kind === 'order' ? q.choices.map((_, j) => j) : [q.answer], context: t.lesson }))),
    ];
  }),
  ...SCIENCE_QUESTIONS.map((q): QuizQuestion => ({ ...q, topic: `Science · ${SCIENCE_TOPICS.find(t => t.id === q.topicId)!.title}`, source: `Science SOL ${q.standard}`, href: `#/science/${q.topicId}`, lessonTitle: SCIENCE_TOPICS.find(t => t.id === q.topicId)!.title })),
  ...MAP_TOPICS.flatMap(t => MAP_QUESTIONS[t.id].map((q, i): QuizQuestion => ({ id: `map:${t.id}:${i}`, topic: `Map lab · ${t.label}`, source: 'Map lab', prompt: q.question, choices: q.choices, answer: [q.answer], kind: 'single', explanation: q.why, href: `#/maps/${t.id}`, lessonTitle: t.title }))),
  ...FIELD_TRIP_CHAPTERS.map((q, i): QuizQuestion => ({ id: `trip:${q.id}`, topic: 'Field trips', source: q.title, prompt: q.question, choices: q.choices, answer: [q.answer], kind: 'single', explanation: q.connection, href: `#/trips/${i}`, lessonTitle: q.title })),
  { id: DAILY_MAP_RETRIEVAL.id, topic: `VS.3 · ${MISSION_CATALOG.missions.find(m => m.id === 'VS.3')!.shortTitle}`, source: 'Daily map clue', prompt: DAILY_MAP_RETRIEVAL.prompt, choices: DAILY_MAP_RETRIEVAL.choices, answer: [DAILY_MAP_RETRIEVAL.choices.indexOf(DAILY_MAP_RETRIEVAL.correctChoice)], kind: 'single', explanation: DAILY_MAP_RETRIEVAL.feedbackByChoice[DAILY_MAP_RETRIEVAL.correctChoice], href: '#/story/VS.3', lessonTitle: 'Jamestown' },
];

export const QUESTION_BANK: readonly QuizQuestion[] = publishedQuestions.map(q => ({ ...q, lessonHref: q.href, href: `#/reading/${encodeURIComponent(q.id)}` }));
