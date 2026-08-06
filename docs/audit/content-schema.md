# Content Collection Schema — dopaminelabtv.com

Reference for anyone writing new articles. Everything below was read out of the code and
content files as they exist today (audited 2026-07-21), not inferred from convention.

---

## 1. The headline finding: there is no schema file

**There is no `src/content/config.ts` and no `src/content.config.ts` in this repo.**

Verified by:

```
$ find . -path ./node_modules -prune -o \( -name "content.config.*" -o -name "config.ts" \) -print | grep -i content
(no output)

$ grep -rn "defineCollection" --include="*.ts" --include="*.astro" --include="*.mjs" . | grep -v node_modules
(no output — only getCollection appears, in src/pages/llms.txt.ts)
```

Astro 4 (`"astro": "^4.15.0"`, legacy content collections) therefore auto-registers each
directory under `src/content/` as an **unvalidated** collection. The proof is in Astro's own
generated type file, `.astro/astro/content.d.ts`, where every entry's `data` is typed `any`
rather than an inferred Zod shape:

```ts
	type ContentEntryMap = {
		"posts": {
"en/adhd-is-not-a-broken-brain.md": {
	id: "en/adhd-is-not-a-broken-brain.md";
  slug: "en/adhd-is-not-a-broken-brain";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
```

**Consequences for article writing:**

- No field is *enforced* required. A typo'd or missing key fails silently at build time and
  surfaces as a missing UI block (or `undefined` in a meta tag) on the rendered page.
- No defaults are applied. Every `?? []` / `?? 0` fallback lives in the templates, not the schema.
- No enums, no date coercion. `date` stays a **string**; templates call `new Date(...)` on it
  themselves (`src/layouts/PostLayout.astro:13`).

So the "schema" below is a **de-facto contract**: the intersection of what all 60 existing
articles actually contain and what the templates actually read. Treat the "Required" column as
"required for the page to render correctly," not "required by a validator."

---

## 2. Collections

| Collection | Directory | Entries today | Purpose |
|---|---|---|---|
| `posts` | `src/content/posts/` | 60 (`en/` 30, `ja/` 30) | The article corpus. Locale is a **subdirectory**, not a frontmatter field. |
| `times` | `src/content/times/` | 1 (`vol-001.md`) | "Dopamine Times" — a numbered weekly JA newsletter issue, flat (no locale subdirectory). Currently one draft stub. |

### How each collection is loaded

`posts` is read two different ways, and this matters:

- **Page rendering, listings, RSS, sitemap, related posts** use path-scoped globs, so the locale
  is derived from the file path:
  - `src/pages/posts/[slug].astro:5` — `Astro.glob('../../content/posts/en/*.md')`
  - `src/pages/ja/posts/[slug].astro:5` — `Astro.glob('../../../content/posts/ja/*.md')`
  - `src/layouts/PostLayout.astro:65` — `Astro.glob('../content/posts/**/*.md')` (both locales, then filtered by directory name at line 78)
- **`/llms.txt` only** uses the real collection API (`src/pages/llms.txt.ts:11`), splitting locale
  off the entry id: `posts.filter((p) => p.id.startsWith(`${lang}/`))` (line 15).

Practical implication: **a new article file must live in `src/content/posts/en/` or
`src/content/posts/ja/`.** A file placed directly in `src/content/posts/` would be picked up by
`getCollection('posts')` (so it would leak into `/llms.txt` via neither branch) but rendered by no
page route, and `PostLayout`'s `sameLang` check at line 78 would never match it.

Note that `scripts/new-post.mjs:47` writes to `src/content/posts/${slug}.md` — **no locale
subdirectory**. That scaffolder is stale relative to the current layout; don't use it as-is.

---

## 3. `posts` schema

### 3.1 Fields present in all 60 articles

Counted per-file across `src/content/posts/{ja,en}/*.md` — each of these appears in 30/30 ja and
30/30 en files.

