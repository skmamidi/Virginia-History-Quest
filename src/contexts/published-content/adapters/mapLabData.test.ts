import { expect, it } from 'vitest';
import { POPULATION_PLACES } from './mapLabData';

it('includes every Virginia county and independent city exactly once and reconciles to the 2020 Census total', () => {
  expect(POPULATION_PLACES).toHaveLength(133);
  expect(POPULATION_PLACES.filter(p => p.kind === 'county')).toHaveLength(95);
  expect(POPULATION_PLACES.filter(p => p.kind === 'city')).toHaveLength(38);
  expect(new Set(POPULATION_PLACES.map(p => p.id)).size).toBe(133);
  expect(POPULATION_PLACES.reduce((total, p) => total + p.population, 0)).toBe(8631393);
  expect(POPULATION_PLACES.find(p => p.name === 'Arlington County')?.density).toBeCloseTo(9179.5, 1);
  expect(POPULATION_PLACES.find(p => p.name === 'Highland County')?.density).toBeCloseTo(5.4, 1);
  for (const p of POPULATION_PLACES) {
    expect(p.landAreaSquareMeters).toBeGreaterThan(0);
    expect(p.at[0]).toBeGreaterThan(-84);
    expect(p.at[0]).toBeLessThan(-75);
    expect(p.at[1]).toBeGreaterThan(36);
    expect(p.at[1]).toBeLessThan(40);
  }
});
