export type QuestViewMode = "map" | "timeline" | "standards";

export type PortalDisplayState =
  | "restored"
  | "in_progress"
  | "available"
  | "locked";

export interface QuestPortalView {
  readonly id: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly experienceTitle: string;
  readonly essentialQuestion: string;
  readonly heroLocation: string;
  readonly mapSummary: string;
  readonly dateLabel: string;
  readonly eraLabel: string;
  readonly hook: string;
  readonly learningFocus: readonly string[];
  readonly portal: {
    readonly longitude: number;
    readonly latitude: number;
    readonly precision: string;
  };
  readonly displayState: PortalDisplayState;
}

export interface MapLayers {
  terrain: boolean;
  rivers: boolean;
  thenNow: boolean;
}
