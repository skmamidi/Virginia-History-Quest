import type { MissionId } from "../domain/mission";

export interface MissionChallenge {
  prompt: string;
  clue: string;
  choices: readonly string[];
  answer: number;
  explanation: string;
  kind?: "order";
}
export interface MissionActivity {
  badge: string;
  goal: string;
  challenges: readonly [MissionChallenge, MissionChallenge, MissionChallenge];
}
const choice = (prompt: string, clue: string, choices: string[], answer: number, explanation: string): MissionChallenge =>
  ({ prompt, clue, choices, answer, explanation });
const order = (prompt: string, clue: string, choices: string[], explanation: string): MissionChallenge =>
  ({ prompt, clue, choices, answer: 0, explanation, kind: "order" });

/** Original child-facing practice activities. Order arrays are stored in correct order. */
export const MISSION_ACTIVITIES: Record<MissionId, MissionActivity> = {
  "VS.1": {
    badge: "Trail Finder", goal: "Repair the map! Follow rivers and piece Virginia’s regions back together.",
    challenges: [
      choice("Your boat reaches the Fall Line. What might block its path?", "The Fall Line marks a change from the Piedmont to the Coastal Plain. Water tumbles over rocks here.", ["A desert", "Waterfalls and rapids", "An ocean of ice"], 1, "Rapids can stop boats. People moved goods around them, helping trading centers grow."),
      order("Build a trail from east to west.", "Start at the Atlantic coast. Cross the rolling Piedmont before reaching the Blue Ridge mountains.", ["Coastal Plain", "Piedmont", "Blue Ridge"], "You traveled inland: Coastal Plain → Piedmont → Blue Ridge. Valley and Ridge and the Appalachian Plateau lie farther west."),
      choice("A town needs to move heavy goods before trucks exist. Which place helps?", "Think of a natural route that can carry a boat.", ["Beside a navigable river", "On an isolated peak", "Far from every route"], 0, "Navigable rivers helped people travel and trade. Geography influenced where towns grew."),
    ],
  },
  "VS.2": {
    badge: "Careful Listener", goal: "Gather clues about Virginia’s Indigenous peoples, past and present.",
    challenges: [
      choice("Which clue reminds us that Indigenous history continues today?", "Virginia’s tribal communities continue to share their languages, traditions, and stories.", ["Only old objects matter", "All communities disappeared", "Living tribal communities"], 2, "Indigenous peoples are part of Virginia today. Their own voices are essential evidence."),
      choice("You find an old pottery fragment. What should you do?", "Where an object is found helps archaeologists understand it. Moving it can erase that information.", ["Take it home", "Leave it and tell a responsible adult", "Dig for more"], 1, "Protect the place and seek help. Evidence belongs in its context, not in a souvenir bag."),
      choice("How can you learn about a tribal community’s traditions?", "A good investigator listens to people and checks more than one source.", ["Listen to that community and study evidence", "Guess from one picture", "Assume all tribes are the same"], 0, "Communities have different histories and traditions. Listen carefully instead of treating everyone as the same."),
    ],
  },
  "VS.3": {
    badge: "River Detective", goal: "Investigate Jamestown’s river, risky choices, and first assembly.",
    challenges: [
      choice("Find the water route beside Jamestown.", "Jamestown stood beside the James River, which connects to the Chesapeake Bay.", ["Potomac River", "James River", "Ohio River"], 1, "The James River connected Jamestown to the bay and arriving ships."),
      order("Repair Jamestown’s timeline: earliest first.", "The settlement began in 1607. The Starving Time came in 1609–1610. An assembly met in 1619.", ["1607: Jamestown founded", "1609–1610: Starving Time", "1619: Assembly meets"], "Survival was uncertain. The settlement endured and later developed a representative assembly, though many people had no voice in it."),
      choice("Ships can reach the settlement, but its water is unhealthy. What does that show?", "A location can offer an advantage and a danger at the same time.", ["Every river is safe to drink", "Ships solve every problem", "A useful location can still be risky"], 2, "Access for ships helped, but unhealthy water and shortages threatened survival. One advantage did not erase the risks."),
    ],
  },
  "VS.4": {
    badge: "Community Investigator", goal: "Follow a colonial crop and uncover who did the work.",
    challenges: [
      choice("Which crop became a major colonial Virginia export?", "Planters sold tobacco overseas. Growing it required land and a great deal of labor.", ["Tobacco", "Bananas", "Coffee"], 0, "Tobacco brought wealth to some colonists, while its production depended on unequal labor systems."),
      order("Follow tobacco from field to market.", "First grow the crop, then carry it to a ship, then send it to buyers overseas.", ["Grow and harvest", "Load ships on the river", "Sell overseas"], "Fields, rivers, ships, and markets formed a trade network."),
      choice("Who must be included in a story about plantation work?", "Enslaved people were forced to work without freedom. Their experiences are central to this history.", ["Only plantation owners", "Only ship captains", "Enslaved workers as well as owners"], 2, "A complete history includes the people who did the work and the laws that denied their freedom."),
    ],
  },
  "VS.5": {
    badge: "Timeline Tracker", goal: "Connect a declaration, a siege, and the path to independence.",
    challenges: [
      choice("What did the Declaration of Independence announce?", "In 1776, the colonies declared that they were separating from Great Britain.", ["A new royal tax", "Independence from Britain", "The end of all wars"], 1, "The declaration announced independence. Winning it still required a long war."),
      order("Put these Revolutionary events in order.", "Compare the dates: 1776, 1781, then 1783.", ["1776: Independence declared", "1781: British surrender at Yorktown", "1783: Peace treaty"], "Yorktown was a major turning point; the Treaty of Paris formally recognized independence in 1783."),
      choice("Why study different people’s experiences of the Revolution?", "Promises of liberty did not give everyone equal rights or freedom.", ["Everyone experienced it alike", "Only generals made choices", "Freedom meant different things to different people"], 2, "Enslaved people, women, Indigenous peoples, Patriots, and Loyalists faced different choices and consequences."),
    ],
  },
  "VS.6": {
    badge: "Rights Explorer", goal: "Investigate how a new nation turned ideas about rights into laws.",
    challenges: [
      choice("What is a constitution for?", "A constitution sets out a government’s structure and powers.", ["Organizing government", "Listing every road", "Predicting weather"], 0, "The U.S. Constitution established a framework for the national government."),
      order("Rebuild the new nation’s timeline.", "The Constitution was written in 1787. Washington became president in 1789. The Bill of Rights followed in 1791.", ["1787: Constitution written", "1789: Washington takes office", "1791: Bill of Rights ratified"], "Building a government took several steps, including adding protections for individual rights."),
      choice("Did promises about liberty mean everyone was free?", "Slavery continued after the new government was formed.", ["Yes, immediately", "No; slavery and unequal rights continued", "Only maps can tell us"], 1, "Compare a country’s promises with people’s experiences. They did not always match."),
    ],
  },
  "VS.7": {
    badge: "Evidence Connector", goal: "Connect slavery, the Civil War, and the struggle for freedom.",
    challenges: [
      choice("Which issue was central to Southern secession?", "Seceding states sought to protect slavery. Secession means leaving the Union.", ["A shortage of rivers", "Protecting slavery", "Choosing a national bird"], 1, "Slavery was central to secession and the conflict that led to the Civil War."),
      order("Place these events on the timeline.", "The war began in 1861. West Virginia became a state in 1863. The war ended in 1865.", ["1861: Civil War begins", "1863: West Virginia becomes a state", "1865: Civil War ends"], "Virginia was divided by the war. West Virginia became a separate state during the conflict."),
      choice("Which amendment abolished slavery in the United States?", "The Thirteenth Amendment was ratified in 1865, the year the Civil War ended.", ["First Amendment", "Tenth Amendment", "Thirteenth Amendment"], 2, "The Thirteenth Amendment abolished slavery, except as punishment for a crime. The struggle for equal rights continued."),
    ],
  },
  "VS.8": {
    badge: "Change Detective", goal: "Look for changes after emancipation—and barriers that remained.",
    challenges: [
      choice("What does Reconstruction refer to?", "After the Civil War, the country faced rebuilding and questions about freedom, citizenship, and power.", ["Rebuilding and political change after the Civil War", "Building Jamestown", "The start of the Revolution"], 0, "Reconstruction involved rebuilding communities and defining rights after slavery."),
      order("Connect these constitutional changes in time.", "Follow the amendment numbers: 13, 14, 15.", ["13th: Abolishes slavery", "14th: Establishes citizenship protections", "15th: Bars race-based voting restrictions"], "These amendments changed the Constitution. Resistance still kept many people from exercising their rights."),
      choice("A new law promises rights, but people face threats when voting. What should you conclude?", "A right on paper is not always a right people can safely use.", ["The threats do not matter", "Everyone can vote safely", "The promise and the experience differ"], 2, "To understand change, examine laws and what actually happened in people’s lives."),
    ],
  },
  "VS.9": {
    badge: "Network Navigator", goal: "Reconnect resources, railroads, and growing towns.",
    challenges: [
      choice("How did railroads help Virginia’s industries?", "Trains moved coal, lumber, and other goods between inland communities and markets.", ["They stopped trade", "They connected goods to markets", "They removed the need for workers"], 1, "Rail connections helped industries and cities grow by moving people and heavy goods."),
      order("Build a resource-to-market route.", "A resource is gathered, transported, and then used or sold.", ["Gather coal or lumber", "Carry it by rail", "Deliver it to a market"], "A railroad connected places into a network; an isolated track alone could not do the job."),
      choice("A railroad helps a factory grow. What else should an investigator ask?", "Economic growth can affect owners, workers, and nearby communities differently.", ["How did workers and communities experience it?", "Were all people affected identically?", "Can we ignore the people?"], 0, "Follow both the goods and the people to understand the benefits and costs of industrial change."),
    ],
  },
  "VS.10": {
    badge: "Home Front Historian", goal: "Trace how people at home supported wartime service.",
    challenges: [
      choice("What was the home front?", "During the world wars, civilians worked, conserved supplies, and supported the war effort at home.", ["Only the front of a house", "Only a battlefield", "Civilian life and work during war"], 2, "War changed life beyond battlefields, including work and family routines."),
      order("Trace supplies from makers to people who need them.", "Supplies must be made before they can be packed and shipped.", ["Workers make supplies", "Pack and transport them", "Deliver them to service members"], "Factories, transport workers, ports, and ships were connected parts of wartime mobilization."),
      choice("Which pair of sources gives a fuller picture of wartime life?", "Compare accounts from people with different roles.", ["Two copies of the same poster", "A service member’s letter and a factory worker’s account", "A guess with no evidence"], 1, "Different perspectives help us understand service, work, sacrifice, and how people remembered the wars."),
    ],
  },
  "VS.11": {
    badge: "Voice for Change", goal: "Follow students and communities working for equal education.",
    challenges: [
      choice("Who helped launch the 1951 school strike in Farmville?", "Barbara Johns was a student at Robert Russa Moton High School. Students protested unequal school conditions.", ["Barbara Johns", "George Washington", "John Rolfe"], 0, "Students could organize for change. Their actions helped lead to a legal challenge to school segregation."),
      order("Put these civil-rights events in order.", "Start with the student strike in 1951, then the court ruling in 1954, then school closings in 1959.", ["1951: Moton students strike", "1954: Brown ruling", "1959: Prince Edward closes public schools"], "The Supreme Court ruled school segregation unconstitutional, but resistance to integration continued."),
      choice("What does the school-closing story show?", "A court victory did not immediately guarantee access to equal schooling.", ["Court decisions never matter", "Change was instant", "Progress could face organized resistance"], 2, "Families and communities kept working for educational rights even after a major court victory."),
    ],
  },
  "VS.12": {
    badge: "Presidential Pathfinder", goal: "Untangle the timeline of Virginia-born presidents.",
    challenges: [
      choice("Why is Virginia called the Mother of Presidents?", "Eight U.S. presidents were born in Virginia.", ["Every president lived there", "Eight presidents were born there", "It has eight capitals"], 1, "The nickname refers to birthplace, not to every president’s home while in office."),
      order("Order these presidents by when they first took office.", "Washington was first, Jefferson third, and Madison fourth.", ["George Washington", "Thomas Jefferson", "James Madison"], "John Adams, who was born in Massachusetts, served between Washington and Jefferson."),
      choice("How should we investigate a president’s legacy?", "A legacy includes achievements, harmful actions, and effects on different people.", ["Study achievements and contradictions", "Read only praise", "Ignore the people affected"], 0, "Use evidence to examine the full record, including who benefited and who was excluded."),
    ],
  },
  "VS.13": {
    badge: "World Connector", goal: "Follow Virginia’s products and ideas on a trip around the world.",
    challenges: [
      choice("A Virginia farm sells a product to another country. What is that called?", "An export is a product sold to another country.", ["An election", "A landform", "An export"], 2, "Exports connect local work to international markets."),
      order("Trace a product from a farm to an overseas buyer.", "First produce it, then move it, then deliver it.", ["Grow a farm product", "Transport it to a port", "Ship it to an overseas buyer"], "Farms, roads, ports, and buyers are connected in a supply chain."),
      choice("Two charts show different numbers of jobs. What should you check first?", "Economic data can change over time and can count different things.", ["Which has brighter colors", "The dates, sources, and what each counts", "Which number is bigger"], 1, "Checking dates and definitions helps you compare changing economic information fairly."),
    ],
  },
};

export const ACTIVITY_SOURCES = [
  { label: "National Park Service: The Story of Brown", url: "https://www.nps.gov/brvb/planyourvisit/the-story-of-brown.htm" },
  { label: "Commonwealth of Virginia: History and Facts", url: "https://www.commonwealth.virginia.gov/about-virginia/history-and-facts-on-virginia/" },
  { label: "Virginia Department of Education: Virginia Studies resources", url: "https://www.doe.virginia.gov/teaching-learning-assessment/k-12-standards-instruction/history-and-social-science/standards-of-learning" },
  { label: "National Park Service: A Short History of Jamestown", url: "https://www.nps.gov/jame/learn/historyculture/a-short-history-of-jamestown.htm" },
  { label: "Virginia Museum of History & Culture: Reconstruction", url: "https://virginiahistory.org/what-you-can-see/story-virginia/explore-story-virginia/1861-1876/reconstruction" },
  { label: "Virginia Museum of History & Culture: A New Virginia", url: "https://virginiahistory.org/learn/story-of-virginia/chapter/new-virginia-0" },
];
