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
  challenges: readonly MissionChallenge[];
}
const choice = (prompt: string, clue: string, choices: string[], answer: number, explanation: string): MissionChallenge =>
  ({ prompt, clue, choices, answer, explanation });
const order = (prompt: string, clue: string, choices: string[], explanation: string): MissionChallenge =>
  ({ prompt, clue, choices, answer: 0, explanation, kind: "order" });

/** Original grade 4–5 activities. Keep the first two legacy questions in place;
 * added questions precede the original final question. Order arrays use correct order. */
export const MISSION_ACTIVITIES: Record<MissionId, MissionActivity> = {
  "VS.1": {
    badge: "Trail Finder", goal: "Repair the map! Follow rivers and piece Virginia’s regions back together.",
    challenges: [
      choice("Your boat reaches the Fall Line. What might block its path?", "The Fall Line marks a change from the Piedmont to the Coastal Plain. Water tumbles over rocks here.", ["A desert", "Waterfalls and rapids", "An ocean of ice"], 1, "Rapids can stop boats. People moved goods around them, helping trading centers grow."),
      order("Build a trail from east to west.", "Start at the Atlantic coast. Cross the rolling Piedmont before reaching the Blue Ridge mountains.", ["Coastal Plain", "Piedmont", "Blue Ridge"], "You traveled inland: Coastal Plain → Piedmont → Blue Ridge. Valley and Ridge and the Appalachian Plateau lie farther west."),
      choice("What does “navigable” mean when describing a river?", "A boat needs enough depth and room to travel.", ["Boats can travel along it","Its water is always safe to drink","It has no plants or animals"], 0, "Navigable rivers can carry boats. Rocks, depth, and water levels affect travel."),
      choice("Which region has the rolling hills between the Blue Ridge and Coastal Plain?", "The Piedmont lies at the foot of the mountains.", ["Appalachian Plateau","Piedmont","Valley and Ridge"], 1, "The Piedmont’s rolling hills lie east of the Blue Ridge and west of the Coastal Plain."),
      choice("Why do streams usually flow downhill?", "Think about water running down a slide.", ["Trees push all water east","Boats pull the streams","Gravity pulls water toward lower ground"], 2, "Gravity moves water downhill. The shape of the land helps guide its route."),
      choice("Why might traders build a warehouse near the Fall Line?", "People needed places to store goods while changing how they traveled.", ["Goods had to be unloaded around river obstacles","Every river ended there","Ocean ships could sail over every waterfall"], 0, "Rapids interrupted boat travel, creating places where goods could be stored and moved to another route."),
      choice("Which water body connects the Chesapeake Bay to distant countries?", "The bay opens to the ocean east of Virginia.", ["Lake Drummond","Atlantic Ocean","Appomattox River"], 1, "The Chesapeake Bay opens to the Atlantic, connecting Virginia’s rivers with ocean travel."),
      choice("A river is deep enough for boats but polluted. Which claim is supported?", "Travel conditions and drinking-water quality are different clues.", ["Boat travel makes water safe","Deep water cannot be polluted","It may help transportation but be unsafe to drink"], 2, "A waterway can have an advantage for trade and still pose a health risk."),
      choice("Which evidence best helps explain an old town’s location?", "Look for routes that connected people and goods.", ["A map of river crossings and early roads","A list of today’s favorite songs","Only the color of its houses"], 0, "Historical maps can show how transport routes helped a town connect with other places."),
      choice("A town needs to move heavy goods before trucks exist. Which place helps?", "Think of a natural route that can carry a boat.", ["Beside a navigable river", "On an isolated peak", "Far from every route"], 0, "Navigable rivers helped people travel and trade. Geography influenced where towns grew."),
    ],
  },
  "VS.2": {
    badge: "Careful Listener", goal: "Gather clues about Virginia’s Indigenous peoples, past and present.",
    challenges: [
      choice("Which clue reminds us that Indigenous history continues today?", "Virginia’s tribal communities continue to share their languages, traditions, and stories.", ["Only old objects matter", "All communities disappeared", "Living tribal communities"], 2, "Indigenous peoples are part of Virginia today. Their own voices are essential evidence."),
      choice("You find an old pottery fragment. What should you do?", "Where an object is found helps archaeologists understand it. Moving it can erase that information.", ["Take it home", "Leave it and tell a responsible adult", "Dig for more"], 1, "Protect the place and seek help. Evidence belongs in its context, not in a souvenir bag."),
      choice("What is an oral history?", "Oral means spoken.", ["An account shared through spoken words","A guess made from a map","An object with no known location"], 0, "Spoken accounts can preserve experiences and knowledge. Ask who shared them and when."),
      choice("Why is the location of an old object an important clue?", "Archaeologists study an object’s surroundings as well as the object.", ["Every object means the same thing anywhere","Nearby objects and soil help explain its use","The location tells its exact age by itself"], 1, "Context connects an object to other evidence. Moving it can destroy those connections."),
      choice("Which question avoids treating every tribal nation as the same?", "Name the community you want to learn about.", ["Why did all tribes live exactly alike?","Which one picture represents all Indigenous people?","What traditions does this particular community share?"], 2, "Tribal nations have distinct histories and traditions. Specific questions help us learn accurately."),
      choice("A picture shows one Indigenous family long ago. What can it tell us by itself?", "One picture shows a limited view.", ["Something about the people and moment it portrays","How every tribal citizen lives today","Everything about all Virginia tribes"], 0, "A picture is one source from one setting. More evidence is needed for broader conclusions."),
      choice("Which source best adds a tribal community’s own viewpoint?", "Listen to people who know and represent their community.", ["A made-up movie character","An account from that community’s museum or educator","A stranger’s unsupported guess"], 1, "Community voices provide knowledge and perspectives that outside accounts may miss."),
      choice("Two sources describe the same event differently. What should you do?", "People can notice different things or write for different reasons.", ["Discard both without reading them","Choose whichever has the biggest picture","Compare who made them and what evidence they give"], 2, "Comparing sources helps explain differences and reveals questions that need more evidence."),
      choice("What is a tribal nation?", "A nation is a community of people, not an object.", ["An Indigenous political community with its own identity and history","Any group visiting the same museum","A name for a type of pottery"], 0, "Virginia’s tribal nations are living communities with distinct identities and histories."),
      choice("How can you learn about a tribal community’s traditions?", "A good investigator listens to people and checks more than one source.", ["Listen to that community and study evidence", "Guess from one picture", "Assume all tribes are the same"], 0, "Communities have different histories and traditions. Listen carefully instead of treating everyone as the same."),
    ],
  },
  "VS.3": {
    badge: "River Detective", goal: "Investigate Jamestown’s river, risky choices, and first assembly.",
    challenges: [
      choice("Find the water route beside Jamestown.", "Jamestown stood beside the James River, which connects to the Chesapeake Bay.", ["Potomac River", "James River", "Ohio River"], 1, "The James River connected Jamestown to the bay and arriving ships."),
      order("Repair Jamestown’s timeline: earliest first.", "The settlement began in 1607. The Starving Time came in 1609–1610. An assembly met in 1619.", ["1607: Jamestown founded", "1609–1610: Starving Time", "1619: Assembly meets"], "Survival was uncertain. The settlement endured and later developed a representative assembly, though many people had no voice in it."),
      choice("In which year did English colonists establish Jamestown?", "Jamestown came before the Starving Time of 1609–1610.", ["1607","1776","1865"], 0, "English colonists founded Jamestown in 1607 beside the James River."),
      choice("Whose homeland included the Jamestown site before English settlement?", "Indigenous communities lived there before the English colonists arrived.", ["The French army at Yorktown","Powhatan peoples","Railroad companies"], 1, "Jamestown was established within the homeland of the Powhatan peoples."),
      choice("Which feature helped large ships approach Jamestown?", "Large ships need water deep enough to float.", ["A mountain blocking the river","A frozen harbor all year","Deep water near the shore"], 2, "Deep water helped ships reach the settlement with people and supplies."),
      choice("Which combination helps explain the Starving Time?", "More than one danger affected the colony during 1609–1610.", ["Food shortages, disease, and conflict","Too many healthy crops and supplies","Railroad strikes and factory closures"], 0, "Food, health, conflict, and decisions all mattered. A single cause cannot explain every loss."),
      choice("What is a representative in government?", "Representatives act on behalf of other people.", ["Someone who predicts storms","Someone chosen to speak or make decisions for others","Someone who builds every house"], 1, "The 1619 assembly included representatives, but many people had no voice in choosing them."),
      choice("Which group was excluded from representation in the 1619 assembly?", "Representative government in 1619 did not include everyone.", ["The burgesses serving in the assembly","All English male landowners","Women"], 2, "Women, Indigenous peoples, and enslaved people were excluded from representation."),
      choice("What should settlers investigate besides whether ships can reach a site?", "People need more than a transportation route to survive.", ["Safe drinking water and reliable food","Only the shape of the flag","Only how wide a ship’s sail is"], 0, "A location must be considered for food, health, and relationships as well as transport."),
      choice("Ships can reach the settlement, but its water is unhealthy. What does that show?", "A location can offer an advantage and a danger at the same time.", ["Every river is safe to drink", "Ships solve every problem", "A useful location can still be risky"], 2, "Access for ships helped, but unhealthy water and shortages threatened survival. One advantage did not erase the risks."),
    ],
  },
  "VS.4": {
    badge: "Community Investigator", goal: "Follow a colonial crop and uncover who did the work.",
    challenges: [
      choice("Which crop became a major colonial Virginia export?", "Planters sold tobacco overseas. Growing it required land and a great deal of labor.", ["Tobacco", "Bananas", "Coffee"], 0, "Tobacco brought wealth to some colonists, while its production depended on unequal labor systems."),
      order("Follow tobacco from field to market.", "First grow the crop, then carry it to a ship, then send it to buyers overseas.", ["Grow and harvest", "Load ships on the river", "Sell overseas"], "Fields, rivers, ships, and markets formed a trade network."),
      choice("What is a cash crop?", "The word cash points to selling for income.", ["A crop grown mainly to sell","A plant that grows coins","A crop that can never be traded"], 0, "Tobacco was a major cash crop. Growing it required land, knowledge, and labor."),
      choice("Why did plantations value access to rivers?", "Heavy loads were hard to move over rough roads.", ["Rivers removed the need to grow crops","Boats could carry heavy tobacco cargo","Every river crossed the ocean by itself"], 1, "Rivers linked plantations to ships and Atlantic trade routes."),
      choice("Which task came before tobacco could be shipped?", "A crop must be prepared before it is sold.", ["Buying the cargo overseas","Unloading the cargo in another country","Harvesting and drying the leaves"], 2, "Workers grew, tended, harvested, and dried tobacco before it entered the shipping network."),
      choice("What were the large barrels used to pack tobacco called?", "The story follows a cargo barrel from field to ship.", ["Hogsheads","Burgesses","Amendments"], 0, "Tobacco was packed into large barrels called hogsheads for storage and transport."),
      choice("An owner’s account book lists tobacco sales. What might another source reveal?", "Money records tell only part of the story.", ["That nobody worked in the fields","Workers’ lives and experiences","That sales records explain everyone’s feelings"], 1, "Accounts of workers’ lives can add evidence about labor, family, resistance, and unequal treatment."),
      choice("Which statement accurately describes enslaved labor?", "Enslavement denied people control over their own lives.", ["Workers could always leave whenever they wished","Everyone shared the profits equally","People were forced to work and denied freedom"], 2, "Enslaved people’s skills and labor supported the economy while laws denied their freedom."),
      choice("What is a trade network?", "Think of growers, barrel makers, sailors, and buyers.", ["Connected people and places exchanging goods","A single field with no connections","A rule that prevents every exchange"], 0, "Trade links many kinds of work and places. Following the connections helps explain an economy."),
      choice("Who must be included in a story about plantation work?", "Enslaved people were forced to work without freedom. Their experiences are central to this history.", ["Only plantation owners", "Only ship captains", "Enslaved workers as well as owners"], 2, "A complete history includes the people who did the work and the laws that denied their freedom."),
    ],
  },
  "VS.5": {
    badge: "Timeline Tracker", goal: "Connect a declaration, a siege, and the path to independence.",
    challenges: [
      choice("What did the Declaration of Independence announce?", "In 1776, the colonies declared that they were separating from Great Britain.", ["A new royal tax", "Independence from Britain", "The end of all wars"], 1, "The declaration announced independence. Winning it still required a long war."),
      order("Put these Revolutionary events in order.", "Compare the dates: 1776, 1781, then 1783.", ["1776: Independence declared", "1781: British surrender at Yorktown", "1783: Peace treaty"], "Yorktown was a major turning point; the Treaty of Paris formally recognized independence in 1783."),
      choice("What does independence mean for a country?", "The colonies wanted to separate from British rule.", ["Governing itself","Being ruled by another country","Ending every disagreement"], 0, "Independence means a country can govern itself. Declaring it did not immediately end the war."),
      choice("Which country allied with the Americans at Yorktown?", "French armies and ships helped surround the British.", ["Great Britain","France","The Confederate States"], 1, "French and American forces worked together at Yorktown in 1781."),
      choice("How did the French fleet help at Yorktown?", "An army on land could not block every water route alone.", ["It carried Cornwallis safely away","It wrote Virginia’s constitution","It blocked British escape by sea"], 2, "The fleet’s control of sea routes supported the forces surrounding Yorktown on land."),
      choice("What is a siege?", "At Yorktown, land and sea forces closed routes around British troops.", ["Surrounding a defended place and cutting off its supplies or escape","Signing a peace treaty","Electing a representative"], 0, "A siege pressures a defended place by limiting movement and supplies."),
      choice("Which British commander surrendered at Yorktown?", "Cornwallis commanded the British force surrounded in 1781.", ["George Washington","Charles Cornwallis","Thomas Jefferson"], 1, "Cornwallis’s army surrendered at Yorktown. This was a major turning point in the Revolution."),
      choice("What did the Treaty of Paris of 1783 do?", "A peace agreement followed the fighting.", ["Found Jamestown","Start the Civil War","Formally recognize U.S. independence"], 2, "The treaty formally recognized independence after years of war."),
      choice("Why is it useful to separate 1776, 1781, and 1783 on a timeline?", "An announcement, a military event, and a peace agreement are different kinds of events.", ["A declaration, a surrender, and a treaty did different jobs","All three were names for the same day","The dates show that no fighting happened"], 0, "Following the sequence explains how declaring independence differed from securing it."),
      choice("Why study different people’s experiences of the Revolution?", "Promises of liberty did not give everyone equal rights or freedom.", ["Everyone experienced it alike", "Only generals made choices", "Freedom meant different things to different people"], 2, "Enslaved people, women, Indigenous peoples, Patriots, and Loyalists faced different choices and consequences."),
    ],
  },
  "VS.6": {
    badge: "Rights Explorer", goal: "Investigate how a new nation turned ideas about rights into laws.",
    challenges: [
      choice("What is a constitution for?", "A constitution sets out a government’s structure and powers.", ["Organizing government", "Listing every road", "Predicting weather"], 0, "The U.S. Constitution established a framework for the national government."),
      order("Rebuild the new nation’s timeline.", "The Constitution was written in 1787. Washington became president in 1789. The Bill of Rights followed in 1791.", ["1787: Constitution written", "1789: Washington takes office", "1791: Bill of Rights ratified"], "Building a government took several steps, including adding protections for individual rights."),
      choice("What is an amendment?", "A written framework can be changed through an agreed process.", ["An official change or addition to the Constitution","A kind of river boat","A president’s birthplace"], 0, "Amendments allow the Constitution to be changed or expanded."),
      choice("What do we call the first ten amendments to the U.S. Constitution?", "These amendments added protections for individual rights.", ["The Treaty of Paris","The Bill of Rights","The Virginia Company charter"], 1, "The Bill of Rights was ratified in 1791 and contains the first ten amendments."),
      choice("Which branch of the national government makes laws?", "The Constitution gives different jobs to different branches.", ["The president acting alone","Federal courts alone","Congress, the legislative branch"], 2, "Congress makes laws. The president carries them out, and courts interpret them."),
      choice("Which job belongs to the president?", "The president leads the executive branch.", ["Carrying out the laws","Serving as every member of Congress","Deciding every court case"], 0, "The executive branch carries out laws within the Constitution’s framework."),
      choice("What is a main job of federal courts?", "Courts examine legal questions.", ["Planting the nation’s crops","Interpreting laws in cases","Electing every president"], 1, "Federal courts interpret and apply laws when deciding cases."),
      choice("Which freedom is protected by the Bill of Rights?", "The First Amendment protects expression and religion.", ["Permission to ignore every law","A guarantee that nobody will disagree","Freedom of speech"], 2, "The Bill of Rights includes protections for speech and religion, alongside other rights."),
      choice("Washington’s choices set examples for later presidents. What are such examples called?", "A precedent can guide a later decision.", ["Precedents","Imports","Landforms"], 0, "As the first president, Washington helped establish examples for how the office would work."),
      choice("Did promises about liberty mean everyone was free?", "Slavery continued after the new government was formed.", ["Yes, immediately", "No; slavery and unequal rights continued", "Only maps can tell us"], 1, "Compare a country’s promises with people’s experiences. They did not always match."),
    ],
  },
  "VS.7": {
    badge: "Evidence Connector", goal: "Connect slavery, the Civil War, and the struggle for freedom.",
    challenges: [
      choice("Which issue was central to Southern secession?", "Seceding states sought to protect slavery. Secession means leaving the Union.", ["A shortage of rivers", "Protecting slavery", "Choosing a national bird"], 1, "Slavery was central to secession and the conflict that led to the Civil War."),
      order("Connect three places you visited: earliest event first.", "Sailor’s Creek was fought on April 6, 1865. The High Bridge crossing on April 7 helped Union troops pursue Lee’s army. Lee surrendered at Appomattox on April 9.", ["April 6: Sailor’s Creek", "April 7: High Bridge crossing", "April 9: Appomattox surrender"], "Your visits connect through Lee’s retreat: battle losses, a river crossing, then surrender. Other Confederate armies surrendered later."),
      choice("What does secession mean?", "Southern states seceded from the United States.", ["Leaving a political union","Joining a railroad line","Approving a new amendment"], 0, "Secession means leaving a political union. Protecting slavery was central to Southern secession."),
      choice("What is a military retreat?", "Lee’s army moved away from Union forces in April 1865.", ["Holding an election","Moving forces away from an enemy or position","Sending crops to market"], 1, "A retreat changes an army’s position. Roads, rivers, and supplies can shape its route."),
      choice("Why could a river crossing matter to an army?", "A river may be an obstacle on a land route.", ["Bridges made food unnecessary","All soldiers could fly over rivers","People, animals, and supplies needed a way across"], 2, "Keeping a crossing open helped forces and their supplies continue moving."),
      choice("Which river did the High Bridge crossings span?", "The crossings near Farmville helped connect Lee’s retreat with the pursuit.", ["Appomattox River","Potomac River","York River"], 0, "High Bridge and nearby crossings spanned the Appomattox River."),
      choice("To whom did Robert E. Lee surrender at Appomattox?", "Grant commanded the Union armies.", ["Charles Cornwallis","Ulysses S. Grant","George Washington"], 1, "Lee surrendered the Army of Northern Virginia to Grant on April 9, 1865."),
      choice("Did Lee’s surrender mean every Confederate army surrendered that day?", "One surrender agreement applied to Lee’s particular army.", ["Yes, every army surrendered at the same place","No, it happened before the Civil War began","No, other Confederate armies surrendered later"], 2, "Appomattox was a major event, but other Confederate armies surrendered afterward."),
      choice("How does a constitutional amendment differ from an army’s surrender?", "Military agreements and changes to the Constitution do different things.", ["It changes national law","It only moves troops across a bridge","It only changes a commander’s route"], 0, "The Thirteenth Amendment changed the Constitution. An army’s surrender ends that army’s fighting."),
      choice("Which amendment abolished slavery in the United States?", "The Thirteenth Amendment was ratified in 1865, the year the Civil War ended.", ["First Amendment", "Tenth Amendment", "Thirteenth Amendment"], 2, "The Thirteenth Amendment abolished slavery, except as punishment for a crime. The struggle for equal rights continued."),
    ],
  },
  "VS.8": {
    badge: "Change Detective", goal: "Look for changes after emancipation—and barriers that remained.",
    challenges: [
      choice("What does Reconstruction refer to?", "After the Civil War, the country faced rebuilding and questions about freedom, citizenship, and power.", ["Rebuilding and political change after the Civil War", "Building Jamestown", "The start of the Revolution"], 0, "Reconstruction involved rebuilding communities and defining rights after slavery."),
      order("Connect these constitutional changes in time.", "Follow the amendment numbers: 13, 14, 15.", ["13th: Abolishes slavery", "14th: Establishes citizenship protections", "15th: Bars race-based voting restrictions"], "These amendments changed the Constitution. Resistance still kept many people from exercising their rights."),
      choice("What does emancipation mean?", "Emancipation concerns freedom.", ["Being freed from slavery","Building a railroad","Buying goods from abroad"], 0, "Emancipation ended enslavement, while the struggle for equal treatment and opportunity continued."),
      choice("Which goal mattered to many formerly enslaved people after the Civil War?", "Freedom opened possibilities for education, family, and control over daily life.", ["Restoring slavery","Reuniting families and building schools","Ending all paid work"], 1, "Freed people worked to reunite families, earn wages, gain education, and shape their futures."),
      choice("Which amendment required states to provide equal protection of the laws?", "The middle Reconstruction amendment addressed citizenship and equal protection.", ["The First Amendment","The Thirteenth Amendment","The Fourteenth Amendment"], 2, "The Fourteenth Amendment added citizenship and equal-protection guarantees."),
      choice("Which amendment barred denying voting rights because of race?", "Think of the last of the three Reconstruction amendments.", ["The Fifteenth Amendment","The Thirteenth Amendment","The Second Amendment"], 0, "The Fifteenth Amendment barred voting restrictions based on race, color, or previous enslavement."),
      choice("Did the Fifteenth Amendment give every person the right to vote?", "Its protection addressed particular reasons for denying the vote.", ["Yes, including all children","No, other restrictions and barriers remained","Yes, and nobody ever blocked voting again"], 1, "The amendment did not give everyone the vote, and discrimination still blocked many citizens."),
      choice("What does it mean to enforce a law?", "A promise on paper needs action to make it real.", ["Erase it from every book","Keep it secret","Make sure the law is followed"], 2, "Enforcement helps turn written protections into rights people can actually use."),
      choice("Which sources best show whether a new school law changed daily life?", "Compare the rule with evidence of what happened.", ["The law and records from schools and families","Only the law’s title","Only a map of mountain heights"], 0, "School records and family accounts help show whether access to education changed in practice."),
      choice("A new law promises rights, but people face threats when voting. What should you conclude?", "A right on paper is not always a right people can safely use.", ["The threats do not matter", "Everyone can vote safely", "The promise and the experience differ"], 2, "To understand change, examine laws and what actually happened in people’s lives."),
    ],
  },
  "VS.9": {
    badge: "Network Navigator", goal: "Reconnect resources, railroads, and growing towns.",
    challenges: [
      choice("How did railroads, like the route at High Bridge, help Virginia’s industries?", "High Bridge Trail follows a former railroad corridor. Railroads carried heavy goods between inland communities and markets.", ["They stopped trade", "They connected goods to markets", "They removed the need for workers"], 1, "Rail connections helped industries and cities grow by moving people and heavy goods."),
      order("Build a resource-to-market route.", "A resource is gathered, transported, and then used or sold.", ["Gather coal or lumber", "Carry it by rail", "Deliver it to a market"], "A railroad connected places into a network; an isolated track alone could not do the job."),
      choice("Which pair supplied materials for Virginia industry?", "Think of timber and fuel.", ["Forests and coalfields","Ballots and constitutions","Ocean waves and court rulings"], 0, "Forests supplied timber, and coalfields supplied coal. Workers made these resources available."),
      choice("Why was a railroad track useful only when connected to other places?", "A network links places together.", ["An isolated track could deliver anywhere","Goods needed routes from producers to buyers","Connections removed every need for workers"], 1, "Tracks, bridges, towns, mines, and ports worked together to move people and goods."),
      choice("What is infrastructure?", "Think of shared systems that support travel and work.", ["Only the products in a shop","Only a worker’s personal tools","Systems such as roads, railways, and bridges"], 2, "Infrastructure connects communities and helps people move goods and reach services."),
      choice("How is High Bridge’s former railway corridor used today?", "A place can take on a new use while keeping clues to its past.", ["As a recreation trail","As an ocean shipping lane","As Virginia’s state capital"], 0, "High Bridge Trail follows a former railroad corridor, connecting recreation with transportation history."),
      choice("What is a market?", "Producers need to reach buyers.", ["A barrier that stops every train","A place or system where people buy and sell goods","A type of mountain ridge"], 1, "Markets connect sellers with people who want their goods."),
      choice("Which source could tell you about factory working hours and safety?", "People doing the work may describe conditions that sales records leave out.", ["Only a map of state borders","A list of presidents’ birthplaces","A worker’s account"], 2, "Worker accounts can add evidence about pay, hours, and safety."),
      choice("A town gains jobs from a mine. What else should be investigated?", "Economic growth can bring benefits and costs.", ["Effects on workers, land, and water","Only the owner’s favorite color","Whether every resident had the same experience"], 0, "Mining could provide jobs while creating hazards and environmental changes. Both belong in the story."),
      choice("A railroad helps a factory grow. What else should an investigator ask?", "Economic growth can affect owners, workers, and nearby communities differently.", ["How did workers and communities experience it?", "Were all people affected identically?", "Can we ignore the people?"], 0, "Follow both the goods and the people to understand the benefits and costs of industrial change."),
    ],
  },
  "VS.10": {
    badge: "Home Front Historian", goal: "Trace how people at home supported wartime service.",
    challenges: [
      choice("What was the home front?", "During the world wars, civilians worked, conserved supplies, and supported the war effort at home.", ["Only the front of a house", "Only a battlefield", "Civilian life and work during war"], 2, "War changed life beyond battlefields, including work and family routines."),
      order("Trace supplies from makers to people who need them.", "Supplies must be made before they can be packed and shipped.", ["Workers make supplies", "Pack and transport them", "Deliver them to service members"], "Factories, transport workers, ports, and ships were connected parts of wartime mobilization."),
      choice("Who is a civilian?", "Civilians could support wartime needs while staying at home.", ["A person who is not a member of the armed forces","Only a person who works on a ship","Every person serving in the army"], 0, "Civilians worked in farms, factories, hospitals, and homes during the wars."),
      choice("What was rationing during World War II?", "Some goods had to be conserved and shared.", ["Giving every family unlimited supplies","Limiting purchases of scarce goods","Trading only with another country"], 1, "Rationing controlled how much of certain goods people could buy."),
      choice("Which action at home could help conserve wartime supplies?", "Conserving means using resources thoughtfully.", ["Throwing away usable goods","Buying scarce items without limits","Using needed materials carefully and avoiding waste"], 2, "Avoiding waste helped stretch supplies for civilians and the military."),
      choice("Why were Virginia’s ports important to wartime supply routes?", "Supplies traveled by road, rail, and sea.", ["They connected land transport with ships","They made every product without workers","They removed the need for packing cargo"], 0, "Ports let workers transfer goods between land routes and ships bound for other places."),
      choice("A shipment is packed, but no transport is available. What happens to the supply chain?", "Each step depends on connections with the next.", ["The supplies arrive automatically","Delivery may be delayed","The factories no longer need materials"], 1, "Making and packing supplies is not enough. Transport is needed to reach the people who use them."),
      choice("What might a wartime poster be designed to do?", "Ask why a source was created and who was meant to see it.", ["Describe every family’s experience","Replace all personal letters","Persuade people to take action"], 2, "Posters could encourage conserving, working, or supporting the war effort."),
      choice("Why might a family letter and a government poster tell different stories?", "A personal message and a public appeal are created for different readers.", ["Their creators had different experiences and purposes","One must always be useless","Every source has the same purpose"], 0, "Comparing their purposes helps us understand what each source can and cannot tell us."),
      choice("Which pair of sources gives a fuller picture of wartime life?", "Compare accounts from people with different roles.", ["Two copies of the same poster", "A service member’s letter and a factory worker’s account", "A guess with no evidence"], 1, "Different perspectives help us understand service, work, sacrifice, and how people remembered the wars."),
    ],
  },
  "VS.11": {
    badge: "Voice for Change", goal: "Follow students and communities working for equal education.",
    challenges: [
      choice("Who helped launch the 1951 school strike in Farmville?", "Barbara Johns was a student at Robert Russa Moton High School. Students protested unequal school conditions.", ["Barbara Johns", "George Washington", "John Rolfe"], 0, "Students could organize for change. Their actions helped lead to a legal challenge to school segregation."),
      order("Put these civil-rights events in order.", "Start with the student strike in 1951, then the court ruling in 1954, then school closings in 1959.", ["1951: Moton students strike", "1954: Brown ruling", "1959: Prince Edward closes public schools"], "The Supreme Court ruled school segregation unconstitutional, but resistance to integration continued."),
      choice("Where was Robert Russa Moton High School?", "Barbara Johns attended school in Farmville.", ["Farmville, Virginia","Jamestown, Virginia","Paris, France"], 0, "Moton High School in Farmville was the site of the 1951 student strike."),
      choice("What conditions did Moton students protest?", "Students wanted fair educational conditions.", ["Too many equal opportunities","Crowded and unequal schooling under segregation","A shortage of Revolutionary War ships"], 1, "Their protest challenged unequal schooling and helped lead to a legal challenge to segregation."),
      choice("What does racial segregation mean?", "Segregation kept people apart through rules and practices.", ["Equal participation in the same public schools","Moving goods between markets","Enforced separation of people by race"], 2, "Racial segregation enforced separation and unequal treatment."),
      choice("What did Brown v. Board of Education rule in 1954?", "The Supreme Court examined school segregation under the Constitution.", ["Racial segregation in public schools was unconstitutional","Public schools had to close forever","Jamestown needed a new assembly"], 0, "Brown ruled racial segregation in public schools unconstitutional, though resistance continued."),
      choice("What does unconstitutional mean?", "The Constitution sets rules government must follow.", ["Older than the Constitution","In conflict with the Constitution","Mentioned in a history textbook"], 1, "An unconstitutional law or practice conflicts with the Constitution."),
      choice("Why did Prince Edward County close its public schools in 1959?", "Local officials resisted desegregation after Brown.", ["To celebrate equal access for all","To support the Jamestown colony","To resist school integration"], 2, "The county closed its public schools rather than integrate them, harming children’s education."),
      choice("In what year did Prince Edward County’s public schools reopen?", "The closures lasted five years after 1959.", ["1964","1951","1776"], 0, "Schools reopened in 1964 after a long struggle. Many Black children had lost years of formal schooling."),
      choice("What does the school-closing story show?", "A court victory did not immediately guarantee access to equal schooling.", ["Court decisions never matter", "Change was instant", "Progress could face organized resistance"], 2, "Families and communities kept working for educational rights even after a major court victory."),
    ],
  },
  "VS.12": {
    badge: "Presidential Pathfinder", goal: "Untangle the timeline of Virginia-born presidents.",
    challenges: [
      choice("Why is Virginia called the Mother of Presidents?", "Eight U.S. presidents were born in Virginia.", ["Every president lived there", "Eight presidents were born there", "It has eight capitals"], 1, "The nickname refers to birthplace, not to every president’s home while in office."),
      order("Order these presidents by when they first took office.", "Washington was first, Jefferson third, and Madison fourth.", ["George Washington", "Thomas Jefferson", "James Madison"], "John Adams, who was born in Massachusetts, served between Washington and Jefferson."),
      choice("Which president served between Washington and Jefferson?", "Washington was first and Jefferson was third.", ["John Adams","James Madison","Woodrow Wilson"], 0, "John Adams was the second president. He was born in Massachusetts."),
      choice("Which Virginia-born president first took office in 1789?", "He was the first U.S. president.", ["John Tyler","George Washington","Zachary Taylor"], 1, "Washington took office in 1789, beginning the new government under the Constitution."),
      choice("Which president first took office in 1809?", "He followed Jefferson as the fourth president.", ["George Washington","Woodrow Wilson","James Madison"], 2, "Madison became president in 1809. A timeline helps keep different leaders’ terms separate."),
      choice("Which name belongs among the eight Virginia-born presidents?", "The group extends beyond the early presidents.", ["Woodrow Wilson","Abraham Lincoln","John Adams"], 0, "Wilson joins Washington, Jefferson, Madison, Monroe, Harrison, Tyler, and Taylor in the Virginia-born group."),
      choice("What is a biography?", "A biography follows a person through events and experiences.", ["A map of rainfall","An account of a person’s life","A list of products for sale"], 1, "A biography can connect birthplace, relationships, decisions, achievements, and harms."),
      choice("What is chronology?", "A timeline puts events in chronological order.", ["The height of a mountain","The number of people in a town","The order in which events happened"], 2, "Chronology helps us understand what came before or after a decision or event."),
      choice("Which evidence helps examine a president’s effect on ordinary people?", "A decision’s effects appear in people’s lives.", ["Laws and accounts from people affected by them","Only an official portrait","Only the president’s birthplace"], 0, "Legal records and personal accounts help reveal both benefits and harms."),
      choice("How should we investigate a president’s legacy?", "A legacy includes achievements, harmful actions, and effects on different people.", ["Study achievements and contradictions", "Read only praise", "Ignore the people affected"], 0, "Use evidence to examine the full record, including who benefited and who was excluded."),
    ],
  },
  "VS.13": {
    badge: "World Connector", goal: "Follow Virginia’s products and ideas on a trip around the world.",
    challenges: [
      choice("A Virginia farm sells a product to another country. What is that called?", "An export is a product sold to another country.", ["An election", "A landform", "An export"], 2, "Exports connect local work to international markets."),
      order("Trace a product from a farm to an overseas buyer.", "First produce it, then move it, then deliver it.", ["Grow a farm product", "Transport it to a port", "Ship it to an overseas buyer"], "Farms, roads, ports, and buyers are connected in a supply chain."),
      choice("A Virginia business buys a product from another country. What is it called?", "Imports come into a country; exports go out.", ["An import","An export from Virginia","An amendment"], 0, "A product bought from abroad is an import to the buyer’s country."),
      choice("What happens at a port?", "Ports connect ships with people and goods on land.", ["All crops are grown","Ships load and unload cargo or passengers","Every road becomes a river"], 1, "Ports link ocean routes with roads, railways, warehouses, and workers."),
      choice("Which workers help move farm goods from a truck onto a ship?", "Different people do different jobs along a product’s route.", ["Only classroom teachers","Only farmers planting seeds","Port cargo workers"], 2, "Cargo workers and equipment transfer shipments at a port."),
      choice("How can a poor harvest affect an overseas buyer?", "Events at the beginning of a supply chain can affect later steps.", ["Fewer goods may be available to deliver","Every ship automatically travels faster","The buyer no longer needs any products"], 0, "A smaller harvest can change how much a farm can send to buyers."),
      choice("A shipment leaves Virginia for France. How can both countries describe it?", "The name depends on whether goods are going out or coming in.", ["An import into both countries","An export from the U.S. and an import into France","An export from both countries"], 1, "The same shipment is an export for the seller’s country and an import for the buyer’s."),
      choice("Which example shows that Virginia’s economy includes services?", "A service is work done for someone.", ["A farmer harvesting apples","A factory making chairs","A guide leading visitors through a museum"], 2, "A guided tour is a service. Virginia’s economy includes many kinds of goods and services."),
      choice("One chart counts all jobs; another counts only farm jobs. Can you treat them as the same measure?", "Read the labels before comparing totals.", ["No, they count different groups of jobs","Yes, because both use numbers","Yes, if both charts are colorful"], 0, "To compare fairly, check which jobs each chart includes, as well as its date and source."),
      choice("Two charts show different numbers of jobs. What should you check first?", "Economic data can change over time and can count different things.", ["Which has brighter colors", "The dates, sources, and what each counts", "Which number is bigger"], 1, "Checking dates and definitions helps you compare changing economic information fairly."),
    ],
  },
};

