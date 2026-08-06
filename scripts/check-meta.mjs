/**
 * Build gate: sitewide meta tags & structured data over the generated HTML.
 *   1. every page has a non-empty <title> and <meta name="description">
 *   2. no page repeats the site name twice in its title ("… | X | X")
 *   3. no two indexable pages share the same title or the same description
 *   4. every JSON-LD block parses as JSON and declares @context + @type
 *   5. every article page (posts/, ja/posts/) emits hreflang en + ja links
 *   6. every slug in src/data/post-pairs.ts exists as a content file
 * Exits 1 listing violations. Run after astro build: node scripts/check-meta.mjs
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const SITE_NAME = 'Dopamine Lab TV';

const errors = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const pages = walk(DIST);
if (pages.length === 0) {
  console.error('check-meta: no HTML in dist/ — run astro build first');
  process.exit(1);
}

const titles = new Map();       // title -> [pages]
const descriptions = new Map(); // description -> [pages]

for (const file of pages) {
  const rel = '/' + relative(DIST, file).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const noindex = /<meta name="robots" content="noindex/.test(html);

  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1]?.trim() ?? '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1]?.trim() ?? '';

  if (!title) errors.push(`${rel}: empty or missing <title>`);
  if (!desc) errors.push(`${rel}: empty or missing meta description`);
  if (title.split(SITE_NAME).length > 2) errors.push(`${rel}: site name repeated in title "${title}"`);

  if (!noindex) {
    (titles.get(title) ?? titles.set(title, []).get(title)).push(rel);
    (descriptions.get(desc) ?? descriptions.set(desc, []).get(desc)).push(rel);
  }

  // JSON-LD validity
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      if (!data['@context'] || !data['@type']) errors.push(`${rel}: JSON-LD missing @context/@type`);
    } catch (e) {
      errors.push(`${rel}: invalid JSON-LD (${e.message})`);
    }
  }

  // Article pages must link their translation
  if (/^\/(ja\/)?posts\/[^/]+\/$/.test(rel)) {
    if (!/hreflang="en"/.test(html) || !/hreflang="ja"/.test(html)) {
      errors.push(`${rel}: article page missing hreflang en/ja pair (add it to src/data/post-pairs.ts)`);
    }
  }
}

for (const [t, list] of titles) if (list.length > 1) errors.push(`duplicate title "${t}": ${list.join(', ')}`);
for (const [d, list] of descriptions) if (list.length > 1) errors.push(`duplicate description "${d.slice(0, 60)}…": ${list.join(', ')}`);

// Pair table ↔ content files
const pairsSrc = readFileSync(join(ROOT, 'src/data/post-pairs.ts'), 'utf8');
for (const m of pairsSrc.matchAll(/\{ en: '([^']+)', ja: '([^']+)' \}/g)) {
  if (!existsSync(join(ROOT, `src/content/posts/en/${m[1]}.md`))) errors.push(`post-pairs.ts: en slug "${m[1]}" has no content file`);
  if (!existsSync(join(ROOT, `src/content/posts/ja/${m[2]}.md`))) errors.push(`post-pairs.ts: ja slug "${m[2]}" has no content file`);
}

if (errors.length) {
  console.error(`check-meta: ${errors.length} violation(s)`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log(`check-meta: ${pages.length} pages — titles/descriptions unique, JSON-LD valid, article hreflang paired ✓`);
