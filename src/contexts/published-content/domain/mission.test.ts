import { describe, expect, it } from "vitest";
import {
  MissionCatalogSchema,
  parseMissionId,
} from "./mission";

describe("published mission content contract", () => {
  it("accepts only canonical VS.1 through VS.13 identifiers", () => {
    expect(parseMissionId("VS.1")).toBe("VS.1");
    expect(parseMissionId("VS.13")).toBe("VS.13");
    expect(() => parseMissionId("VS1")).toThrow(/canonical/i);
    expect(() => parseMissionId("VS.14")).toThrow(/canonical/i);
  });

  it("fails closed when a mission lacks its accessible map summary", () => {
    const result = MissionCatalogSchema.safeParse({
      version: "2026.08",
      missions: [
        {
          id: "VS.1",
          title: "Virginia: Land, Water, and Human Movement",
          shortTitle: "Land & water",
          essentialQuestion: "How does geography influence movement?",
          heroLocation: "Virginia's five physical regions",
          portal: { longitude: -78.5, latitude: 37.5, precision: "region" },
          status: "published",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("requires exactly one published entry for every mission", () => {
    const result = MissionCatalogSchema.safeParse({
      version: "2026.08",
      missions: [],
    });

    expect(result.success).toBe(false);
  });
});