| Field | Type | Required | Default | Notes / observed values |
|---|---|---|---|---|
| `title` | `string` | yes (30/30 both) | none | Quoted string. Drives `<h1>`, `<title>`, OG image text, breadcrumb, Speakable JSON-LD, narration prompt. |
| `date` | `string` | yes (30/30 both) | none | **String, not a YAML date** — always quoted, always `"YYYY-MM-DD"` (verified: 0 of 60 deviate). Templates parse it with `new Date()`. |
| `excerpt` | `string` | yes (30/30 both) | none | One or two sentences. Becomes `<meta name="description">`, `og:description`, `twitter:description`, the card blurb on listings, the `/llms.txt` summary, and the narration prompt's 概要 line. |
| `tags` | `string[]` | yes (30/30 both) | `[]` via `frontmatter.tags ?? []` (`PostLayout.astro:18`) | Observed length 3–6 (mode 5). **Locale-specific vocabulary** — see §4. |
| `readTime` | `number` (integer, minutes) | yes (30/30 both) | none, but guarded by `{frontmatter.readTime && ...}` (`PostLayout.astro:146`) | Observed 5–9 across the corpus. Also the `wordCount` fallback: `readTime * 200` (`PostLayout.astro:104`). |
| `tldr` | `string[]` | yes (30/30 both) | `[]` via `frontmatter.tldr ?? []` (`PostLayout.astro:10`) | Observed 3 items (20 files) or 4 items (10 files), identically in both locales. Renders the TL;DR box, the sticky TL;DR pill, and is a Speakable JSON-LD target (`.tldr-list`). |
| `sources` | `{ name: string; url?: string }[]` | yes (30/30 both) | `[]` via `frontmatter.sources ?? []` (`PostLayout.astro:9`) | Only two keys ever used: `name` and `url` (verified across all 60). Observed 1–5 entries, mode 3. `url` is typed optional and the template branches on it (`PostLayout.astro:198`); in practice every existing entry has one. Feeds the Sources list, `isBasedOn` in JSON-LD, and `citation_reference` meta tags (`BaseLayout.astro:224`). |

Exact shape, copied verbatim from `src/content/posts/en/adhd-is-not-a-broken-brain.md:1-20`:

```yaml
---
title: "ADHD Is Not a Broken Brain"
date: "2026-04-27"
excerpt: "ADHD isn't a deficit of attention. It's a deficit of dopamine — specifically, of the tonic baseline that makes low-stimulation tasks feel worth doing. Neuroscience and Zen both know what to do about it."
tags: ["ADHD", "dopamine", "focus", "neuroscience", "Japanese philosophy"]
readTime: 8
tldr:
  - "ADHD is not a deficit of attention — it is a deficit of tonic dopamine baseline that makes low-stimulation tasks feel worth starting."
  - "The same mechanism explains why high-stimulation environments temporarily 'fix' ADHD symptoms."
  - "Environment design and deliberate recovery practices rebuild the baseline without requiring medication."
sources:
  - name: "Dopamine D2 receptor availability in ADHD, Volkow et al., JAMA, 2009"
    url: "https://pubmed.ncbi.nlm.nih.gov/19826025/"
  - name: "Mindfulness training for ADHD adults, Zylowska et al., Journal of Attention Disorders, 2008"
    url: "https://pubmed.ncbi.nlm.nih.gov/18025249/"
  - name: "Multiple dopamine functions at different time courses, Schultz, Annual Review of Neuroscience, 2007"
    url: "https://pubmed.ncbi.nlm.nih.gov/17600522/"
  - name: "Cortical maturation delay in ADHD, Shaw et al., PNAS, 2007"
    url: "https://pubmed.ncbi.nlm.nih.gov/17563363/"
---
```

And the same seven keys in the ja corpus, from
`src/content/posts/ja/adhd-wa-chusui-no-ketsujo-dewa-nai.md:1-21` (truncated for length):

```yaml
---
title: "ADHDは「注意の欠如」ではない"
date: "2026-06-18"
excerpt: "ADHDは名前が誤解を招く。神経科学が示すのは、注意が消えているのではなく、異なる調節システムで動いている脳だ。"
tags: ["神経科学", "ADHD", "ドーパミン", "注意", "実行機能", "デフォルトモードネットワーク"]
readTime: 9
tldr:
  - "ADHDは注意の欠如ではなく、調節不全だ。…"
sources:
  - name: "Castellanos FX, Tannock R — ADHDの神経科学: 内表現型の探索, Nature Reviews Neuroscience, 2002"
    url: "https://pubmed.ncbi.nlm.nih.gov/12209120/"
---
```

### 3.2 Optional fields the templates support

These are read by the templates but are **not** part of the seven-key baseline.

