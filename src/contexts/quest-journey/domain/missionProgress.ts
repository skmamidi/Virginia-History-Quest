import type { MissionId } from "../../published-content/domain/mission";

export const MISSION_STATES = [
  "LOCKED",
  "AVAILABLE",
  "ORIENTING",
  "LEARNING",
  "PRACTICING",
  "BOSS_READY",
  "PROVISIONAL_MASTERY",
  "DELAYED_CHECK_DUE",
  "TARGETED_REVIEW",
  "MASTERED",
] as const;

export type MissionState = (typeof MISSION_STATES)[number];

export interface MissionProgress {
  readonly missionId: MissionId;
  readonly state: MissionState;
  readonly lastMeaningfulStep: string | null;
  readonly provisionalMasteryAt?: string;
  readonly masteredAt?: string;
}

type OccurredEvent<Type extends string> = Readonly<{
  type: Type;
  occurredAt: string;
}>;

export type MissionEvent =
  | Readonly<{ type: "PREREQUISITE_MET" | "ADULT_OVERRIDE" }>
  | Readonly<{ type: "MISSION_OPENED" }>
  | Readonly<{ type: "ORIENTATION_COMPLETED" }>
  | Readonly<{ type: "LEARNING_COMPLETED" }>
  | Readonly<{ type: "PRACTICE_GATES_MET" }>
  | OccurredEvent<"BOSS_PASSED">
  | Readonly<{ type: "BOSS_RETRY_NEEDED" }>
  | OccurredEvent<"DELAYED_CHECK_BECAME_DUE">
  | OccurredEvent<"DELAYED_CHECK_PASSED">
  | Readonly<{ type: "DELAYED_CHECK_GAP_FOUND" }>
  | Readonly<{ type: "TARGETED_REVIEW_COMPLETED" }>
  | Readonly<{ type: "MAINTENANCE_REVIEW_DUE" }>
  | Readonly<{ type: "MEANINGFUL_STEP_REACHED"; step: string }>;

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1_000;
const MINIMUM_DELAY_DAYS = 7;

function assertValidTimestamp(timestamp: string, eventType: string): number {
  const milliseconds = Date.parse(timestamp);
  if (!Number.isFinite(milliseconds)) {
    throw new Error(`${eventType} requires a valid occurredAt timestamp.`);
  }
  return milliseconds;
}

function cannotApply(
  progress: MissionProgress,
  event: MissionEvent,
): never {
  throw new Error(
    `${progress.missionId} cannot apply ${event.type} while it is ${progress.state}.`,
  );
}

function transition(
  progress: MissionProgress,
  state: MissionState,
  additions: Partial<MissionProgress> = {},
): MissionProgress {
  return Object.freeze({ ...progress, ...additions, state });
}

/**
 * Pure aggregate transition function. In particular, a boss pass can only
 * establish provisional mastery; retained mastery needs a later retrieval.
 */
export function applyMissionEvent(
  progress: MissionProgress,
  event: MissionEvent,
): MissionProgress {
  if (event.type === "MEANINGFUL_STEP_REACHED") {
    const step = event.step.trim();
    if (step.length === 0) {
      throw new Error("A meaningful step cannot be empty.");
    }
    if (progress.state === "LOCKED") {
      return cannotApply(progress, event);
    }
    return Object.freeze({ ...progress, lastMeaningfulStep: step });
  }

  switch (progress.state) {
    case "LOCKED":
      if (event.type === "PREREQUISITE_MET" || event.type === "ADULT_OVERRIDE") {
        return transition(progress, "AVAILABLE");
      }
      break;

    case "AVAILABLE":
      if (event.type === "MISSION_OPENED") {
        return transition(progress, "ORIENTING");
      }
      break;

    case "ORIENTING":
      if (event.type === "ORIENTATION_COMPLETED") {
        return transition(progress, "LEARNING");
      }
      break;

    case "LEARNING":
      if (event.type === "LEARNING_COMPLETED") {
        return transition(progress, "PRACTICING");
      }
      break;

    case "PRACTICING":
      if (event.type === "PRACTICE_GATES_MET") {
        return transition(progress, "BOSS_READY");
      }
      break;

    case "BOSS_READY":
      if (event.type === "BOSS_PASSED") {
        assertValidTimestamp(event.occurredAt, event.type);
        return transition(progress, "PROVISIONAL_MASTERY", {
          provisionalMasteryAt: event.occurredAt,
        });
      }
      if (event.type === "BOSS_RETRY_NEEDED") {
        return transition(progress, "PRACTICING");
      }
      break;

    case "PROVISIONAL_MASTERY":
      if (event.type === "DELAYED_CHECK_BECAME_DUE") {
        const dueAt = assertValidTimestamp(event.occurredAt, event.type);
        if (progress.provisionalMasteryAt !== undefined) {
          const provisionalAt = assertValidTimestamp(
            progress.provisionalMasteryAt,
            "Stored provisional mastery",
          );
          if (dueAt - provisionalAt < MINIMUM_DELAY_DAYS * DAY_IN_MILLISECONDS) {
            throw new Error(
              "A delayed mastery check cannot become due until at least seven days after the boss pass.",
            );
          }
        }
        return transition(progress, "DELAYED_CHECK_DUE");
      }
      break;

    case "DELAYED_CHECK_DUE":
      if (event.type === "DELAYED_CHECK_PASSED") {
        assertValidTimestamp(event.occurredAt, event.type);
        return transition(progress, "MASTERED", {
          masteredAt: event.occurredAt,
        });
      }
      if (event.type === "DELAYED_CHECK_GAP_FOUND") {
        return transition(progress, "TARGETED_REVIEW");
      }
      break;

    case "TARGETED_REVIEW":
      if (event.type === "TARGETED_REVIEW_COMPLETED") {
        return transition(progress, "DELAYED_CHECK_DUE");
      }
      break;

    case "MASTERED":
      if (event.type === "MAINTENANCE_REVIEW_DUE") {
        return transition(progress, "TARGETED_REVIEW");
      }
      break;
  }

  return cannotApply(progress, event);
}

