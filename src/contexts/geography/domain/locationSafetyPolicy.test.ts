import { describe, expect, it } from "vitest";
import { createPublicMapPoint } from "./locationSafetyPolicy";

describe("LocationSafetyPolicy", () => {
  it("rejects exact public geometry for a sensitive location", () => {
    expect(() =>
      createPublicMapPoint({
        longitude: -76.6,
        latitude: 37.6,
        precision: "exact_public",
        sensitive: true,
      }),
    ).toThrow(/generalized/i);
  });

  it("permits generalized geometry for a sensitive cultural landscape", () => {
    expect(
      createPublicMapPoint({
        longitude: -76.6,
        latitude: 37.6,
        precision: "generalized_sensitive",
        sensitive: true,
      }),
    ).toMatchObject({ precision: "generalized_sensitive", sensitive: true });
  });
});
