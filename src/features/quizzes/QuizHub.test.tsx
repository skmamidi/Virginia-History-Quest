import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import QuizHub from './QuizHub';
import { QUESTION_BANK, isCorrect, shuffle, type QuizQuestion } from './questionBank';
import { MISSION_ACTIVITIES } from '../../contexts/published-content/adapters/missionActivities';
import { SOL_PRACTICE } from '../../contexts/published-content/adapters/solPractice';
import { SCIENCE_QUESTIONS } from '../../contexts/published-content/adapters/scienceQuestions';
import { MAP_QUESTIONS } from '../../contexts/published-content/adapters/schoolMaterials';
import { FIELD_TRIP_CHAPTERS } from '../../contexts/published-content/adapters/fieldTrips';
import { parseRoute, routeHash } from '../quest-map/useJourneyNavigation';

const questions: QuizQuestion[] = [
  { id: 'one', topic: 'Rivers', source: 'Mission', prompt: 'Pick the river', kind: 'single', choices: ['James', 'Mountain'], answer: [0], explanation: 'James is a river.', href: '#/story/VS.3', lessonTitle: 'Jamestown' },
  { id: 'two', topic: 'Rocks', source: 'Science', prompt: 'Pick the rock', kind: 'single', choices: ['Granite', 'Tree'], answer: [0], explanation: 'Granite is a rock.', href: '#/science/rocks', lessonTitle: 'Rocks' },
];
describe('all quizzes', () => {
  it('includes every published scored question and valid context links', () => {
    const count = Object.values(MISSION_ACTIVITIES).reduce((n, m) => n + m.challenges.length, 0)
      + Object.values(SOL_PRACTICE).flat().reduce((n, t) => n + t.questions.length, 0)
      + SCIENCE_QUESTIONS.length + Object.values(MAP_QUESTIONS).flat().length + FIELD_TRIP_CHAPTERS.length + 1;
    expect(QUESTION_BANK).toHaveLength(count);
    expect(new Set(QUESTION_BANK.map(q => q.id)).size).toBe(count);
    for (const q of QUESTION_BANK) {
      expect(routeHash(parseRoute(q.href))).toBe(q.href);
      expect(q.answer.every(i => i >= 0 && i < q.choices.length)).toBe(true);
      expect(isCorrect(q, q.answer)).toBe(true);
    }
  });
  it('shuffles without losing or changing questions and grades all formats', () => {
    expect(shuffle(questions, () => 0)).toEqual([...questions].reverse());
    expect(shuffle(questions, () => .99)).toEqual(questions);
    const multi = { ...questions[0], kind: 'multiple' as const, answer: [0, 1] };
    expect(isCorrect(multi, [1, 0])).toBe(true);
    expect(isCorrect(multi, [0, 0])).toBe(false);
    expect(isCorrect({ ...multi, kind: 'order' }, [1, 0])).toBe(false);
  });
  it('summarizes first answers, retries only mistakes, resets, and starts fresh on remount', async () => {
    const user = userEvent.setup();
    const view = render(<QuizHub questions={questions} />);
    await user.click(screen.getByRole('button', { name: 'Start quiz' }));
    for (let i = 0; i < 2; i++) {
      const river = !!screen.queryByRole('heading', { name: 'Pick the river' });
      await user.click(screen.getByRole('radio', { name: river ? 'Mountain' : 'Granite' }));
      expect(screen.getByRole('link', { name: /Read the background/ })).toHaveAttribute('target', '_blank');
      await user.click(screen.getByRole('button', { name: 'Check my answer' }));
      expect(screen.getByText(`Question ${i + 1} of 2`)).toBeVisible();
      expect(screen.getByRole('status')).toHaveTextContent(river ? 'this answer is incorrect' : 'Correct!');
      expect(screen.getByRole('status')).toHaveTextContent(river ? 'James is a river.' : 'Granite is a rock.');
      expect(screen.getByRole('radio', { name: river ? 'James' : 'Tree' })).toBeDisabled();
      expect(screen.queryByRole('heading', { name: 'Your quiz summary' })).not.toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /Next question|See quiz summary/ }));
    }
    expect(screen.getByText('1 correct · 1 wrong · 2 total')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Retake just the 1 wrong question' }));
    expect(screen.getByText('Question 1 of 1')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Pick the river' })).toBeVisible();
    expect(screen.getByRole('radio', { name: 'Mountain' })).not.toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'James' }));
    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    await user.click(screen.getByRole('button', { name: /Next question|See quiz summary/ }));
    expect(screen.getByText('1 correct · 0 wrong · 1 total')).toBeVisible();
    expect(screen.queryByRole('button', { name: /Retake just/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Reset quiz & clear results' }));
    expect(screen.queryByRole('region', { name: 'Review your answers' })).not.toBeInTheDocument();
    expect(screen.getByText('2 questions ready')).toBeVisible();
    view.unmount();
    render(<QuizHub questions={questions} />);
    expect(screen.getByRole('button', { name: 'Start quiz' })).toBeVisible();
    expect(screen.queryByText(/correct ·/)).not.toBeInTheDocument();
  });
  it('filters the directory and quiz, and clears an active attempt on topic change', async () => {
    const user = userEvent.setup();
    render(<QuizHub questions={questions} />);
    await user.selectOptions(screen.getByLabelText('Filter by topic'), 'Rivers');
    expect(screen.getByText('1 question ready')).toBeVisible();
    await user.click(screen.getByText('Browse all 1 question'));
    expect(screen.getByRole('heading', { name: 'Pick the river' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Pick the rock' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start quiz' }));
    await user.click(screen.getByRole('radio', { name: 'James' }));
    await user.selectOptions(screen.getByLabelText('Filter by topic'), 'Rocks');
    await user.click(screen.getByRole('button', { name: 'Start quiz' }));
    expect(screen.getByRole('heading', { name: 'Pick the rock' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Check my answer' })).toBeDisabled();
  });
  it('supports multiple answers, ordered answers, and data tables', async () => {
    const user = userEvent.setup();
    const q: QuizQuestion = { ...questions[0], kind: 'multiple', answer: [0, 1], table: { caption: 'Evidence', headings: ['Place', 'Count'], rows: [['River', '2']] } };
    const view = render(<QuizHub questions={[q]} />);
    await user.click(screen.getByRole('button', { name: 'Start quiz' }));
    expect(within(screen.getByRole('table')).getByText('River')).toBeVisible();
    await user.click(screen.getByRole('checkbox', { name: 'James' }));
    expect(screen.getByRole('button', { name: 'Check my answer' })).toBeDisabled();
    await user.click(screen.getByRole('checkbox', { name: 'Mountain' }));
    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    await user.click(screen.getByRole('button', { name: /Next question|See quiz summary/ }));
    expect(screen.getByText('1 correct · 0 wrong · 1 total')).toBeVisible();
    view.unmount();
    render(<QuizHub questions={[{ ...q, kind: 'order' }]} />);
    await user.click(screen.getByRole('button', { name: 'Start quiz' }));
    await user.click(screen.getByRole('button', { name: 'Mountain' }));
    await user.click(screen.getByRole('button', { name: 'Clear steps' }));
    await user.click(screen.getByRole('button', { name: 'James' }));
    await user.click(screen.getByRole('button', { name: 'Mountain' }));
    await user.click(screen.getByRole('button', { name: 'Check my answer' }));
    await user.click(screen.getByRole('button', { name: /Next question|See quiz summary/ }));
    expect(screen.getByText('1 correct · 0 wrong · 1 total')).toBeVisible();
  });
});
