// Public YouTube Shorts embedded on /videos and /ja/videos.
// `id` is the YouTube video ID (used in the /embed/<id> URL).
// `article_ja` / `article_en` are post slugs (see src/content/posts/<lang>/)
// for the deep-dive article that expands on this Short's thesis. Optional —
// only set when a real article match exists; omitted otherwise. Consumed by
// videos.astro/ja/videos.astro (onward link) and PostLayout.astro (reciprocal
// "watch the video" callout).
export interface ShortVideo {
  id: string;
  title_ja: string;
  title_en: string;
  topic: string;
  article_ja?: string;
  article_en?: string;
}

export const SHORTS: ShortVideo[] = [
  {
    id: 'OGVtTkSJ2Rg',
    title_ja: '朝すぐ動けないのは、夜型だからじゃない',
    title_en: "Morning sluggishness isn't about being a night owl",
    topic: 'sleep',
    article_ja: 'asa-ugokenai-nowa-yogata-dakara-janai',
    article_en: 'morning-sluggishness-is-not-being-a-night-owl',
  },
  {
    id: 'icLYoZEbPKA',
    title_ja: 'やる気が出ないのは、怠けているからじゃない',
    title_en: "Low motivation isn't laziness",
    topic: 'motivation',
    article_ja: 'undou-ga-nou-wo-kaeru',
    article_en: 'how-exercise-rewires-your-brain',
  },
  {
    id: '1SE87Wjy7U8',
    title_ja: 'イライラするのは、性格のせいじゃない',
    title_en: "Irritability isn't your personality",
    topic: 'sleep',
    article_ja: 'nemuranai-to-okorippoku-naru',
    article_en: 'sleep-loss-makes-you-reactive',
  },
  {
    id: 'fR1P4hwhCao',
    title_ja: '甘いものがやめられないのは、意志の問題じゃない',
    title_en: "Sugar cravings aren't a willpower problem",
    topic: 'appetite',
    article_ja: 'amai-mono-ga-yamerarenai-nowa-ishi-no-mondai-janai',
    article_en: 'sugar-cravings-are-not-a-willpower-problem',
  },
  {
    id: 'MEVI2bzjevE',
    title_ja: '考えごとが止まらないのは、心配性だからじゃない',
    title_en: "Racing thoughts aren't about being a worrier",
    topic: 'rumination',
    article_ja: 'shizen-wo-aruku-to-hansu-ga-heru',
    article_en: 'walking-in-nature-quiets-rumination',
  },
  {
    id: 'AnnUGYqYgm4',
    title_ja: '気分が晴れないのは、心のせいじゃない',
    title_en: 'Your low mood may not be a mindset problem',
    topic: 'gut-brain',
    article_ja: 'chou-nou-soukan',
    article_en: 'the-gut-brain-connection',
  },
  {
    id: 'rSzt8bKWZFw',
    title_ja: '寝る前のスマホ、ブルーライトだけが問題じゃない',
    title_en: "It's not just the blue light before bed",
    topic: 'sleep',
    article_ja: 'sumatho-wo-yamerarenai-honto-no-riyu',
    article_en: 'why-you-cant-put-down-your-phone',
  },
  {
    id: 'tdHrvlI3Q9w',
    title_ja: '夜眠れないのは、夜のせいじゃない',
    title_en: "Sleeplessness doesn't start at night",
    topic: 'sleep',
    article_ja: 'gaijitsu-rhythm-to-hikari',
    article_en: 'light-sets-your-brains-clock',
  },
];
