import type { MissionId } from '../domain/mission';

export type StoryIcon = 'mountain' | 'water' | 'people' | 'search' | 'ship' | 'plant' | 'document' | 'flag' | 'rights' | 'bridge' | 'train' | 'factory' | 'school' | 'globe';
export interface StoryScene {
  label: string;
  time: string;
  icon: StoryIcon;
  title: string;
  narrative: string;
  discoveryLabel: string;
  discovery: string;
  word: string;
  definition: string;
}
export interface MissionStory {
  title: string;
  invitation: string;
  diagram: 'landscape' | 'timeline' | 'network';
  diagramLabel: string;
  connections: readonly [string, string];
  scenes: readonly [StoryScene, StoryScene, StoryScene];
  think: string;
  source: { label: string; url: string };
}
const scene = (label: string, time: string, icon: StoryIcon, title: string, narrative: string, discoveryLabel: string, discovery: string, word: string, definition: string): StoryScene =>
  ({ label, time, icon, title, narrative, discoveryLabel, discovery, word, definition });

/** Original teaching stories; diagrams illustrate relationships, not exact geography or elapsed time. */
export const MISSION_STORIES: Record<MissionId, MissionStory> = {
  'VS.1': {
    title: 'A river has a story to tell', invitation: 'Travel from the mountains toward the sea. Discover how the land helped shape Virginia’s communities.',
    diagram: 'landscape', diagramLabel: 'A journey downhill: mountains, Fall Line, coastal rivers', connections: ['Water flows downhill', 'Rivers connect places'],
    scenes: [
      scene('Mountain headwaters', 'Higher ground', 'mountain', 'Start where streams gather', 'Rain and melting snow feed streams. Gravity pulls water downhill, and streams join into rivers. Virginia’s five regions have different landforms: the Appalachian Plateau, Valley and Ridge, Blue Ridge, Piedmont, and Coastal Plain. Their shapes influence where water travels.', 'Unfold the region trail', 'Travel east to west from the Coastal Plain across the rolling Piedmont to the Blue Ridge. Farther west are Valley and Ridge and the Appalachian Plateau. This picture is a simplified landscape, not a map of their borders.', 'Region', 'An area with shared characteristics, such as similar landforms.'),
      scene('The Fall Line', 'Changing elevation', 'water', 'A rocky interruption', 'As rivers cross from the Piedmont into the lower Coastal Plain, they encounter a change in the land. Rapids and waterfalls can make a boat trip impossible. Travelers once had to unload goods and carry them around these obstacles.', 'See why towns grew here', 'Places where river travel was interrupted could become meeting points for roads, warehouses, and trade. Richmond grew at the Fall Line on the James River. Geography offered opportunities; people still made choices about where to live.', 'Fall Line', 'The zone of rapids and waterfalls between the Piedmont and Coastal Plain.'),
      scene('River to sea', 'Lower ground', 'ship', 'A natural transportation route', 'Before trucks and railroads, boats could carry heavy loads along navigable rivers. Many Virginia rivers flow toward the Chesapeake Bay. The bay opens to the Atlantic Ocean, connecting inland communities with distant places. Farther south, Lake Drummond is a natural freshwater lake in the Great Dismal Swamp. Both are in the low Coastal Plain of southeastern Virginia. A coastal region can include lakes and forested wetlands as well as beaches.', 'Look beneath the water', 'Navigable means boats can travel along a waterway. A river’s depth, rocks, and changing water level matter. A river can be useful for travel without being safe to drink from.', 'Navigable', 'Deep and clear enough for boats to travel through.'),
    ],
    think: 'Imagine carrying a heavy barrel. How would a river help, and where might you have to stop?',
    source: { label: 'U.S. Geological Survey: regions and the Fall Line', url: 'https://pubs.usgs.gov/ha/ha730/ch_l/L-text1.html' },
  },
  'VS.2': {
    title: 'Listen to a living history', invitation: 'Connect community voices, objects, and places. Each can help us learn, but no single clue tells the whole story.',
    diagram: 'network', diagramLabel: 'Three connected ways to learn about Indigenous Virginia', connections: ['Voices explain meaning', 'Context connects evidence'],
    scenes: [
      scene('Community voices', 'Past and present', 'people', 'History is still being made', 'Indigenous peoples lived in this region long before it was called Virginia. Tribal nations, including the Pamunkey, Mattaponi, and Monacan, have distinct histories. Their communities continue today. Learning from their own museums, educators, and accounts helps us understand traditions and present-day life.', 'Challenge an old picture', 'A picture of one person long ago cannot show every tribal community or how people live today. Ask whose community is represented, when the source was made, and whose voice is missing.', 'Tribal nation', 'An Indigenous political community with its own identity and history.'),
      scene('An object in place', 'Evidence from the past', 'search', 'The place is part of the clue', 'A pottery fragment can tell an archaeologist something about its makers. Its location, the soil around it, and nearby objects are evidence too. Moving it can break those connections. Leave an object where it is and tell a responsible adult instead of digging or taking it home.', 'Open the investigator’s notebook', 'An object beside cooking remains may raise different questions from one found in another setting. Archaeologists record context carefully and work with tribal communities to interpret and care for their heritage.', 'Context', 'The setting and connections that help explain a piece of evidence.'),
      scene('Many sources', 'Learning respectfully', 'document', 'Put the clues in conversation', 'Oral histories, written records, archaeology, and community knowledge can answer different questions. Compare them. A colonial writer might describe only what they noticed or believed; a tribal account can explain meanings that outsider missed.', 'Try a historian’s question', 'Instead of asking “What were all tribes like?”, choose a particular community, place, and time. Then seek that community’s perspective and compare evidence. Differences are discoveries, not mistakes to erase.', 'Perspective', 'A person’s way of understanding events, shaped by their experiences.'),
    ],
    think: 'What could you learn from a community member that an object alone could not tell you?',
    source: { label: 'Commonwealth of Virginia: Virginia Indians', url: 'https://www.commonwealth.virginia.gov/virginia-indians/' },
  },
  'VS.3': {
    title: 'Jamestown: a place of possibilities and risks', invitation: 'Step through three moments beside the James River. A useful location did not guarantee survival.',
    diagram: 'timeline', diagramLabel: 'Jamestown: settlement, survival, and government', connections: ['Survival is uncertain', 'The colony changes'],
    scenes: [
      scene('A river landing', '1607', 'ship', 'Ships reach the settlement', 'English colonists established Jamestown beside the James River, within the homeland of the Powhatan peoples. Deep water let ships approach the shore. The river connected the site to the Chesapeake Bay and the Atlantic, but the newcomers depended on food, supplies, and relationships with people already living there.', 'Examine the location', 'Deep water helped ships. Unhealthy drinking water and disease endangered people. One place could offer both an advantage and a serious danger.', 'Settlement', 'A place where people establish a community.'),
      scene('A difficult winter', '1609–1610', 'plant', 'Food becomes a matter of survival', 'During the Starving Time, food shortages, disease, and conflict devastated the colony. Many colonists died. Jamestown’s story includes Powhatan communities defending their interests as well as colonists struggling to survive.', 'Look beyond a single cause', 'A river route could bring supplies, but ships did not always arrive when needed. A good explanation connects food, health, conflict, and decisions instead of blaming just one thing.', 'Shortage', 'A situation in which there is not enough of something people need.'),
      scene('An assembly meets', '1619', 'document', 'Who gets a voice?', 'Representatives met in Virginia’s first legislative assembly in 1619. This was a step in representative government in the English colonies. It was not equal democracy: many people living in Virginia had no voice in this assembly.', 'Notice who is excluded', 'Women, Indigenous peoples, and enslaved people were excluded from representation. When studying government, ask both how decisions were made and who was allowed to take part.', 'Representative', 'Someone chosen to speak or make decisions for other people.'),
    ],
    think: 'If you were choosing a settlement site, what would you investigate besides whether ships could reach it?',
    source: { label: 'National Park Service: Jamestown history', url: 'https://www.nps.gov/jame/learn/historyculture/a-short-history-of-jamestown.htm' },
  },
  'VS.4': {
    title: 'Follow a crop. Remember the people.', invitation: 'Trace tobacco from a Virginia field to an overseas market—and investigate the labor behind the trade.',
    diagram: 'network', diagramLabel: 'Colonial tobacco: field to river to overseas market', connections: ['Carry the harvest', 'Ship across the Atlantic'],
    scenes: [
      scene('In the fields', 'Colonial Virginia', 'plant', 'A crop grown to sell', 'Tobacco became a major cash crop in colonial Virginia. It required land and many hours of work. Workers planted, tended, harvested, and dried the leaves. The money earned from selling tobacco helped some planters become wealthy.', 'Meet the people doing the work', 'Labor systems changed over time. Enslaved Africans and their descendants were increasingly forced to work without freedom. Their knowledge and work were central to the economy, while laws protected enslavers’ power.', 'Cash crop', 'A crop grown mainly to sell rather than to feed the grower.'),
      scene('At the river', 'Moving the crop', 'ship', 'Water connects the fields', 'Harvested tobacco traveled to ships on rivers. Rivers connected plantations with Atlantic trade routes. Heavy cargo was easier to move by water than over rough land, so river access shaped the colony’s economy.', 'Open a cargo barrel', 'Tobacco was packed into large barrels called hogsheads. Follow one barrel and you find many connections: the people who grew the crop, made the barrel, moved it, and sailed the ship.', 'Trade network', 'Connected people and places that exchange goods.'),
      scene('Across the Atlantic', 'Selling overseas', 'globe', 'Profit was not shared fairly', 'Overseas buyers paid for the tobacco. Plantation owners could gain wealth while enslaved workers were denied freedom and control over their labor. Economic history must include human experiences, not only the value of goods.', 'Change the viewpoint', 'An owner’s account book might show sales. An enslaved person’s life story can reveal family ties, skill, resistance, and the harms of enslavement. Both kinds of evidence help us ask better questions.', 'Enslavement', 'Forcing people to live and work as another person’s property, denying their freedom.'),
    ],
    think: 'Whose work is hidden if we tell this story only by following the money?',
    source: { label: 'National Park Service: tobacco in colonial Virginia', url: 'https://www.nps.gov/jame/learn/historyculture/tobacco-colonial-cultivation-methods.htm' },
  },
  'VS.5': {
    title: 'Independence was a journey', invitation: 'Connect an announcement, a military turning point, and a peace agreement. They did different jobs.',
    diagram: 'timeline', diagramLabel: 'Declaration to Yorktown to the Treaty of Paris', connections: ['A war continues', 'Peace must be negotiated'],
    scenes: [
      scene('Declare independence', '1776', 'document', 'An announcement changes the stakes', 'The Declaration of Independence announced that the colonies were separating from Great Britain. Declaring a new nation did not make Britain agree. The war continued, and people faced difficult choices about loyalty, service, and survival.', 'Read the promise carefully', 'The declaration expressed ideals of equality and liberty. Enslaved people remained unfree, and many others lacked equal rights. An ideal and everyday life can be very different.', 'Independence', 'The ability of a country to govern itself.'),
      scene('Yorktown', '1781', 'flag', 'Allies work together', 'At Yorktown, American and French armies surrounded British forces on land while a French fleet blocked escape by sea. The British army under Cornwallis surrendered. Geography, cooperation, and supplies all mattered.', 'Follow the land-and-sea connection', 'A siege cuts off a defended place. At Yorktown, the army and fleet supported each other. The surrender was a major turning point, but it was not the final peace treaty.', 'Ally', 'A person or country working with another toward a shared goal.'),
      scene('Make peace', '1783', 'globe', 'A treaty recognizes a new nation', 'The Treaty of Paris formally recognized the United States’ independence. Peace agreements changed political boundaries, but not everyone gained the same freedom or security. Indigenous nations, enslaved people, women, Patriots, and Loyalists experienced the Revolution differently.', 'Look through another window', 'Ask who gained power and who faced new losses or dangers. Studying different experiences makes the story of independence more complete.', 'Treaty', 'A formal agreement between governments.'),
    ],
    think: 'Why might a declaration, a victory, and a treaty all be needed on the path to independence?',
    source: { label: 'National Park Service: the siege of Yorktown', url: 'https://www.nps.gov/york/learn/historyculture/history-of-the-siege.htm' },
  },
  'VS.6': {
    title: 'How do you build a government?', invitation: 'Explore three pieces of a new nation: a framework, people who put it to work, and protections for rights.',
    diagram: 'timeline', diagramLabel: 'Constitution, first presidency, and Bill of Rights', connections: ['Put the framework to work', 'Add protections'],
    scenes: [
      scene('Write a framework', '1787', 'document', 'Agree on how decisions are made', 'The Constitution set out the structure and powers of the national government. It divided responsibilities among branches and created ways for them to limit one another’s power. James Madison of Virginia played an important role in the convention and the debate over the new plan.', 'Open the government blueprint', 'Congress makes laws, the president carries out laws, and federal courts interpret laws. These branches have different jobs. A constitution is a framework, not a list of every decision a country will ever make.', 'Constitution', 'A country’s basic framework for government.'),
      scene('Begin governing', '1789', 'people', 'People put the plan into action', 'George Washington became the first U.S. president in 1789. A written plan needed people and institutions to make it work. Decisions made by the first government helped set examples for later leaders.', 'Notice the gap', 'The new government did not end slavery. Many people were excluded from political participation. To understand the nation, examine both the principles it stated and the lives people actually led.', 'Precedent', 'An example that helps guide later decisions.'),
      scene('Protect rights', '1791', 'rights', 'Add the Bill of Rights', 'The first ten amendments became the Bill of Rights. They included protections for speech, religion, and fair treatment in legal proceedings. Amendments allow the Constitution to change, but rights also depend on how laws are interpreted and enforced.', 'Connect paper to practice', 'A written protection matters, yet people may still face barriers to using it. Later generations worked to expand and enforce rights for people who had been excluded.', 'Amendment', 'An official change or addition to a document such as the Constitution.'),
    ],
    think: 'Why might people want written limits on the power of their leaders?',
    source: { label: 'National Archives: founding documents', url: 'https://www.archives.gov/founding-docs' },
  },
  'VS.7': {
    title: 'Three places on the road to Appomattox', invitation: 'Follow the final days of Lee’s retreat in Virginia, then connect military surrender with the larger struggle for freedom.',
    diagram: 'timeline', diagramLabel: 'Lee’s retreat in April 1865: three connected events', connections: ['Retreat toward the river', 'Pursuit continues'],
    scenes: [
      scene('Sailor’s Creek', 'April 6, 1865', 'flag', 'Understand the war behind the battle', 'Southern states seceded from the United States to protect slavery. Four years of Civil War followed. Near its end, Confederate general Robert E. Lee’s retreating army suffered major losses at Sailor’s Creek in Virginia.', 'Explain secession', 'Secession means leaving a political union. Slavery was central to Southern secession; it cannot be left out of an explanation of why the war happened.', 'Secession', 'The act of leaving a political union.'),
      scene('High Bridge', 'April 7, 1865', 'bridge', 'A river crossing matters', 'Near Farmville, bridges crossed the Appomattox River. During the retreat, Confederate troops tried to destroy crossings. Union troops preserved a wagon bridge crossing and continued their pursuit. A river that slowed one army could give the other time.', 'Picture the obstacle', 'An army needed to move people, animals, and supplies. Keeping a crossing open could matter as much as moving quickly along a road. This trail shows the sequence, not exact distances.', 'Retreat', 'Moving forces away from an enemy or position.'),
      scene('Appomattox', 'April 9, 1865', 'document', 'Surrender—and unfinished work', 'Lee surrendered his Army of Northern Virginia to Ulysses S. Grant at Appomattox. Other Confederate armies surrendered later. The Thirteenth Amendment, ratified in December 1865, abolished slavery except as punishment for a crime. Equal rights remained an ongoing struggle.', 'Separate two kinds of change', 'An army’s surrender ends that army’s fighting. A constitutional amendment changes the nation’s law. They are connected events, but they are not the same thing.', 'Ratify', 'To formally approve an agreement or amendment.'),
    ],
    think: 'How can a bridge connect the geography of a place with the outcome of an event?',
    source: { label: 'National Park Service: Sailor’s Creek and High Bridge', url: 'https://www.nps.gov/articles/000/traversing-history-at-sailor-s-creek-and-high-bridge-state-parks.htm' },
  },
  'VS.8': {
    title: 'Freedom, citizenship, and a voice', invitation: 'Explore three constitutional changes after the Civil War. Then ask what it took to make their promises real.',
    diagram: 'timeline', diagramLabel: 'Reconstruction amendments: 13th, 14th, and 15th', connections: ['Define citizenship', 'Protect voting rights'],
    scenes: [
      scene('End slavery', '1865 · 13th', 'rights', 'Rebuilding means more than buildings', 'Reconstruction was the period of rebuilding and political change after the Civil War. The Thirteenth Amendment abolished slavery, except as punishment for a crime. Newly freed people sought family reunions, paid work, education, and control over their own lives.', 'Look at a community', 'Building schools and independent community organizations helped formerly enslaved people shape their futures. Freedom was about everyday choices as well as changes to national law.', 'Emancipation', 'Being freed from slavery.'),
      scene('Citizenship protections', '1868 · 14th', 'document', 'Who belongs—and who is protected?', 'The Fourteenth Amendment established citizenship for people born or naturalized in the United States and subject to its jurisdiction. It also required states to provide equal protection of the laws. These protections changed the Constitution in important ways.', 'Read a right and an experience', 'A law promising equal protection could exist alongside unfair treatment. Historians compare legal documents with records of schools, courts, work, and community life to understand that difference.', 'Citizenship', 'Membership in a country, with legal rights and responsibilities.'),
      scene('Voting protections', '1870 · 15th', 'people', 'A promise needs protection', 'The Fifteenth Amendment barred denying voting rights because of race, color, or previous enslavement. It did not give everyone the vote. Violence and discriminatory barriers later prevented many Black citizens from voting, despite this constitutional protection.', 'Spot the unfinished work', 'Threats can stop someone from using a right that exists on paper. People continued organizing, challenging unfair laws, and demanding that constitutional promises be enforced.', 'Enforce', 'To make sure a law or rule is actually followed.'),
    ],
    think: 'What is the difference between being promised a right and being able to use it safely?',
    source: { label: 'National Archives: Reconstruction amendments', url: 'https://www.archives.gov/founding-docs/amendments-11-27' },
  },
  'VS.9': {
    title: 'Connect a resource to a growing town', invitation: 'Build a mental railroad network. Follow the goods, then look at the people who made the network work.',
    diagram: 'network', diagramLabel: 'Resources, railroad connections, and industry', connections: ['Load and transport', 'Deliver to buyers'],
    scenes: [
      scene('Gather resources', 'At the source', 'mountain', 'Industry begins with materials', 'Virginia’s forests and coalfields supplied resources for industry. Workers cut timber and mined coal. Materials alone did not create a thriving factory or town: people also needed tools, investment, skills, and ways to move the goods.', 'Look beyond the resource', 'Mining and logging could offer jobs while also bringing dangerous work and changes to land and water. The benefits and costs were not shared equally.', 'Resource', 'Something people use to meet needs or make products.'),
      scene('Connect by rail', 'Along the route', 'train', 'Tracks turn places into a network', 'Railroads carried heavy goods and people across long distances. Bridges, including High Bridge near Farmville, connected routes across rivers. High Bridge Trail now follows a former railroad corridor, so a walk there can reveal an older transportation network.', 'Remove a connection in your mind', 'Imagine a track that never reaches a town, mine, or port. It cannot do much on its own. Connections let a railroad link the people who produce goods with the people who need them.', 'Infrastructure', 'Shared systems such as roads, railways, and bridges.'),
      scene('Reach a market', 'In the town', 'factory', 'Growth changes everyday life', 'Factories and markets used or sold the goods that trains delivered. Rail connections helped some Virginia towns and cities grow. Workers and families experienced new opportunities, but also difficult working conditions and unequal treatment.', 'Interview more than an owner', 'A business record might show profits. A worker’s account might describe pay, hours, and safety. A nearby resident might describe changes to the neighborhood. Together they reveal more of industrial change.', 'Market', 'A place or system where people buy and sell goods.'),
    ],
    think: 'If you followed a trainload of lumber, which people would you meet along the way?',
    source: { label: 'Virginia Museum of History & Culture: industrialization', url: 'https://virginiahistory.org/learn/industrialization-virginia' },
  },
  'VS.10': {
    title: 'A package connects the home front', invitation: 'Follow wartime supplies from workers to service members. War changed lives far beyond the battlefield.',
    diagram: 'network', diagramLabel: 'A wartime supply chain: make, transport, deliver', connections: ['Pack the supplies', 'Move by land and sea'],
    scenes: [
      scene('Make and conserve', 'At home', 'factory', 'Many kinds of service', 'During the world wars, Virginia civilians worked in factories, farms, and shipyards. Families conserved materials and adjusted daily routines. This civilian side of wartime life is called the home front. It was connected to military service, even far from battlefields.', 'Open a family’s cupboard', 'During World War II, rationing limited purchases of some scarce goods so supplies could be shared and directed to wartime needs. Conserving was one way everyday routines became part of the war effort.', 'Civilian', 'A person who is not a member of the armed forces.'),
      scene('Pack and transport', 'Between places', 'ship', 'Supplies need a journey', 'Making supplies was only the first step. Workers packed goods, moved them by rail or road, and loaded ships. Virginia’s ports and shipyards were important parts of these connections. A delay in one part of the network could affect people far away.', 'Trace a pair of boots', 'Think of the materials, factory workers, packers, transport workers, and service member linked by one pair of boots. This is a simplified example of a supply chain, not the journey of a particular surviving object.', 'Supply chain', 'The connected steps that make and deliver something.'),
      scene('Use and remember', 'In service', 'people', 'One war, many experiences', 'Service members depended on supplies and support. Families waited for news and coped with separation or loss. A letter from a service member and an account from a factory worker tell different parts of wartime life. Neither alone represents everyone.', 'Compare two windows', 'A wartime poster might try to persuade people to act. A personal letter might describe worries or daily routines. Ask who created a source, for whom, and for what purpose.', 'Home front', 'Civilian life and work in a country during a war.'),
    ],
    think: 'How could something done at home affect a person serving far away?',
    source: { label: 'Virginia Museum of History & Culture: a new Virginia', url: 'https://virginiahistory.org/learn/story-of-virginia/chapter/new-virginia-0' },
  },
  'VS.11': {
    title: 'Barbara Johns and the students who spoke up', invitation: 'Meet a real student organizer. Follow how a school protest became part of a national struggle for equal education.',
    diagram: 'timeline', diagramLabel: 'Student action, a court ruling, and resistance in Prince Edward County', connections: ['A legal challenge grows', 'Resistance continues'],
    scenes: [
      scene('Students take action', '1951', 'school', 'A sixteen-year-old helps lead change', 'Barbara Johns attended Robert Russa Moton High School in Farmville. Black students faced crowded, unequal school conditions under segregation. Johns helped organize a student strike in 1951. Students and families sought change, and their lawsuit became one of the cases considered in Brown v. Board of Education.', 'Look at the school itself', 'Buildings and classrooms can be historical evidence. Moton’s students were challenging real differences in educational conditions, not simply asking for a different school name.', 'Segregation', 'The enforced separation of people by race.'),
      scene('The Supreme Court rules', '1954', 'rights', 'A national legal victory', 'In Brown v. Board of Education, the Supreme Court ruled racial segregation in public schools unconstitutional. The Virginia case helped shape this landmark decision. Students, families, lawyers, and communities all played roles.', 'Connect a local action to a national change', 'A protest at one school helped lead to a case with consequences across the country. Change involved many people working through different kinds of action, including organizing and legal arguments.', 'Unconstitutional', 'In conflict with the Constitution.'),
      scene('Schools close', '1959–1964', 'document', 'A ruling does not enforce itself', 'Prince Edward County closed its public schools in 1959 rather than integrate them. The schools remained closed until 1964. Black children were especially harmed; many lost years of formal schooling. Families and communities continued fighting for access to education.', 'Keep following the story', 'Stopping the timeline at the 1954 ruling would hide the resistance that followed. A fuller history follows both a legal victory and what happened in people’s daily lives afterward.', 'Integration', 'Ending enforced separation so people can participate together.'),
    ],
    think: 'What does this story show about young people’s ability to help change their communities?',
    source: { label: 'National Park Service: Virginia and school desegregation', url: 'https://www.nps.gov/brvb/learn/historyculture/virginia.htm' },
  },
  'VS.12': {
    title: 'Presidents are people to investigate', invitation: 'Explore Virginia’s presidential connections, put leaders in time, and examine their decisions from more than one viewpoint.',
    diagram: 'network', diagramLabel: 'Three lenses for investigating a president: place, time, and legacy', connections: ['Place a life in time', 'Investigate its effects'],
    scenes: [
      scene('Birthplace', 'A Virginia connection', 'mountain', 'Why “Mother of Presidents”?', 'Eight U.S. presidents were born in Virginia: George Washington, Thomas Jefferson, James Madison, James Monroe, William Henry Harrison, John Tyler, Zachary Taylor, and Woodrow Wilson. The nickname refers to their birthplaces, not to every place they later lived or worked.', 'Open the birthplace clue', 'A birthplace is one fact about a person. To understand their life, also explore where they grew up, the people around them, and the circumstances in which they made decisions.', 'Biography', 'An account of a person’s life.'),
      scene('Time in office', '1789 → 1801 → 1809', 'document', 'Build a timeline, not a blur', 'Washington became the first president in 1789. Jefferson became the third in 1801, and Madison the fourth in 1809. John Adams, born in Massachusetts, served between Washington and Jefferson. Presidents faced different events and inherited earlier decisions.', 'Find the missing president', 'A list of Virginia-born presidents is not a complete list of presidents. Ask what a timeline includes and what it leaves out before using it to explain the past.', 'Chronology', 'The order in which events happened.'),
      scene('Legacy', 'Effects across time', 'search', 'Ask who benefited and who was harmed', 'A leader’s legacy includes achievements, harmful actions, and effects on different people. Washington, Jefferson, and Madison helped shape the nation, and all three enslaved people. Learning about their leadership means examining these contradictions with evidence.', 'Use more than a portrait', 'Laws, letters, speeches, and accounts from people affected by a president’s decisions can reveal different parts of the record. A famous name is a reason to investigate, not a reason to stop asking questions.', 'Legacy', 'The lasting effects of a person’s life and actions.'),
    ],
    think: 'Which sources could help you understand how a president’s decision affected ordinary people?',
    source: { label: 'Commonwealth of Virginia: history and facts', url: 'https://www.commonwealth.virginia.gov/about-virginia/history-and-facts-on-virginia/' },
  },
  'VS.13': {
    title: 'A Virginia product travels the world', invitation: 'Trace an example journey from farm to port to buyer. Then become a careful reader of the numbers behind trade.',
    diagram: 'network', diagramLabel: 'An example export journey from Virginia to another country', connections: ['Move to the port', 'Ship to another country'],
    scenes: [
      scene('A local beginning', 'On a Virginia farm', 'plant', 'Global connections can start nearby', 'A farm grows a product that an overseas customer wants to buy. Growing it depends on people, land, equipment, and weather. This example follows a farm product, but Virginia’s economy also includes services, technology, manufacturing, and many other kinds of work.', 'Name the journey', 'When a product is sold to another country, it is an export. A product bought from another country is an import. The same shipment can be an export for the seller’s country and an import for the buyer’s.', 'Export', 'A product sold to another country.'),
      scene('Roads, rail, and port', 'Across a network', 'ship', 'A port connects land and sea', 'A truck or train carries goods toward a port. Workers and equipment transfer cargo to ships. The Port of Virginia connects inland transportation with ocean trade. A supply chain works because people and systems at each step connect with the next.', 'Imagine one link slows down', 'A damaged road, a delayed ship, or a poor harvest can affect delivery. This diagram shows a possible route, not a live shipment or every step in world trade.', 'Port', 'A place where ships load and unload cargo or passengers.'),
      scene('Buyer and evidence', 'Across the world', 'globe', 'Check what a number really means', 'An overseas buyer receives the product. People use economic data to describe trade and jobs, but numbers depend on when and how they were counted. Before comparing two charts, check their dates, sources, and definitions.', 'Compare like with like', 'A chart of all jobs in one year cannot be directly compared with a chart of only farm jobs in another year. First find out what each number counts. These diagrams use no live trade totals.', 'Data', 'Recorded information that can help answer a question.'),
    ],
    think: 'How many kinds of work can you find along one product’s journey?',
    source: { label: 'The Port of Virginia: trade connections', url: 'https://www.portofvirginia.com/' },
  },
};
