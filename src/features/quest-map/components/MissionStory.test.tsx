import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { expect, it } from 'vitest';
import { MISSION_IDS } from '../../../contexts/published-content/domain/mission';
import { MISSION_STORIES } from '../../../contexts/published-content/adapters/missionStories';
import { MISSION_ACTIVITIES } from '../../../contexts/published-content/adapters/missionActivities';
import { QuestMapScreen } from '../QuestMapScreen';

it.each(MISSION_IDS)('teaches %s through all three interactive scenes before its questions', async id => {
  window.history.replaceState(null, '', `#/mission/${id}`);
  const user = userEvent.setup();
  const { container } = render(<QuestMapScreen />);
  const story = MISSION_STORIES[id];
  expect(screen.getByRole('heading', { name: story.title })).toBeVisible();
  expect(screen.queryByRole('heading', { name: MISSION_ACTIVITIES[id].challenges[0].prompt })).toBeNull();
  expect(screen.getByRole('button', { name: 'Try the challenges' })).toBeDisabled();
  if (id === 'VS.1') expect((await axe(container)).violations).toEqual([]);
  // Jump ahead: visiting the final scene alone must not bypass the middle scene.
  const stops = within(screen.getByRole('group', { name: story.diagramLabel }));
  await user.click(stops.getAllByRole('button')[2]);
  expect(screen.getByText(story.scenes[2].narrative)).toBeVisible();
  expect(screen.getByRole('button', { name: 'Try the challenges' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Explore the missing stop' }));
  expect(screen.getByText(story.scenes[1].narrative)).toBeVisible();
  await user.click(screen.getByRole('button', { name: story.scenes[1].discoveryLabel }));
  expect(screen.getByText(story.scenes[1].discovery)).toBeVisible();
  expect(screen.getByRole('link', { name: new RegExp(story.source.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) })).toHaveAttribute('href', story.source.url);
  await user.click(screen.getByRole('button', { name: 'Try the challenges' }));
  expect(screen.getByRole('heading', { name: MISSION_ACTIVITIES[id].challenges[0].prompt })).toBeVisible();
}, 15000);

it('keeps story place on navigation and quiz selections on a story revisit', async () => {
  const user = userEvent.setup();
  render(<QuestMapScreen />);
  await user.click(screen.getByRole('button', { name: 'Start my adventure' }));
  await user.click(screen.getByRole('button', { name: 'Next story stop' }));
  await user.click(screen.getByRole('link', { name: 'Scrapbook' }));
  await act(async () => window.history.back());
  expect(await screen.findByRole('heading', { name: 'A rocky interruption' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Next story stop' }));
  await user.click(screen.getByRole('button', { name: 'Try the challenges' }));
  await user.click(screen.getByRole('button', { name: 'B Waterfalls and rapids' }));
  await user.click(screen.getByRole('button', { name: 'Check my discovery' }));
  await user.click(screen.getByRole('button', { name: 'Next challenge' }));
  await user.click(screen.getByRole('button', { name: '? Coastal Plain' }));
  await user.click(screen.getByRole('button', { name: 'Revisit the story' }));
  expect(window.location.hash).toBe('#/story/VS.1');
  await user.click(screen.getByRole('button', { name: 'Previous stop' }));
  await user.click(screen.getByRole('button', { name: 'Return to my challenges' }));
  await waitFor(() => expect(window.location.hash).toBe('#/mission/VS.1'));
  expect(screen.getByRole('heading', { name: 'Build a trail from east to west.' })).toBeVisible();
  expect(screen.getByRole('button', { name: '1 Coastal Plain' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.queryByRole('heading', { name: 'You did it, explorer!' })).toBeNull();
});

it('allows keyboard exploration and entering challenges from a direct story link', async () => {
  window.history.replaceState(null, '', '#/story/VS.11');
  const user = userEvent.setup();
  render(<QuestMapScreen />);
  const stops = within(screen.getByRole('group', { name: MISSION_STORIES['VS.11'].diagramLabel })).getAllByRole('button');
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Your mission: Civil Rights' })).toHaveFocus());
  await act(async () => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
  stops[1].focus(); await user.keyboard('{Enter}');
  expect(screen.getByRole('heading', { name: 'A national legal victory' })).toBeVisible();
  await user.tab(); await user.keyboard(' ');
  expect(screen.getByRole('heading', { name: 'A ruling does not enforce itself' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Try the challenges' }));
  expect(screen.getByRole('heading', { name: MISSION_ACTIVITIES['VS.11'].challenges[0].prompt })).toBeVisible();
});
