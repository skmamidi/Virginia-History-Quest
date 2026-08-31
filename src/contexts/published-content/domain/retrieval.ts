import { z } from "zod";

export const RetrievalChallengeSchema = z
  .object({
    id: z.string().min(1),
    heading: z.string().min(1),
    prompt: z.string().min(1),
    choices: z.array(z.string().min(1)).min(2).max(5),
    correctChoice: z.string().min(1),
    feedbackByChoice: z.record(z.string(), z.string().min(1)),
    claimIds: z.array(z.string().min(1)).min(1),
  })
  .strict()
  .superRefine((challenge, context) => {
    if (!challenge.choices.includes(challenge.correctChoice)) {
      context.addIssue({
        code: "custom",
        path: ["correctChoice"],
        message: "The correct retrieval choice must be one of the published choices.",
      });
    }
    for (const choice of challenge.choices) {
      if (!(choice in challenge.feedbackByChoice)) {
        context.addIssue({
          code: "custom",
          path: ["feedbackByChoice", choice],
          message: `Every choice needs relationship-focused feedback; missing ${choice}.`,
        });
      }
    }
  });

export type RetrievalChallenge = Readonly<
  z.infer<typeof RetrievalChallengeSchema>
>;
