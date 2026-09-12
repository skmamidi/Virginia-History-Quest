import { describe, expect, it } from 'vitest';
import { isScienceAnswerCorrect, mixedScienceReview, SCIENCE_TOPIC_IDS, type ScienceQuestion } from './science';
import { SCIENCE_TOPICS } from '../adapters/scienceLessons';
import { SCIENCE_QUESTIONS } from '../adapters/scienceQuestions';

describe('science learning content', () => {
  it('provides complete, sourced trails and unambiguous answer keys', () => {
    expect(SCIENCE_TOPICS.map(t => t.id)).toEqual([...SCIENCE_TOPIC_IDS]);
    expect(SCIENCE_QUESTIONS).toHaveLength(48);
    expect(new Set(SCIENCE_QUESTIONS.map(q => q.id)).size).toBe(48);
    for (const topic of SCIENCE_TOPICS) {
      expect(topic.sections.length).toBeGreaterThanOrEqual(4);
      expect(topic.sources.every(s => s.url.startsWith('https://'))).toBe(true);
      const questions = SCIENCE_QUESTIONS.filter(q => q.topicId === topic.id);
      expect(questions).toHaveLength(6);
      for (const q of questions) {
        expect(topic.standards.some(s => s.code === q.standard)).toBe(true);
        expect(new Set(q.choices).size).toBe(q.choices.length);
        expect(q.answer.every(a => Number.isInteger(a) && a >= 0 && a < q.choices.length)).toBe(true);
        expect(isScienceAnswerCorrect(q, q.answer)).toBe(true);
        expect(q.hint.length).toBeGreaterThan(20);
        expect(q.explanation.length).toBeGreaterThan(40);
        if (q.kind === 'order') expect([...q.answer].sort()).toEqual(q.choices.map((_, i) => i));
        if (q.kind === 'single') expect(q.answer).toHaveLength(1);
      }
    }
  });
  it('requires exact selections for multiple answers and exact order for sequences', () => {
    const q: ScienceQuestion = { ...SCIENCE_QUESTIONS[0], kind: 'multiple', answer: [0, 2] };
    expect(isScienceAnswerCorrect(q, [2, 0])).toBe(true);
    expect(isScienceAnswerCorrect(q, [0])).toBe(false);
    expect(isScienceAnswerCorrect(q, [0, 2, 1])).toBe(false);
    expect(isScienceAnswerCorrect(q, [0, 0])).toBe(false);
    expect(isScienceAnswerCorrect({ ...q, kind: 'order' }, [2, 0])).toBe(false);
  });
  it('builds a balanced review without duplicate questions', () => {
    const questions = mixedScienceReview(SCIENCE_QUESTIONS, () => 0.4);
    expect(new Set(questions.map(q => q.id)).size).toBe(16);
    for (const id of SCIENCE_TOPIC_IDS) expect(questions.filter(q => q.topicId === id)).toHaveLength(2);
  });
});
