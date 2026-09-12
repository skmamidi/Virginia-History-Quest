import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import SciencePage from './SciencePage';
import { SCIENCE_QUESTIONS } from '../../contexts/published-content/adapters/scienceQuestions';
import { SCIENCE_PROGRESS_KEY } from '../../contexts/quest-journey/adapters/scienceProgressStore';

let data: Map<string, string>;
beforeEach(() => {
  data = new Map();
  vi.stubGlobal('localStorage', { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } });
});
afterEach(() => vi.unstubAllGlobals());

it('filters lessons by grade and exposes the standards and source links accessibly', async () => {
  const user = userEvent.setup();
  const { container } = render(<SciencePage onTopic={() => {}} />);
  expect(screen.getAllByRole('button', { name: /^Explore lesson:/ })).toHaveLength(8);
  await user.click(screen.getByRole('button', { name: 'Grade 5' }));
  expect(screen.getAllByRole('button', { name: /^Explore lesson:/ })).toHaveLength(5);
  expect(screen.queryByRole('button', { name: 'Explore lesson: Follow the water' })).toBeNull();
  expect(screen.getByRole('link', { name: /VDOE grade 5 science test blueprint/ })).toHaveAttribute('href', expect.stringContaining('15808'));
  expect((await axe(container)).violations).toEqual([]);
});

it('supports retries, saves only correct answers, and resumes after reloading', async () => {
  const user = userEvent.setup();
  const view = render(<SciencePage topicId="watersheds" onTopic={() => {}} />);
  await user.click(screen.getByRole('button', { name: 'Practice 6 questions' }));
  expect(screen.getByRole('button', { name: 'Check my answer' })).toBeDisabled();
  await user.click(screen.getByRole('radio', { name: 'Only the water inside the creek' }));
  await user.click(screen.getByRole('button', { name: 'Check my answer' }));
  expect(screen.getByRole('status')).toHaveTextContent('Keep investigating');
  expect(data.has(SCIENCE_PROGRESS_KEY)).toBe(false);
  await user.click(screen.getByRole('radio', { name: 'All the land draining surface water to the creek’s outlet' }));
  await user.click(screen.getByRole('button', { name: 'Check my answer' }));
  expect(JSON.parse(data.get(SCIENCE_PROGRESS_KEY)!)).toEqual(['watersheds:land']);
  view.unmount();
  render(<SciencePage topicId="watersheds" onTopic={() => {}} />);
  await user.click(screen.getByRole('button', { name: 'Continue practice · 5 remaining' }));
  expect(screen.getByRole('heading', { name: SCIENCE_QUESTIONS[1].prompt })).toBeVisible();
});

it('checks multiple answers exactly and supports keyboard-friendly ordering', async () => {
  data.set(SCIENCE_PROGRESS_KEY, JSON.stringify(SCIENCE_QUESTIONS.slice(0, 3).map(q => q.id)));
  const user = userEvent.setup();
  const { container } = render(<SciencePage topicId="watersheds" onTopic={() => {}} />);
  await user.click(screen.getByRole('button', { name: 'Continue practice · 3 remaining' }));
  await user.click(screen.getByRole('checkbox', { name: 'Keep a strip of plants beside the stream' }));
  await user.click(screen.getByRole('button', { name: 'Check my answer' }));
  expect(screen.getByRole('status')).toHaveTextContent('Keep investigating');
  await user.click(screen.getByRole('checkbox', { name: 'Collect litter before it washes away' }));
  await user.click(screen.getByRole('button', { name: 'Check my answer' }));
  await user.click(screen.getByRole('button', { name: 'Next question' }));
  const q = SCIENCE_QUESTIONS[4];
  for (const index of q.answer) await user.click(screen.getByRole('button', { name: `Add step: ${q.choices[index]}` }));
  expect((await axe(container)).violations).toEqual([]);
  await user.click(screen.getByRole('button', { name: 'Check my answer' }));
  expect(screen.getByRole('status')).toHaveTextContent('You found it');
});

it('finishes mixed review, defers explanations, and offers targeted retry', () => {
  render(<SciencePage onTopic={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Start 16-question review' }));
  const missed: string[] = [];
  for (let i = 0; i < 16; i++) {
    const question = SCIENCE_QUESTIONS.find(q => screen.queryByRole('heading', { name: q.prompt }))!;
    const selected = i === 0 ? (question.kind === 'order' ? [...question.answer].reverse() : [(question.answer[0] + 1) % question.choices.length]) : question.answer;
    if (i === 0) missed.push(question.prompt);
    for (const index of selected) {
      const role = question.kind === 'single' ? 'radio' : question.kind === 'multiple' ? 'checkbox' : 'button';
      fireEvent.click(screen.getByRole(role, { name: question.kind === 'order' ? `Add step: ${question.choices[index]}` : question.choices[index] }));
    }
    expect(screen.queryByText(question.explanation)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: i === 15 ? 'Finish review' : 'Save answer & next' }));
  }
  expect(screen.getByRole('heading', { name: '15 of 16 correct' })).toBeVisible();
  const results = screen.getByRole('region', { name: 'Review your answers' });
  expect(within(results).getAllByText(/Your answer:/)).toHaveLength(16);
  fireEvent.click(screen.getByRole('button', { name: 'Practice 1 missed question' }));
  expect(screen.getByRole('heading', { name: missed[0] })).toBeVisible();
});

it('shows a save warning and still completes practice when storage fails', () => {
  vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => { throw Error('full'); } });
  render(<SciencePage topicId="watersheds" onTopic={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Practice 6 questions' }));
  fireEvent.click(screen.getByRole('radio', { name: SCIENCE_QUESTIONS[0].choices[1] }));
  fireEvent.click(screen.getByRole('button', { name: 'Check my answer' }));
  expect(screen.getByRole('alert')).toHaveTextContent('could not save');
  expect(screen.getByRole('button', { name: 'Next question' })).toBeEnabled();
});