| Field | Type | In corpus | Read at | Behaviour |
|---|---|---|---|---|
| `noteUrl` | `string` (URL) | 8 of 30 ja, **0 of 30 en** | `PostLayout.astro:179-183` | Renders a "noteで深掘りする →" button. Gated on `isJa && frontmatter.noteUrl`, so **setting it on an English article does nothing.** |
| `notePrice` | `number` (JPY) | **0 of 60** | `PostLayout.astro:181` | When present alongside `noteUrl`, changes the button label to `有料版を読む（¥{notePrice}）→`. Supported, never yet used on an article. |
| `updatedDate` | `string` (`YYYY-MM-DD`) | **0 of 60** | `PostLayout.astro:103` → `BaseLayout.astro:76,181` | Sets JSON-LD `dateModified` and `article:modified_time`. Without it, `dateModified` falls back to `publishedTime`. |
| `wordCount` | `number` | **0 of 60** | `PostLayout.astro:104` | Sets JSON-LD `wordCount`. Falls back to `readTime * 200` when absent, so the field is effectively already populated for every article. |
| `faqItems` | `{ q: string; a: string }[]` | **0 of 60** | `PostLayout.astro:46-57, 327` | The only way to emit **FAQPage JSON-LD**. `frontmatter.faqItems ?? []`; when empty, no FAQ script tag is rendered at all. This is a live SEO opportunity: the code path exists and is unused corpus-wide. |
| `draft` | `boolean` | **0 of 60 posts** (used in `times`) | Not read by any `posts` page | The `PROD` draft filter exists only in `src/pages/times/index.astro:7`. Adding `draft: true` to an article **will not hide it** — the posts routes have no such filter. |

### 3.3 Fields that look like frontmatter but are not

- **`ogImage`** — not frontmatter. It is a prop the route passes to the layout, derived from the
  filename: `src/pages/ja/posts/[slug].astro:16` does
  `<PostLayout frontmatter={frontmatter} lang="ja" ogImage={`/og/${slug}.png`}>`. The image itself
  is generated at build time from `title` alone (see §5).
- **`lang` / `locale`** — not frontmatter. Locale comes from the directory (`en/` vs `ja/`) and is
  passed as a route-level prop (`lang="ja"`).
- **Series membership** — not frontmatter. Series are a hardcoded slug list in
  `src/data/series.ts`, e.g.
  ```ts
  slugs: {
    en: ['why-you-cant-focus-anymore', 'your-brain-does-something-ai-will-never-do'],
    ja: ['naze-shuchu-dekinai', 'no-ai-niwa-dekinai-koto'],
  },
  ```
  To put a new article in a series you edit `src/data/series.ts`, not the article.
- **Slug** — not frontmatter. It is the filename stem. `src/pages/ja/posts/[slug].astro:7` derives it
  as `post.file.split('/').pop()!.replace('.md', '')`.
- **Related posts** — not frontmatter. Computed by tag overlap within the same locale, newest 3
  (`PostLayout.astro:80-84`), with a newest-2 fallback when no tags match.

---

## 4. What is locale-specific vs shared

**The key names are identical in ja and en.** All seven baseline fields and their types are
shared. What differs is *values* and *reach*:

| Aspect | ja | en |
|---|---|---|
| Directory | `src/content/posts/ja/` | `src/content/posts/en/` |
| URL | `/ja/posts/<slug>/` | `/posts/<slug>/` |
| `title`, `excerpt`, `tldr` | Japanese prose | English prose |
| `tags` | **Japanese-language tags** (`"神経科学"`, `"ドーパミン"`, `"実行機能"`) | **English tags** (`"dopamine"`, `"neuroscience"`, `"focus"`) |
| Tag URL | `/ja/tags/{tag}` — tag used verbatim, no casing/slug transform | `/tags/{tag.toLowerCase().replace(/\s+/g, '-')}` — lowercased and hyphenated (`PostLayout.astro:27-29`) |
| `sources[].name` | Citations are **translated into Japanese** while the `url` stays the same PubMed link | English citation text |
| `noteUrl` / `notePrice` | Effective (8 ja articles use `noteUrl`) | **Inert** — gated on `isJa` |
| Slug style | Romaji transliteration of the JA title (`adhd-wa-chusui-no-ketsujo-dewa-nai`) | English words (`adhd-is-not-a-broken-brain`) |
| OG image generator | `scripts/generate-og-ja.py` (Pillow, Mincho font, `wrap_ja(title, max_chars=16)`) | `scripts/generate-og.mjs` (SVG, word wrap) |
| Narration pipeline | Fully supported | **Not supported in practice** — see §5.3 |

ja and en articles are **not** paired by slug and nothing in the code links a translation pair.
`ma-shigeki-to-hannou-no-aida` (ja) and `ma-the-space-between-stimulus-and-response` (en) are
counterpart articles, but only a human knows that; there is no `translationOf` field.

