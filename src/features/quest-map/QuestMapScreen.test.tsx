import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { QuestMapScreen } from "./QuestMapScreen";

describe("QuestMapScreen", () => {
  it("gives pointer and keyboard users equivalent access to all 13 portals", async () => {
    const user = userEvent.setup();
    render(<QuestMapScreen />);

    const map = screen.getByRole("region", { name: /interactive virginia mission map/i });
    expect(within(map).getAllByRole("button", { name: /VS\./i })).toHaveLength(13);

    await user.click(screen.getByRole("button", { name: /all missions/i }));
    const list = screen.getByRole("dialog", { name: /all missions/i });
    expect(within(list).getAllByRole("button", { name: /VS\./i })).toHaveLength(13);

    await user.click(
      within(list).getByRole("button", { name: /VS\.11.*Civil Rights/i }),
    );
    expect(screen.getByRole("heading", { name: /Civil Rights in Virginia/i })).toBeVisible();
  });

  it("switches between map, timeline, and standards projections", async () => {
    const user = userEvent.setup();
    render(<QuestMapScreen />);

    await user.click(screen.getByText("Map tools & other views"));
    await user.click(screen.getByRole("tab", { name: "Timeline" }));
    expect(screen.getByRole("region", { name: /mission timeline/i })).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Standards" }));
    expect(screen.getByRole("region", { name: /standards mission list/i })).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Map" }));
    expect(
      screen.getByRole("region", { name: /interactive virginia mission map/i }),
    ).toBeVisible();
  });

  it("explains the map relationship after a retrieval attempt", async () => {
    const user = userEvent.setup();
    render(<QuestMapScreen />);

    await user.click(screen.getByText("Bonus clues & review"));
    await user.click(screen.getByRole("radio", { name: "James River" }));
    expect(
      screen.getByText(/James River connected Jamestown with the Chesapeake Bay/i),
    ).toBeVisible();
  });

  it("has no detectable axe violations in its default state", async () => {
    const { container } = render(<QuestMapScreen />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});


it("guides a new explorer directly into a mission and updates the next action", async () => {
  const user = userEvent.setup();
  render(<QuestMapScreen />);
  expect(screen.getByRole("heading", { name: "Start here, explorer!" })).toBeVisible();
  expect(screen.getByRole("tab", { name: "Standards" })).not.toBeVisible();
  expect(screen.getByRole("radio", { name: "James River" })).not.toBeVisible();
  await user.click(screen.getByRole("button", { name: "Start my adventure" }));
  await user.click(screen.getByRole("button", { name: "Let’s investigate" }));
  expect(screen.getByText("Read the clue, then tap one answer below.")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "B Waterfalls and rapids" }));
  expect(screen.getByText("Ready! Tap Check my discovery below.")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Check my discovery" }));
  expect(screen.getByText("Nice work! Tap Next challenge to keep going.")).toBeVisible();
  await user.keyboard("{Escape}");
  expect(screen.getByRole("button", { name: "Continue my adventure" })).toBeVisible();
  expect(screen.getByText(/Next up: challenge 2 of 3/)).toBeVisible();
});
