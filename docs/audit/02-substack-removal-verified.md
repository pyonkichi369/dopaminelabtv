# t12 — Substack Removal Verified

Date: 2026-08-04

## Grep verification

Command (run from repo root):

```
grep -ri substack . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=audit
```

Result: **zero hits outside `docs/audit/`**. The only remaining reference in the
repository is `docs/audit/01-substack-inventory.md`, which is intentionally kept
as a historical record and excluded from this check. A filename sweep
(`find . -iname '*substack*'` with the same exclusions) confirms no leftover
Substack-named files exist either.

## Build verification

Ran the verified build command from `docs/audit/00-build-baseline.md`
(with the documented Node 22 PATH prefix, since the machine default is Node 16):

```
export PATH="$HOME/.nvm/versions/node/v22.13.0/bin:$PATH"
npm run build
```

Result: **exit code 0** — 245 pages built, `[build] Complete!`, and the
post-build checks passed (`check-links`: no broken internal links across 11,971
href occurrences; `check-meta`: 245 pages with unique titles/descriptions,
valid JSON-LD, paired article hreflang).

## Additional references found and fixed in this task (t12)

The final sweep found Substack references beyond the surfaces covered by the
prior removal tasks. All were fixed here:

- **39 content posts** (`src/content/posts/`) — removed the italic Substack
  subscription CTA line at the end of each article (plus any orphaned trailing
  `---` divider). EN (19): adhd-is-not-a-broken-brain, eight-weeks-that-change-the-brain,
  four-things-music-does-to-your-brain, how-exercise-rewires-your-brain,
  how-gratitude-rewires-the-brain, post-holiday-blues-and-the-dopamine-baseline,
  procrastination-is-not-a-willpower-problem, sleep-makes-memories,
  the-law-of-attraction-is-half-right, the-neuroscience-of-empathy,
  the-neuroscience-of-loneliness, totonou-what-your-brain-needs,
  what-intuition-actually-is, what-the-lotus-sutra-knew-2500-years-ago,
  why-anger-hijacks-your-brain, why-vacation-doesnt-restore-your-brain,
  why-you-cant-focus-anymore, why-you-cant-put-down-your-phone,
  your-brain-does-something-ai-will-never-do. JA (20): adhd-wa-kowareta-nou-dewa-nai,
  chokkan-no-shotai, gogatsubyou-no-shotai, hikiyo-se-no-hosoku-wa-hannbun-hontou-datta,
  hokekyo-ga-2500nen-mae-ni-shitte-ita-koto, ikari-to-nou, kansha-ga-nou-wo-kaeru,
  kodoku-to-nou, kyoukan-no-noukagaku, kyuka-ga-nou-wo-kaifuku-shinai-riyu,
  maindfullness-to-nou, naze-shuchu-dekinai, no-ai-niwa-dekinai-koto,
  ongaku-ga-nou-ni-suru-koto, saki-nobashi-no-noukagaku, suimin-ga-kioku-wo-tsukuru,
  sumatho-wo-yamerarenai-honto-no-riyu, totonou-no-kagaku, undou-ga-nou-wo-kaeru,
  zen-ga-shinkagaku-yori-shitte-ita-koto.
- `src/layouts/BaseLayout.astro` — removed the Substack URL from the WebSite
  JSON-LD `sameAs` array (nav/footer/preconnect/GA were already handled earlier).
- `src/pages/index.astro`, `src/pages/ja/index.astro` — removed the
  "Go deeper / Substack — weekly letter" (深く学びたい人へ) CTA card from the
  check-result "Start here" block and renumbered the remaining cards 01/02.
- `src/pages/about.astro`, `src/pages/ja/about.astro` — removed the Substack
  list item from "Where to find us" and the Substack URL from the AboutPage
  JSON-LD `sameAs`.
- `src/pages/privacy.astro`, `src/pages/ja/privacy.astro` — removed Substack
  from the external-services sentence.
- `src/pages/totonou.astro`, `src/pages/ja/totonou.astro` — removed the
  `.totonou-waitlist` block whose sole function was the "Join the waitlist on
  Substack" funnel.
- `src/pages/series/[name].astro`, `src/pages/ja/series/[name].astro` —
  replaced the upcoming-article excerpt "Subscribe on Substack to be notified."
  / 「Substackで通知を受け取る。」 with neutral copy.
- `src/pages/fatigue.astro`, `src/pages/ja/fatigue.astro`,
  `src/pages/dopamine-debt.astro`, `src/pages/ja/dopamine-debt.astro` — renamed
  the still-used crosslink class `times-substack-crosslink` → `times-crosslink`
  (the box links to /times/, not Substack).
- `src/styles/global.css` — deleted the dead `.times-substack`,
  `.times-substack-pitch`, `.times-substack iframe` embed styles (component was
  deleted earlier) and renamed `.times-substack-crosslink` → `.times-crosslink`
  (base, `p`, and media-query rules).
- Internal docs: `_aegis/handoff.md` (revenue-stack line), `AUDIT_REPORT.md`
  (external-links line, "all four" → "all three"),
  `docs/dopamine-lab/content-system.md` (distribution table row, weekly
  checklist item, template file-tree entry),
  `workspace/youtube/yt-long_adhd-test/script.txt` and `narration.vtt`
  (outro CTA now points to dopaminelabtv.com instead of Substack).

## Complete file list for the whole Substack-removal effort

Prior tasks:

- `src/components/TimesSubstackEmbed.astro` — **deleted**.
- `src/pages/times/index.astro` — embed usage removed.
- `src/pages/times/vol-[vol].astro` — embed usage removed.
- `src/layouts/BaseLayout.astro` — nav/footer links, preconnect/dns-prefetch
  hints, and GA `substack_click` tracking removed.
- `src/layouts/PostLayout.astro` — "Substackで読む/購読する" CTA removed.
- `src/data/llms-static.ts` — Substack mention removed.
- `README.md` — Substack mention removed.

This task (t12): all files in the section above (39 posts, BaseLayout `sameAs`,
index/about/privacy/totonou/series/fatigue/dopamine-debt pages ×2 locales,
global.css, and the five internal docs).

## Conclusion

Substack is fully removed from the site code, content, styles, and working
docs. The repository greps clean for `substack` outside `docs/audit/`, and
`npm run build` is green (245 pages).