---

## 5. The narration pipeline

Traced by `grep -rn "narration"` across the repo. Relevant files (excluding
`workspace/**`, which holds per-video render output, not pipeline code):

- `scripts/narration/article_to_script.py` — markdown article → spoken-word script via local Ollama
- `scripts/narration/pipeline.py` — orchestrator: article → script → audio → subtitles → render dir
- `scripts/narration/tts_f5.py` — script → `narration.wav` / `.mp3` / `.srt` / `.vtt` via F5-TTS (or edge-tts fallback)

### 5.1 Which frontmatter fields the pipeline consumes

**Exactly two: `title` and `excerpt`.** There is no narration-specific field, no TTS summary
field, and no companion audio path in frontmatter. The pipeline re-parses the markdown itself with
its own YAML reader (`article_to_script.py:40-52`) rather than going through Astro.

`scripts/narration/article_to_script.py:126-140`:

```python
def article_to_script(article_path: Path) -> tuple[dict, str]:
    """Convert a markdown article to narration script. Returns (meta, script)."""
    content = article_path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(content)

    title = meta.get("title", article_path.stem)
    excerpt = meta.get("excerpt", "")
    ...
    script = generate_script_with_ollama(title, excerpt, body)
```

Those two land directly in the LLM prompt (`article_to_script.py:96-98`):

```python
article_text = f"タイトル: {title}\n\n概要: {excerpt}\n\n本文:\n{clean_markdown(body)}"
```

The **body** is the third input — stripped of markdown by `clean_markdown()`
(`article_to_script.py:55-65`: removes headings, bold, italic, inline code, link syntax; converts
`- ` bullets to `・`). Everything else in frontmatter — `tags`, `tldr`, `sources`, `readTime`,
`date` — is parsed into `meta` and then ignored.

`title` is used a second time in the orchestrator, to stamp the video renderer
(`scripts/narration/pipeline.py:103-120`):

```python
meta, _ = parse_frontmatter(content)
title = meta.get("title", article_path.stem)
...
create_render_py(out_dir, title, article_path.stem)
```

which rewrites `TITLE = "..."` in a copy of the render template.

### 5.2 Filename → output directory

The **filename stem is load-bearing** for narration, not just for URLs. `pipeline.py:80-82`:

```python
slug = article_path.stem
out_dir = DLTV_ROOT / "workspace" / "youtube" / f"yt-long_{slug}"
```

So `src/content/posts/ja/foo.md` produces `workspace/youtube/yt-long_foo/` containing
`script.txt`, `narration.wav`, `narration.mp3`, `narration.srt`, `narration.vtt`, `render.py`.
None of these paths are referenced from the site — the audio is a YouTube artifact, not a page asset.

### 5.3 The pipeline is Japanese-only in effect

Two hard constraints make it unusable for English articles as written:

1. `SCRIPT_SYSTEM_PROMPT` (`article_to_script.py:23-37`) is written in Japanese and instructs the
   model in Japanese conventions ("1文を30文字以内に区切る", "「〜である」→「〜です」").
2. `looks_like_reasoning()` (`article_to_script.py:78-93`) rejects any output that is less than 30%
   Japanese characters:

   ```python
   # Narration for a JA article must be mostly Japanese.
   ja = len(re.findall(r"[ぁ-んァ-ヶ一-龯]", head))
   return ja < len(head) * 0.3
   ```

   An English narration script trips this guard and the pipeline silently falls back to
   `clean_markdown(body)` — i.e. the raw article text, read aloud verbatim.

The failure is soft: `generate_script_with_ollama` is fail-open by design
(`article_to_script.py:113-123` falls back to `clean_markdown(body)` on short output, leaked
reasoning, or a dead Ollama). Nothing crashes; the narration just gets worse.

**Writing implication:** for a ja article, `title` and `excerpt` are doing double duty as SEO
metadata *and* as the narration hook/framing that the LLM builds the opening 30 seconds from
(prompt rule 4: "冒頭30秒はフック"). Write them so they work read aloud. The body should also
survive `clean_markdown()` — heavy tables, code fences, or footnote syntax degrade badly, since the
cleaner only handles headings, bold/italic, inline code, links, and list markers.

---

## 6. Build-time consumers of frontmatter (for cross-checking a new article)

