# Substack Reference Inventory (t02)

Read-only inventory of every case-insensitive `substack` match in the repository
(excluding `node_modules/`, `dist/`, `.git/`, `.astro/`, `__pycache__/`, and this file itself).
This file is the authoritative line-level reference for the removal tasks.

## Summary

- **Total matches:** 106
- **Total files affected:** 66

### Presence check for task-specified files

| Target | Present? | Matches |
|---|---|---|
| src/components/TimesSubstackEmbed.astro | YES | 5 |
| src/pages/times/index.astro | YES | 2 |
| src/pages/times/vol-[vol].astro | YES | 3 |
| src/layouts/BaseLayout.astro | YES | 11 |
| src/layouts/PostLayout.astro | YES | 4 |
| llms-static (src/data/llms-static.ts) | YES | 1 |
| README.md (repo root) | YES | 1 |

Notes:
- The `llms-static` file lives at `src/data/llms-static.ts` (not `src/utils/`).
- `src/pages/times/` contains exactly two files with matches: `index.astro` and `vol-[vol].astro`. No other times-pattern pages exist.
- BaseLayout has a `dns-prefetch` hint to Substack (line 233) but **no `preconnect`** — only dns-prefetch needs removing. Line 123 is a JSON-LD `sameAs` entry (structured data), easy to miss.
- Beyond the Times pages, `TimesSubstackEmbed` is ALSO imported/used by 4 pillar pages: `src/pages/fatigue.astro`, `src/pages/dopamine-debt.astro`, `src/pages/ja/fatigue.astro`, `src/pages/ja/dopamine-debt.astro`.
- 39 article markdown files (20 ja + 19 en) contain a Substack footer link — content-level references, listed for completeness.
- `src/styles/global.css` holds `.times-substack*` styles that become dead CSS once the embed is removed.
- `docs/`, `_aegis/`, and `workspace/` matches are internal docs/scripts output, not site code.

## Full inventory (grouped by file)

### Component (to delete)

#### `src/components/TimesSubstackEmbed.astro` (5 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/components/TimesSubstackEmbed.astro` | 2 | `// Substack embedded signup widget, shared by the Times issue page and archive index.` | Component (to delete) |
| `src/components/TimesSubstackEmbed.astro` | 5 | `<div class="times-substack">` | Component (to delete) |
| `src/components/TimesSubstackEmbed.astro` | 6 | `<p class="times-substack-pitch">毎週日曜、メールで届きます</p>` | Component (to delete) |
| `src/components/TimesSubstackEmbed.astro` | 8 | `src="https://dopaminelabtv.substack.com/embed"` | Component (to delete) |
| `src/components/TimesSubstackEmbed.astro` | 13 | `title="The Dopamine Times — Substack 購読フォーム"` | Component (to delete) |

### Times page (embed usage)

#### `src/pages/times/index.astro` (2 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/times/index.astro` | 4 | `import TimesSubstackEmbed from '../../components/TimesSubstackEmbed.astro';` | Times page (embed usage) |
| `src/pages/times/index.astro` | 49 | `<TimesSubstackEmbed />` | Times page (embed usage) |

#### `src/pages/times/vol-[vol].astro` (3 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/times/vol-[vol].astro` | 4 | `import TimesSubstackEmbed from '../../components/TimesSubstackEmbed.astro';` | Times page (embed usage) |
| `src/pages/times/vol-[vol].astro` | 85 | `<!-- Monetization: Substack signup -->` | Times page (embed usage) |
| `src/pages/times/vol-[vol].astro` | 86 | `<TimesSubstackEmbed />` | Times page (embed usage) |

### Pillar page (embed usage)

#### `src/pages/dopamine-debt.astro` (3 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/dopamine-debt.astro` | 3 | `import TimesSubstackEmbed from '../components/TimesSubstackEmbed.astro';` | Pillar page (embed usage) |
| `src/pages/dopamine-debt.astro` | 166 | `<div class="times-substack-crosslink">` | Pillar page (embed usage) |
| `src/pages/dopamine-debt.astro` | 169 | `<TimesSubstackEmbed />` | Pillar page (embed usage) |

