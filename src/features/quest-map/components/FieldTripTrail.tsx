import { useEffect, useRef, useState } from "react";
import { Award, CheckCircle2, ChevronRight, Lightbulb, MapPin } from "lucide-react";
import { FIELD_TRIP_CHAPTERS, MISSION_TRIP_LINKS } from "../../../contexts/published-content/adapters/fieldTrips";
import type { MissionId } from "../../../contexts/published-content/domain/mission";
import { PageContent } from "./PageContent";

const STAMP_KEY = "virginia-history-quest:field-trips:v1";
export function readTripStamps(storage: Pick<Storage, "getItem">): string[] {
  try {
    const value: unknown = JSON.parse(storage.getItem(STAMP_KEY) ?? "[]");
    return Array.isArray(value) ? FIELD_TRIP_CHAPTERS.map((chapter) => chapter.id).filter((id) => value.includes(id)) : [];
  } catch { return []; }
}

export function MissionTripClue({ missionId, onOpen }: { missionId: MissionId; onOpen?: (chapter: number) => void }) {
  const link = MISSION_TRIP_LINKS[missionId];
  if (!link) return null;
  return <div className="mission-trip-clue">
    <MapPin aria-hidden="true" /><div><strong>{link.label}</strong><p>{link.clue}</p>
      {onOpen ? <button type="button" onClick={() => onOpen(link.chapter)}>Connect these places <ChevronRight aria-hidden="true" /></button> : null}
    </div>
  </div>;
}

