import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { FIELD_TRIP_CHAPTERS } from "../../../contexts/published-content/adapters/fieldTrips";
import { FieldTripTrail, readTripStamps } from "./FieldTripTrail";
import { QuestMapScreen } from "../QuestMapScreen";

it("loads only unique valid discoveries and tolerates broken storage", () => {
  expect(readTripStamps({ getItem: () => '["freedom","unknown","freedom","two-wars"]' })).toEqual(["two-wars", "freedom"]);
  expect(readTripStamps({ getItem: () => 'not json' })).toEqual([]);
  expect(readTripStamps({ getItem() { throw new Error("denied"); } })).toEqual([]);
});

describe("field trip connection stories", () => {
  it.each(FIELD_TRIP_CHAPTERS.map((chapter, index) => ({ chapter, index })))("connects $chapter.title with retry, reflection, and mission handoff", async ({ chapter, index }) => {
    const user = userEvent.setup();
    const onMission = vi.fn();
    render(<FieldTripTrail initialChapter={index} onClose={() => {}} onMission={onMission} />);
    for (let stop = 0; stop < chapter.places.length; stop++) {
      expect(screen.getByRole("heading", { name: chapter.places[stop].name })).toBeVisible();
      await user.click(screen.getByText("Think back to your visit"));
      expect(screen.getByText(chapter.places[stop].notice)).toBeVisible();
      await user.click(screen.getByRole("button", { name: stop + 1 < chapter.places.length ? `Next place: ${chapter.places[stop + 1].name}` : "Solve the connection" }));
    }
    expect(screen.getByRole("button", { name: "Check my connection" })).toBeDisabled();
    const group = within(screen.getByRole("group", { name: "Connection answers" }));
    await user.click(group.getByRole("button", { name: chapter.choices[(chapter.answer + 1) % 3] }));
    await user.click(screen.getByRole("button", { name: "Check my connection" }));
    expect(screen.getByText(/try another answer/)).toBeVisible();
    expect(screen.queryByText("Connection discovered!")).toBeNull();
    await user.click(group.getByRole("button", { name: chapter.choices[chapter.answer] }));
    await user.click(screen.getByRole("button", { name: "Check my connection" }));
    expect(screen.getByText(chapter.connection)).toBeVisible();
    await user.click(screen.getByRole("button", { name: chapter.missionLabel }));
    expect(onMission).toHaveBeenCalledWith(chapter.missionId);
  });

  it("keeps story selection accessible and reopens a relevant chapter from a mission", async () => {
    const user = userEvent.setup();
    const { container } = render(<QuestMapScreen />);
    await user.click(screen.getByRole("button", { name: "Connect these places" }));
    expect(screen.getByRole("heading", { name: "Three places, four April days" })).toBeVisible();
    expect((await axe(container)).violations).toEqual([]);
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /Connect our field trips/ }));
    expect(screen.getByRole("heading", { name: "Yorktown" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /People reaching for freedom/ }));
    expect(screen.getByRole("heading", { name: "Harpers Ferry & John Brown Museum" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Next place: Norfolk/ }));
    expect(screen.getByRole("heading", { name: "Norfolk" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Next place: Hampton/ }));
    expect(screen.getByRole("heading", { name: "Hampton \/ Hampton Roads" })).toBeVisible();
  });

  it("earns the three-connection reward", () => {
    render(<FieldTripTrail onClose={() => {}} onMission={() => {}} />);
    for (const chapter of FIELD_TRIP_CHAPTERS) {
      fireEvent.click(within(screen.getByRole("navigation", { name: "Field trip stories" })).getByRole("button", { name: new RegExp(chapter.title) }));
      for (let i = 0; i < chapter.places.length; i++) fireEvent.click(screen.getByRole("button", { name: i + 1 < chapter.places.length ? `Next place: ${chapter.places[i + 1].name}` : "Solve the connection" }));
      fireEvent.click(screen.getByRole("button", { name: chapter.choices[chapter.answer] }));
      fireEvent.click(screen.getByRole("button", { name: "Check my connection" }));
    }
    expect(screen.getByText("Field-trip Connector!")).toBeVisible();
    expect(screen.getByText("3 of 3 connections discovered")).toBeVisible();
  });
});
