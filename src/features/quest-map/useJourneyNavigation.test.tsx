import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { parseRoute, routeHash } from './useJourneyNavigation';
import { QuestMapScreen } from './QuestMapScreen';

it('recognizes shareable destinations and safely handles unknown missions', () => {
  expect(parseRoute('#/mission/VS.13')).toEqual({ kind: 'mission', missionId: 'VS.13' });
  expect(parseRoute('#/practice/VS.2')).toEqual({ kind: 'practice', missionId: 'VS.2' });
  expect(parseRoute('#/mission/VS.99')).toEqual({ kind: 'home' });
  expect(parseRoute('#/unknown')).toEqual({ kind: 'home' });
  expect(routeHash({ kind: 'scrapbook' })).toBe('#/scrapbook');
  expect(parseRoute('#/science/rocks')).toEqual({ kind: 'science', topicId: 'rocks' });
  expect(parseRoute('#/science/unknown')).toEqual({ kind: 'science' });
  expect(routeHash({ kind: 'science', topicId: 'soil' })).toBe('#/science/soil');
});

it('uses full pages, preserves the map view, and supports browser back and forward', async () => {
  const user = userEvent.setup();
  render(<QuestMapScreen />);
  await user.click(screen.getByText('Map tools & other views'));
  await user.click(screen.getByRole('tab', { name: 'Timeline' }));
  const launch = screen.getByRole('button', { name: 'Start my adventure' });
  await user.click(launch);
  expect(window.location.hash).toBe('#/mission/VS.1');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(within(screen.getByRole('navigation', { name: 'Explore Virginia' })).getAllByRole('link')).toHaveLength(6);
  await user.click(screen.getByRole('button', { name: 'Next story stop' }));
  await user.click(screen.getByRole('button', { name: 'Next story stop' }));
  await user.click(screen.getByRole('button', { name: 'Try the challenges' }));
  expect(screen.getByRole('complementary', { name: 'Your mission trail' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'B Waterfalls and rapids' }));
  await user.click(screen.getByRole('button', { name: 'Check my discovery' }));
  await act(async () => window.history.back());
  expect(await screen.findByRole('region', { name: 'Mission timeline' })).toBeVisible();
  await waitFor(() => expect(launch).toHaveFocus());
  await act(async () => window.history.forward());
  expect(await screen.findByRole('heading', { name: 'Build a trail from east to west.' })).toBeVisible();
  expect(window.location.hash).toBe('#/mission/VS.1');
  expect(document.body.style.overflow).not.toBe('hidden');
});

it('opens a science lesson directly and returns to the science directory and quest map', async () => {
  window.history.replaceState(null, '', '#/science/rocks');
  const user = userEvent.setup();
  render(<QuestMapScreen />);
  expect(await screen.findByRole('heading', { name: 'Virginia’s rocky treasures' })).toBeVisible();
  expect(screen.queryByRole('dialog')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Back to Science' }));
  expect(await screen.findByRole('heading', { name: 'Science & natural resources' })).toBeVisible();
  await user.click(within(screen.getByRole('navigation', { name: 'Explore Virginia' })).getByRole('link', { name: 'Quest map' }));
  expect(screen.getByRole('heading', { name: 'Your Virginia Memory Map' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Start my adventure' })).toBeVisible();
});

it('opens a mission link directly and provides a safe parent destination', async () => {
  window.history.replaceState(null, '', '#/mission/VS.11');
  const user = userEvent.setup();
  const { unmount } = render(<QuestMapScreen />);
  expect(screen.getByRole('heading', { name: 'Your mission: Civil Rights' })).toBeVisible();
  unmount();
  render(<QuestMapScreen />);
  expect(screen.getByRole('heading', { name: 'Your mission: Civil Rights' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Back to Missions' }));
  expect(screen.getByRole('region', { name: 'All missions' })).toBeVisible();
  expect(window.location.hash).toBe('#/missions');
});
