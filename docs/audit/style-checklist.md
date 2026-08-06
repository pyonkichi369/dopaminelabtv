# Style Checklist — dopaminelabtv.com articles

Condensed from the in-repo style/brand sources. **There is no STYLE.md / BRAND.md in this repo**
(verified by repo-wide find). Rules below trace to:

- `docs/dopamine-lab/content-system.md` §2 ブランドトーン, §3 サイト記事生成システム — cited as **[CS]**
- `README.md` コンテンツ公式 / コンテンツ設計の原則 / 記事フォーマット — cited as **[RM]**
- `docs/audit/content-schema.md` (de-facto schema & locale conventions audit) — cited as **[SC]**

---

## Tone of voice (all platforms) [CS §2]

- [ ] 静かな語り口 — quiet, calm narration
- [ ] ミニマルな文章 — minimal prose, value whitespace (余白を大切に)
- [ ] No hard-sell — links/導線 to the site must feel natural, never pushed
- [ ] Don't over-explain — leave room for the reader to think
- [ ] Human-sounding writing — zero AI-flavored phrasing (AIっぽさゼロ)

## Forbidden [CS §2 DON'T]

- [ ] No high-tension hype copy (テンション高い煽り文句)
- [ ] No 「今すぐ！」「絶対！」-style CTAs
- [ ] No strings of jargon (専門用語の羅列)
- [ ] No forcing conclusions on the reader (結論の押しつけ)
- [ ] No overlong explanations (長すぎる説明)

## Content formula [RM]

- [ ] Every article = 「ドーパミン × X」 — dopamine is **always the subject**; other hormones,
      philosophy concepts, and modern problems appear only in relation to dopamine
- [ ] Neuroscience first, Japanese philosophy as complement (神経科学が先、日本哲学が補完)
- [ ] Treat Zen/Buddhist concepts as "2,500 years of practice data," not religion
- [ ] Show structure ("なぜこうなるか"), not prescriptions ("こうしなさい")
- [ ] All scientific claims backed by verifiable sources — **PubMed citations only**
- [ ] Target reader: tired working adults 30–50, stress / brain fatigue / autonomic nerves /
      sleep concerns, anxious about the AI era [CS §1]

## Article structure (5 stages, in order) [CS §2]

- [ ] 1. フック — one line that stops the reader
- [ ] 2. 共感 — make them think 「わかる」
- [ ] 3. 原因 — why it happens, scientific basis in plain language
- [ ] 4. 気づき — shift of perspective
- [ ] 5. 余韻 — a close that doesn't push

## Frontmatter (all 7 keys mandatory — nothing validates them) [CS §3, RM, SC §3]

- [ ] `title`, `date`, `excerpt`, `tags`, `readTime`, `tldr`, `sources` all present
- [ ] `date` is a **quoted** `"YYYY-MM-DD"` string (never a bare YAML date) [SC §3.1]
- [ ] `excerpt` = OGP/search-snippet summary: **EN ≤ 150 chars / JA ≤ 100 chars** [CS §3]
- [ ] `tldr`: 3–4 items (3 required minimum per README) [RM, SC §3.1]
- [ ] `sources`: entries are `{ name, url }` only; 3–4 entries typical; `url` points to a real
      PubMed citation (house style) [SC §8, RM]
- [ ] `readTime`: integer minutes ≈ wordCount / 200 (it doubles as the JSON-LD wordCount proxy) [SC §8]
- [ ] `tags`: 3–6 tags, written in the article's own language; reuse existing tag strings [SC §3.1, §8]
- [ ] Do NOT rely on `draft: true` — posts routes never filter it [SC §3.2]
- [ ] Series membership goes in `src/data/series.ts`, not frontmatter [SC §3.3]

## File / slug conventions [CS §3, SC §8]

- [ ] File lives in `src/content/posts/en/` or `src/content/posts/ja/` — nowhere else
- [ ] Filename stem = slug = URL = OG image name = narration output dir
- [ ] EN slug: kebab-case English words; JA slug: romaji transliteration of the JA title,
      kebab-case [CS §3, SC §4]
- [ ] Do not use stale `scripts/new-post.mjs` (writes to wrong path) [SC §2]

## Length & locale strategy [CS §3]

- [ ] EN article: 1000–1200 words, aimed at SEO + English-market growth
- [ ] JA article: 1000–1500 chars, **re-composed for Japanese readers — not a translation**
- [ ] Articles ship as an EN + JA set (週1記事ずつ、ENとJAでセット) [CS §1]
- [ ] Keep the 3-layer funnel in mind: SNS → site article → note (paid) [CS §3]

## Per-locale differences (ja vs en) [SC §4]

- [ ] JA tags in Japanese (「神経科学」「ドーパミン」…), EN tags in English
- [ ] JA `sources[].name` translated into Japanese; `url` stays the original PubMed link
- [ ] `noteUrl` / `notePrice` are **ja-only** (inert on EN articles) — the only in-article CTA
      button; keep site CTAs otherwise natural per tone rules [SC §3.2, CS §2]
- [ ] JA URL is `/ja/posts/<slug>/`; EN is `/posts/<slug>/`

## Narration compatibility (ja articles feed the TTS pipeline) [SC §5]

- [ ] Write `title` and `excerpt` so they work **read aloud** — they become the narration
      hook/framing (opening 30 seconds)
- [ ] Body must survive `clean_markdown()`: avoid heavy tables, code fences, and footnote
      syntax; headings, bold/italic, links, and `- ` bullets are handled

## Images / OG [SC §6]

- [ ] No in-article image conventions exist in the source docs; OG image is auto-generated at
      build time from `title` alone (`public/og/<slug>.png`) — write titles that render well
      standalone