export const ACTIVITY_SOURCES = [
  { label: "National Archives: Bill of Rights", url: "https://www.archives.gov/founding-docs/bill-of-rights" },
  { label: "National Archives: Reconstruction amendments", url: "https://www.archives.gov/founding-docs/amendments-11-27" },
  { label: "Commonwealth of Virginia: Virginia Indians", url: "https://www.commonwealth.virginia.gov/virginia-indians/" },
  { label: "USGS: Virginia regions and the Fall Line", url: "https://pubs.usgs.gov/ha/ha730/ch_l/L-text1.html" },
  { label: "NPS: Sailor’s Creek and High Bridge connections", url: "https://www.nps.gov/articles/000/traversing-history-at-sailor-s-creek-and-high-bridge-state-parks.htm" },
  { label: "Virginia State Parks: High Bridge Trail", url: "https://www.dcr.virginia.gov/state-parks/high-bridge-trail" },
  { label: "National Park Service: The Story of Brown", url: "https://www.nps.gov/brvb/planyourvisit/the-story-of-brown.htm" },
  { label: "Commonwealth of Virginia: History and Facts", url: "https://www.commonwealth.virginia.gov/about-virginia/history-and-facts-on-virginia/" },
  { label: "Virginia Department of Education: Virginia Studies resources", url: "https://www.doe.virginia.gov/teaching-learning-assessment/k-12-standards-instruction/history-and-social-science/standards-of-learning" },
  { label: "National Park Service: A Short History of Jamestown", url: "https://www.nps.gov/jame/learn/historyculture/a-short-history-of-jamestown.htm" },
  { label: "Virginia Museum of History & Culture: Reconstruction", url: "https://virginiahistory.org/what-you-can-see/story-virginia/explore-story-virginia/1861-1876/reconstruction" },
  { label: "Virginia Museum of History & Culture: A New Virginia", url: "https://virginiahistory.org/learn/story-of-virginia/chapter/new-virginia-0" },
];
