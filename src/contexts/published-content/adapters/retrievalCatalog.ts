import {
  RetrievalChallengeSchema,
  type RetrievalChallenge,
} from "../domain/retrieval";

/**
 * Published-content adapter for the map vertical slice. Claim IDs are retained
 * so a future content API can replace this local record without changing UI.
 */
export const DAILY_MAP_RETRIEVAL: RetrievalChallenge =
  RetrievalChallengeSchema.parse({
    id: "RET-VS3-MAP-001",
    heading: "Today’s map clue",
    prompt: "Which river carried ships to Jamestown?",
    choices: ["James River", "York River", "Potomac River"],
    correctChoice: "James River",
    feedbackByChoice: {
      "James River":
        "That’s it. The James River connected Jamestown with the Chesapeake Bay and Atlantic routes.",
      "York River":
        "Good map thinking. The York River reaches Yorktown; Jamestown sits on the James River.",
      "Potomac River":
        "The Potomac crosses northern Virginia. Look farther south for the river beside Jamestown.",
    },
    claimIds: ["CLAIM-VS1-JAMES-ROUTE", "CLAIM-VS3-JAMESTOWN-LOCATION"],
  });