#### `src/pages/fatigue.astro` (3 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/fatigue.astro` | 3 | `import TimesSubstackEmbed from '../components/TimesSubstackEmbed.astro';` | Pillar page (embed usage) |
| `src/pages/fatigue.astro` | 166 | `<div class="times-substack-crosslink">` | Pillar page (embed usage) |
| `src/pages/fatigue.astro` | 169 | `<TimesSubstackEmbed />` | Pillar page (embed usage) |

#### `src/pages/ja/dopamine-debt.astro` (3 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/ja/dopamine-debt.astro` | 3 | `import TimesSubstackEmbed from '../../components/TimesSubstackEmbed.astro';` | Pillar page (embed usage) |
| `src/pages/ja/dopamine-debt.astro` | 157 | `<div class="times-substack-crosslink">` | Pillar page (embed usage) |
| `src/pages/ja/dopamine-debt.astro` | 160 | `<TimesSubstackEmbed />` | Pillar page (embed usage) |

#### `src/pages/ja/fatigue.astro` (3 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/ja/fatigue.astro` | 3 | `import TimesSubstackEmbed from '../../components/TimesSubstackEmbed.astro';` | Pillar page (embed usage) |
| `src/pages/ja/fatigue.astro` | 157 | `<div class="times-substack-crosslink">` | Pillar page (embed usage) |
| `src/pages/ja/fatigue.astro` | 160 | `<TimesSubstackEmbed />` | Pillar page (embed usage) |

### Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking

#### `src/layouts/BaseLayout.astro` (11 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/layouts/BaseLayout.astro` | 123 | `'https://dopaminelabtv.substack.com',` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 233 | `<link rel="dns-prefetch" href="https://dopaminelabtv.substack.com" />` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 278 | `<a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer">Newsletter</a>` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 289 | `<a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer">Newsletter</a>` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 319 | `<a href="https://dopaminelabtv.substack.com" class="mobile-nav-link" target="_blank" rel="noopener noreferrer"...` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 329 | `<a href="https://dopaminelabtv.substack.com" class="mobile-nav-link" target="_blank" rel="noopener noreferrer"...` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 355 | `<a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer">Substack</a>` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 367 | `<a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer">Substack</a>` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 410 | `// Global click tracking — affiliate / Substack / outbound` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 422 | `} else if (href.indexOf('dopaminelabtv.substack.com') !== -1) {` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |
| `src/layouts/BaseLayout.astro` | 423 | `ga('substack_click', { link_text: text, page: window.location.pathname });` | Layout: nav/footer links, dns-prefetch, JSON-LD sameAs, GA tracking |

### Layout: post CTA

#### `src/layouts/PostLayout.astro` (4 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/layouts/PostLayout.astro` | 184 | `<a class="btn btn--outline" href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer...` | Layout: post CTA |
| `src/layouts/PostLayout.astro` | 185 | `{isJa ? 'Substackで読む →' : 'Read on Substack →'}` | Layout: post CTA |
| `src/layouts/PostLayout.astro` | 260 | `href="https://dopaminelabtv.substack.com"` | Layout: post CTA |
| `src/layouts/PostLayout.astro` | 264 | `{isJa ? 'Substackで購読する →' : 'Subscribe on Substack →'}` | Layout: post CTA |

### Page link/CTA

#### `src/pages/about.astro` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/about.astro` | 38 | `<li><a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer">Substack</a> — week...` | Page link/CTA |

#### `src/pages/index.astro` (2 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/index.astro` | 163 | `<a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer"` | Page link/CTA |
| `src/pages/index.astro` | 168 | `<span>Substack — weekly letter</span>` | Page link/CTA |