export function FieldTripTrail({ initialChapter = 0, onClose, onMission }: {
  initialChapter?: number; onClose: () => void; onMission: (id: MissionId) => void;
}) {
  const [chapterIndex, setChapterIndex] = useState(Math.max(0, Math.min(2, initialChapter)));
  const [stopIndex, setStopIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [stamps, setStamps] = useState<string[]>(() => {
    try { return readTripStamps(window.localStorage); } catch { return []; }
  });
  const [saveWarning, setSaveWarning] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const chapter = FIELD_TRIP_CHAPTERS[chapterIndex];
  const place = chapter.places[stopIndex];
  const solved = checked && answer === chapter.answer;
  useEffect(() => { heading.current?.focus(); }, [chapterIndex, stopIndex]);

  function selectChapter(index: number) {
    setChapterIndex(index); setStopIndex(0); setAnswer(null); setChecked(false); setHint(false);
  }
  function checkConnection() {
    setChecked(true);
    if (answer === chapter.answer) {
      const next = Array.from(new Set([...stamps, chapter.id]));
      setStamps(next);
      try { window.localStorage.setItem(STAMP_KEY, JSON.stringify(next)); setSaveWarning(false); }
      catch { setSaveWarning(true); }
    }
  }

  return <PageContent label="Connect our field trips" titleId="field-trip-title" className="field-trip-trail" onClose={onClose}>
    <h2 id="field-trip-title">Connect our field trips</h2>
    <p className="modal-lead">You’ve stood in these places. Now uncover the stories between them!</p>
    <nav className="trip-chapters" aria-label="Field trip stories">
      {FIELD_TRIP_CHAPTERS.map((item, index) => <button key={item.id} type="button" aria-pressed={index === chapterIndex} onClick={() => selectChapter(index)}>
        {stamps.includes(item.id) ? <CheckCircle2 aria-hidden="true" /> : <span>{index + 1}</span>}{item.title}
      </button>)}
    </nav>
    <p className="trip-stamp-count"><Award aria-hidden="true" />{stamps.length} of 3 connections discovered</p>
    <h3 className="trip-story-heading">{chapter.title}</h3>
    <p className="trip-subtitle">{chapter.subtitle}</p>
    <ol className="trip-place-trail" aria-label="Connected places">
      {chapter.places.map((item, index) => <li key={item.id}>
        <button type="button" aria-label={`Place ${index + 1}: ${item.name}`} aria-current={index === stopIndex ? "step" : undefined} onClick={() => setStopIndex(index)}>
          <span aria-hidden="true">{index + 1}</span><span className="trip-place-name">{item.name}</span>
        </button>
      </li>)}
    </ol>
    {place ? <article className="trip-stop" key={place.id}>
      <p className="field-label">Place {stopIndex + 1} of {chapter.places.length} · {place.date}</p>
      <h4 ref={heading} tabIndex={-1}><MapPin aria-hidden="true" />{place.name}</h4>
      <p>{place.clue}</p>
      <button className="primary-action" type="button" onClick={() => setStopIndex(stopIndex + 1)}>
        {chapter.places[stopIndex + 1] ? `Next place: ${chapter.places[stopIndex + 1].name}` : "Solve the connection"}<ChevronRight aria-hidden="true" />
      </button>
      <details className="trip-reflection"><summary>Think back to your visit</summary><p>{place.notice}</p><p>You can think, talk, or sketch. You don’t need to type anything.</p></details>
      <a className="trip-source" href={place.source.url} target="_blank" rel="noreferrer">{place.source.label}</a>
      {place.id === "harpers" ? <a className="trip-source" href="https://www.nps.gov/places/000/john-brown-museum.htm" target="_blank" rel="noreferrer">NPS · Inside the John Brown Museum</a> : null}

    </article> : <section className="trip-puzzle" aria-labelledby="trip-question">
      <p className="next-step-cue"><Lightbulb aria-hidden="true" />Use the place clues to connect the story.</p>
      <h4 ref={heading} tabIndex={-1} id="trip-question">{chapter.question}</h4>
      <div className="challenge-choices" role="group" aria-label="Connection answers">
        {chapter.choices.map((choice, index) => <button key={choice} type="button" className="challenge-choice" aria-pressed={answer === index} disabled={solved} onClick={() => { setAnswer(index); setChecked(false); }}>
          <span className="choice-marker" aria-hidden="true">{String.fromCharCode(65 + index)}</span>{choice}
        </button>)}
      </div>
      {!solved ? <>
        <button type="button" className="hint-button" aria-expanded={hint} onClick={() => setHint(!hint)}>Need a connection clue?</button>
        {hint || (checked && !solved) ? <p className="clue-card">{chapter.hint}</p> : null}
      </> : null}
      <div role="status" className={`challenge-feedback ${solved ? "feedback-correct" : ""}`}>
        {solved ? <><strong><CheckCircle2 aria-hidden="true" />Connection discovered!</strong><p>{chapter.connection}</p></> : checked ? <p>Look at the clue and try another answer. Your discoveries are safe.</p> : null}
      </div>
      {solved ? <>
        {stamps.length === 3 ? <p className="trip-complete"><Award aria-hidden="true" /><strong>Field-trip Connector!</strong> You linked all three stories.</p> : null}
        <details className="trip-reflection"><summary>Your turn to be the museum guide</summary><p>{chapter.reflection}</p></details>
        {chapterIndex < 2 ? <button className="primary-action" type="button" onClick={() => selectChapter(chapterIndex + 1)}>Next story: {FIELD_TRIP_CHAPTERS[chapterIndex + 1].title}<ChevronRight aria-hidden="true" /></button> : null}
        <button className={chapterIndex === 2 ? "primary-action" : "secondary-action"} type="button" onClick={() => onMission(chapter.missionId)}>{chapter.missionLabel}<ChevronRight aria-hidden="true" /></button>
      </> : <button className="primary-action" type="button" disabled={answer === null} onClick={checkConnection}>Check my connection<ChevronRight aria-hidden="true" /></button>}
    </section>}
    {saveWarning ? <p role="status">Your discoveries count for this visit, but this browser couldn’t save them for next time.</p> : null}
    <p className="checkpoint-note">These are connections through history, not driving directions. Your three field-trip discoveries are separate from mission badges.</p>
  </PageContent>;
}
