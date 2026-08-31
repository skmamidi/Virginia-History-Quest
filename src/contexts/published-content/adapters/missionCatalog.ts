import {
  MissionCatalogSchema,
  type MissionCatalog,
} from "../domain/mission";

/**
 * This adapter stands in for the versioned `/v1/catalog` response. Historical
 * and curriculum copy stays here so UI components only render projections.
 * Portal points are deliberately broad and must not be used for navigation.
 */
const missionCatalogSource = {
  version: "2026.08",
  missions: [
    {
      id: "VS.1",
      title: "Virginia: Land, Water, and Human Movement",
      shortTitle: "Land & Water",
      experienceTitle: "Land, water & movement",
      essentialQuestion:
        "How does Virginia’s geography influence where people live and move?",
      heroLocation: "Virginia’s five physical regions",
      mapSummary:
        "A generalized statewide point introduces Virginia’s regions, rivers, and movement routes.",
      dateLabel: "Deep time–today",
      eraLabel: "Geography across time",
      hook: "Restore the land and water layers erased from the Memory Map.",
      learningFocus: ["Regions and landforms", "Rivers and routes", "Map skills"],
      portal: {
        longitude: -82.45,
        latitude: 37.05,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.2",
      title: "Indigenous Virginia: Deep History and Living Nations",
      shortTitle: "Indigenous Virginia",
      experienceTitle: "Deep history & living nations",
      essentialQuestion:
        "How do evidence and living communities help us understand Indigenous Virginia?",
      heroLocation: "Virginia’s watersheds and cultural regions",
      mapSummary:
        "A watershed-scale point represents broad cultural landscapes without exposing sensitive places.",
      dateLabel: "Deep history–today",
      eraLabel: "Indigenous Virginia",
      hook: "Read land, language, and artifacts as clues to enduring communities.",
      learningFocus: [
        "Living nations",
        "Land and language",
        "Evidence and stewardship",
      ],
      portal: {
        longitude: -76.72,
        latitude: 37.58,
        precision: "generalized_sensitive",
        sensitive: true,
      },
      status: "published",
    },
    {
      id: "VS.3",
      title: "Jamestown: Choices, Survival, Encounters, and Government",
      shortTitle: "Jamestown",
      experienceTitle: "Choices, survival & change",
      essentialQuestion:
        "Why did Jamestown survive despite severe risk?",
      heroLocation: "Lower James River landscape",
      mapSummary:
        "A broad Lower James River point connects the Chesapeake watershed with the Jamestown story.",
      dateLabel: "1607–1624",
      eraLabel: "Early Jamestown",
      hook: "Investigate why the settlement struggled and how people responded.",
      learningFocus: ["Settlement choices", "Survival and encounters", "Government"],
      portal: {
        longitude: -76.8,
        latitude: 37.2,
        precision: "water_body",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.4",
      title: "Colonial Virginia: Land, Labor, Law, and Daily Life",
      shortTitle: "Colonial Virginia",
      experienceTitle: "Land, labor & law",
      essentialQuestion:
        "How did land, labor, and law shape daily life in colonial Virginia?",
      heroLocation: "Colonial Virginia’s river communities",
      mapSummary:
        "A generalized central river-corridor point represents connected colonial communities and systems.",
      dateLabel: "1600s–1700s",
      eraLabel: "Colonial Virginia",
      hook: "Trace how work, rules, and communities changed across the colony.",
      learningFocus: ["Land and labor", "Law and power", "Daily life"],
      portal: {
        longitude: -77.25,
        latitude: 37.48,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.5",
      title: "Revolution in Virginia: Ideas, Choices, War, and Independence",
      shortTitle: "Revolution",
      experienceTitle: "Ideas, choices & independence",
      essentialQuestion:
        "How did ideas and choices in Virginia contribute to independence?",
      heroLocation: "Virginia’s Revolutionary routes",
      mapSummary:
        "A generalized Tidewater point anchors a statewide story of ideas, choices, and Revolutionary movement.",
      dateLabel: "1775–1781",
      eraLabel: "American Revolution",
      hook: "Connect powerful ideas to difficult choices and their consequences.",
      learningFocus: ["Ideas and rights", "Choices and perspectives", "War and independence"],
      portal: {
        longitude: -76.5,
        latitude: 37.25,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.6",
      title:
        "Building a New Nation: Rights, Government, Expansion, and Resistance",
      shortTitle: "New Nation",
      experienceTitle: "Rights, government & resistance",
      essentialQuestion:
        "How did Virginians help shape a new government, and who was left out?",
      heroLocation: "Virginia’s civic and westward networks",
      mapSummary:
        "A broad Piedmont point links public ideas, government, migration, and resistance across Virginia.",
      dateLabel: "1781–1850s",
      eraLabel: "The new nation",
      hook: "Test how promises about rights worked in practice for different people.",
      learningFocus: ["Rights and government", "Expansion", "Resistance and limits"],
      portal: {
        longitude: -83.45,
        latitude: 36.68,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.7",
      title:
        "Civil War in Virginia: Slavery, Division, Service, and Consequence",
      shortTitle: "Civil War",
      experienceTitle: "Slavery, division & consequence",
      essentialQuestion:
        "How did slavery and secession lead to war, and what changed as a result?",
      heroLocation: "Virginia’s Civil War landscapes",
      mapSummary:
        "A statewide generalized point represents connected home-front, freedom, and military landscapes.",
      dateLabel: "1861–1865",
      eraLabel: "Civil War",
      hook: "Build an evidence chain from slavery and division to war and emancipation.",
      learningFocus: ["Slavery and division", "Service and freedom", "Consequences"],
      portal: {
        longitude: -78.8,
        latitude: 37.38,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.8",
      title:
        "Reconstruction: Freedom, Citizenship, Education, and Resistance",
      shortTitle: "Reconstruction",
      experienceTitle: "Freedom, citizenship & resistance",
      essentialQuestion:
        "What changed during Reconstruction, and what limited that change?",
      heroLocation: "Virginia’s Reconstruction communities",
      mapSummary:
        "A generalized central Virginia point represents community, school, government, and resistance networks.",
      dateLabel: "1865–1877",
      eraLabel: "Reconstruction",
      hook: "Measure new freedoms alongside the barriers people continued to face.",
      learningFocus: ["Freedom and citizenship", "Education", "Change and resistance"],
      portal: {
        longitude: -76.36,
        latitude: 37.05,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.9",
      title: "Railroads, Cities, Industry, and a Changing Virginia",
      shortTitle: "Industry & Cities",
      experienceTitle: "Rails, cities & industry",
      essentialQuestion:
        "How did transportation and industry reshape Virginia communities?",
      heroLocation: "Virginia’s rail and city network",
      mapSummary:
        "A generalized rail-corridor point connects western resources, cities, and coastal trade.",
      dateLabel: "1870s–early 1900s",
      eraLabel: "Industrial change",
      hook: "Reconnect rails, resources, workers, and cities to see a changing system.",
      learningFocus: ["Railroad networks", "Cities and industry", "Uneven change"],
      portal: {
        longitude: -79.94,
        latitude: 37.27,
        precision: "route",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.10",
      title:
        "Virginia in the World Wars: Mobilization, Service, Home Front, and Memory",
      shortTitle: "World Wars",
      experienceTitle: "Service, home front & memory",
      essentialQuestion:
        "How did the world wars change service, work, communities, and memory in Virginia?",
      heroLocation: "Virginia’s wartime logistics network",
      mapSummary:
        "A generalized Hampton Roads region represents wartime movement without showing operational details.",
      dateLabel: "1917–1945",
      eraLabel: "The World Wars",
      hook: "Follow people and supplies while asking how communities remember service and loss.",
      learningFocus: ["Mobilization and service", "Home front", "Memory and evidence"],
      portal: {
        longitude: -79.52,
        latitude: 37.33,
        precision: "generalized_sensitive",
        sensitive: true,
      },
      status: "published",
    },
    {
      id: "VS.11",
      title:
        "Civil Rights in Virginia: Students, Courts, Communities, and Change",
      shortTitle: "Civil Rights",
      experienceTitle: "Students, courts & change",
      essentialQuestion:
        "How did students, families, lawyers, and communities work for civil rights?",
      heroLocation: "Virginia’s civil-rights community network",
      mapSummary:
        "A county-scale central Virginia point represents linked student, community, and court action.",
      dateLabel: "1902–1990",
      eraLabel: "Civil rights in Virginia",
      hook: "Trace how local courage, organized action, and court cases created change.",
      learningFocus: ["Student action", "Courts and communities", "Change and resistance"],
      portal: {
        longitude: -78.4,
        latitude: 37.3,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.12",
      title: "Virginia, the “Mother of Presidents”",
      shortTitle: "Presidents",
      experienceTitle: "Virginia-born presidents",
      essentialQuestion:
        "Why is Virginia called the Mother of Presidents, and what can their records teach us?",
      heroLocation: "Virginia-born presidents’ statewide connections",
      mapSummary:
        "A generalized statewide point introduces the places and timelines connected with eight presidents.",
      dateLabel: "1789–1921",
      eraLabel: "Virginia-born presidents",
      hook: "Build a presidential sequence while examining achievements and contradictions.",
      learningFocus: ["Presidential sequence", "Virginia connections", "Complex legacies"],
      portal: {
        longitude: -77.09,
        latitude: 38.71,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
    {
      id: "VS.13",
      title:
        "Virginia in the Global Economy: Products, Networks, Science, and Innovation",
      shortTitle: "Virginia Today",
      experienceTitle: "Products, science & innovation",
      essentialQuestion:
        "How do Virginia’s products, people, and ideas connect with a changing world?",
      heroLocation: "Virginia’s modern economic network",
      mapSummary:
        "A broad statewide point represents trade, agriculture, research, and technology without operational detail.",
      dateLabel: "1917–today",
      eraLabel: "Modern Virginia",
      hook: "Follow a product or idea through the networks that connect Virginia to the world.",
      learningFocus: ["Products and trade", "Science and innovation", "Changing data"],
      portal: {
        longitude: -77.2,
        latitude: 38.9,
        precision: "region",
        sensitive: false,
      },
      status: "published",
    },
  ],
} as const;

/** Parse at the publication boundary so malformed or incomplete content fails closed. */
export const MISSION_CATALOG: MissionCatalog = MissionCatalogSchema.parse(
  missionCatalogSource,
);
