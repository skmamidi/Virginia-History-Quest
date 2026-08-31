import { z } from "zod";

export const MISSION_IDS = [
  "VS.1",
  "VS.2",
  "VS.3",
  "VS.4",
  "VS.5",
  "VS.6",
  "VS.7",
  "VS.8",
  "VS.9",
  "VS.10",
  "VS.11",
  "VS.12",
  "VS.13",
] as const;

export const MissionIdSchema = z.enum(MISSION_IDS, {
  error: "Mission id must use a canonical identifier from VS.1 through VS.13",
});

export type MissionId = z.infer<typeof MissionIdSchema>;

export function parseMissionId(candidate: unknown): MissionId {
  const result = MissionIdSchema.safeParse(candidate);

  if (!result.success) {
    throw new Error(
      `Mission id must use a canonical identifier from VS.1 through VS.13; received ${JSON.stringify(candidate)}.`,
    );
  }

  return result.data;
}

export const MISSION_TITLES = {
  "VS.1": "Virginia: Land, Water, and Human Movement",
  "VS.2": "Indigenous Virginia: Deep History and Living Nations",
  "VS.3": "Jamestown: Choices, Survival, Encounters, and Government",
  "VS.4": "Colonial Virginia: Land, Labor, Law, and Daily Life",
  "VS.5": "Revolution in Virginia: Ideas, Choices, War, and Independence",
  "VS.6":
    "Building a New Nation: Rights, Government, Expansion, and Resistance",
  "VS.7":
    "Civil War in Virginia: Slavery, Division, Service, and Consequence",
  "VS.8":
    "Reconstruction: Freedom, Citizenship, Education, and Resistance",
  "VS.9": "Railroads, Cities, Industry, and a Changing Virginia",
  "VS.10":
    "Virginia in the World Wars: Mobilization, Service, Home Front, and Memory",
  "VS.11":
    "Civil Rights in Virginia: Students, Courts, Communities, and Change",
  "VS.12": "Virginia, the “Mother of Presidents”",
  "VS.13":
    "Virginia in the Global Economy: Products, Networks, Science, and Innovation",
} as const satisfies Readonly<Record<MissionId, string>>;

const LearnerTextSchema = z.string().trim().min(1);

/**
 * Mission portals contain public, intentionally generalized points only. More
 * detailed source geometry belongs to the geography context and is not shipped
 * in the learner catalog.
 */
export const MissionPortalSchema = z
  .object({
    longitude: z.number().finite().min(-180).max(180),
    latitude: z.number().finite().min(-90).max(90),
    precision: z.enum([
      "approximate",
      "generalized_sensitive",
      "route",
      "region",
      "water_body",
    ]),
    sensitive: z.boolean().default(false),
  })
  .strict()
  .superRefine((portal, context) => {
    if (
      portal.precision === "generalized_sensitive" &&
      portal.sensitive === false
    ) {
      context.addIssue({
        code: "custom",
        path: ["sensitive"],
        message:
          "A generalized_sensitive mission portal must be marked sensitive.",
      });
    }
  });

export const PublishedMissionSummarySchema = z
  .object({
    id: MissionIdSchema,
    title: LearnerTextSchema,
    shortTitle: LearnerTextSchema,
    experienceTitle: LearnerTextSchema,
    essentialQuestion: LearnerTextSchema,
    heroLocation: LearnerTextSchema,
    mapSummary: LearnerTextSchema,
    dateLabel: LearnerTextSchema,
    eraLabel: LearnerTextSchema,
    hook: LearnerTextSchema,
    learningFocus: z.array(LearnerTextSchema).min(2).max(3),
    portal: MissionPortalSchema,
    status: z.literal("published"),
  })
  .strict()
  .superRefine((mission, context) => {
    if (mission.title !== MISSION_TITLES[mission.id]) {
      context.addIssue({
        code: "custom",
        path: ["title"],
        message: `${mission.id} must use its canonical curriculum title.`,
      });
    }
  });

export type PublishedMissionSummary = Readonly<
  z.infer<typeof PublishedMissionSummarySchema>
>;

export const MissionCatalogSchema = z
  .object({
    version: z.string().regex(/^\d{4}\.\d{2}$/, {
      message: "Catalog version must use YYYY.MM format",
    }),
    missions: z.array(PublishedMissionSummarySchema).length(MISSION_IDS.length),
  })
  .strict()
  .superRefine((catalog, context) => {
    const counts = new Map<MissionId, number>(
      MISSION_IDS.map((missionId) => [missionId, 0]),
    );

    for (const mission of catalog.missions) {
      counts.set(mission.id, (counts.get(mission.id) ?? 0) + 1);
    }

    for (const missionId of MISSION_IDS) {
      const count = counts.get(missionId) ?? 0;
      if (count !== 1) {
        context.addIssue({
          code: "custom",
          path: ["missions"],
          message: `Catalog must contain exactly one published ${missionId} mission; found ${count}.`,
        });
      }
    }
  });

export type MissionCatalog = Readonly<{
  version: string;
  missions: readonly PublishedMissionSummary[];
}>;

export function missionNumber(missionId: MissionId): number {
  return Number(missionId.slice(3));
}
