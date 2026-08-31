import { List, Pause, Play, Volume2, VolumeX } from "lucide-react";

interface QuestHeaderProps {
  motionPaused: boolean;
  audioEnabled: boolean;
  onToggleMotion: () => void;
  onToggleAudio: () => void;
  onOpenMissions: () => void;
}

export function QuestHeader({
  motionPaused,
  audioEnabled,
  onToggleMotion,
  onToggleAudio,
  onOpenMissions,
}: QuestHeaderProps) {
  return (
    <header className="quest-header">
      <a className="brand" href="#quest-map" aria-label="Virginia History Quest home">
        <img
          className="brand-mark"
          src="/assets/quest-compass.png"
          alt=""
          width="56"
          height="56"
        />
        <span>Virginia History Quest</span>
      </a>
      <div className="header-actions" aria-label="Experience controls">
        <button
          className="header-button"
          type="button"
          aria-pressed={motionPaused}
          onClick={onToggleMotion}
        >
          {motionPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          <span>{motionPaused ? "Resume motion" : "Pause motion"}</span>
        </button>
        <button
          className="header-button"
          type="button"
          aria-pressed={audioEnabled}
          onClick={onToggleAudio}
        >
          {audioEnabled ? (
            <Volume2 aria-hidden="true" />
          ) : (
            <VolumeX aria-hidden="true" />
          )}
          <span>{audioEnabled ? "Audio on" : "Audio off"}</span>
        </button>
        <button
          className="header-button header-menu-button"
          type="button"
          aria-label="Open mission directory from header"
          onClick={onOpenMissions}
        >
          <List aria-hidden="true" />
          <span>All missions</span>
        </button>
      </div>
    </header>
  );
}
