export const SCIENCE_TOPIC_IDS = ['watersheds', 'chesapeake', 'forests', 'soil', 'rocks', 'energy', 'conservation', 'investigations'] as const;
export type ScienceTopicId = typeof SCIENCE_TOPIC_IDS[number];
export type ScienceGrade = 4 | 5;
export interface ScienceTable {
  caption: string;
  headings: readonly string[];
  rows: readonly (readonly string[])[];
}
export interface ScienceQuestion {
  id: string;
  topicId: ScienceTopicId;
  standard: string;
  kind: 'single' | 'multiple' | 'order';
  prompt: string;
  context?: string;
  table?: ScienceTable;
  choices: readonly string[];
  answer: readonly number[];
  hint: string;
  explanation: string;
}
export interface ScienceSource { label: string; url: string }
export interface ScienceTopic {
  id: ScienceTopicId;
  title: string;
  subtitle: string;
  grades: readonly ScienceGrade[];
  standards: readonly { code: string; focus: string }[];
  question: string;
  intro: string;
  sections: readonly { title: string; text: string }[];
  vocabulary: readonly { term: string; meaning: string }[];
  misconception: { idea: string; explanation: string };
  fieldwork: { title: string; steps: readonly string[]; explain: string };
  sources: readonly ScienceSource[];
}

export function isScienceAnswerCorrect(question: ScienceQuestion, selection: readonly number[]): boolean {
  if (selection.length !== question.answer.length || new Set(selection).size !== selection.length) return false;
  return question.kind === 'order'
    ? question.answer.every((value, index) => value === selection[index])
    : question.answer.every(value => selection.includes(value));
}

export function mixedScienceReview(questions: readonly ScienceQuestion[], random = Math.random): ScienceQuestion[] {
  const shuffle = (items: readonly ScienceQuestion[]) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  return shuffle(SCIENCE_TOPIC_IDS.flatMap(id => shuffle(questions.filter(q => q.topicId === id)).slice(0, 2)));
}
