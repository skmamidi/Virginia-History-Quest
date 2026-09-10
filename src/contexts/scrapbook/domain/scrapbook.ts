import { z } from 'zod';

const text = z.string().max(6000);
const visitSchema = z.object({
  place: z.string().max(160), jurisdiction: z.enum(['VA', 'DC', 'Other']), region: z.string().max(80),
  date: z.string().max(10), visited: z.boolean(), why: text, history: text, learned: text,
  favorite: text, recommend: text, caption: z.string().max(300),
  photo: z.string().max(900000).refine(value => value === '' || /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value)),
  studentInPhoto: z.boolean(), physicalPhoto: z.boolean(),
});
const bookSchema = z.object({ version: z.literal(1), visits: z.array(visitSchema).length(5), organized: z.boolean(), rehearsed: z.boolean() });
export type Visit = z.infer<typeof visitSchema>;
export type Scrapbook = z.infer<typeof bookSchema>;
export function blankScrapbook(): Scrapbook {
  return { version: 1, organized: false, rehearsed: false, visits: Array.from({ length: 5 }, () => ({
    place: '', jurisdiction: 'VA', region: '', date: '', visited: false, why: '', history: '', learned: '',
    favorite: '', recommend: '', caption: '', photo: '', studentInPhoto: false, physicalPhoto: false,
  })) };
}
export function parseScrapbook(raw: string): Scrapbook | null {
  try { const result = bookSchema.safeParse(JSON.parse(raw)); return result.success ? result.data : null; } catch { return null; }
}
export function visitChecklist(v: Visit) {
  return { visited: v.visited && !!v.place.trim(), photo: (!!v.photo || v.physicalPhoto) && v.studentInPhoto,
    writing: [v.why, v.history, v.learned, v.favorite, v.recommend].every(value => !!value.trim()) };
}
export function projectChecklist(book: Scrapbook) {
  return {
    locations: book.visits.every(v => visitChecklist(v).visited && v.jurisdiction !== 'Other') &&
      book.visits.filter(v => v.jurisdiction === 'DC').length <= 1 &&
      new Set(book.visits.map(v => v.place.trim().toLocaleLowerCase())).size === 5,
    photos: book.visits.every(v => visitChecklist(v).photo), writing: book.visits.every(v => visitChecklist(v).writing),
    organized: book.organized, rehearsed: book.rehearsed,
  };
}
