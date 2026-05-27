/**
 * One-shot port: lernen-de-all/public/data.js (VOCAB) → src/data/vocabulary.json.
 * Reads as UTF-8 to preserve German diacritics (ß, ä…) and emojis exactly.
 * Re-run if the upstream figé data source changes. Safe to delete otherwise.
 */
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/LUFFY MKD/lernen-de-all/public/data.js';
const OUT = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');

const src = fs.readFileSync(SRC, 'utf8');
const line = src.split(/\r?\n/).find((l) => l.trimStart().startsWith('const VOCAB'));
if (!line) throw new Error('VOCAB declaration not found');

const json = line.replace(/^\s*const VOCAB\s*=\s*/, '').replace(/;\s*$/, '');
const data = JSON.parse(json);

const cats = Object.keys(data);
let total = 0;
const keys = new Set();
for (const c of cats) {
  total += data[c].length;
  for (const w of data[c]) Object.keys(w).forEach((k) => keys.add(k));
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data), 'utf8');

console.log('CATEGORIES:', cats.join(', '));
console.log('COUNTS:', cats.map((c) => `${c}=${data[c].length}`).join(', '));
console.log('KEYS:', [...keys].join(','));
console.log('TOTAL WORDS:', total);
console.log('WROTE:', OUT);
