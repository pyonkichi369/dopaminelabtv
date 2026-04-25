/**
 * Generates OGP images:
 *   /public/og-default.png     — site-wide default (1200×630)
 *   /public/og/[slug].png      — per-article, title embedded
 * Uses sharp (Astro transitive dep). Run: node scripts/generate-og.mjs
 */
import sharp from 'sharp';
import { writeFileSync, readFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const W = 1200;
const H = 630;

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapWords(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? current + ' ' + word : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function wrapChars(text, maxChars) {
  const lines = [];
  for (let i = 0; i < text.length; i += maxChars) {
    lines.push(text.slice(i, i + maxChars));
  }
  return lines;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) result[key] = val;
  }
  return result;
}

// ─── Shared decorative SVG elements ───────────────────────────────────────
const DEFS = `  <defs>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b44840" stop-opacity="0"/>
      <stop offset="25%" stop-color="#b44840" stop-opacity="0.5"/>
      <stop offset="75%" stop-color="#b44840" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#b44840" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

const BG = `  <rect width="${W}" height="${H}" fill="#faf5ec"/>
  <rect x="0" y="0" width="3" height="${H}" fill="url(#lineGrad)"/>
  <circle cx="940" cy="315" r="240"
    stroke="#b44840" stroke-width="32" fill="none" stroke-linecap="round"
    stroke-dasharray="1383 120" opacity="0.07"/>
  <text x="820" y="480"
    font-family="'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', Georgia, serif"
    font-size="320" font-weight="300" fill="#b44840" opacity="0.04"
    text-anchor="middle">研</text>`;

const FOOTER = `  <line x1="56" y1="530" x2="500" y2="530" stroke="#1e1910" stroke-width="1" opacity="0.1"/>
  <text x="56" y="562"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="18" fill="#7e6e5a" letter-spacing="3" opacity="0.7">
    dopaminelabtv.com
  </text>`;

const EYEBROW = `  <text x="56" y="96"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="16" font-weight="400" fill="#8a6f2e" letter-spacing="6">
    DOPAMINE LAB TV
  </text>
  <line x1="56" y1="114" x2="260" y2="114" stroke="#8a6f2e" stroke-width="1" opacity="0.4"/>`;

// ─── Default OGP ──────────────────────────────────────────────────────────
const defaultSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${DEFS}
${BG}
${EYEBROW}
  <text x="56" y="270"
    font-family="Georgia, 'Times New Roman', 'Noto Serif', serif"
    font-size="72" font-weight="400" fill="#1e1910" letter-spacing="-0.5">
    The science of
  </text>
  <text x="56" y="358"
    font-family="Georgia, 'Times New Roman', 'Noto Serif', serif"
    font-size="72" font-weight="400" fill="#b44840" letter-spacing="-0.5">
    staying human.
  </text>
  <text x="56" y="446"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="22" font-weight="300" fill="#7e6e5a" letter-spacing="1">
    Neuroscience x Japanese philosophy for the AI age
  </text>
${FOOTER}
</svg>`;

const defaultPng = await sharp(Buffer.from(defaultSvg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(join(ROOT, 'public', 'og-default.png'), defaultPng);
console.log(`✓ og-default.png (${(defaultPng.length / 1024).toFixed(0)}KB)`);

// ─── Per-article OGP ──────────────────────────────────────────────────────
const ogDir = join(ROOT, 'public', 'og');
if (!existsSync(ogDir)) mkdirSync(ogDir, { recursive: true });

function makeArticleSvg(title, isJa) {
  const maxChars = isJa ? 16 : 36;
  const lines = isJa ? wrapChars(title, maxChars) : wrapWords(title, maxChars);
  const count = lines.length;
  const fontSize = count >= 3 ? 52 : count === 2 ? 60 : 68;
  const lineH = Math.round(fontSize * 1.38);
  const blockH = count * lineH;
  const startY = Math.round(310 - blockH / 2 + fontSize * 0.85);
  const fontFamily = isJa
    ? "'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', Georgia, serif"
    : "Georgia, 'Times New Roman', 'Noto Serif', serif";

  const titleSVG = lines
    .map((line, i) =>
      `  <text x="56" y="${startY + i * lineH}"
    font-family="${fontFamily}"
    font-size="${fontSize}" font-weight="400" fill="#1e1910" letter-spacing="-0.5">${escapeXml(line)}</text>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
${DEFS}
${BG}
${EYEBROW}
${titleSVG}
${FOOTER}
</svg>`;
}

const postsRoot = join(ROOT, 'src', 'content', 'posts');
for (const lang of ['en']) {
  const dir = join(postsRoot, lang);
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const slug = file.replace('.md', '');
    const content = readFileSync(join(dir, file), 'utf-8');
    const { title } = parseFrontmatter(content);
    if (!title) { console.warn(`  ⚠ no title: ${file}`); continue; }
    const svg = makeArticleSvg(title, lang === 'ja');
    const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
    writeFileSync(join(ogDir, `${slug}.png`), png);
    console.log(`✓ og/${slug}.png (${(png.length / 1024).toFixed(0)}KB)  "${title}"`);
  }
}
