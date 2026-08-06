# dopaminelabtv.com Completeness Audit

## Homepage

Audited `src/pages/index.astro` (with `src/layouts/BaseLayout.astro`, `src/styles/global.css`) on 2026-07-29. Verified against the built output (`npm run build`, 245 pages, exit 0 — requires Node ≥18; ran with Node 22.13.0).

### What was checked

1. **Responsive layout** — Media queries exist at 1080px, 768px, 600px, and 380px. The hero's decorative elements (`.hero-enso` at `right:-40px`, `.zen-kanji-bg`) are contained by `overflow:hidden` on `.hero`; the vertical-text `.hero-tate` is hidden below 768px. No fixed pixel widths on content elements — only `max-width` caps (`--max-w` container, 520px hero-sub). At ≤600px quiz rows stack (`.check-q { flex-direction: column }`), YES/NO buttons go full-width, post cards stack, and footer links keep a 44px tap-target height. A 380px block handles very narrow screens. **No breakage found.**
2. **Empty state** — The template guards both dynamic lists: `posts.length === 0` renders "First episode dropping soon." and the Times teaser only renders when a non-draft issue exists (`latestIssue &&`). **But both guards were unreachable**: `Astro.glob()` throws at build time when its pattern matches zero files, so an empty `src/content/posts/en/` or `src/content/times/` would crash the build instead of rendering the designed empty state. Fixed (see below).
3. **Error state** — Data loading is build-time only (static site), so a throwing query fails the build rather than shipping a broken page — acceptable for SSG. `frontmatter.vol` sort uses `?? 0`; `tags?.map` and `readTime &&` are optional-chained. One unguarded render found: an issue with `title: ""` (exactly what `vol-001.md` has) would render an empty teaser title line. Fixed (see below).
4. **Internal links** — Verified all 110 unique internal `href`s in the built `dist/index.html` resolve to a built file: nav (`/posts`, `/glossary`, `/protocols`, `/times/`, `/about`), hero (`/ja/`), quiz result links (`/posts/totonou-what-your-brain-needs`, `/posts/why-you-cant-focus-anymore`, `/posts/what-zen-knew-before-neuroscience`, `/posts/your-brain-does-something-ai-will-never-do`), measurement cards (`/fatigue/`, `/dopamine-debt/`, `/sound/`), all 20 post-card links, all tag links (the `tagHref()` slug transform in `index.astro` is identical to the one in `tags/[tag].astro` `getStaticPaths`, so they can't drift), footer (`/totonou`, `/research`, `/tags/`, `/privacy`, `/rss.xml`). **Zero dead links.**
5. **Meta tags / structured data** — All present and non-empty in built output: `<title>` ("Dopamine Lab TV — The science of staying human."), meta description, canonical (`https://dopaminelabtv.com/`), hreflang en/ja/x-default pairs, full Open Graph set (`og:type/site_name/title/description/image/url/locale` — `og:image` is an absolute URL and `/og-default.png` exists in `dist/`), `twitter:card summary_large_image` + site/creator, favicon + manifest + theme-color, RSS/OpenSearch/llms.txt links, JSON-LD `WebSite` schema (with creator Person + sameAs) and a homepage `FAQPage` schema. **Nothing missing.**

### What was fixed

- `src/pages/index.astro`: converted both `Astro.glob()` calls to `Object.values(import.meta.glob(..., { eager: true }))`. Zero matches now yields an empty array, making the existing empty-state branches ("First episode dropping soon.", teaser omission) actually reachable instead of a build crash. Rendered output is byte-identical for the current content.
- `src/pages/index.astro`: Times teaser title now falls back to `The Dopamine Times Vol.NNN` when `frontmatter.title` is empty — `vol-001.md` ships `title: ""` and is only invisible today because it is `draft: true`; the first published issue with an empty title would have rendered a blank teaser line.
- **Build no longer fails on the machine's default Node 16.** `npm run build` previously crashed inside `sharp/lib/constructor.js` when run from a non-interactive shell (system Node is 16.16.0; Astro 4 and sharp require ≥18). The build script is now `scripts/build.sh`, which detects a too-old `node`, prepends the newest nvm-installed Node ≥18 (currently v22.13.0) to `PATH`, and fails with a clear one-line error if none is installed. Also added `.nvmrc` (`22`) and `"engines": { "node": ">=18.17" }` to `package.json` to document the requirement. Verified: `npm run build` now exits 0 from a shell whose default `node` is v16.16.0.

### Flagged for a decision (not fixed)

- **FAQPage JSON-LD content is not visible on the page.** The five answers exist only in the schema block; the visible quiz shows only the questions. Google's FAQ rich-result policy requires the marked-up content to be visible to users — this risks being ignored or treated as spammy markup. Decision needed: surface the answers (e.g. an expandable FAQ section) or drop the FAQPage block.
- **"Latest from the Lab" is a `<div class="wa-divider">`, not a heading**, so the posts section has no heading landmark for screen-reader navigation (the "Measurement Menu" / "Brain State Check" labels are `<p>` elements too). Heading order (h1 → h2) is technically valid, but section navigation would benefit from real headings. Changing `wa-divider` affects shared styling across pages — design decision.
- **`Astro.glob` remains in ~all other pages** (`posts/index`, `tags/[tag]`, `times/*`, `ja/*`, RSS/sitemap endpoints) with the same crash-on-empty behavior, and the site uses raw glob over `src/content/` instead of the Content Collections API (`getCollection`) — no schema validation on frontmatter. A site-wide migration is out of homepage scope; recorded here for the collection-level audit tasks.
- `package.json` lists `@astrojs/sitemap` as a dependency, but it is not registered in `astro.config.mjs`; the sitemap is instead hand-built in `src/pages/sitemap.xml.ts`. Unused dependency — confirm intent before removing.

## Article list page

Audited the article-list/archive routes on 2026-07-30: `src/pages/posts/index.astro`, `src/pages/ja/posts/index.astro`, `src/pages/tags/index.astro` + `tags/[tag].astro` (en/ja), `src/pages/series/[name].astro` (en/ja), and `src/pages/times/index.astro`. Verified against the built output (`npm run build`, 245 pages, exit 0, before and after fixes).

### What was checked

1. **Responsive layout** — `.posts-list` is a flex column (no grid tracks to overflow); `.post-card` switches to `flex-direction: column` with tighter padding at ≤768px; `.tags-cloud` is `flex-wrap: wrap`; `.search-input` is `width: 100%`. Excerpts are line-clamped (3 lines), so long frontmatter can't blow out card height. No fixed pixel widths on content elements. **No breakage found.**
2. **Empty state** — Every list page loaded content via `Astro.glob()`, which throws at build time on zero matches, so no empty state was reachable anywhere (same defect class as the homepage finding). Additionally `posts/index` (en/ja) and `tags/index` (en/ja) had **no empty-state markup at all** — an empty collection would have rendered "All Articles — 0 dispatches" over an empty 1px-bordered box. Both fixed (see below). `times/index` already had a designed empty state (「創刊号は近日公開予定。」) that was unreachable for the same reason — now reachable. The client-side search on `posts/index` already shows "No articles found." / 「記事が見つかりませんでした。」 when a query matches nothing — verified the toggle logic (`hidden = visible > 0`) is correct.
3. **Error state** — All list data is loaded at build time (SSG): a throwing query fails the build rather than shipping a broken page — acceptable. Per-item guards checked: `tags?.map`, `readTime &&` optional-chained; `times/index` falls back to `Vol.NNN` when an issue title is empty; series cards fall back to `?.frontmatter ?? {}`. One residual risk flagged below (missing series slug renders an empty card).
4. **Pagination** — **The site has no pagination**: all 30 en and 30 ja posts render on the single `/posts/` page, and no route or component uses Astro's `paginate()`. First/last/beyond-last edge cases are therefore N/A — there are no page-number URLs to overflow, and `/posts/2/` correctly 404s as an unknown route. Fine at 30 articles; flagged as a scale consideration below.
5. **Internal links** — Verified in the built output that every article-card link on `/posts/`, `/ja/posts/`, every tag link on both post lists and both tag indexes, every series-card link (all `SERIES` slugs exist as content files), and every Times back-number link resolves to a built page. Draft filtering is consistent between `times/index` and `times/vol-[vol]` (both filter `draft` in PROD), so the archive can't link a filtered-out issue. The en `tagHref()` slug transform is identical across `posts/index`, `tags/index`, `tags/[tag]` and the homepage, so tag URLs can't drift. **Zero dead links.**
6. **Meta tags / structured data** — `title`, `description`, and canonical (with trailing slash, matching the built directory URLs) present on all list pages. `posts/index` (en/ja) already had `CollectionPage` JSON-LD with `hasPart`. Found and fixed: **doubled site name in `<title>`** and **hreflang pairs pointing at 404s on tag pages** (details below). Tag detail pages had no structured data — added.

### What was fixed

- **All 7 list pages**: converted `Astro.glob()` → `Object.values(import.meta.glob(..., { eager: true }))` (`posts/index`, `ja/posts/index`, `tags/index`, `ja/tags/index`, `tags/[tag]`, `ja/tags/[tag]`, `times/index`). Zero content files now yields an empty array instead of a build crash, making empty states reachable. Rendered output is byte-equivalent for current content (verified: link sets and page count unchanged after rebuild).
- **`posts/index` + `ja/posts/index`**: added a server-rendered empty state ("First dispatch dropping soon." / 「最初の記事は近日公開予定。」) and made the search bar + list render only when posts exist — an empty collection no longer shows a search box over a bare bordered box.
- **`tags/index` + `ja/tags/index`**: added an empty-state message for the zero-tags case.
- **Doubled site name in `<title>` removed** — `BaseLayout` appends `| Dopamine Lab TV` to every title, and five list pages also baked the site name into the title they passed, producing e.g. `All Tags — Dopamine Lab TV | Dopamine Lab TV` and `Focus & Dopamine | Dopamine Lab TV | Dopamine Lab TV` in the built HTML. Stripped the site name from the page-level titles of `tags/index`, `tags/[tag]`, their ja counterparts, and both `series/[name]` pages. Verified in `dist/`: all now render a single `… | Dopamine Lab TV`.
- **hreflang on tag detail pages pointed at non-existent URLs** — `BaseLayout` auto-derives the alternate URL by prefixing/stripping `/ja`, but en tag slugs (`dopamine`) and ja tag slugs (`ドーパミン`) don't mirror each other, so `/tags/dopamine/` declared `hreflang="ja"` → `/ja/tags/dopamine/` (404) and vice versa — an SEO error (hreflang to a 404 invalidates the pair). Added an optional `hreflang` prop to `BaseLayout` (default `true`, all other pages unaffected) and set `hreflang={false}` on `tags/[tag]` and `ja/tags/[tag]`. Canonical is untouched. Verified in `dist/`: tag detail pages emit no hreflang links; `tags/index` (whose `/ja/tags/` mirror does exist) still emits all three.
- **Added `CollectionPage` JSON-LD with `hasPart`** to `tags/[tag]` and `ja/tags/[tag]`, matching the pattern already on `posts/index`.

### Flagged (not fixed)

- **No pagination at 30+ articles per locale.** One page is fine today (and good for crawl depth), but if the collection doubles again, consider `paginate()` — and note the client-side search only filters what's server-rendered on the page, so it naturally breaks under pagination unless rethought.
- **A missing/renamed series slug renders an empty card.** `series/[name]` falls back to `frontmatter ?? {}` for a slug in `src/data/series.ts` that has no matching content file, producing a card with a blank title linking to a 404. All current slugs verified present; consider failing the build (throw) on an unresolved series slug instead of the silent fallback.
- **En tag slugs only sanitize spaces** (`toLowerCase().replace(/\s+/g,'-')`). A future tag containing `/`, `#`, or `&` would produce a broken route, and two tags differing only in case would collide into one param. All current tags are safe; a slugifier + collision check belongs with a Content Collections schema migration.
- **`Astro.glob` still remains in the detail-page routes and homepages** (`posts/[slug]`, `ja/posts/[slug]`, `times/vol-[vol]`, `index`, `ja/index`, `PostLayout`) — same crash-on-empty class, recorded for the tasks owning those pages.

## Article detail template

Scope: `src/pages/posts/[slug].astro`, `src/pages/ja/posts/[slug].astro`, `src/layouts/PostLayout.astro`, plus the parts of `BaseLayout.astro`, `AudioPlayer.astro` and `global.css` they depend on. Verified against the built output (245 pages), a headless-browser pass at 375px and 1280px (layout probe + interaction script + screenshots read by eye), and a link check of every internal `href` on all 60 built post pages.

### What was checked

1. **Responsive layout** — Body typography, TL;DR box, breadcrumb (truncates long titles with ellipsis), tag rows, floating overlays (ADHD reading-support toolbar, sticky TL;DR pill, Lab BGM button) at 375px and 1280px, en and ja. No horizontal overflow at either width. Japanese line-wrapping inspected on screenshots.
2. **Missing-field handling** — Built a temporary fixture post containing only `title`/`date`/`excerpt` (no tags, tldr, sources, readTime, noteUrl, faqItems). Rendered HTML contains zero `undefined`/`NaN`/`Invalid Date`; TL;DR box, sources, series banner, read-time, note CTA and FAQ JSON-LD are all cleanly absent; related-posts falls back to "More from the Lab" (latest 2). Fixture removed after the check. All 60 real posts populate every optional field today.
3. **Internal links** — Script-checked every internal link on all 60 built post pages (breadcrumbs, tag chips, related cards, series banners, CTA anchors, asset URLs) against `dist/`: **zero dead links**. The en tag-chip slug transform in `PostLayout` is identical to the tag route's param generation, so tag links can't drift. `/#check` and `/ja/#check` CTA anchors both exist on their homepages.
4. **Meta / structured data** — Per-article `<title>`, meta description (from `excerpt`, with default fallback), canonical with trailing slash, `og:image` → `/og/<slug>.png` (verified 60/60 exist and are regenerated by `scripts/generate-og.mjs` / `generate-og-ja.py` in `npm run build`), Article JSON-LD (headline, datePublished, dateModified, author Person, publisher, image), BreadcrumbList, Speakable, conditional FAQPage — all populated from real frontmatter in the built HTML of en and ja samples.

### What was fixed

- **hreflang on article pages pointed at 404s** (same class as the tag-page bug above): en and ja post slugs never mirror (`ma-the-space-between-stimulus-and-response` ⇄ `ma-shigeki-to-hannou-no-aida`), yet every post page emitted `hreflang` alternates at the mirrored `/ja/...` path. Set `hreflang={false}` in `PostLayout`; verified all 60 built post pages now emit no hreflang links.
- **ToC invisible on mobile** — the bare `nav { display:none }` rule in the ≤600px header block (meant to swap the desktop header nav for the hamburger) also hid `nav.toc`, so the table of contents never appeared on phones even after JS populated it (the bare `nav { display:flex }` rule was also unintentionally styling `nav.toc`/`nav.breadcrumb` on desktop). Scoped all bare `nav` rules to `header nav`; verified `#toc` is now visible at 375px.
- **Fixed overlays trapped under the footer** — `main { z-index:1 }` created a stacking context, and the later-in-DOM `footer` (also `z-index:1`) painted over the reading-support toolbar and sticky TL;DR pill at page bottom, making them unclickable (reproduced: Playwright click intercepted by `<footer>`). Raised `main` to `z-index:2` (still under the sticky header at 100 and mobile nav at 300).
- **ADHD toolbar overlapped the Lab BGM button** — both were fixed at ~bottom-right 24–28px; the toolbar (z 900) sat on top of the BGM button (z 200). Stacked the toolbar above the BGM button (desktop `bottom:5.25rem`, mobile `4.5rem`); also `.ap` (the BGM container, whose layout box includes the invisible closed panel) was swallowing clicks aimed at the toolbar — set `pointer-events:none` on the container with `auto` on the button. Verified by script at both widths: TL;DR pill expands, reading-support panel opens, BGM panel opens, buttons don't overlap.
- **Duplicate hidden TL;DR text removed** — the sticky "Key points" pill server-rendered a second copy of all TL;DR items inside its collapsed list. The list is now cloned client-side from the visible `.tldr-box` (single source of truth; static HTML carries no hidden duplicate content).
- **Ja headings broke mid-word** (「…反応のあい／だ」 at 375px). Added `word-break:auto-phrase; text-wrap:pretty` for `html[lang="ja"] h1–h3` (Chrome 119+, no-op elsewhere); heading now wraps 「刺激と／反応のあいだ」.
- **Empty `"keywords":""` in Article JSON-LD** when a post has no tags — now omitted entirely (BaseLayout).
- **Latent overflow guards added** — `.article-body pre` (Shiki is configured but no post uses code blocks yet) and `.article-body table` had no `overflow-x` rules and would have broken the 375px layout in a future article; added scroll containers plus basic table cell styling.

### Flagged (not fixed)

- **`Astro.glob` in `posts/[slug]`, `ja/posts/[slug]` and `PostLayout`** (deprecated API, crash-on-empty class) — already recorded in the list-page section; unchanged here to keep this diff focused.
- **No frontmatter schema**: posts are loaded via glob, not Content Collections, so a post missing `date` would render "Invalid Date" and emit invalid JSON-LD dates with no build error. All 60 current posts are complete; a `src/content/config.ts` zod schema is the durable guard.
- **Ja OG generation depends on Pillow** — `build.sh` tolerates its absence ("use pre-built images"), which is safe for the existing 30 ja posts but means a *new* ja post built on a machine without Pillow would ship a 404 `og:image`. The en path (sharp) has no such gap.
- **Duplicate speakable JSON-LD** — PostLayout emits a standalone `WebPage` speakable block while BaseLayout's Article JSON-LD already carries a `speakable` property with slightly different selectors. Harmless (Google reads either), but worth unifying.
- **Default meta description is English on ja pages** if a ja post ever omits `excerpt` (all currently have one).
- **Layout-probe residue (verified false positives)**: under `file://` (JS off) the probe flags the ToC label — the ToC is JS-revealed progressive enhancement and hidden-by-default is intentional degradation; over HTTP it flags the collapsed "Key points" list items — a user-toggled disclosure duplicating the fully visible TL;DR box, confirmed expandable by scripted click at both widths.

Verification: `npm run build` passes (245 pages); internal-link check across all 60 post pages: 0 broken; minimal-frontmatter fixture renders with no broken markup; interaction script confirms all three floating overlays are clickable at 375px and 1280px.

## About page

Audited both locale versions: `src/pages/about.astro` (`/about/`) and `src/pages/ja/about.astro` (`/ja/about/`).

### Fixed

- **Duplicated site name in the ja `<title>`** — the ja page passed `title="About — Dopamine Lab TV"` into BaseLayout, which appends `| Dopamine Lab TV`, producing `About — Dopamine Lab TV | Dopamine Lab TV` in the tab title, og:title, and twitter:title. Changed to `title="ラボについて"` (matches the h1, gives a Japanese keyword to the SERP title); built page now emits `ラボについて | Dopamine Lab TV`.
- **Redundant en meta description** — ended "…dopamine, attention, focus, and the AI age." after already opening with "for the AI age" (the phrase appeared twice in one sentence). Rewritten to "…dopamine, attention, and staying focused."
- **No page-level structured data** — every other major page (index, glossary, protocols, posts/tags lists) emits page-specific JSON-LD, but about — the page search engines use to understand the entity — had only BaseLayout's generic WebSite block. Added `AboutPage` JSON-LD (with `mainEntity` Organization: logo, founder `@id` shared with the site-wide Person entity, and the four `sameAs` profiles matching the on-page links) plus a `BreadcrumbList`, on both locales, with locale-correct `inLanguage`/names.
- **Untagged Japanese text in the en document** — the `.jp-note` block on `/about/` is Japanese prose inside `<html lang="en">`; added `lang="ja"` on the div (screen-reader pronunciation, correct font/segmentation hints).

### Checked, no issues

- **Responsive**: `.about-section` has dedicated base (60px padding, 1.9rem h1) and ≤768px (48px, 1.5rem) rules; content is plain prose in `.container` (max-width + 24px/20px gutters). Geometry probe (`layout_probe.py`) passes on both built pages at 375px and 1280px — no horizontal overflow, no invisible content. Ja headings inherit the site-wide `word-break:auto-phrase; text-wrap:pretty` rule.
- **Dynamic/empty states**: none — the page is fully static (no collections, no data source that can be empty).
- **Internal links**: `/ja/about` ⇄ `/about` cross-links resolve (both build to `dist/{,ja/}about/index.html`); all header/footer targets rendered on this page (`/posts`, `/glossary`, `/protocols`, `/times/`, `/privacy` + ja mirrors) exist in `dist/`.
- **External links**: YouTube `@DopamineLabTV`, X `@DopamineLab`, Rakuten ROOM — all three carry `target="_blank" rel="noopener noreferrer"` and are consistent with the `sameAs` URLs in the site-wide JSON-LD (not fetched live; repo work only).
- **Meta/canonical/hreflang**: canonical is self-referential on both (`…/about/`, `…/ja/about/`); the pages mirror at `/ja`, so BaseLayout's default hreflang trio (en, ja, x-default) is correct here; og:locale + alternate correct per locale.
- **Locale parity**: both versions carry the same sections in the same order (intro ×3, blockquote, dopamine-crisis paragraph, "Where to find us" with the same 4 links, jp-note, cross-locale link). Neither is a stub; the ja copy is a real translation, not machine boilerplate.

### Flagged (not fixed)

- **Repeated inline `style="font-family: var(--font-jp)"`** on ~9 elements in `ja/about.astro` — works, but a single scoped rule (e.g. `.about-section :lang(ja)` or a page class) would be cleaner. Cosmetic; left alone to keep the diff focused.
- **X handle divergence**: the about pages and JSON-LD link `twitter.com/DopamineLab`, while the author entity uses `x.com/pyonkichi369`. Both are intentional (brand vs. operator), but if the brand account migrates to an x.com URL the about links, BaseLayout `sameAs`, and `twitter:site` meta should be updated together.

Verification: `npm run build` passes (245 pages); built `/about/` and `/ja/about/` each contain exactly one `AboutPage` and one `BreadcrumbList` block; titles and canonicals confirmed in dist; layout probe exit 0 at 375/1280 on both.

## Footer component

**Scope**: The site has no standalone `Footer.astro` — the shared footer is rendered inline in `src/layouts/BaseLayout.astro` (`<footer>` block, lines ~337–364), used by every page (all page files import BaseLayout directly or via `PostLayout`). No separate link-data source; hrefs are hardcoded per-locale in the layout.

### Link resolution (all checked against `dist/` after `npm run build`)

| Link | href (en / ja) | Status |
|---|---|---|
| Articles / 記事 | `/posts` / `/ja/posts` | ✅ builds to `dist/{,ja/}posts/index.html` |
| Glossary / 禅語 | `/glossary` / `/ja/glossary` | ✅ exists |
| totonou | `/totonou` / `/ja/totonou` | ✅ exists |
| Research / 参考文献 | `/research` / `/ja/research` | ✅ exists |
| Protocols / 実践 | `/protocols` / `/ja/protocols` | ✅ exists |
| Times | `/times/` (both locales) | ✅ exists (Times is a single shared section — intentional) |
| Tags / タグ | `/tags/` / `/ja/tags/` | ✅ exists |
| RSS | `/rss.xml` / `/rss-ja.xml` | ✅ both feeds built; ja footer correctly points at the ja feed |
| Privacy / プライバシー | `/privacy` / `/ja/privacy` | ✅ exists |
| Operator / 運営者 | `https://takuyahirata.com` | ✅ fetched live: HTTP 200; carries `rel="me noopener noreferrer"` + `target="_blank"` |

No placeholder `#` links, no dead internal routes.

### Responsive

`.footer-inner` is a centered flex column with `gap:16px`; `.footer-links` uses `flex-wrap:wrap; justify-content:center`. The ≤768px breakpoint switches copy to 0.72rem with a bottom border separator and keeps links wrapping with `gap:0 20px` (44px min-height tap targets preserved). No fixed widths, nothing to overflow — layout is sound at narrow viewports.

### Locale parity

Every ja page passes `lang="ja"` (verified by grep across `src/pages/ja/**`), so the ja footer renders fully translated labels (記事/禅語/参考文献/実践/タグ/プライバシー/運営者: 平田拓也) with no English fallback. "totonou", "Times", and "RSS" are intentional brand/proper names in both locales.

### Images / alt text

The footer contains no images or icon graphics (the 波紋 accent is a CSS `::before`, invisible to AT). The RSS text link carries `aria-label="RSS Feed"`. Header logo `img` (same layout) has alt text. ✅

### Fixed

- **Copyright-line links failed WCAG AA contrast and were indistinguishable from plain text** — the Privacy and operator links used inline `style="color:inherit;opacity:0.6;text-decoration:none;"`. `--text-muted` (#5e5040) is exactly AA (4.5:1) on the washi background, so 0.6 opacity blended it to ~#9c9285 ≈ **2.8:1** (fails AA for 12px text), and with no underline the links were visually identical to the surrounding copy (WCAG 1.4.1). Fix: removed the inline styles in `BaseLayout.astro`; added a `.footer-copy a` rule in `global.css` — full-opacity inherited color (restores 4.5:1) with a subtle underline (`text-decoration-color: rgba(30,25,16,0.3)`, darkening on hover) so links stay distinguishable without breaking the muted aesthetic.

### Flagged (not fixed)

- **Trailing-slash inconsistency**: `/times/`, `/tags/`, `/ja/tags/` have trailing slashes; the other internal hrefs don't. Astro's default `trailingSlash: 'ignore'` + directory-index output means both forms resolve on the current host (one canonical redirect hop for the non-slash forms). Harmless; normalizing would touch header/nav too, so left for a site-wide pass.

Verification: `npm run build` passes (245 pages); every footer target confirmed present in `dist/` (17/17 OK); external operator link returned HTTP 200.

## OGP image generation

**Scope**: OGP images are not an Astro endpoint (no `satori`/`@vercel/og` route). They are pre-generated at build time into `public/og/` by two scripts wired into `scripts/build.sh`: `scripts/generate-og.mjs` (EN posts + `og-default.png`; sharp rendering an SVG template) and `scripts/generate-og-ja.py` (JA posts; Pillow + Hiragino Mincho ProN from `/System/Library/Fonts/`). Pages reference the output via `ogImage` → `BaseLayout.astro`, which emits absolute `og:image`/`twitter:image` URLs with `new URL(ogImage, Astro.site)` plus correct `og:image:width/height` (1200×630, matching both generators).

### Audit findings

1. **Missing-slug / missing-image behavior** — nothing crashes (images are static files), but the failure mode was a *silent 404*: a post whose PNG was never generated still shipped a page whose `og:image` pointed at a nonexistent file, and no build step checked for this.
2. **Seven referenced page-level OG images did not exist** — `totonou.astro`, `glossary.astro`, `protocols.astro`, `research.astro` and their `ja/` counterparts referenced `/og/totonou.png`, `/og/glossary.png`, `/og/protocols.png`, `/og/research.png`, `/og/ja/totonou.png`, `/og/ja/glossary.png`, `/og/ja/research.png` — none of which were in `public/og/`. Sharing any of those 8 pages rendered a broken/blank card. Additionally `ja/protocols.astro` pointed at the *English* image path.
3. **Missing-title handling was warn-and-skip** — both generators logged `⚠ no title` and continued, producing exactly the silent-404 case above (title is not schema-enforced; posts load via `Astro.glob`, not a content collection with zod).
4. **Long-title overflow was unguarded** — no cap on line count. EN `wrapWords` also never split a single word longer than 36 chars (would overflow horizontally). Current worst cases are safe (EN max 3 lines, JA max 2), but a future 5+ line title would collide with the eyebrow/footer.
5. **JA font rendering: no tofu** — verified Pillow loads `ヒラギノ明朝 ProN.ttc` (face "Hiragino Mincho Pro W3") and visually inspected generated PNGs (`undou-ga-nou-wo-kaeru.png`, `ja/protocols.png`): real CJK glyphs, correct char-boundary wrapping inside the canvas. The EN template's decorative 研 watermark also renders correctly via sharp. Caveat (flagged, not a bug): the JA generator is macOS-only (hardcoded Hiragino paths); `build.sh` deliberately tolerates its absence because the PNGs are committed.
6. **Meta-tag spot-check (4 pages, both locales)** — `dist/posts/why-you-cant-focus-anymore/`, `dist/ja/posts/undou-ga-nou-wo-kaeru/`, `dist/posts/ma-the-space-between-stimulus-and-response/`, `dist/ja/protocols/` all emit correct absolute `og:image` URLs, and every URL maps to an existing file in `dist/`. All 60 posts (30 EN + 30 JA) have a matching `public/og/<slug>.png`.

### Fixed

- **Generated the 7 missing page-level OG images** — added a `STATIC_PAGES` list to `generate-og-ja.py` (Pillow/Hiragino renders both Latin and JA titles) producing `og/{totonou,glossary,protocols,research}.png` and `og/ja/{totonou,glossary,protocols,research}.png`; pointed `ja/protocols.astro` at `/og/ja/protocols.png`.
- **Fail-closed build gate** — new `scripts/check-og.mjs`, run in `build.sh` between generation and `astro build`: verifies every post slug and every literal `ogImage="/…"` reference in `src/pages/**` resolves to an existing file in `public/`; exits 1 listing what's missing (tested: removing an image fails the build with the file named).
- **Missing title now fails generation** — both generators collect titleless posts and exit non-zero instead of warn-and-skip (the JA step's failure is additionally caught by `check-og.mjs` since `build.sh` tolerates a skipped Pillow run).
- **Long-title overflow guarded** — both generators cap titles at 4 lines with a trailing ellipsis (4 lines × current line heights fits between eyebrow and footer); EN `wrapWords` now hard-splits words longer than the 36-char line limit. Verified: 100-char JA title wraps to exactly 4 lines ending in `…`, every line ≤16 chars.

Verification: `node scripts/check-og.mjs` → "✓ all referenced OGP images exist"; `npm run build` passes (245 pages); regenerated JA + page-level PNGs visually inspected (no tofu, no overflow).

## Sitewide internal link check

**Scope**: full production build (`npm run build`, 245 pages) → scanned every `href` in `dist/**/*.html` (11,804 occurrences, 489 unique internal targets after excluding external domains, `mailto:`, `tel:`, and pure `#anchors`; absolute `https://dopaminelabtv.com/...` URLs were normalized to paths and checked too). Each unique target was resolved against the generated output (`<path>/index.html`, exact file, or `<path>.html`). Nav, footer, breadcrumb, and article related-links are all rendered into the built HTML, so the sweep covers every source-level internal link as well. New checker: `scripts/check-links.mjs`.

### Broken links found (1)

| Source page | Broken target | Cause | Fix |
|---|---|---|---|
| `/totonou/privacy-policy/` | `/ja/totonou/privacy-policy/` | `BaseLayout.astro` derives the `hreflang="ja"` alternate as `/ja` + current path; this page has no Japanese-path counterpart (it is a single Japanese-language page living at the EN path), so the emitted `<link rel="alternate" hreflang="ja">` pointed at a 404 | Opted the page out via the layout's existing escape hatch: `hreflang={false}` in `src/pages/totonou/privacy-policy.astro` (same mechanism tag pages already use). The page keeps its canonical URL; it just no longer advertises nonexistent alternates. |

All 488 remaining unique internal targets (every `<a>`, `<link rel="alternate/canonical">`, breadcrumb, pagination, tag, series, and related-article href) resolve to a built route.

### Regression guard

Added `scripts/check-links.mjs` as a fail-closed gate at the end of `scripts/build.sh` (after `astro build`, mirroring the `check-og.mjs` pattern): the build now exits 1 listing `broken-target ← source-pages` if any internal href in the fresh output fails to resolve. A stale slug, removed page, or future hreflang mismatch breaks the build instead of shipping a 404.

Verification: re-ran `npm run build` — 245 pages, then `checked 11801 internal href occurrences (488 unique) / ✓ no broken internal links` (the 3 removed occurrences are the dropped alternate links on the fixed page). Exit 0.

## Sitewide meta tags & structured data

**Scope**: audited the shared head in `src/layouts/BaseLayout.astro` (title, description, canonical, hreflang, Open Graph, Twitter Card, WebSite/Article JSON-LD) and `src/layouts/PostLayout.astro` (BreadcrumbList, FAQPage, WebPage/speakable JSON-LD), plus every page's `<BaseLayout>` props (33 page templates) and `src/pages/sitemap.xml.ts`. Verified against the full production build (245 pages).

### What was already solid

Every page template passes an explicit, page-specific title and description (only the EN home relies on the layout default, which doubles as the site description — no duplication results). Canonical URLs are absolute, per-locale, trailing-slash-consistent with the built routes, and match `og:url`. OG/Twitter/`og:locale`+alternate, RSS/OpenSearch alternates, citation meta, and robots meta are emitted sitewide. JSON-LD is generated via `JSON.stringify` (syntactically valid by construction) with correct types: `WebSite` + author entity on non-article pages, `Article` (+`BreadcrumbList`, conditional `FAQPage`, speakable `WebPage`) on articles.

### Defects found & fixed (all in the shared layouts, one data file, and two one-line page props)

| # | Defect | Evidence (before) | Fix |
|---|---|---|---|
| 1 | **All 60 article pages emitted no hreflang** despite full 30/30 EN↔JA content parity — `PostLayout` hardcoded `hreflang={false}` because translated slugs differ, so the mirrored-path derivation could never find the counterpart | `/posts/ma-the-space-between-stimulus-and-response/` had zero `hreflang` links while `/ja/posts/ma-shigeki-to-hannou-no-aida/` is its direct translation | New `src/data/post-pairs.ts` maps all 30 EN↔JA slug pairs (verified by title comparison, 1:1 with no leftovers). `BaseLayout` gained an `alternate` prop; `PostLayout` resolves the pair and passes it. Every article now emits `hreflang="en"`, `hreflang="ja"`, and `x-default` (EN) pointing at the real translation. |
| 2 | **Duplicated site name in `<title>`** — layout appended `\| Dopamine Lab TV` unconditionally, and 11 pages already include the brand in their title prop | `<title>Totonou Protocols — Practical Reset Methods \| Dopamine Lab TV \| Dopamine Lab TV</title>` (also glossary ×2, research ×2, totonou ×2, privacy ×2, ja/404, ja/protocols) | `BaseLayout` now skips the suffix when the title already contains the site name. |
| 3 | **`/times/` pages declared conflicting hreflang** — Japanese-language pages living outside `/ja` made the derivation emit `hreflang="en"` and `hreflang="ja"` both pointing at the same URL | `/times/` had `hreflang="en" href=…/times/` **and** `hreflang="ja" href=…/times/` | `BaseLayout` now suppresses derived hreflang for `lang="ja"` pages outside `/ja` unless an explicit `alternate` is given (fails safe for any future non-mirrored page). |
| 4 | **404 pages were indexable** with a canonical to `/404/` and hreflang alternates | `dist/404.html`: `robots: index, follow` + `<link rel="canonical" href=…/404/>` | New `noindex` prop on `BaseLayout` (emits `noindex, nofollow`, drops canonical + hreflang); set on both 404 pages. |
| 5 | **Duplicate titles across locales for acronym tags** — `#ADHD`, `#BDNF`, `#RAS` exist as tags in both languages and produced byte-identical titles on EN and JA tag pages | `/tags/adhd/` and `/ja/tags/ADHD/` both titled `#ADHD \| Dopamine Lab TV` | EN tag pages now titled `#<tag> — Articles`, JA `#<tag> の記事一覧` (page `<h1>`s untouched). |
| 6 | **Sitemap missing 2 built pages** — `/ja/protocols/` and `/ja/privacy/` were built and hreflang-referenced but absent from `sitemap.xml` | `grep` of built sitemap: 0 hits for either | Added both to the static list in `sitemap.xml.ts`. |
| 7 | **`/totonou/privacy-policy/` declared `lang="en"`** while the entire page (title, description, body) is Japanese | `<html lang="en">`, `og:locale en_US` on Japanese content | Page now passes `lang="ja"` → `<html lang="ja">`, `og:locale ja_JP` (hreflang stays off; no `/ja` counterpart exists). |

### Noted, not changed (judgment calls for the operator)

- `WebSite` JSON-LD renders on every non-article page (about, tags, series…), not just the home page. Harmless duplication; splitting into `WebSite` (home) + `WebPage` (others) is a possible refinement.
- The JA home title is the plain `ラボは開いている | Dopamine Lab TV`, while the EN home gets the branded tagline title. Mirroring would require new JA brand copy — left to the operator.
- Times vol pages (currently all draft) will emit no hreflang once published (covered by fix #3) — correct, since no EN edition exists.

### Regression guard

New fail-closed gate `scripts/check-meta.mjs`, wired into `scripts/build.sh` after `check-links.mjs`. Over the full built output it asserts: non-empty title + description on every page; no doubled site name; no duplicate title or description across indexable pages; every JSON-LD block parses and declares `@context`/`@type`; every article page carries the hreflang en/ja pair (so a future article published without a `post-pairs.ts` entry breaks the build with a pointed message); every pair-table slug resolves to a real content file. The existing `check-links.mjs` gate independently verifies every emitted hreflang URL resolves to a built route.

Verification: `npm run build` → 245 pages, `✓ no broken internal links` (11,971 hrefs), `check-meta: 245 pages — titles/descriptions unique, JSON-LD valid, article hreflang paired ✓`. Spot-checked built HTML for home, article list, and article detail in both locales: unique titles/descriptions, per-locale canonicals, reciprocal hreflang on the article pair, and JSON-LD types `WebSite`/`Article`+`BreadcrumbList` parse cleanly.

## Shared UI components

Audited the five shared components in `src/components/` (all other card/badge/list UI is page-local markup styled by `src/styles/global.css` and was covered by the page audits). For each: responsive behavior, empty/missing-prop rendering, and client-side error states.

| Component | Used by | Empty/error state before | After |
|---|---|---|---|
| `AudioPlayer.astro` (floating Lab BGM widget) | `BaseLayout` → every page | **Bug (error state):** `selectMode()` optimistically set the "playing" wave animation and `aria-pressed` before playback was confirmed. If `/audio/{mode}.m4a` failed to load (404 on a partial deploy, network failure, unsupported codec) or autoplay was rejected, the button animated "playing" forever over silence, with no way to tell anything was wrong. | Playback state is now event-driven: `playing`/`pause` events on the `<audio>` element sync the button, an `error` event fully resets the widget (animation off, all modes unpressed, `current` cleared) so the next click retries cleanly, and a rejected `play()` promise clears the fake playing state. Also added a `prefers-reduced-motion: reduce` block: wave-bar animation and panel slide-up are disabled (opacity fade kept). |
| `ShareBlock.astro` (X/LINE/Threads/copy + Web Share) | `PostLayout` (all 60 articles), fatigue ×2, dopamine-debt ×2, sound ×2, times vol pages | Empty props already safe: every button reads `data-share-url`/`-text` fresh at click time and falls back to `location.href`/`document.title`. **Bug (error path):** the copy button only worked where the async Clipboard API exists — on non-secure origins or older WebViews the click was a silent no-op (GA event fired, nothing copied, no feedback). | Added an `execCommand('copy')` textarea fallback, used both when `navigator.clipboard` is absent and when `writeText()` rejects. The "Copied" confirmation only shows on an actual successful copy. Verified all call sites embed the URL inside `shareText`, so the X/Threads text-only intents do carry a link. |
| `TimesMasthead.astro` | `/times/` index + `vol-[vol]` pages | Missing `vol`/`date` props already handled (dateline omitted — the index page relies on this). **Bug (bad data):** a malformed frontmatter `date` in a times issue would render `Vol.001 — Invalid Date` — `formatDateline()` never validated its input. | Dateline now renders only when `new Date(date)` parses; a bad date drops the dateline line instead of printing "Invalid Date". |
| `SoundLabEngine.astro` (Web Audio synth for `/sound/`) | sound ×2 (ja/en) | Good by design: fetches nothing (all noise/binaural synthesized client-side, so no asset-404 path exists); bails early when its DOM (`#sound-volume`, `.sound-card`) is absent; `localStorage` reads/writes wrapped in try/catch. **Gap:** on a browser without `AudioContext`/`webkitAudioContext`, clicking a card threw an uncaught TypeError. | Added an early capability guard — without Web Audio the cards stay inert instead of throwing. |
| `RelatedProduct.astro` (A8 product slot) | `PostLayout` | Already sound — no fix needed: `PostLayout` only renders it when `matchProduct()` finds a topical match; a missing `imageUrl` renders a styled placeholder block; an unpasted `A8-PASTE-LINK` placeholder renders a non-clickable「準備中 / coming soon」label instead of a 404 link; live links get `rel="sponsored nofollow noopener"`. | Unchanged (documented as the reference pattern). |

Responsive: each component was reviewed at code level — AudioPlayer narrows its panel and inset at ≤600px; RelatedProduct shrinks its thumbnail/padding at ≤600px and uses `min-width: 0` so long product names can't blow out the flex row; ShareBlock buttons wrap via `global.css`; TimesMasthead is single-column text. None of this section's fixes change layout geometry (the only CSS added is a reduced-motion media query). A browser-based geometry probe (`layout_probe.py`) was attempted but Playwright is not installed in this environment, so it reported "layout NOT verified" — noted honestly rather than claimed.

Verification: `npm run build` exits 0 — 265 pages, `✓ no broken internal links` (12,959 hrefs), `check-meta: 265 pages … ✓`. Confirmed in built output: the AudioPlayer `error`/`playing` listeners are present in the hoisted JS bundle, the ShareBlock copy fallback ships on every page using it, the SoundLab capability guard is inline on both sound pages, and no times page contains "Invalid Date". (Pre-existing, unrelated: `scripts/generate-og-ja.py` fails with `ModuleNotFoundError: PIL` inside the build script; the build is wired to tolerate it and still exits 0 — flagged for the operator since regenerating JA OG images currently silently does nothing.)
