import { z } from "zod";
import { MissionIdSchema } from "../../published-content/domain/mission";
import {
  MISSION_STATES,
  type MissionProgress,
} from "../domain/missionProgress";

interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const ProgressRecordSchema = z
  .object({
    missionId: MissionIdSchema,
    state: z.enum(MISSION_STATES),
    lastMeaningfulStep: z.string().nullable(),
    provisionalMasteryAt: z.string().optional(),
    masteredAt: z.string().optional(),
  })
  .strict();

const StoredProgressSchema = z
  .object({
    contentVersion: z.string(),
    records: z.array(ProgressRecordSchema),
  })
  .strict();

const STORAGE_KEY = "virginia-history-quest:progress";

function cloneRecords(
  records: readonly MissionProgress[],
): readonly MissionProgress[] {
  return records.map((record) => Object.freeze({ ...record }));
}

/**
 * Browser adapter for this local vertical slice. Progress is versioned and
 * pseudonymous; the store contains no child name, location, or free-form text.
 */
export class BrowserProgressStore {
  constructor(
    private readonly storage: StoragePort,
    private readonly contentVersion: string,
  ) {}

  load(seed: readonly MissionProgress[]): readonly MissionProgress[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return cloneRecords(seed);

    try {
      const parsed = StoredProgressSchema.parse(JSON.parse(raw));
      if (parsed.contentVersion !== this.contentVersion) {
        return cloneRecords(seed);
      }
      return cloneRecords(parsed.records);
    } catch {
      this.storage.removeItem(STORAGE_KEY);
      return cloneRecords(seed);
    }
  }

  save(records: readonly MissionProgress[]): void {
    const safeRecords = ProgressRecordSchema.array().parse(records);
    this.storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        contentVersion: this.contentVersion,
        records: safeRecords,
      }),
    );
  }
}
