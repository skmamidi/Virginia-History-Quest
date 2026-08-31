import { z } from "zod";

/**
 * The precision labels are deliberately about what may be published, not about
 * the accuracy of the source record. Exact source geometry stays server-side.
 */
export const GeometryPrecisionSchema = z.enum([
  "exact_public",
  "approximate",
  "generalized_sensitive",
  "route",
  "region",
  "water_body",
]);

export type GeometryPrecision = z.infer<typeof GeometryPrecisionSchema>;

const LongitudeSchema = z
  .number()
  .finite()
  .min(-180, "Longitude must be at least -180 degrees")
  .max(180, "Longitude must be at most 180 degrees");

const LatitudeSchema = z
  .number()
  .finite()
  .min(-90, "Latitude must be at least -90 degrees")
  .max(90, "Latitude must be at most 90 degrees");

export const PublicMapPointSchema = z
  .object({
    longitude: LongitudeSchema,
    latitude: LatitudeSchema,
    precision: GeometryPrecisionSchema,
    sensitive: z.boolean(),
  })
  .strict()
  .superRefine((point, context) => {
    if (point.sensitive && point.precision === "exact_public") {
      context.addIssue({
        code: "custom",
        path: ["precision"],
        message:
          "A sensitive location must use generalized public geometry; exact public coordinates are not allowed.",
      });
    }

    if (point.precision === "generalized_sensitive" && !point.sensitive) {
      context.addIssue({
        code: "custom",
        path: ["sensitive"],
        message:
          "Geometry marked generalized_sensitive must also be marked sensitive.",
      });
    }
  });

export type PublicMapPoint = Readonly<z.infer<typeof PublicMapPointSchema>>;

/**
 * The only constructor for a point destined for a learner-visible map.
 * Zod's parsed copy prevents callers from mutating the returned value through
 * their original input object; freezing makes that boundary explicit.
 */
export function createPublicMapPoint(
  input: z.input<typeof PublicMapPointSchema>,
): PublicMapPoint {
  return Object.freeze(PublicMapPointSchema.parse(input));
}

