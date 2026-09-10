import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { beforeEach, expect, it, vi } from 'vitest';
import { ScrapbookExplorer } from './ScrapbookExplorer';
import { Scrapbook } from './Scrapbook';
import { EXPLORE_PLACES, findPlaces, mapPoint } from '../../../contexts/published-content/adapters/explorePlaces';
import { REGION_LESSONS } from '../../../contexts/published-content/adapters/schoolMaterials';
import { blankScrapbook, pageForPlace } from '../../../contexts/scrapbook/domain/scrapbook';
import { SCRAPBOOK_KEY } from '../../../contexts/scrapbook/adapters/browserScrapbook';

beforeEach(() => {
  const data = new Map<string, string>();
  Object.defineProperty(window, 'localStorage', { configurable: true, value: { getItem: (key: string) => data.get(key) || null, setItem: (key: string, value: string) => data.set(key, value) } });
});
it('has distinct sourced places in each region, searchable by name, town, and interest', () => {
  expect(EXPLORE_PLACES).toHaveLength(70);
  expect(new Set(EXPLORE_PLACES.map(p => p.id)).size).toBe(70);
  for (const p of EXPLORE_PLACES) {
    expect(REGION_LESSONS[p.region]).toBeDefined();
    expect(new URL(p.url).protocol).toBe('https:');
    expect(mapPoint(p.at).x).toBeGreaterThan(0); expect(mapPoint(p.at).x).toBeLessThan(760);
    expect(mapPoint(p.at).y).toBeGreaterThan(0); expect(mapPoint(p.at).y).toBeLessThan(400);
    expect(p.quest.length).toBeGreaterThan(25); expect(p.story.length).toBeGreaterThan(50);
  }
  for (let i = 0; i < 5; i++) expect(findPlaces(i, '', '').length).toBeGreaterThanOrEqual(5);
  expect(findPlaces(null, '', '  LEESBURG  ')).toHaveLength(3);
  expect(findPlaces(2, 'History', 'mill').map(p => p.id)).toEqual(['mabry']);
});
it('protects unnamed work, opens duplicates, and refuses to overwrite full scrapbooks', () => {
  const book = blankScrapbook(); book.visits[0].history = 'My research';
  expect(pageForPlace(book, 'Mabry Mill')).toEqual({ index: 1, existing: false });
  book.visits[1].photo = 'data:image/jpeg;base64,abc=';
  expect(pageForPlace(book, 'Mabry Mill')).toEqual({ index: 2, existing: false });
  book.visits[2].place = 'Mabry Mill'; book.visits[3].visited = true; book.visits[4].caption = 'A caption';
  expect(pageForPlace(book, '  MABRY MILL  ')).toEqual({ index: 2, existing: true });
  expect(pageForPlace(book, 'New place')).toBeNull();
});
it('filters the whole directory, opens stories and missions, and discovers all five regions', async () => {
  const choose = vi.fn();
  const { container } = render(<ScrapbookExplorer onChoose={choose} actionFor={() => ({ label: 'Plan on visit 1', disabled: false })} />);
  const directory = within(screen.getByRole('region', { name: 'Places by region' }));
  expect(directory.getAllByRole('button')).toHaveLength(70);
  for (let i = 0; i < 5; i++) {
    fireEvent.click(screen.getByRole('button', { name: `Browse ${REGION_LESSONS[i].name}` }));
    expect(directory.getAllByRole('button')).toHaveLength(findPlaces(i, '', '').length);
    fireEvent.click(directory.getAllByRole('button')[0]);
    expect(screen.getByText('🔎 Your detective mission')).toBeVisible();
    fireEvent.click(screen.getByText('🔎 Your detective mission'));
  }
  expect(screen.getByText('Regions discovered here: 5/5')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Plan on visit 1' })); expect(choose).toHaveBeenCalledOnce();
  expect((await axe(container)).violations).toEqual([]);
  fireEvent.change(screen.getByLabelText('Find a place'), { target: { value: 'nothing matches' } });
  expect(screen.getByText('0 of 70 places match')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Surprise me!' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Show all places' }));
  expect(directory.getAllByRole('button')).toHaveLength(70);
});
it('zooms, pans, expands a cluster, and selects a map pin with an equivalent directory', () => {
  render(<ScrapbookExplorer onChoose={() => {}} actionFor={() => ({ label: 'Plan', disabled: false })} />);
  fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(screen.getByText('1.6×')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Move map east' }));
  fireEvent.click(screen.getByRole('button', { name: 'Fit Virginia' }));
  const group = screen.getAllByRole('button', { name: /Explore \d+ nearby places/ })[0];
  fireEvent.click(group);
  expect(screen.getByText('Close neighbors — pick a story')).toBeVisible();
  fireEvent.change(screen.getByLabelText('Find a place'), { target: { value: 'Mabry Mill' } });
  fireEvent.click(screen.getByRole('button', { name: 'Learn about Mabry Mill' }));
  expect(screen.getByRole('heading', { name: 'Mabry Mill' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Surprise me!' }));
  expect(screen.getByRole('heading', { name: 'Mabry Mill' })).toBeVisible();
});
it('plans a place on an empty page, preserves writing, and returns to the same page for a duplicate', async () => {
  render(<Scrapbook onClose={() => {}} />);
  fireEvent.change(screen.getByLabelText(/Why is this place historically important/), { target: { value: 'Keep my unfinished research' } });
  fireEvent.click(screen.getByRole('button', { name: /Explore places70 stories/ }));
  fireEvent.change(await screen.findByLabelText('Find a place'), { target: { value: 'Mabry Mill' } });
  fireEvent.click(within(screen.getByRole('region', { name: 'Places by region' })).getByRole('button'));
  fireEvent.click(screen.getByRole('button', { name: 'Plan on visit 2' }));
  expect(screen.getByLabelText('Historical site')).toHaveValue('Mabry Mill');
  expect(screen.getByLabelText('I have visited this place.')).not.toBeChecked();
  expect(screen.getByLabelText('Geographic region (optional)')).toHaveValue('Blue Ridge Mountains');
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Visit 2: Mabry Mill' })).toHaveFocus());
  const saved = JSON.parse(window.localStorage.getItem(SCRAPBOOK_KEY)!);
  expect(saved.visits[0].history).toBe('Keep my unfinished research');
  fireEvent.click(screen.getByRole('button', { name: /Explore places70 stories/ }));
  fireEvent.change(await screen.findByLabelText('Find a place'), { target: { value: 'Mabry Mill' } });
  fireEvent.click(within(screen.getByRole('region', { name: 'Places by region' })).getByRole('button'));
  fireEvent.click(screen.getByRole('button', { name: 'Open my visit 2 page' }));
  expect(JSON.parse(window.localStorage.getItem(SCRAPBOOK_KEY)!).visits.filter((v: { place: string }) => v.place === 'Mabry Mill')).toHaveLength(1);
});