#### `src/pages/ja/about.astro` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/ja/about.astro` | 40 | `<li><a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer">Substack</a> — 週1レタ...` | Page link/CTA |

#### `src/pages/ja/index.astro` (2 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/ja/index.astro` | 162 | `<a href="https://dopaminelabtv.substack.com" target="_blank" rel="noopener noreferrer"` | Page link/CTA |
| `src/pages/ja/index.astro` | 167 | `<span>Substack — 週1レター</span>` | Page link/CTA |

#### `src/pages/ja/privacy.astro` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/ja/privacy.astro` | 36 | `<p style="font-family:var(--font-jp);">当サイトは YouTube・Substack・X（Twitter）へのリンクを掲載しています。これらのリンクの利用は、各サービスのプライバシー...` | Page link/CTA |

#### `src/pages/ja/series/[name].astro` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/ja/series/[name].astro` | 56 | `<p class="series-post-excerpt" style="font-family: var(--font-jp)">Substackで通知を受け取る。</p>` | Page link/CTA |

#### `src/pages/ja/totonou.astro` (2 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/ja/totonou.astro` | 77 | `href="https://dopaminelabtv.substack.com"` | Page link/CTA |
| `src/pages/ja/totonou.astro` | 81 | `Substack でウェイトリストに登録 →` | Page link/CTA |

#### `src/pages/privacy.astro` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/privacy.astro` | 35 | `<p>The site embeds links to YouTube, Substack, and X (Twitter). Visiting those links is subject to their respe...` | Page link/CTA |

#### `src/pages/series/[name].astro` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/series/[name].astro` | 56 | `<p class="series-post-excerpt">Subscribe on Substack to be notified.</p>` | Page link/CTA |

#### `src/pages/totonou.astro` (2 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/pages/totonou.astro` | 78 | `href="https://dopaminelabtv.substack.com"` | Page link/CTA |
| `src/pages/totonou.astro` | 82 | `Join the waitlist on Substack →` | Page link/CTA |

### llms.txt static content

#### `src/data/llms-static.ts` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/data/llms-static.ts` | 80 | `- Newsletter: https://dopaminelabtv.substack.com (weekly letter)` | llms.txt static content |

### README

#### `README.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `README.md` | 5 | `[dopaminelabtv.com](https://dopaminelabtv.com) \| [Substack](https://dopaminelabtv.substack.com) \| [note](htt...` | README |

### CSS (embed/crosslink styles)

#### `src/styles/global.css` (7 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/styles/global.css` | 2522 | `.times-substack {` | CSS (embed/crosslink styles) |
| `src/styles/global.css` | 2531 | `.times-substack-pitch {` | CSS (embed/crosslink styles) |
| `src/styles/global.css` | 2537 | `.times-substack iframe { border-radius: var(--radius); }` | CSS (embed/crosslink styles) |
| `src/styles/global.css` | 2596 | `.times-substack { padding: 22px 18px; }` | CSS (embed/crosslink styles) |
| `src/styles/global.css` | 2671 | `.times-substack-crosslink {` | CSS (embed/crosslink styles) |
| `src/styles/global.css` | 2680 | `.times-substack-crosslink p {` | CSS (embed/crosslink styles) |
| `src/styles/global.css` | 2754 | `.times-substack-crosslink { padding: 18px 16px; }` | CSS (embed/crosslink styles) |

### Article footer link (content)

#### `src/content/posts/en/adhd-is-not-a-broken-brain.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/adhd-is-not-a-broken-brain.md` | 126 | `*New research dispatches every Sunday. Subscribe to [Substack](https://dopaminelabtv.substack.com) for the ful...` | Article footer link (content) |

