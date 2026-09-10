import { describe, expect, it } from 'vitest';
import { blankScrapbook, visitChecklist, projectChecklist, parseScrapbook } from './scrapbook';

describe('school scrapbook requirements', () => {
  it('counts five distinct visited sites, with at most one in DC', () => {
    const book = blankScrapbook();
    book.visits.forEach((v, i) => Object.assign(v, { place: `Place ${i}`, jurisdiction: 'VA', visited: true }));
    expect(projectChecklist(book).locations).toBe(true);
    book.visits[1].place = '  place 0  ';
    expect(projectChecklist(book).locations).toBe(false);
    book.visits[1].place = 'Place 1';
    book.visits[0].jurisdiction = 'DC';
    expect(projectChecklist(book).locations).toBe(true);
    book.visits[1].jurisdiction = 'DC';
    expect(projectChecklist(book).locations).toBe(false);
    book.visits[1].jurisdiction = 'Other';
    expect(projectChecklist(book).locations).toBe(false);
  });
  it('requires a photo with the student or a confirmed physical photo and meaningful writing fields', () => {
    const v = blankScrapbook().visits[0];
    v.studentInPhoto = true;
    expect(visitChecklist(v).photo).toBe(false);
    v.physicalPhoto = true;
    expect(visitChecklist(v).photo).toBe(true);
    expect(visitChecklist(v).writing).toBe(false);
    Object.assign(v, { why: 'Curious about canals', history: 'Canal boats carried goods.', learned: 'Locks lift boats.', favorite: 'The old lock.', recommend: 'Yes, because I could see the canal.' });
    expect(visitChecklist(v).writing).toBe(true);
  });
  it('rejects malformed or incompatible backups instead of silently erasing saved work', () => {
    expect(parseScrapbook(JSON.stringify(blankScrapbook()))).not.toBeNull();
    for (const bad of ['{}', 'oops', '{"version":99}', JSON.stringify({ ...blankScrapbook(), visits: [] })]) expect(parseScrapbook(bad)).toBeNull();
    const bad = blankScrapbook(); bad.visits[0].photo = 'https://example.com/tracker.jpg';
    expect(parseScrapbook(JSON.stringify(bad))).toBeNull();
  });
});
