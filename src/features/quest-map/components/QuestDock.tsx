import { Compass, Map, Shield } from "lucide-react";

export type DockAction =
  | "map"
  | "missions"
  | "timeline"
  | "people"
  | "chains"
  | "review"
  | "guide";

interface QuestDockProps {
  active: "map" | "timeline" | "standards";
  onAction: (action: DockAction) => void;
}

const items = [
  { id: "map", label: "My map", Icon: Map },
  { id: "missions", label: "Choose mission", Icon: Shield },
  { id: "guide", label: "My next step", Icon: Compass },
] as const;

export function QuestDock({ active, onAction }: QuestDockProps) {
  return (
    <nav className="quest-dock" aria-label="Learner tools">
      {items.map(({ id, label, Icon }) => {
        const isCurrent = id === "map" && active === "map";
        return (
          <button
            key={id}
            type="button"
            className={isCurrent ? "dock-active" : ""}
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => onAction(id)}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
