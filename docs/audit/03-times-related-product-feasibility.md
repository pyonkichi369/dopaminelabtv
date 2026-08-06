# Feasibility: RelatedProduct on the Times pages

Date: 2026-08-06
Scope: read-only investigation (task t13). No code was changed. Question: can the
existing `RelatedProduct.astro` + `matchProduct()` pattern fill the space left by
the removed Substack embed on `src/pages/times/index.astro` and
`src/pages/times/vol-[vol].astro`, under the same 広告/PR disclosure rule?

## Recommendation (summary)

| Page | Recommendation |
|---|---|
| `src/pages/times/vol-[vol].astro` (individual issue) | **YES — implement.** Match against `frontmatter.title` + `frontmatter.excerpt`; render in the monetization block area where the Substack embed sat. |
| `src/pages/times/index.astro` (back-number listing) | **NO — do not implement.** The page has no single topic; any page-level match would be generic/misleading, violating the catalog's own "never a random or unrelated product" rule. |

## How the existing pattern works (as wired on blog posts)

- `matchProduct(tags: string[], title: string)` (`src/data/products.ts:244`)
  lowercases the tags + title into a haystack and scores each of the 13 products
  by how many of its `matchKeywords` appear as substrings. It returns the single
  best-scoring product, or `null` when nothing scores — callers must render
  nothing in that case.
- `PostLayout.astro` calls it once with the post's tags and title
  (`src/layouts/PostLayout.astro:102`) and renders
  `{matchedProduct && <RelatedProduct product={matchedProduct} lang={lang} />}`
  at the end of the article container (`src/layouts/PostLayout.astro:252`),
  after the related-articles grid.
- `RelatedProduct.astro` is self-contained for compliance: it renders the
  広告/Advertisement badge, `aria-label="広告"`, the ステマ規制 disclosure
  sentence, `rel="sponsored nofollow noopener"` on live links, and a
  non-clickable "準備中" state for unpasted `A8-PASTE-LINK:` placeholders. Every
  product has `disclosureRequired: true` (the type only admits `true`), so any
  caller that renders the component gets the mandatory labeling for free — no
  page-side disclosure wiring is needed.

## What data the Times pages actually have

Times issues (`src/content/times/vol-00N.md`, 5 issues) carry this frontmatter:
`vol`, `date`, `title`, `excerpt`, `draft`, `noteUrl`, `bookTitle`, `bookUrl`.
**There is no `tags` field** — `vol-[vol].astro` even passes `tags: []` to
BaseLayout's article metadata. However, each issue's `title` and `excerpt` are
long, keyword-bearing Japanese sentences (睡眠, 記憶, 海馬, BDNF, 運動, 感謝,
不安, 集中…), which is exactly the substring material `matchProduct()` consumes.

## Measured match results (actual `matchProduct()` runs, not guesses)

The real function from `src/data/products.ts` was executed against all 5 live
issues (TypeScript annotations stripped, logic untouched):

| Issue | Topic | title only | title + excerpt |
|---|---|---|---|
| vol-001 | SNSの「いいね」/注意経済 | NO MATCH | NO MATCH |
| vol-002 | 睡眠と記憶固定 | rokkaku-nou-makura-pillow | rokkaku-nou-makura-pillow |
| vol-003 | 運動・BDNF・海馬 | rokkaku-nou-makura-pillow ⚠️ | soelu-online-yoga ✅ |
| vol-004 | 集中用ノイズ・不安 | awarefy-mental-care-app | awarefy-mental-care-app |
| vol-005 | 感謝と報酬回路 | awarefy-mental-care-app | awarefy-mental-care-app |

Two conclusions from the measurement:

1. **Coverage is good**: 4 of 5 issues match a topically relevant product;
   vol-001 correctly renders nothing (no attention-economy product exists in the
   catalog — that is the designed null behavior, not a failure).
2. **Include the excerpt, not just the title.** On vol-003 (an exercise/BDNF
   issue) the title alone mis-matches a sleep pillow — the title mentions 海馬
   (a pillow keyword via the sleep-memory article) but not 運動. Adding the
   excerpt (which contains 有酸素運動/運動) flips the match to SOELU online
   yoga, the correct category. Title-only matching on volume pages is measurably
   worse than title+excerpt.

## YES: `vol-[vol].astro` — proposed shape (for the implementing task)

- **Data matched against**: `frontmatter.title` and `frontmatter.excerpt`. The
  signature-compatible call is
  `matchProduct([frontmatter.excerpt ?? ''], frontmatter.title)` (the excerpt
  rides in the tags array; `matchProduct` treats both inputs identically as
  haystack strings). No change to `products.ts` is needed.
- **Render location**: in the monetization block sequence after `ShareBlock` —
  concretely between the note CTA block and the `times-archive-link` div, which
  is exactly where `<TimesSubstackEmbed />` sat before removal (former line
  85–86 per `docs/audit/01-substack-inventory.md`). This keeps the page's
  established order: content → share → bookshelf PR → note → product slot →
  archive link.
- **Props**: `lang="ja"` (all Times issues are Japanese;
  `RelatedProduct.astro` fully supports ja, including the ステマ規制
  disclosure sentence and 広告 badge).
- **Disclosure compliance**: identical to blog posts — the component itself
  carries the badge + disclosure, and it sits consistently next to the existing
  `PR`-badged bookshelf CTA the Times pages already ship. No extra labeling
  work.
- **Null behavior**: guard with `{matchedProduct && ...}` exactly as
  `PostLayout.astro:252` does, so vol-001-style issues render nothing rather
  than an unrelated product.

One caveat worth stating for the operator: an issue page could show both the
bookshelf affiliate CTA and the A8 product slot. That is two clearly-labeled
promotional units per page — acceptable, but if it ever feels heavy, the product
slot is the one to make conditional (e.g. only when `bookUrl` is empty). That is
an editorial choice, not a compliance requirement.

## NO: `times/index.astro` — reasons

- The page is a chronological back-number list. There is no single topic to
  match against; feeding the concatenated titles of all issues into
  `matchProduct()` would produce whichever product's keywords happen to
  dominate the archive — a volume-level aggregate match that is generic and
  misleading to readers, exactly what the catalog header comment forbids
  ("never a random or unrelated one").
- The disclosure sentence itself would become false on this page: it says the
  product "is topically related to this article" (この記事にはプロモーションを
  含みます／記事のトピックに関連する) — a listing page is not an article and has
  no topic for the product to relate to.
- The space the embed left on the index is small (it sat below the issue list,
  former line 49) and the page still ends naturally with the issue cards. No
  replacement unit is needed there.

## Files read for this investigation

- `src/components/RelatedProduct.astro` (full)
- `src/data/products.ts` (full — 13 products, `matchProduct()`, `disclosureRequired`)
- `src/layouts/PostLayout.astro` (call site at lines 102 and 252)
- `src/pages/times/index.astro`, `src/pages/times/vol-[vol].astro` (full)
- `src/content/times/vol-001.md` … `vol-005.md` (frontmatter)
- `docs/audit/01-substack-inventory.md` (former embed locations)
