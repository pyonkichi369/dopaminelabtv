/* EN ↔ JA slug pairs for article hreflang alternates. Slugs differ between
   locales, so the mirrored-path derivation in BaseLayout cannot link them —
   this table is the single source of truth. A missing entry means the article
   page emits no hreflang (fails safe); add the pair when publishing a
   translation. */
export interface PostPair {
  en: string;
  ja: string;
}

export const POST_PAIRS: PostPair[] = [
  { en: 'adhd-is-not-a-broken-brain', ja: 'adhd-wa-kowareta-nou-dewa-nai' },
  { en: 'eight-weeks-that-change-the-brain', ja: 'maindfullness-to-nou' },
  { en: 'four-things-music-does-to-your-brain', ja: 'ongaku-ga-nou-ni-suru-koto' },
  { en: 'hare-and-ke-dopamine-reset', ja: 'hare-to-ke-dopamine-reset' },
  { en: 'how-exercise-rewires-your-brain', ja: 'undou-ga-nou-wo-kaeru' },
  { en: 'how-gratitude-rewires-the-brain', ja: 'kansha-ga-nou-wo-kaeru' },
  { en: 'how-much-of-binaural-beats-is-real', ja: 'binaural-beat-wa-doko-made-hontou-ka' },
  { en: 'how-slow-breathing-calms-the-brain', ja: 'kokyu-to-meiso-shinkei' },
  { en: 'light-sets-your-brains-clock', ja: 'gaijitsu-rhythm-to-hikari' },
  { en: 'ma-the-space-between-stimulus-and-response', ja: 'ma-shigeki-to-hannou-no-aida' },
  { en: 'post-holiday-blues-and-the-dopamine-baseline', ja: 'gogatsubyou-no-shotai' },
  { en: 'procrastination-is-not-a-willpower-problem', ja: 'saki-nobashi-no-noukagaku' },
  { en: 'sleep-loss-makes-you-reactive', ja: 'nemuranai-to-okorippoku-naru' },
  { en: 'sleep-makes-memories', ja: 'suimin-ga-kioku-wo-tsukuru' },
  { en: 'the-adhd-brain-attention-not-deficit', ja: 'adhd-wa-chusui-no-ketsujo-dewa-nai' },
  { en: 'the-brain-washes-itself-but-not-with-sound', ja: 'nou-no-gomi-wa-oto-dewa-nagasenai' },
  { en: 'the-gut-brain-connection', ja: 'chou-nou-soukan' },
  { en: 'the-law-of-attraction-is-half-right', ja: 'hikiyo-se-no-hosoku-wa-hannbun-hontou-datta' },
  { en: 'the-neuroscience-of-empathy', ja: 'kyoukan-no-noukagaku' },
  { en: 'the-neuroscience-of-loneliness', ja: 'kodoku-to-nou' },
  { en: 'totonou-what-your-brain-needs', ja: 'totonou-no-kagaku' },
  { en: 'walking-in-nature-quiets-rumination', ja: 'shizen-wo-aruku-to-hansu-ga-heru' },
  { en: 'what-burnout-does-to-your-brain', ja: 'naze-yakitsukita-ato-yaruki-ga-modora-nai-no-ka' },
  { en: 'what-intuition-actually-is', ja: 'chokkan-no-shotai' },
  { en: 'what-the-lotus-sutra-knew-2500-years-ago', ja: 'hokekyo-ga-2500nen-mae-ni-shitte-ita-koto' },
  { en: 'what-zen-knew-before-neuroscience', ja: 'zen-ga-shinkagaku-yori-shitte-ita-koto' },
  { en: 'why-anger-hijacks-your-brain', ja: 'ikari-to-nou' },
  { en: 'why-anxiety-becomes-a-habit', ja: 'fuan-ga-kuse-ni-naru-riyu' },
  { en: 'why-slow-breathing-calms-you', ja: 'yukkuri-iki-wo-suru-to-naze-ochitsuku-noka' },
  { en: 'why-vacation-doesnt-restore-your-brain', ja: 'kyuka-ga-nou-wo-kaifuku-shinai-riyu' },
  { en: 'why-you-cant-focus-anymore', ja: 'naze-shuchu-dekinai' },
  { en: 'why-you-cant-put-down-your-phone', ja: 'sumatho-wo-yamerarenai-honto-no-riyu' },
  { en: 'your-brain-does-something-ai-will-never-do', ja: 'no-ai-niwa-dekinai-koto' },
];

export function getAlternatePostSlug(slug: string, lang: 'en' | 'ja'): string | null {
  const pair = POST_PAIRS.find(p => p[lang] === slug);
  if (!pair) return null;
  return lang === 'en' ? pair.ja : pair.en;
}
