import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { MISSION_ACTIVITIES } from "../../../contexts/published-content/adapters/missionActivities";
import { MISSION_IDS } from "../../../contexts/published-content/domain/mission";
import { QuestMapScreen } from "../QuestMapScreen";

async function openMission(user: ReturnType<typeof userEvent.setup>, id: string) {
  await user.click(screen.getByRole("button", { name: "All missions" }));
  await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: new RegExp(`${id.replace(".", "\\.")} `) }));
  await user.click(screen.getByRole("button", { name: "Begin mission" }));
  await user.click(screen.getByRole("button", { name: "Let’s investigate" }));
}

describe("mission adventures", () => {
  it.each(MISSION_IDS)("plays %s from briefing through all challenges to a badge", async (id) => {
    const user = userEvent.setup();
    render(<QuestMapScreen />);
    await openMission(user, id);
    const activity = MISSION_ACTIVITIES[id];
    for (let index = 0; index < 3; index++) {
      const challenge = activity.challenges[index];
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
      await user.click(screen.getByRole("button", { name: index === 2 ? "Reveal my badge" : "Next challenge" }));
    }
    expect(within(screen.getByRole("dialog")).getByText(activity.badge)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Back to my map" }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  });

  it("supports wrong answers, ordering retries, saved checkpoints, and accessible dialogs", async () => {
    const user = userEvent.setup();
    const { container } = render(<QuestMapScreen />);
    await openMission(user, "VS.1");
    expect((await axe(container)).violations).toEqual([]);
    await user.click(screen.getByRole("button", { name: "A A desert" }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    expect(within(screen.getByRole("dialog")).getByText(/Keep investigating/)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Next challenge" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "B Waterfalls and rapids" }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Continue mission" }));
    expect(screen.getByRole("heading", { name: "Build a trail from east to west." })).toBeVisible();
    for (const label of ["Blue Ridge", "Piedmont", "Coastal Plain"]) await user.click(screen.getByRole("button", { name: `? ${label}` }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    expect(within(screen.getByRole("dialog")).getByText(/Keep investigating/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Start over" }));
    expect(screen.getByRole("button", { name: "Check my discovery" })).toBeDisabled();
    for (const label of ["Coastal Plain", "Piedmont", "Blue Ridge"]) await user.click(screen.getByRole("button", { name: `? ${label}` }));
    await user.click(screen.getByRole("button", { name: "Check my discovery" }));
    expect(screen.getByRole("button", { name: "Next challenge" })).toBeVisible();
  });
});
