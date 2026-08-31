import { describe, expect, it } from "vitest";
import {
  applyMissionEvent,
  type MissionProgress,
} from "./missionProgress";

describe("MissionProgress", () => {
  const progress: MissionProgress = {
    missionId: "VS.3",
    state: "AVAILABLE",
    lastMeaningfulStep: null,
  };

  it("starts an available mission in orientation", () => {
    expect(applyMissionEvent(progress, { type: "MISSION_OPENED" }).state).toBe(
      "ORIENTING",
    );
  });

  it("never grants retained mastery from a same-day boss pass", () => {
    const bossReady: MissionProgress = { ...progress, state: "BOSS_READY" };
    expect(
      applyMissionEvent(bossReady, {
        type: "BOSS_PASSED",
        occurredAt: "2026-08-24T12:00:00.000Z",
      }).state,
    ).toBe("PROVISIONAL_MASTERY");
  });

  it("rejects illegal state transitions", () => {
    const locked: MissionProgress = { ...progress, state: "LOCKED" };
    expect(() =>
      applyMissionEvent(locked, { type: "MISSION_OPENED" }),
    ).toThrow(/cannot/i);
  });
});
