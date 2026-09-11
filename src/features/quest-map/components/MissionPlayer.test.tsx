import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { MISSION_ACTIVITIES } from "../../../contexts/published-content/adapters/missionActivities";
import { MISSION_IDS } from "../../../contexts/published-content/domain/mission";
import { QuestMapScreen } from "../QuestMapScreen";

async function openMission(user: ReturnType<typeof userEvent.setup>, id: string) {
  await user.click(screen.getByRole("button", { name: "All missions" }));
  await user.click(within(screen.getByRole("main")).getByRole("button", { name: new RegExp(`${id.replace(".", "\\.")} `) }));
  await user.click(screen.getByRole("button", { name: "Next story stop" }));
  await user.click(screen.getByRole("button", { name: "Next story stop" }));
  await user.click(screen.getByRole("button", { name: "Try the challenges" }));
}

describe("mission adventures", () => {
  it.each(MISSION_IDS)("plays %s from briefing through all challenges to a badge", async (id) => {
    const user = userEvent.setup();
    render(<QuestMapScreen />);
    await openMission(user, id);
    const activity = MISSION_ACTIVITIES[id];
    expect(activity.challenges.length).toBeGreaterThanOrEqual(10);
    for (let index = 0; index < activity.challenges.length; index++) {
      const challenge = activity.challenges[index];
      expect(screen.getByText(`Question ${index + 1} of ${activity.challenges.length}`)).toBeVisible();
      expect(screen.getByRole("heading", { name: challenge.prompt })).toBeVisible();
      expect(screen.getByRole("button", { name: "Check my discovery" })).toBeDisabled();
      const answers = within(screen.getByRole("group", { name: challenge.kind === "order" ? "Timeline pieces" : "Answer choices" }));
      if (challenge.kind === "order") {
        for (const label of challenge.choices) await user.click(answers.getByRole("button", { name: new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }));
      } else {
        await user.click(answers.getAllByRole("button")[challenge.answer]);
      }
      await user.click(screen.getByRole("button", { name: "Check my discovery" }));
      expect(screen.getByText(challenge.explanation)).toBeVisible();
      const last = index === activity.challenges.length - 1;
      expect(screen.queryByRole('button', { name: last ? 'Next challenge' : 'Reveal my badge' })).toBeNull();
      if (id === 'VS.1' && index === 4) {
        await user.click(within(screen.getByRole('navigation', { name: 'Explore Virginia' })).getByRole('link', { name: 'Quest map' }));
        expect(screen.getByText(/Next up: challenge 6 of 10/)).toBeVisible();
        await user.click(screen.getByRole('button', { name: 'Continue my adventure' }));
      } else {
        await user.click(screen.getByRole("button", { name: last ? "Reveal my badge" : "Next challenge" }));
      }
    }
    expect(within(screen.getByRole("main")).getByText(activity.badge)).toBeVisible();
    if (id === "VS.11") {
      await user.click(screen.getByRole("button", { name: "Revisit the story" }));
      await user.click(screen.getByRole("button", { name: "Return to my challenges" }));
      expect(await screen.findByRole("heading", { name: "You did it, explorer!" })).toBeVisible();
      expect(within(screen.getByRole("main")).getByText(activity.badge)).toBeVisible();
      await user.click(screen.getByRole('button', { name: 'Replay all 10 questions' }));
      expect(screen.getByRole('heading', { name: activity.challenges[0].prompt })).toBeVisible();
      expect(screen.getByText('Question 1 of 10')).toBeVisible();
    }
    if (id === "VS.1") {
      await user.click(screen.getByRole("button", { name: "Next adventure: Indigenous Virginia" }));
      expect(screen.getByRole("heading", { name: "Your mission: Indigenous Virginia" })).toBeVisible();
      await user.click(within(screen.getByRole("navigation", { name: "Explore Virginia" })).getByRole("link", { name: "Quest map" }));
    } else {
      await user.click(screen.getByRole("button", { name: "Back to quest map" }));
    }
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  }, 15000);

  it("supports wrong answers, ordering retries, saved checkpoints, and accessible pages", async () => {
    const user = userEvent.setup();
    const { container } = render(<QuestMapScreen />);
    await openMission(user, "VS.1");
    expect((await axe(container)).violations).toEqual([]);
    await user.click(screen.getByRole("button", { name: "A A desert" }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    expect(within(screen.getByRole("main")).getByText(/Keep investigating/)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Next challenge" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "B Waterfalls and rapids" }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    await user.click(within(screen.getByRole("navigation", { name: "Explore Virginia" })).getByRole("link", { name: "Quest map" }));
    await user.click(screen.getByRole("button", { name: "Continue mission" }));
    expect(screen.getByRole("heading", { name: "Build a trail from east to west." })).toBeVisible();
    expect(screen.getByText("Tap the first piece. 0 of 3 placed.")).toBeVisible();
    expect(screen.getByText("First piece goes here")).toBeVisible();
    for (const label of ["Blue Ridge", "Piedmont", "Coastal Plain"]) await user.click(screen.getByRole("button", { name: `? ${label}` }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    expect(within(screen.getByRole("main")).getByText(/Keep investigating/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Start over" }));
    expect(screen.getByRole("button", { name: "Check my discovery" })).toBeDisabled();
    for (const label of ["Coastal Plain", "Piedmont", "Blue Ridge"]) await user.click(screen.getByRole("button", { name: `? ${label}` }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    expect(screen.getByRole("button", { name: "Next challenge" })).toBeVisible();
  });
});