#### `src/content/posts/en/eight-weeks-that-change-the-brain.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/eight-weeks-that-change-the-brain.md` | 109 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/four-things-music-does-to-your-brain.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/four-things-music-does-to-your-brain.md` | 100 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/how-exercise-rewires-your-brain.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/how-exercise-rewires-your-brain.md` | 107 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/how-gratitude-rewires-the-brain.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/how-gratitude-rewires-the-brain.md` | 96 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/post-holiday-blues-and-the-dopamine-baseline.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/post-holiday-blues-and-the-dopamine-baseline.md` | 132 | `*New research letters every Sunday. Full reports with audio at [Substack](https://dopaminelabtv.substack.com)....` | Article footer link (content) |

#### `src/content/posts/en/procrastination-is-not-a-willpower-problem.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/procrastination-is-not-a-willpower-problem.md` | 106 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/sleep-makes-memories.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/sleep-makes-memories.md` | 111 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/the-law-of-attraction-is-half-right.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/the-law-of-attraction-is-half-right.md` | 100 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/the-neuroscience-of-empathy.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/the-neuroscience-of-empathy.md` | 100 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/the-neuroscience-of-loneliness.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/the-neuroscience-of-loneliness.md` | 103 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/totonou-what-your-brain-needs.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/totonou-what-your-brain-needs.md` | 92 | `*The totonou app is in development. If you want to be notified at launch — and receive the research behind the...` | Article footer link (content) |

#### `src/content/posts/en/what-intuition-actually-is.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/what-intuition-actually-is.md` | 108 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/what-the-lotus-sutra-knew-2500-years-ago.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/what-the-lotus-sutra-knew-2500-years-ago.md` | 142 | `*New research letters every Sunday. Full reports with audio at [Substack](https://dopaminelabtv.substack.com)....` | Article footer link (content) |

#### `src/content/posts/en/why-anger-hijacks-your-brain.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/why-anger-hijacks-your-brain.md` | 104 | `*New research reports every Sunday. Full audio report on [Substack](https://dopaminelabtv.substack.com).*` | Article footer link (content) |

#### `src/content/posts/en/why-vacation-doesnt-restore-your-brain.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/why-vacation-doesnt-restore-your-brain.md` | 88 | `*New research dispatches every Sunday. Subscribe to [Substack](https://dopaminelabtv.substack.com) for the ful...` | Article footer link (content) |

#### `src/content/posts/en/why-you-cant-focus-anymore.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/why-you-cant-focus-anymore.md` | 50 | `*New research dispatches every Sunday. Subscribe to [Substack](https://dopaminelabtv.substack.com) for the ful...` | Article footer link (content) |

#### `src/content/posts/en/why-you-cant-put-down-your-phone.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/why-you-cant-put-down-your-phone.md` | 88 | `*New research dispatches every Sunday. Subscribe to [Substack](https://dopaminelabtv.substack.com) for the ful...` | Article footer link (content) |

#### `src/content/posts/en/your-brain-does-something-ai-will-never-do.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/en/your-brain-does-something-ai-will-never-do.md` | 60 | `*New research dispatches every Sunday. Subscribe to [Substack](https://dopaminelabtv.substack.com) for the ful...` | Article footer link (content) |

#### `src/content/posts/ja/adhd-wa-kowareta-nou-dewa-nai.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/adhd-wa-kowareta-nou-dewa-nai.md` | 133 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/chokkan-no-shotai.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/chokkan-no-shotai.md` | 102 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/gogatsubyou-no-shotai.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/gogatsubyou-no-shotai.md` | 137 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/hikiyo-se-no-hosoku-wa-hannbun-hontou-datta.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/hikiyo-se-no-hosoku-wa-hannbun-hontou-datta.md` | 98 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/hokekyo-ga-2500nen-mae-ni-shitte-ita-koto.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/hokekyo-ga-2500nen-mae-ni-shitte-ita-koto.md` | 143 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/ikari-to-nou.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/ikari-to-nou.md` | 111 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/kansha-ga-nou-wo-kaeru.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/kansha-ga-nou-wo-kaeru.md` | 109 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/kodoku-to-nou.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/kodoku-to-nou.md` | 101 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/kyoukan-no-noukagaku.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/kyoukan-no-noukagaku.md` | 88 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/kyuka-ga-nou-wo-kaifuku-shinai-riyu.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/kyuka-ga-nou-wo-kaifuku-shinai-riyu.md` | 97 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/maindfullness-to-nou.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/maindfullness-to-nou.md` | 122 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/naze-shuchu-dekinai.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/naze-shuchu-dekinai.md` | 51 | `*毎週日曜日に新しいリサーチを配信。[Substack](https://dopaminelabtv.substack.com) でフルレポートを受け取る。*` | Article footer link (content) |

