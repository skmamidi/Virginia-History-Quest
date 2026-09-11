import { describe, expect, it } from "vitest";
import { challengeIndex, freshProgress, hasBadge, passChallenge, prepareProgress } from "./playMission";
import type { MissionProgress } from "../domain/missionProgress";
import { MISSION_ACTIVITIES } from "../../published-content/adapters/missionActivities";
import { MISSION_IDS } from "../../published-content/domain/mission";
import { BrowserProgressStore } from "../adapters/browserProgressStore";

describe("playable mission journey", () => {
  it("starts with no unearned badges and repairs missing or locked prototype records", () => {
    expect(freshProgress).toHaveLength(13);
    expect(freshProgress.every((record) => record.state === "AVAILABLE" && !hasBadge(record))).toBe(true);
    const recovered = prepareProgress([{ missionId: "VS.9", state: "LOCKED", lastMeaningfulStep: null }]);
    expect(recovered).toHaveLength(13);
    expect(recovered.every((record) => record.state === "AVAILABLE")).toBe(true);
  });

  it.each(MISSION_IDS)("requires every question in %s before awarding a badge", (missionId) => {
    const questions = MISSION_ACTIVITIES[missionId].challenges;
    expect(questions.length).toBeGreaterThanOrEqual(10);
    expect(new Set(questions.map(q => q.prompt)).size).toBe(questions.length);
    for (const question of questions) {
      expect(new Set(question.choices).size).toBe(3);
      expect(question.choices[question.answer]).toBeTruthy();
      expect(question.clue.trim()).not.toBe('');
      expect(question.explanation.trim()).not.toBe('');
    }
    let record: MissionProgress = { missionId, state: "LEARNING", lastMeaningfulStep: null };
    for (let index = 0; index < questions.length; index++) {
      expect(challengeIndex(record)).toBe(index);
      expect(hasBadge(record)).toBe(false);
      expect(passChallenge(record, index + 1)).toBe(record);
      record = passChallenge(record, index, new Date("2026-09-08T12:00:00Z"));
      if (index < questions.length - 1) expect(passChallenge(record, index)).toBe(record);
    }
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
    const finalIndex = MISSION_ACTIVITIES['VS.1'].challenges.length - 1;
    expect(challengeIndex(due)).toBe(finalIndex);
    expect(passChallenge(due, finalIndex).state).toBe("MASTERED");
  });

  it('continues legacy three-question checkpoints without granting an early badge', () => {
    const legacy: MissionProgress = { missionId: 'VS.1', state: 'BOSS_READY', lastMeaningfulStep: 'mission-briefing' };
    expect(challengeIndex(legacy)).toBe(2);
    const next = passChallenge(legacy, 2);
    expect(next.state).toBe('PRACTICING');
    expect(challengeIndex(next)).toBe(3);
    expect(hasBadge(next)).toBe(false);
    const earned: MissionProgress = { ...legacy, state: 'PROVISIONAL_MASTERY', provisionalMasteryAt: '2026-09-08T12:00:00Z' };
    expect(prepareProgress([earned], new Date('2026-09-09'))[0]).toEqual(earned);
    expect(passChallenge(earned, 0)).toBe(earned);
  });

  it('restores question six from saved progress after a browser restart', () => {
    let saved = '';
    const store = new BrowserProgressStore({ getItem: () => saved || null, setItem: (_, value) => { saved = value; }, removeItem: () => {} }, '2026.09');
    let record: MissionProgress = { missionId: 'VS.1', state: 'LEARNING', lastMeaningfulStep: null };
    for (let index = 0; index < 5; index++) record = passChallenge(record, index);
    expect(store.save([record])).toBe(true);
    const restored = store.load(freshProgress)[0];
    expect(challengeIndex(restored)).toBe(5);
    expect(hasBadge(restored)).toBe(false);
    expect(challengeIndex(passChallenge(restored, 5))).toBe(6);
  });

  it('ignores invalid checkpoints and keeps the final memory check working', () => {
    for (const step of ['mission-question:999', 'mission-question:-1', 'mission-question:1.5', 'unrelated']) {
      expect(challengeIndex({ missionId: 'VS.1', state: 'PRACTICING', lastMeaningfulStep: step })).toBe(1);
    }
    const review: MissionProgress = { missionId: 'VS.1', state: 'TARGETED_REVIEW', lastMeaningfulStep: null, provisionalMasteryAt: '2026-09-01T12:00:00Z' };
    expect(passChallenge(review, 2)).toBe(review);
    const mastered = passChallenge(review, 9);
    expect(mastered.state).toBe('MASTERED');
    expect(mastered.provisionalMasteryAt).toBe(review.provisionalMasteryAt);
  });
});
