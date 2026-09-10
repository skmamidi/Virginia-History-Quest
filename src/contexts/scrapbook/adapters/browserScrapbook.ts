import { blankScrapbook, parseScrapbook, type Scrapbook } from '../domain/scrapbook';
export const SCRAPBOOK_KEY = 'virginia-history-quest:scrapbook:v1';
export function loadScrapbook(): { book: Scrapbook; warning: string } {
  try {
    const raw = window.localStorage.getItem(SCRAPBOOK_KEY);
    if (raw === null) return { book: blankScrapbook(), warning: '' };
    const book = parseScrapbook(raw);
    return book ? { book, warning: '' } : { book: blankScrapbook(), warning: 'The saved scrapbook could not be read. Your original data has not been changed. Restore a backup before editing if you have one.' };
  } catch { return { book: blankScrapbook(), warning: 'Browser saving is unavailable. Download a backup to keep your work.' }; }
}
export function saveScrapbook(book: Scrapbook): boolean {
  try { window.localStorage.setItem(SCRAPBOOK_KEY, JSON.stringify(book)); return true; } catch { return false; }
}
export function downloadScrapbook(book: Scrapbook) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(book, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'my-virginia-scrapbook.json'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Re-encode selected photos locally to keep storage small and omit embedded camera metadata.
export async function preparePhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 15_000_000) throw new Error('Choose a JPG, PNG, or WebP photo smaller than 15 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url; await image.decode();
    const scale = Math.min(1, 1000 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
    const context = canvas.getContext('2d'); if (!context) throw new Error('This browser could not prepare the photo.');
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL('image/jpeg', 0.72);
    if (result.length > 900000) throw new Error('This photo is too large to save. Try a smaller photo.');
    return result;
  } finally { URL.revokeObjectURL(url); }
}
