import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { beforeEach, expect, it, vi } from 'vitest';
import { MapLab } from './MapLab';
import { Scrapbook } from './Scrapbook';
import { SCRAPBOOK_KEY } from '../../../contexts/scrapbook/adapters/browserScrapbook';
import { MAP_QUESTIONS, REGION_LESSONS } from '../../../contexts/published-content/adapters/schoolMaterials';
import { MAP_TOPICS } from '../../../contexts/published-content/adapters/mapLabData';
import { QuestMapScreen } from '../QuestMapScreen';

let values: Map<string, string>;
beforeEach(() => {
  values = new Map();
  Object.defineProperty(window, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } });
});
it('opens both classroom connections from the home screen', () => {
  render(<QuestMapScreen />);
  fireEvent.click(screen.getByRole('button', { name: /My Virginia scrapbook/ }));
  expect(screen.getByRole('dialog', { name: 'My Virginia scrapbook' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Close My Virginia scrapbook' }));
  fireEvent.click(screen.getByRole('button', { name: /Virginia map lab/ }));
  expect(screen.getByRole('heading', { name: 'Read the landscape' })).toBeVisible();
});
it('saves writing across page changes and reopening, then presents all five pages accessibly', async () => {
  const { unmount, container } = render(<Scrapbook onClose={() => {}} />);
  fireEvent.change(screen.getByLabelText('Historical site'), { target: { value: 'Great Falls Park' } });
  fireEvent.change(screen.getByLabelText(/Why is this place historically important/), { target: { value: 'The canal helped boats move goods.' } });
  fireEvent.click(screen.getByRole('button', { name: /Visit 2 Choose a place/ }));
  expect(screen.getByLabelText('Historical site')).toHaveValue('');
  fireEvent.click(screen.getByRole('button', { name: /Visit 1 Great Falls Park/ }));
  expect(screen.getByLabelText('Historical site')).toHaveValue('Great Falls Park');
  expect((await axe(container)).violations).toEqual([]);
  unmount();
  render(<Scrapbook onClose={() => {}} />);
  expect(screen.getByLabelText('Historical site')).toHaveValue('Great Falls Park');
  fireEvent.click(screen.getByRole('button', { name: 'Preview & present' }));
  expect(screen.getByText('The canal helped boats move goods.')).toBeVisible();
  expect(screen.getAllByRole('article')).toHaveLength(5);
  const print = vi.spyOn(window, 'print').mockImplementation(() => {});
  fireEvent.click(screen.getByRole('button', { name: 'Print / Save as PDF' }));
  expect(print).toHaveBeenCalled(); print.mockRestore();
});
it('warns when saving fails and keeps edits visible', () => {
  window.localStorage.setItem = () => { throw new Error('quota'); };
  render(<Scrapbook onClose={() => {}} />);
  fireEvent.change(screen.getByLabelText('Historical site'), { target: { value: 'My site' } });
  expect(screen.getByRole('alert')).toHaveTextContent('could not be saved');
  expect(screen.getByLabelText('Historical site')).toHaveValue('My site');
});
it('does not silently replace unreadable saved data on opening', () => {
  values.set(SCRAPBOOK_KEY, '{bad');
  render(<Scrapbook onClose={() => {}} />);
  expect(screen.getByRole('alert')).toHaveTextContent('could not be read');
  expect(values.get(SCRAPBOOK_KEY)).toBe('{bad');
});
it('explores all five regions, switches map legends, and gives retry feedback for every practice trail', async () => {
  const { container } = render(<MapLab onClose={() => {}} onScrapbook={() => {}} />);
  for (const region of REGION_LESSONS) {
    fireEvent.click(screen.getByRole('button', { name: `Explore ${region.name}` }));
    expect(screen.getByRole('heading', { name: region.name, level: 3 })).toBeVisible();
  }
  for (const topic of MAP_TOPICS) {
    fireEvent.click(screen.getByRole('button', { name: topic.label }));
    expect((await axe(container)).violations).toEqual([]);
    if (topic.id === 'climate') {
      fireEvent.click(screen.getByRole('button', { name: 'Snowfall patterns' }));
      expect(screen.getByRole('img', { name: 'Virginia snowfall patterns' })).toBeVisible();
    }
    for (const question of MAP_QUESTIONS[topic.id]) {
      const group = within(screen.getByRole('group', { name: 'Map question answers' }));
      expect(screen.getByRole('button', { name: 'Check my answer' })).toBeDisabled();
      fireEvent.click(group.getByRole('button', { name: question.choices[(question.answer + 1) % 3] }));
      fireEvent.click(screen.getByRole('button', { name: 'Check my answer' }));
      expect(screen.getByRole('status')).toHaveTextContent('Not quite');
      fireEvent.click(group.getByRole('button', { name: question.choices[question.answer] }));
      fireEvent.click(screen.getByRole('button', { name: 'Check my answer' }));
      expect(screen.getByRole('status')).toHaveTextContent(question.why);
      fireEvent.click(screen.getByRole('button', { name: /Next map clue|Finish this practice/ }));
    }
    expect(screen.getByRole('heading', { name: 'Map detective discoveries complete!' })).toBeVisible();
  }
});
