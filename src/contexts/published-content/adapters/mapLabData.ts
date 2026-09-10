export const DENSITY_COLORS = ['#fff1c9', '#edcd87', '#dca649', '#c77332', '#9c493b', '#4d293c'];
export const DENSITY_RANGES = ['1–10', '11–100', '101–500', '501–1,000', '1,001–5,000', 'More than 5,000'];
export const POPULATION_PLACES = [
  { name: 'Highland County', at: [-79.56, 38.36], density: 5.4, category: 0, source: 'https://tigerweb.geo.census.gov/tigerwebmain/Files/bas25/tigerweb_bas25_county_2020_tab20_va.html' },
  { name: 'Loudoun County', at: [-77.64, 39.09], density: 816.2, category: 3, source: 'https://www.census.gov/quickfacts/fact/table/loudouncountyvirginia/POP060220' },
  { name: 'Arlington County', at: [-77.1, 38.88], density: 9179.6, category: 5, source: 'https://www.census.gov/quickfacts/fact/table/arlingtoncountyvirginia/POP060220' },
  { name: 'Richmond city', at: [-77.44, 37.54], density: 3781.6, category: 4, source: 'https://www.census.gov/quickfacts/fact/table/richmondcityvirginia/POP060220' },
  { name: 'Norfolk city', at: [-76.29, 36.85], density: 4467.5, category: 4, source: 'https://www.census.gov/quickfacts/fact/table/norfolkcityvirginia/POP060220' },
] as const;
// Highland: 2,232 residents / (1,075,266,902 square meters / 2,589,988.110336) = 5.376...; rounded to one decimal.
// Whole-number class labels follow the supplied worksheet; categories are illustrative bins, not color estimates of unsampled areas.
export const MAP_TOPICS = [
  { id: 'regions', label: 'Five regions', title: 'Read the landscape', intro: 'A region is an area with shared characteristics. Explore Virginia from the southwestern plateau to the Atlantic coast.' },
  { id: 'climate', label: 'Climate', title: 'One state, different climates', intro: 'Climate describes weather patterns over many years. Compare the mountains and coast, then read each map’s own legend.' },
  { id: 'population', label: 'Population', title: 'Where do people live?', intro: 'Population density tells us how many people live in each square mile, on average. It helps us compare places of different sizes.' },
  { id: 'tools', label: 'Map tools', title: 'Think like a map detective', intro: 'First read the title. Then look for the legend, compass rose, scale, and date. Each helps you ask a better question.' },
] as const;
export type MapTopic = typeof MAP_TOPICS[number]['id'];
