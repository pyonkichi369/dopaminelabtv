/**
 * Build gate: every og:image a page references must exist in public/.
 *   1. every post in src/content/posts/{en,ja} → public/og/<slug>.png
 *   2. every literal ogImage="/..." in src/pages → the file exists
 * Exits 1 listing the missing files. Run: node scripts/check-og.mjs
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

const missing = [];

// 1. Per-article OGP images
for (const lang of ['en', 'ja']) {
  const dir = join(ROOT, 'src', 'content', 'posts', lang);
  for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    if (!existsSync(join(PUBLIC, 'og', `${slug}.png`))) {
      missing.push(`og/${slug}.png (post ${lang}/${file})`);
    }
  }
}

// 2. Literal ogImage="..." references in .astro pages
function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.astro') ? [p] : [];
  });
}
for (const page of walk(join(ROOT, 'src', 'pages'))) {
  const src = readFileSync(page, 'utf-8');
  for (const [, path] of src.matchAll(/ogImage="(\/[^"]+)"/g)) {
    if (!existsSync(join(PUBLIC, path))) {
      missing.push(`${path.slice(1)} (page ${page.slice(ROOT.length + 1)})`);
    }
  }
}

if (missing.length > 0) {
  console.error('✗ referenced OGP images missing from public/:');
  for (const m of missing) console.error(`  - ${m}`);
  process.exit(1);
}
console.log('✓ all referenced OGP images exist');
