/**
 * One-shot port: lernen-de-all/public/verbs-data.js (VERBS) → src/data/verbs.json.
 * Reads as UTF-8 to preserve German diacritics (ß, ä, ö, ü) exactly.
 * Re-run if the upstream figé data source changes. Safe to delete otherwise.
 *
 * Compact format (per verb): v, f, t, x, s, P[6], T[6], K, l, n. See verbs.ts.
 */
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/LUFFY MKD/lernen-de-all/public/verbs-data.js';
const OUT = path.join(__dirname, '..', 'src', 'data', 'verbs.json');

const src = fs.readFileSync(SRC, 'utf8');
const match = src.match(/const\s+VERBS\s*=\s*(\[[\s\S]*?\]);/);
if (!match) throw new Error('VERBS declaration not found');

const data = JSON.parse(match[1]);

const byType = {};
const byLevel = {};
for (const v of data) {
  byType[v.t] = (byType[v.t] || 0) + 1;
  byLevel[v.l] = (byLevel[v.l] || 0) + 1;
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data), 'utf8');

console.log('TOTAL:', data.length);
console.log('BY TYPE:', byType);
console.log('BY LEVEL:', byLevel);
console.log('WROTE:', OUT);
