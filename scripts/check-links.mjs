#!/usr/bin/env node
// Sitewide internal link check: scans dist/**/*.html for internal hrefs and
// verifies each resolves to a generated file. Exits 1 listing broken links.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
const SITE = 'dopaminelabtv.com';

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

function resolves(pathname) {
  const clean = decodeURIComponent(pathname.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return existsSync(join(DIST, 'index.html'));
  const p = join(DIST, clean);
  return (
    existsSync(p) ||
    existsSync(join(p, 'index.html')) ||
    existsSync(p.replace(/\/$/, '') + '.html')
  );
}

const broken = new Map(); // href -> Set(source pages)
let total = 0;
const seen = new Map(); // href -> ok?

for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + relative(DIST, file).replace(/index\.html$/, '');
  for (const m of html.matchAll(/\bhref=["']([^"']+)["']/g)) {
    let href = m[1];
    if (/^(mailto:|tel:|javascript:|#|data:)/.test(href)) continue;
    if (/^https?:\/\//.test(href)) {
      const u = new URL(href);
      if (u.hostname !== SITE && u.hostname !== 'www.' + SITE) continue;
      href = u.pathname + u.hash;
    }
    if (!href.startsWith('/')) continue; // no relative hrefs expected in output
    total++;
    if (!seen.has(href)) seen.set(href, resolves(href));
    if (!seen.get(href)) {
      if (!broken.has(href)) broken.set(href, new Set());
      broken.get(href).add(page);
    }
  }
}

console.log(`checked ${total} internal href occurrences (${seen.size} unique)`);
if (broken.size) {
  console.error(`✗ ${broken.size} broken internal link target(s):`);
  for (const [href, pages] of broken) {
    const list = [...pages];
    const shown = list.slice(0, 5).join(', ');
    console.error(`  ${href}  ← ${shown}${list.length > 5 ? ` … +${list.length - 5} more pages` : ''}`);
  }
  process.exit(1);
}
console.log('✓ no broken internal links');