| Consumer | File | Fields used |
|---|---|---|
| Article page | `src/layouts/PostLayout.astro` | all seven + `noteUrl`, `notePrice`, `updatedDate`, `wordCount`, `faqItems` |
| Meta tags & JSON-LD | `src/layouts/BaseLayout.astro` | `title`, `excerpt` (as `description`), `date`, `updatedDate`, `wordCount`, `tags`, `sources` |
| OG image (en) | `scripts/generate-og.mjs:168-173` | `title` only → `public/og/<slug>.png` |
| OG image (ja) | `scripts/generate-og-ja.py:101-109` | `title` only → `public/og/<slug>.png` |
| `/llms.txt` | `src/pages/llms.txt.ts:18-23` | `title`, `excerpt`, `date`, and `id` for locale split |
| RSS | `src/pages/rss.xml.ts`, `rss-ja.xml.ts` | `title`, `date`, `excerpt` |
| Sitemap | `src/pages/sitemap.xml.ts` | file path + `date` |
| Tag pages | `src/pages/tags/*`, `src/pages/ja/tags/*` | `tags` |
| Research index | `src/pages/research.astro`, `src/pages/ja/research.astro` | `sources`, `title`, `date` |
| Product slot | `src/data/products.ts` via `matchProduct(tags, frontmatter.title)` | `tags`, `title` |

Both OG generators run as part of `npm run build` (`package.json`:
`node scripts/generate-og.mjs && (python3 scripts/generate-og-ja.py || …) && astro build`), so a new
article gets its OG image automatically — the JA step is allowed to fail soft if Pillow or the
Mincho font is unavailable, in which case a pre-built PNG must already exist in `public/og/`.

---

## 7. `times` schema

Only one entry exists (`src/content/times/vol-001.md`), and it is a `draft: true` stub with empty
strings and `<!-- FILL: -->` markers, so this schema is *inferred from a single template file plus
the templates that read it*. Treat it as less settled than `posts`.

```yaml
---
vol: 1
date: "2026-07-05"
title: ""
excerpt: ""
draft: true
noteUrl: ""
bookTitle: ""
bookUrl: ""
---
```

| Field | Type | Notes |
|---|---|---|
| `vol` | `number` | Issue number. Drives the route `/times/vol-{vol padded to 3}` and sort order (`src/pages/times/index.astro:8,13`). Defaulted to `0` in the sort via `?? 0`. |
| `date` | `string` (`YYYY-MM-DD`) | Same string-not-date convention as `posts`. |
| `title` | `string` | Falls back to `Vol.NNN` in the listing when empty (`times/index.astro:37`). |
| `excerpt` | `string` | Listing blurb + JSON-LD `description`. |
| `draft` | `boolean` | **Honoured** — `import.meta.env.PROD ? allIssues.filter(i => !i.frontmatter.draft) : …` (`times/index.astro:7`). Unlike `posts`, this actually hides the issue in production. |
| `noteUrl` | `string` (URL) | note.com companion link. |
| `bookTitle` / `bookUrl` | `string` | The issue's "Bookshelf" pick. The body template says to keep these in sync with the prose section. |

The body uses a fixed JA section skeleton: `## 今週の脳`, `## Research`, `## Attention Risk`,
`## Dopamine News`, `## Experiment`, `## Bookshelf`, `## 編集後記`.

---

## 8. Checklist for a new `posts` article

1. Pick the locale directory: `src/content/posts/en/` or `src/content/posts/ja/`. Nowhere else.
2. Filename stem = slug. Lowercase, hyphenated, no extension beyond `.md`. It becomes the URL,
   the OG image filename (`public/og/<slug>.png`), and the narration output directory.
3. Include all seven baseline keys — `title`, `date`, `excerpt`, `tags`, `readTime`, `tldr`,
   `sources` — because nothing validates them for you.
4. `date` must be a **quoted** `"YYYY-MM-DD"` string.
5. `tags` in the article's own language: Japanese tags for ja, English for en. Reuse existing tag
   strings where possible, since tag pages are generated from the union of what articles declare.
6. `tldr` 3–4 items, matching the corpus. `sources` 3–4 entries, each `{ name, url }`, `url`
   pointing at a real citation (PubMed is the house style).
7. `readTime` an integer in minutes, roughly `wordCount / 200` — it *is* the `wordCount` proxy in
   JSON-LD.
8. Optional but currently unused corpus-wide: `faqItems` (the only route to FAQPage JSON-LD),
   `updatedDate`, `wordCount`, and — ja only — `noteUrl` / `notePrice`.
9. Series membership, if any, goes in `src/data/series.ts`, not the article.
10. `draft: true` does **not** hide a post. Don't rely on it.
