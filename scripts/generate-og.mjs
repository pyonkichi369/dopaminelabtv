/**
 * Generates /public/og-default.png (1200×630) for SNS card images.
 * Uses sharp (available as Astro transitive dep). Run: node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'og-default.png');

const W = 1200;
const H = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="grain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
      <feBlend in="SourceGraphic" in2="gray" mode="overlay"/>
    </filter>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b44840" stop-opacity="0"/>
      <stop offset="25%" stop-color="#b44840" stop-opacity="0.5"/>
      <stop offset="75%" stop-color="#b44840" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#b44840" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#faf5ec"/>
  <rect width="${W}" height="${H}" fill="#1e1910" opacity="0.04" filter="url(#grain)"/>

  <!-- Left accent line -->
  <rect x="0" y="0" width="3" height="${H}" fill="url(#lineGrad)"/>

  <!-- Enso circle — right side, very subtle -->
  <circle cx="940" cy="315" r="240"
    stroke="#b44840" stroke-width="32" fill="none" stroke-linecap="round"
    stroke-dasharray="1383 120" opacity="0.07"/>

  <!-- Decorative kanji background -->
  <text x="820" y="480"
    font-family="'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', Georgia, serif"
    font-size="320" font-weight="300" fill="#b44840" opacity="0.04"
    text-anchor="middle">研</text>

  <!-- Eyebrow -->
  <text x="56" y="130"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="16" font-weight="400" fill="#8a6f2e" letter-spacing="6">
    DOPAMINE LAB TV
  </text>

  <!-- Horizontal rule after eyebrow -->
  <line x1="56" y1="148" x2="260" y2="148" stroke="#8a6f2e" stroke-width="1" opacity="0.4"/>

  <!-- Main heading line 1 -->
  <text x="56" y="270"
    font-family="Georgia, 'Times New Roman', 'Noto Serif', serif"
    font-size="72" font-weight="400" fill="#1e1910" letter-spacing="-0.5">
    The science of
  </text>

  <!-- Main heading line 2 — accent color -->
  <text x="56" y="358"
    font-family="Georgia, 'Times New Roman', 'Noto Serif', serif"
    font-size="72" font-weight="400" fill="#b44840" letter-spacing="-0.5">
    staying human.
  </text>

  <!-- Tagline -->
  <text x="56" y="446"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="22" font-weight="300" fill="#7e6e5a" letter-spacing="1">
    Neuroscience x Japanese philosophy for the AI age
  </text>

  <!-- Bottom separator -->
  <line x1="56" y1="530" x2="500" y2="530" stroke="#1e1910" stroke-width="1" opacity="0.1"/>

  <!-- Domain -->
  <text x="56" y="562"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="18" fill="#7e6e5a" letter-spacing="3" opacity="0.7">
    dopaminelabtv.com
  </text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(OUT, png);
console.log(`✓ og-default.png generated → ${OUT} (${(png.length / 1024).toFixed(0)}KB)`);
