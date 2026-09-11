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
  expect(screen.getByRole('region', { name: 'My Virginia scrapbook' })).toBeVisible();
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Explore Virginia' })).getByRole('link', { name: 'Quest map' }));
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
it('explores all five regions', () => {
  render(<MapLab onClose={() => {}} onScrapbook={() => {}} />);
  for (const region of REGION_LESSONS) {
    fireEvent.click(screen.getByRole('button', { name: `Explore ${region.name}` }));
    expect(screen.getByRole('heading', { name: region.name, level: 3 })).toBeVisible();
  }
});

// Keep full-page accessibility scans separate from the 15-question interaction
// tests so the population table scan has its own budget on hosted runners.
it.each(MAP_TOPICS)('makes $label accessible', async (topic) => {
  const { container } = render(<MapLab onClose={() => {}} onScrapbook={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: topic.label }));
  expect((await axe(container)).violations).toEqual([]);
}, 15_000);

it.each(MAP_TOPICS)('completes and replays all $label practice questions with retries', (topic) => {
  render(<MapLab onClose={() => {}} onScrapbook={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: topic.label }));
  if (topic.id === 'climate') {
    fireEvent.click(screen.getByRole('button', { name: 'Snowfall patterns' }));
    expect(screen.getByRole('img', { name: 'Virginia snowfall patterns' })).toBeVisible();
  }
  const questions = MAP_QUESTIONS[topic.id];
  expect(questions.length).toBeGreaterThanOrEqual(15);
  const practice = within(screen.getByRole('region', { name: 'Map practice' }));
  for (const [index, question] of questions.entries()) {
    expect(practice.getByText(`Try it yourself · ${index + 1} of ${questions.length}`)).toBeVisible();
    expect(practice.getByRole('heading', { name: question.question })).toBeVisible();
    // Search only the practice area, avoiding repeated scans of 133 table rows.
    const group = within(practice.getByRole('group', { name: 'Map question answers' }));
    expect(practice.getByRole('button', { name: 'Check my answer' })).toBeDisabled();
    fireEvent.click(group.getByRole('button', { name: question.choices[(question.answer + 1) % 3] }));
    fireEvent.click(practice.getByRole('button', { name: 'Check my answer' }));
    expect(practice.getByRole('status')).toHaveTextContent('Not quite');
    fireEvent.click(group.getByRole('button', { name: question.choices[question.answer] }));
    fireEvent.click(practice.getByRole('button', { name: 'Check my answer' }));
    expect(practice.getByRole('status')).toHaveTextContent(question.why);
    const last = index === questions.length - 1;
    expect(practice.queryByRole('button', { name: last ? 'Next map clue' : 'Finish this practice' })).not.toBeInTheDocument();
    fireEvent.click(practice.getByRole('button', { name: last ? 'Finish this practice' : 'Next map clue' }));
  }
  expect(practice.getByRole('heading', { name: 'Map detective discoveries complete!' })).toBeVisible();
  fireEvent.click(practice.getByRole('button', { name: 'Practice again' }));
  expect(practice.getByText(`Try it yourself · 1 of ${questions.length}`)).toBeVisible();
  expect(practice.getByRole('heading', { name: questions[0].question })).toBeVisible();
  expect(practice.getByRole('button', { name: 'Check my answer' })).toBeDisabled();
}, 15_000);


it('lists all counties and cities, filters names without confusing like-named localities, and highlights the chosen place', () => {
  render(<MapLab onClose={() => {}} onScrapbook={() => {}} />);
  expect(screen.queryByText('About these learning materials')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Population' }));
  const table = within(screen.getByRole('table'));
  expect(table.getAllByRole('row')).toHaveLength(134);
  fireEvent.change(screen.getByLabelText('Show'), { target: { value: 'county' } });
  expect(table.getAllByRole('row')).toHaveLength(96);
  fireEvent.change(screen.getByLabelText('Find a county or city'), { target: { value: 'Fairfax' } });
  expect(table.getByRole('button', { name: 'Fairfax County' })).toBeVisible();
  expect(table.queryByRole('button', { name: 'Fairfax city' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Show'), { target: { value: 'all' } });
  expect(table.getAllByRole('row')).toHaveLength(3);
  fireEvent.click(table.getByRole('button', { name: 'Fairfax city' }));
  expect(screen.getByText('Highlighted on the map: Fairfax city')).toBeVisible();
  fireEvent.change(screen.getByLabelText('Find a county or city'), { target: { value: 'no such county' } });
  expect(screen.getByText(/No matching places/)).toBeVisible();
  fireEvent.change(screen.getByLabelText('Find a county or city'), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText('Show'), { target: { value: 'city' } });
  expect(table.getAllByRole('row')).toHaveLength(39);
});

it('explains changing air pressure and follows moist air through lifting, clouds, and a rain shadow', () => {
  render(<MapLab onClose={() => {}} onScrapbook={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Climate' }));
  expect(screen.getByRole('heading', { name: 'Water slows temperature changes' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '3. Air descends' }));
  expect(screen.getByText(/Air sinking on the other side compresses and warms/)).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Snowfall patterns' }));
  expect(screen.getByRole('heading', { name: 'A valley can sit in a rain shadow' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Snow needs moisture and a cold path down' })).toBeVisible();
});
