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
