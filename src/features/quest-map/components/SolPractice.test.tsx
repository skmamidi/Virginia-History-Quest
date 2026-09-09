import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SOL_PRACTICE } from "../../../contexts/published-content/adapters/solPractice";
import { MISSION_CATALOG } from "../../../contexts/published-content/adapters/missionCatalog";
import { PRACTICE_STORAGE_KEY, readPracticeProgress } from "../../../contexts/quest-journey/adapters/solPracticeStore";
import { SolPractice } from "./SolPractice";
import { QuestMapScreen } from "../QuestMapScreen";

let stored: Map<string, string>;
let storage: Storage;
const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
beforeEach(() => {
  stored = new Map();
  storage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => { stored.set(key, value); }, removeItem: key => { stored.delete(key); }, clear: () => stored.clear(), key: index => [...stored.keys()][index] ?? null, get length() { return stored.size; } };
  Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
});
afterEach(() => {
  if (descriptor) Object.defineProperty(window, "localStorage", descriptor);
  else Reflect.deleteProperty(window, "localStorage");
});

it("covers all 13 sections with valid, unique, three-question trails", () => {
  expect(Object.keys(SOL_PRACTICE)).toEqual(MISSION_CATALOG.missions.map(mission => mission.id));
  let count = 0;
  for (const trails of Object.values(SOL_PRACTICE)) {
    expect(new Set(trails.map(trail => trail.id)).size).toBe(trails.length);
    for (const trail of trails) {
      expect(trail.questions).toHaveLength(3);
      expect(trail.lesson.length).toBeGreaterThan(100);
      for (const question of trail.questions) {
        expect(new Set(question.choices).size).toBe(4);
        expect(question.choices[question.answer]).toBeTruthy();
        expect(question.explanation).toBeTruthy();
        count++;
      }
    }
  }
  expect(count).toBe(96);
});

it("rejects unknown, malformed, and duplicate saved discoveries", () => {
  stored.set(PRACTICE_STORAGE_KEY, '["VS.1:regions:0","bad","VS.1:regions:0",null,"VS.1:regions:9"]');
  expect(readPracticeProgress(storage)).toEqual(["VS.1:regions:0"]);
  stored.set(PRACTICE_STORAGE_KEY, "broken");
  expect(readPracticeProgress(storage)).toEqual([]);
  expect(readPracticeProgress({ getItem() { throw Error("denied"); } })).toEqual([]);
});

describe("practice flow", () => {
  it("retries, saves only correct answers, and resumes after remount", async () => {
    const user = userEvent.setup();
    const mount = () => render(<SolPractice missionId="VS.1" title="Land & Water" onClose={() => {}} />);
    const view = mount();
    await user.click(screen.getByRole("button", { name: /Read the landscape/ }));
    expect(screen.getByText(SOL_PRACTICE["VS.1"][0].lesson)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Try the first question" }));
    expect(screen.getByRole("button", { name: "Check my answer" })).toBeDisabled();
    const question = SOL_PRACTICE["VS.1"][0].questions[0];
    await user.click(screen.getByRole("button", { name: question.choices[(question.answer + 1) % 4] }));
    await user.click(screen.getByRole("button", { name: "Check my answer" }));
    expect(screen.getByText("Keep investigating!")).toBeVisible();
    expect(storage.getItem(PRACTICE_STORAGE_KEY)).toBeNull();
    await user.click(screen.getByRole("button", { name: question.choices[question.answer] }));
    await user.click(screen.getByRole("button", { name: "Check my answer" }));
    expect(readPracticeProgress(storage)).toEqual(["VS.1:regions:0"]);
    view.unmount();
    mount();
    expect(screen.getByText("1 of 9 discoveries saved")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Read the landscape/ }));
    await user.click(screen.getByRole("button", { name: "Continue at question 2" }));
    expect(screen.getByRole("heading", { name: SOL_PRACTICE["VS.1"][0].questions[1].prompt })).toBeVisible();
  });

  it("finishes a section, replays without duplicate progress, and returns to the mission", () => {
    const close = vi.fn();
    render(<SolPractice missionId="VS.13" title="Virginia Today" onClose={close} />);
    for (const [trailIndex, trail] of SOL_PRACTICE["VS.13"].entries()) {
      if (trailIndex === 0) fireEvent.click(screen.getByRole("button", { name: /Match places with work/ }));
      else fireEvent.click(screen.getByRole("button", { name: "Next trail: " + trail.title }));
      fireEvent.click(screen.getByRole("button", { name: "Try the first question" }));
      for (const [i, question] of trail.questions.entries()) {
        fireEvent.click(screen.getByRole("button", { name: question.choices[question.answer] }));
        fireEvent.click(screen.getByRole("button", { name: "Check my answer" }));
        fireEvent.click(screen.getByRole("button", { name: i === 2 ? "Finish this trail" : "Next question" }));
      }
      expect(screen.getByRole("heading", { name: "Three discoveries made!" })).toBeVisible();
    }
    expect(readPracticeProgress(storage)).toHaveLength(6);
    fireEvent.click(screen.getByRole("button", { name: "Replay this trail" }));
    fireEvent.click(screen.getByRole("button", { name: "Try the first question" }));
    for (const [i, question] of SOL_PRACTICE["VS.13"][1].questions.entries()) {
      fireEvent.click(screen.getByRole("button", { name: question.choices[question.answer] }));
      fireEvent.click(screen.getByRole("button", { name: "Check my answer" }));
      fireEvent.click(screen.getByRole("button", { name: i === 2 ? "Finish this trail" : "Next question" }));
    }
    expect(readPracticeProgress(storage)).toHaveLength(6);
    fireEvent.click(screen.getByRole("button", { name: "Back to my mission" }));
    expect(close).toHaveBeenCalledOnce();
  });

  it("continues learning if browser storage cannot save", () => {
    vi.spyOn(storage, "setItem").mockImplementation(() => { throw Error("storage denied"); });
    render(<SolPractice missionId="VS.1" title="Land & Water" onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Read the landscape/ }));
    fireEvent.click(screen.getByRole("button", { name: "Try the first question" }));
    const question = SOL_PRACTICE["VS.1"][0].questions[0];
    fireEvent.click(screen.getByRole("button", { name: question.choices[question.answer] }));
    fireEvent.click(screen.getByRole("button", { name: "Check my answer" }));
    expect(screen.getByRole("alert")).toHaveTextContent("could not save");
    expect(screen.getByRole("button", { name: "Next question" })).toBeEnabled();
  });

  it("opens the selected mission’s practice with accessible navigation and leaves badges unchanged", async () => {
    const user = userEvent.setup();
    const { container } = render(<QuestMapScreen />);
    await user.click(screen.getByRole("button", { name: "All missions" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: /VS\.7.*Civil War/ }));
    await user.click(screen.getByRole("button", { name: "Practice this topic · SOL questions" }));
    expect(screen.getByRole("heading", { name: "Practice: Civil War" })).toBeVisible();
    expect((await axe(container)).violations).toEqual([]);
    await user.click(screen.getByRole("button", { name: /Connect battlefield clues/ }));
    await user.click(screen.getByRole("button", { name: "Try the first question" }));
    expect(screen.getByRole("heading", { name: /ironclad exhibit/ })).toBeVisible();
    expect((await axe(container)).violations).toEqual([]);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Practice this topic · SOL questions" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Begin mission" })).toBeVisible();
  });
});
