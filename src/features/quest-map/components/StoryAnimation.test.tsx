import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { MISSION_IDS } from '../../../contexts/published-content/domain/mission';
import { STORY_ANIMATIONS } from '../../../contexts/published-content/adapters/storyAnimations';
import { StoryAnimation } from './StoryAnimation';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

it.each(MISSION_IDS)('provides an illustrated, readable explanation for every %s story stop', id => {
  const { rerender } = render(<StoryAnimation missionId={id} scene={0} motionPaused />);
  for (const scene of [0, 1, 2]) {
    rerender(<StoryAnimation key={scene} missionId={id} scene={scene} motionPaused />);
    const lesson = STORY_ANIMATIONS[id][scene];
    expect(screen.getByRole('img', { name: lesson.title })).toBeVisible();
    for (const [i, step] of lesson.steps.entries()) {
      fireEvent.click(screen.getByRole('button', { name: `${i + 1}. ${step[0]}` }));
      expect(within(screen.getByRole('note', { name: 'Current explanation' })).getByText(step[1])).toBeVisible();
      expect(screen.getByRole('slider', { name: 'Animation progress' })).toHaveValue(String(i * 6));
    }
  }
});

it('pauses, scrubs, replays, and stops at the end without advancing a story', () => {
  vi.useFakeTimers();
  render(<StoryAnimation missionId="VS.1" scene={0} motionPaused={false} />);
  act(() => vi.advanceTimersByTime(1800));
  const slider = screen.getByRole('slider', { name: 'Animation progress' });
  expect(Number((slider as HTMLInputElement).value)).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: 'Pause animation' }));
  const paused = (slider as HTMLInputElement).value;
  act(() => vi.advanceTimersByTime(1500));
  expect(slider).toHaveValue(paused);
  fireEvent.change(slider, { target: { value: '13' } });
  expect(within(screen.getByRole('note', { name: 'Current explanation' })).getByText(STORY_ANIMATIONS['VS.1'][0].steps[2][1])).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Play animation' }));
  act(() => vi.advanceTimersByTime(8000));
  expect(slider).toHaveValue('18');
  expect(screen.getByRole('button', { name: 'Play animation' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Replay animation' }));
  expect(slider).toHaveValue('0');
});

it('respects the app pause control and prefers-reduced-motion, while step buttons still teach', () => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.useFakeTimers();
  const { rerender } = render(<StoryAnimation missionId="VS.5" scene={1} motionPaused={false} />);
  expect(screen.getByRole('button', { name: 'Play animation' })).toBeDisabled();
  act(() => vi.advanceTimersByTime(8000));
  expect(screen.getByRole('slider', { name: 'Animation progress' })).toHaveValue('0');
  fireEvent.click(screen.getByRole('button', { name: '3. Work together' }));
  expect(within(screen.getByRole('note', { name: 'Current explanation' })).getByText(STORY_ANIMATIONS['VS.5'][1].steps[2][1])).toBeVisible();
  rerender(<StoryAnimation missionId="VS.5" scene={1} motionPaused />);
  expect(screen.getByRole('slider', { name: 'Animation progress' })).toHaveValue('12');
});

it('offers accessible controls and a text alternative to the moving diagram', async () => {
  const { container } = render(<StoryAnimation missionId="VS.7" scene={1} motionPaused />);
  expect((await axe(container)).violations).toEqual([]);
  fireEvent.click(screen.getByText('Read the whole explanation'));
  for (const step of STORY_ANIMATIONS['VS.7'][1].steps) expect(screen.getAllByText(step[1]).length).toBeGreaterThan(0);
});
