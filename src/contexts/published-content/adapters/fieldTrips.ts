import type { MissionId } from "../domain/mission";

export interface TripPlace {
  id: string;
  name: string;
  date: string;
  clue: string;
  notice: string;
  source: { label: string; url: string };
}
export interface TripChapter {
  id: string;
  title: string;
  subtitle: string;
  places: readonly TripPlace[];
  connection: string;
  question: string;
  choices: readonly string[];
  answer: number;
  hint: string;
  reflection: string;
  missionId: MissionId;
  missionLabel: string;
}
const yorktown: TripPlace = {
  id: "yorktown", name: "Yorktown", date: "1781 · Revolutionary War",
  clue: "American and French forces trapped Cornwallis’s British army. Its surrender was a turning point toward American independence. Peace came with a treaty in 1783.",
  notice: "Picture the river or earthworks you saw. How could ships and land defenses work together?",
  source: { label: "NPS · Yorktown siege", url: "https://www.nps.gov/york/learn/historyculture/history-of-the-siege.htm" },
};
const appomattox: TripPlace = {
  id: "appomattox", name: "Appomattox Court House", date: "April 9, 1865 · Civil War",
  clue: "Lee surrendered the Army of Northern Virginia to Grant in the McLean House. Other Confederate armies surrendered later. This was a major step toward the war’s end, not an instant end to every conflict.",
  notice: "A meeting in a house changed many lives. What might peace have meant to soldiers, families, and people who had been enslaved?",
  source: { label: "National Archives · The last surrenders", url: "https://www.archives.gov/publications/prologue/2015/spring/images/cw-surrenders.html" },
};
export const FIELD_TRIP_CHAPTERS: readonly TripChapter[] = [
  {
    id: "two-wars", title: "Two wars, two turning points", subtitle: "Yorktown ↔ Appomattox",
    places: [yorktown, appomattox],
    connection: "These places are connected by the idea of surrender, but they belong to different wars, 84 years apart. Yorktown helped secure independence from Britain. Appomattox helped bring the Civil War toward its end. Promises about freedom still had to become rights people could use.",
    question: "A friend says Yorktown and Appomattox ended the same war. Which clue corrects the story?",
    choices: ["Both places have old buildings", "Their dates and armies belong to different wars", "Every surrender means the same thing"], answer: 1,
    hint: "Compare 1781 with 1865. Look at the war named beside each date.",
    reflection: "Think back to both visits. What was similar about the places? What evidence showed you their stories were different?",
    missionId: "VS.5", missionLabel: "Explore the Revolution",
  },
  {
    id: "freedom", title: "People reaching for freedom", subtitle: "Harpers Ferry → Norfolk → Hampton",
    places: [
      { id: "harpers", name: "Harpers Ferry & John Brown Museum", date: "1859 · Before the Civil War",
        clue: "John Brown and his group attacked the federal armory, hoping to begin an uprising against slavery. The raid failed and people died. It deepened the national conflict over slavery; it was not the war’s only cause. Harpers Ferry was then in Virginia and is now in West Virginia.",
        notice: "Remember an exhibit or the film at the John Brown Museum. What did it show about Brown’s goals and the consequences of his actions?",
        source: { label: "NPS · John Brown’s raid", url: "https://www.nps.gov/hafe/learn/historyculture/stories.htm" } },
      { id: "norfolk", name: "Norfolk", date: "May 1861 · Hampton Roads waters",
        clue: "At Sewell’s Point, in what is now Norfolk, Frank Baker, Shepard Mallory, and James Townsend were forced to build Confederate defenses. They escaped across Hampton Roads to seek freedom at Fort Monroe.",
        notice: "Remember the waterfront. Water could separate people from safety—and offer a route toward it.",
        source: { label: "NPS · Baker, Mallory, and Townsend", url: "https://www.nps.gov/places/building-1-quarters-no-1.htm" } },
      { id: "hampton", name: "Hampton / Hampton Roads", date: "May 1861 · Nearby connection: Fort Monroe",
        clue: "Fort Monroe is in Hampton. Union commander Benjamin Butler refused to return the three men to enslavement. Their choices helped challenge slavery during the war. This did not immediately free every enslaved person.",
        notice: "Whether or not you visited the fort, connect your Hampton trip to the same waterway you saw around Norfolk.",
        source: { label: "NPS · Fort Monroe and freedom-seekers", url: "https://www.nps.gov/articles/fort-monroe-and-the-contrabands-of-war.htm" } },
    ],
    connection: "Harpers Ferry and Hampton Roads connect through the struggle against slavery—not one shared journey. Brown attempted an armed uprising in 1859. In 1861, Baker, Mallory, and Townsend took action to seek their own freedom. The Norfolk-to-Hampton crossing is a direct geographic link.",
    question: "Which is an actual journey connecting two of these places?",
    choices: ["John Brown traveling from Yorktown to Appomattox in 1781", "Every enslaved person becoming free at once", "Baker, Mallory, and Townsend crossing from Sewell’s Point to Fort Monroe"], answer: 2,
    hint: "Find the clue that names three men and a crossing over Hampton Roads.",
    reflection: "Who is taking action in each story? What could a museum object, a personal account, or a map help you understand?",
    missionId: "VS.7", missionLabel: "Explore the Civil War",
  },
  {
    id: "final-days", title: "Three places, four April days", subtitle: "Sailor’s Creek → High Bridge → Appomattox",
    places: [
      { id: "sailors", name: "Sailor’s Creek Battlefield State Park", date: "April 6, 1865 · A retreat under pressure",
        clue: "As Lee’s army retreated toward supplies around Farmville, Union forces attacked at Sailor’s Creek. Heavy Confederate losses made the army’s situation more difficult.",
        notice: "Recall the fields and slopes. How could the shape of the land affect people trying to move?",
        source: { label: "Virginia State Parks · Sailor’s Creek", url: "https://www.dcr.virginia.gov/state-parks/sailors-creek" } },
      { id: "high-bridge", name: "High Bridge Trail State Park", date: "April 7, 1865 · The river crossing",
        clue: "Fighting occurred around High Bridge on April 6 and 7. After Sailor’s Creek, parts of the Confederate army crossed the Appomattox River here. On April 7, Union troops saved the lower wagon bridge from burning, helping them keep up the pursuit.",
        notice: "Picture the wide river valley beneath the trail. Why might a usable crossing matter as much as a road?",
        source: { label: "Virginia State Parks · The burning of High Bridge", url: "https://www.dcr.virginia.gov/state-parks/blog/critical-role-of-high-bridge" } },
      appomattox,
    ],
    connection: "The dates tell a connected story: losses at Sailor’s Creek on April 6, pursuit across the river at High Bridge on April 7, and Lee’s surrender at Appomattox on April 9. Supplies, crossings, and military pressure all mattered. The arrows connect events; they are not an exact route taken by every soldier.",
    question: "Why does High Bridge belong between Sailor’s Creek and Appomattox in this story?",
    choices: ["The April 7 crossing helped Union troops continue their pursuit", "It was where the Revolution began", "The bridge alone caused every army to surrender"], answer: 0,
    hint: "Follow April 6 → April 7 → April 9. Think about what a river crossing lets an army do.",
    reflection: "Your trail walk, battlefield visit, and village visit connect! If you drew one evidence arrow between them, what would its label say?",
    missionId: "VS.8", missionLabel: "What happened after the war?",
  },
];

export const MISSION_TRIP_LINKS: Partial<Record<MissionId, { chapter: number; label: string; clue: string }>> = {
  "VS.1": { chapter: 2, label: "Remember High Bridge?", clue: "The river valley you crossed shows why geography matters. Follow a river crossing through three places you visited." },
  "VS.5": { chapter: 0, label: "You’ve visited Yorktown!", clue: "Connect Yorktown’s Revolutionary War story with Appomattox—another surrender, in a different war." },
  "VS.6": { chapter: 1, label: "Remember the John Brown Museum?", clue: "Compare promises about rights with the continued existence of slavery before the Civil War." },
  "VS.7": { chapter: 2, label: "Connect your Civil War visits", clue: "Sailor’s Creek, High Bridge, and Appomattox are connected by the final days of Lee’s army. Explore the other chapters for Harpers Ferry and Hampton Roads." },
  "VS.8": { chapter: 2, label: "What came after Appomattox?", clue: "Surrender did not settle every question about citizenship, education, or equal rights. Your Appomattox visit leads into Reconstruction." },
  "VS.9": { chapter: 2, label: "A trail with a railroad story", clue: "High Bridge connects your trail visit to the importance of transportation networks. Explore its Civil War crossing story." },
};
