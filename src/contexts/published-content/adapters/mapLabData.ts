import populationRecords from './virginiaPopulation2020.json';
export const DENSITY_COLORS = ['#fff1c9', '#edcd87', '#dca649', '#c77332', '#9c493b', '#4d293c'];
export const DENSITY_RANGES = ['Up to 10', 'Over 10–100', 'Over 100–500', 'Over 500–1,000', 'Over 1,000–5,000', 'Over 5,000'];
export const POPULATION_SOURCE = 'https://tigerweb.geo.census.gov/tigerwebmain/Files/bas25/tigerweb_bas25_county_2020_tab20_va.html';
export const POPULATION_PLACES = populationRecords.map(record => {
  const exactDensity = record.population / (record.landAreaSquareMeters / 2589988.110336);
  return { ...record, density: Math.round(exactDensity * 10) / 10,
    category: [10, 100, 500, 1000, 5000].filter(limit => exactDensity > limit).length };
});
export const MAP_TOPICS = [
  { id: 'regions', label: 'Five regions', title: 'Read the landscape', intro: 'A region is an area with shared characteristics. Explore Virginia from the southwestern plateau to the Atlantic coast.' },
  { id: 'climate', label: 'Climate', title: 'One state, different climates', intro: 'Climate describes weather patterns over many years. Compare the mountains and coast, then read each map’s own legend.' },
  { id: 'population', label: 'Population', title: 'Where do people live?', intro: 'Population density tells us how many people live in each square mile, on average. It helps us compare places of different sizes.' },
  { id: 'tools', label: 'Map tools', title: 'Think like a map detective', intro: 'First read the title. Then look for the legend, compass rose, scale, and date. Each helps you ask a better question.' },
] as const;
export type MapTopic = typeof MAP_TOPICS[number]['id'];
