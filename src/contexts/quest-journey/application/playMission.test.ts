import { describe, expect, it } from "vitest";
import { challengeIndex, freshProgress, hasBadge, passChallenge, prepareProgress } from "./playMission";
import type { MissionProgress } from "../domain/missionProgress";

describe("playable mission journey", () => {
  it("starts with no unearned badges and repairs missing or locked prototype records", () => {
    expect(freshProgress).toHaveLength(13);
    expect(freshProgress.every((record) => record.state === "AVAILABLE" && !hasBadge(record))).toBe(true);
    const recovered = prepareProgress([{ missionId: "VS.9", state: "LOCKED", lastMeaningfulStep: null }]);
    expect(recovered).toHaveLength(13);
    expect(recovered.every((record) => record.state === "AVAILABLE")).toBe(true);
  });

  it("requires each challenge and preserves rewards and dates on replay", () => {
    let record: MissionProgress = { missionId: "VS.3", state: "LEARNING", lastMeaningfulStep: null };
    expect(passChallenge(record, 2)).toBe(record);
    record = passChallenge(record, 0);
    expect(challengeIndex(record)).toBe(1);
    record = passChallenge(record, 1);
    expect(hasBadge(record)).toBe(false);
    record = passChallenge(record, 2, new Date("2026-09-08T12:00:00Z"));
    expect(record.state).toBe("PROVISIONAL_MASTERY");
    expect(hasBadge(record)).toBe(true);
    expect(passChallenge(record, 0)).toBe(record);
    expect(passChallenge(record, 2)).toBe(record);
  });

  it("offers retention checks only after seven days and can complete them", () => {
    const record: MissionProgress = { missionId: "VS.1", state: "PROVISIONAL_MASTERY", lastMeaningfulStep: null, provisionalMasteryAt: "2026-09-08T12:00:00Z" };
    expect(prepareProgress([record], new Date("2026-09-15T11:59:59Z"))[0].state).toBe("PROVISIONAL_MASTERY");
    const due = prepareProgress([record], new Date("2026-09-15T12:00:00Z"))[0];
    expect(due.state).toBe("DELAYED_CHECK_DUE");
    expect(challengeIndex(due)).toBe(2);
    expect(passChallenge(due, 2).state).toBe("MASTERED");
  });
});
