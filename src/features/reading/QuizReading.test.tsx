import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { QUESTION_BANK } from '../quizzes/questionBank';
import { readingFor, supportingReading } from './readingCatalog';
import QuizReading from './QuizReading';
import { RegionDiscovery } from './RegionDiscovery';
import { MissionFieldGuide } from './MissionFieldGuide';
import { MISSION_IDS } from '../../contexts/published-content/domain/mission';
import { parseRoute, routeHash } from '../quest-map/useJourneyNavigation';

it('gives every question its own reading, supporting evidence, and broader lesson', () => {
  for (const q of QUESTION_BANK) {
    expect(parseRoute(q.href)).toEqual({ kind: 'reading', questionId: q.id });
    expect(routeHash(parseRoute(q.href))).toBe(q.href);
    const reading = readingFor(q);
    expect(reading.sections.length, q.id).toBeGreaterThan(0);
    expect(reading.originalHref, q.id).not.toContain('/reading/');
    expect(supportingReading(q).map(s => s.text).join(' '), q.id).toContain(q.explanation);
    if (q.context) expect(supportingReading(q).map(s => s.text).join(' ')).toContain(q.context);
  }
});
it('opens the Lake Drummond background with the missing facts visible', () => {
  const q = QUESTION_BANK.find(q => q.prompt.startsWith('A journal describes Lake Drummond'))!;
  render(<QuizReading questionId={q.id} motionPaused />);
  expect(screen.getByRole('heading', { name: 'Meet Lake Drummond and the Great Dismal Swamp' })).toBeVisible();
  expect(screen.getByText(/Lake Drummond is a shallow, natural freshwater lake inside/)).toBeVisible();
  expect(screen.getByText(/Lake Drummond → Great Dismal Swamp → Coastal Plain/)).toBeVisible();
  expect(screen.getByRole('link', { name: 'Open the original topic lesson' })).toHaveAttribute('href', '#/story/VS.1');
});
it('lets children explore regions, change water storage, and reveal a misconception', async () => {
  const user = userEvent.setup();
  render(<RegionDiscovery />);
  await user.click(screen.getByRole('button', { name: '3. Blue Ridge Mountains' }));
  expect(screen.getByRole('heading', { name: 'Blue Ridge Mountains' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Drain a ditch' }));
  expect(screen.getByText(/A ditch lets water escape/)).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Hold water' }));
  expect(screen.getByText(/Wet peat stores water/)).toBeVisible();
  await user.click(screen.getByRole('button', { name: /does “Coastal Plain” mean salt water/ }));
  expect(screen.getByText(/No. The Coastal Plain includes freshwater/)).toBeVisible();
});
it('expands all thirteen mission backgrounds and handles stale links safely', () => {
  for (const missionId of MISSION_IDS) {
    const view = render(<MissionFieldGuide missionId={missionId} motionPaused />);
    expect(screen.getByRole('region', { name: 'Deeper background reading' })).toBeInTheDocument();
    expect(screen.getByText('More connections for your mission')).toBeInTheDocument();
    view.unmount();
  }
  render(<QuizReading questionId="missing" />);
  expect(screen.getByRole('link', { name: 'Browse all quizzes' })).toHaveAttribute('href', '#/quizzes');
});
it.each(['Werowocomoco', 'John Rolfe', 'Lake Drummond'])('includes the specific background for questions mentioning %s', name => {
  const matching = QUESTION_BANK.filter(q => `${q.prompt} ${q.explanation} ${q.answer.map(i => q.choices[i]).join(' ')}`.includes(name));
  expect(matching.length).toBeGreaterThan(0);
  for (const q of matching) {
    const background = readingFor(q).sections.map(s => s.text).join(' ');
    expect(background).toContain(name);
  }
});
