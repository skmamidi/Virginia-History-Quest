import { describe, expect, it } from "vitest";
import type { MissionProgress } from "../domain/missionProgress";
import { BrowserProgressStore } from "./browserProgressStore";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

const seed: readonly MissionProgress[] = [
  { missionId: "VS.1", state: "MASTERED", lastMeaningfulStep: "map" },
  { missionId: "VS.3", state: "LEARNING", lastMeaningfulStep: "evidence" },
];

describe("BrowserProgressStore", () => {
  it("returns seed progress when no compatible record exists", () => {
    const store = new BrowserProgressStore(new MemoryStorage(), "2026.08");
    expect(store.load(seed)).toEqual(seed);
  });

  it("round-trips versioned progress without mutating the seed", () => {
    const storage = new MemoryStorage();
    const store = new BrowserProgressStore(storage, "2026.08");
    const updated: readonly MissionProgress[] = [
      { missionId: "VS.3", state: "ORIENTING", lastMeaningfulStep: "briefing" },
    ];

    store.save(updated);
    expect(store.load(seed)).toEqual(updated);
    expect(seed[1].state).toBe("LEARNING");
  });

  it("fails safely on malformed or stale browser data", () => {
    const storage = new MemoryStorage();
    storage.setItem("virginia-history-quest:progress", "not-json");
    expect(new BrowserProgressStore(storage, "2026.08").load(seed)).toEqual(seed);

    new BrowserProgressStore(storage, "2025.01").save([
      { missionId: "VS.2", state: "MASTERED", lastMeaningfulStep: null },
    ]);
    expect(new BrowserProgressStore(storage, "2026.08").load(seed)).toEqual(seed);
  });
});
