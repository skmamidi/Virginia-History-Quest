import { describe, expect, it } from "vitest";
import { MISSION_CATALOG } from "../../published-content/adapters/missionCatalog";
import { getQuestMap } from "./getQuestMap";

describe("GetQuestMap", () => {
  it("projects all thirteen published missions in numeric order", () => {
    const map = getQuestMap(MISSION_CATALOG, [
      { missionId: "VS.1", state: "MASTERED", lastMeaningfulStep: "map" },
      { missionId: "VS.2", state: "MASTERED", lastMeaningfulStep: "evidence" },
      { missionId: "VS.3", state: "LEARNING", lastMeaningfulStep: "map" },
    ]);

    expect(map.portals).toHaveLength(13);
    expect(map.portals.map((portal) => portal.id)).toEqual(
      Array.from({ length: 13 }, (_, index) => `VS.${index + 1}`),
    );
    expect(map.continueMissionId).toBe("VS.3");
    expect(map.restoredCount).toBe(2);
  });

  it("maps domain progress to color-independent portal states", () => {
    const map = getQuestMap(MISSION_CATALOG, [
      { missionId: "VS.1", state: "MASTERED", lastMeaningfulStep: null },
      { missionId: "VS.2", state: "LEARNING", lastMeaningfulStep: null },
      { missionId: "VS.4", state: "LOCKED", lastMeaningfulStep: null },
    ]);

    expect(map.portals[0].displayState).toBe("restored");
    expect(map.portals[1].displayState).toBe("in_progress");
    expect(map.portals[3].displayState).toBe("locked");
  });
});