#### `src/content/posts/ja/no-ai-niwa-dekinai-koto.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/no-ai-niwa-dekinai-koto.md` | 60 | `*毎週日曜日に新しいリサーチを配信。[Substack](https://dopaminelabtv.substack.com) でフルレポートを受け取る。*` | Article footer link (content) |

#### `src/content/posts/ja/ongaku-ga-nou-ni-suru-koto.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/ongaku-ga-nou-ni-suru-koto.md` | 94 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/saki-nobashi-no-noukagaku.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/saki-nobashi-no-noukagaku.md` | 104 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/suimin-ga-kioku-wo-tsukuru.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/suimin-ga-kioku-wo-tsukuru.md` | 96 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/sumatho-wo-yamerarenai-honto-no-riyu.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/sumatho-wo-yamerarenai-honto-no-riyu.md` | 90 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/totonou-no-kagaku.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/totonou-no-kagaku.md` | 109 | `*totonou アプリは開発中です。ローンチ時の通知と、プロトコルの背景にある研究を受け取るには——[Substack](https://dopaminelabtv.substack.com) でお知らせします。*` | Article footer link (content) |

#### `src/content/posts/ja/undou-ga-nou-wo-kaeru.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/undou-ga-nou-wo-kaeru.md` | 96 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

#### `src/content/posts/ja/zen-ga-shinkagaku-yori-shitte-ita-koto.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `src/content/posts/ja/zen-ga-shinkagaku-yori-shitte-ita-koto.md` | 144 | `*毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは [Substack](https://dopaminelabtv.substack.com) で。*` | Article footer link (content) |

### Docs/workspace (non-site)

#### `_aegis/handoff.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `_aegis/handoff.md` | 9 | `- [x] 収益スタック: Bookshelf アフィリエイト枠（PR表記+nofollow sponsored）+ note CTA + Substack 埋め込みフォーム（外部遷移なしのメール取得）` | Docs/workspace (non-site) |

#### `docs/audit/00-build-baseline.md` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `docs/audit/00-build-baseline.md` | 36 | `- Baseline was established without touching Substack-related code/components — that work starts in a later tas...` | Docs/workspace (non-site) |

#### `docs/dopamine-lab/content-system.md` (3 matches)

| File | Line | Snippet | Category |
|---|---|---|---|
| `docs/dopamine-lab/content-system.md` | 26 | `\| 10 \| Substack \| ニュースレター \| 1通（日曜）\|` | Docs/workspace (non-site) |
| `docs/dopamine-lab/content-system.md` | 203 | `□ Substack 配信` | Docs/workspace (non-site) |
| `docs/dopamine-lab/content-system.md` | 307 | `│       └── substack.md` | Docs/workspace (non-site) |

#### `workspace/youtube/yt-long_adhd-test/narration.vtt` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `workspace/youtube/yt-long_adhd-test/narration.vtt` | 379 | `音声付きフルレポートは Substack で。` | Docs/workspace (non-site) |

#### `workspace/youtube/yt-long_adhd-test/script.txt` (1 match)

| File | Line | Snippet | Category |
|---|---|---|---|
| `workspace/youtube/yt-long_adhd-test/script.txt` | 109 | `毎週日曜日、新しい研究レポートをお届けしています。音声付きフルレポートは Substack で。` | Docs/workspace (non-site) |

