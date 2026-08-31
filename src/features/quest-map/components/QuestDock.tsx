import { BookOpenCheck, Clock3, Link2, Map, Shield, Users } from "lucide-react";

export type DockAction =
  | "map"
  | "missions"
  | "timeline"
  | "people"
  | "chains"
  | "review";

interface QuestDockProps {
  active: "map" | "timeline" | "standards";
  onAction: (action: DockAction) => void;
}

const items = [
  { id: "map", label: "Quest Map", Icon: Map },
  { id: "missions", label: "Time Portals", Icon: Shield },
  { id: "timeline", label: "Timeline Lab", Icon: Clock3 },
  { id: "people", label: "People Deck", Icon: Users },
  { id: "chains", label: "Chain Lab", Icon: Link2 },
  { id: "review", label: "Review", Icon: BookOpenCheck },
] as const;

export function QuestDock({ active, onAction }: QuestDockProps) {
  return (
    <nav className="quest-dock" aria-label="Learner tools">
      {items.map(({ id, label, Icon }) => {
        const isCurrent = id === "map" ? active === "map" : id === "timeline" ? active === "timeline" : false;
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
