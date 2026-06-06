/**
 * Rasterize brand SVGs -> PNG for Expo (icon, adaptive, splash, favicon).
 * Build-time tool. Run: node scripts/rasterize-brand.cjs
 * sharp installed via `npm i --no-save sharp` (not a project dependency).
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'assets', 'brand');
const OUT = path.join(__dirname, '..', 'assets', 'images');

// [svg source, png output, target px]
const JOBS = [
  ['icon-ios.svg', 'icon.png', 1024],
  ['adaptive-foreground.svg', 'adaptive-foreground.png', 1024],
  ['adaptive-background.svg', 'adaptive-background.png', 1024],
  ['adaptive-monochrome.svg', 'adaptive-monochrome.png', 1024],
  ['splash-mark.svg', 'splash-mark.png', 1024],
  ['splash-mark-dark.svg', 'splash-mark-dark.png', 1024],
  ['favicon.svg', 'favicon.png', 196],
];

(async () => {
  for (const [src, out, size] of JOBS) {
    const svg = fs.readFileSync(path.join(SRC, src));
    // High density => crisp rasterization, then resize to exact target.
    await sharp(svg, { density: 384 })
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, out));
    const { size: bytes } = fs.statSync(path.join(OUT, out));
    console.log(`OK  ${out.padEnd(26)} ${size}px  ${(bytes / 1024).toFixed(1)} KB`);
  }
  console.log('Done.');
})().catch((e) => {
  console.error('FAIL', e);
  process.exit(1);
});
