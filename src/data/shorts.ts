// Public YouTube Shorts embedded on /videos and /ja/videos.
// `id` is the YouTube video ID (used in the /embed/<id> URL).
export interface ShortVideo {
  id: string;
  title_ja: string;
  title_en: string;
  topic: string;
}

export const SHORTS: ShortVideo[] = [
  {
    id: 'OGVtTkSJ2Rg',
    title_ja: '朝すぐ動けないのは、夜型だからじゃない',
    title_en: "Morning sluggishness isn't about being a night owl",
    topic: 'sleep',
  },
  {
    id: 'icLYoZEbPKA',
    title_ja: 'やる気が出ないのは、怠けているからじゃない',
    title_en: "Low motivation isn't laziness",
    topic: 'motivation',
  },
  {
    id: '1SE87Wjy7U8',
    title_ja: 'イライラするのは、性格のせいじゃない',
    title_en: "Irritability isn't your personality",
    topic: 'sleep',
  },
  {
    id: 'fR1P4hwhCao',
    title_ja: '甘いものがやめられないのは、意志の問題じゃない',
    title_en: "Sugar cravings aren't a willpower problem",
    topic: 'appetite',
  },
  {
    id: 'MEVI2bzjevE',
    title_ja: '考えごとが止まらないのは、心配性だからじゃない',
    title_en: "Racing thoughts aren't about being a worrier",
    topic: 'rumination',
  },
  {
    id: 'AnnUGYqYgm4',
    title_ja: '気分が晴れないのは、心のせいじゃない',
    title_en: 'Your low mood may not be a mindset problem',
    topic: 'gut-brain',
  },
  {
    id: 'rSzt8bKWZFw',
    title_ja: '寝る前のスマホ、ブルーライトだけが問題じゃない',
    title_en: "It's not just the blue light before bed",
    topic: 'sleep',
  },
  {
    id: 'tdHrvlI3Q9w',
    title_ja: '夜眠れないのは、夜のせいじゃない',
    title_en: "Sleeplessness doesn't start at night",
    topic: 'sleep',
  },
];
