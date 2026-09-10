import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

// GitHub Pages must receive Vite's output, never the source index.html.
const directory = resolve(process.argv[2] ?? 'dist');
const base = '/Virginia-History-Quest/';
const html = await readFile(resolve(directory, 'index.html'), 'utf8');
const resources = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)].map(match => match[1]);
assert(resources.some(url => url.startsWith(`${base}assets/`) && url.endsWith('.js')), 'Pages needs the compiled JavaScript bundle. Run npm run build and publish dist/.');
assert(!resources.some(url => /\/src\/|\.(?:tsx?|jsx)(?:$|\?)/.test(url)), 'Source files cannot run on GitHub Pages.');
for (const url of resources) {
  assert(url.startsWith(base), `Asset is outside the repository base path: ${url}`);
  assert((await stat(resolve(directory, url.slice(base.length)))).isFile(), `Missing published asset: ${url}`);
}
console.log(`Pages build verified: compiled entry point and ${resources.length} resources under ${base}`);
