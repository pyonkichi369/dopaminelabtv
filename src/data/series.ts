export interface SeriesInfo {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  descriptionJa: string;
  slugs: { en: string[]; ja: string[] };
}

export const SERIES: SeriesInfo[] = [
  {
    id: 'japanese-philosophy',
    title: 'Japanese Philosophy × Neuroscience',
    titleJa: '日本哲学×神経科学シリーズ',
    description: 'Ancient Japanese concepts — totonou, ma, mushin, wabi-sabi — mapped to modern brain science.',
    descriptionJa: '整う・間・無心・侘び寂び……古代の日本語概念を、現代神経科学と接続するシリーズ。',
    slugs: {
      en: ['totonou-what-your-brain-needs'],
      ja: ['totonou-no-kagaku'],
    },
  },
  {
    id: 'focus-dopamine',
    title: 'Focus & Dopamine',
    titleJa: '集中力×脳科学',
    description: 'The neuroscience of why modern life hijacks your attention — and how to get it back.',
    descriptionJa: '現代生活がなぜ注意力を奪うのか、神経科学の視点から解説するシリーズ。',
    slugs: {
      en: ['why-you-cant-focus-anymore', 'your-brain-does-something-ai-will-never-do'],
      ja: ['naze-shuchu-dekinai', 'no-ai-niwa-dekinai-koto'],
    },
  },
];

export function getSeriesForSlug(slug: string, lang: 'en' | 'ja'): SeriesInfo | null {
  return SERIES.find(s => s.slugs[lang].includes(slug)) ?? null;
}

export function getSeriesIndex(series: SeriesInfo, slug: string, lang: 'en' | 'ja'): number {
  return series.slugs[lang].indexOf(slug);
}
