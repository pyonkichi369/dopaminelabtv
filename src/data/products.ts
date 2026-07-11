// Research-contextual product catalog.
//
// Each article's tags are matched against `matchKeywords` to surface ONE
// contextually relevant product (never a random or unrelated one). If no
// product scores a match, the calling layout renders nothing — this file
// has no concept of a "default" product.
//
// PLACEHOLDER DATA: affiliateUrl is a stand-in until the operator supplies
// real affiliate links. See README note at the bottom of this file for the
// exact fields to fill in.

export interface Product {
  id: string;
  name: string;
  nameJa: string;
  /** 1-2 sentence factual description. No medical claims, no urgency/scarcity language. */
  blurb: string;
  blurbJa: string;
  category: string;
  /** Lowercase keywords/tags this product is relevant to. Matched against article tags + title. */
  matchKeywords: string[];
  /** Local path or URL. Empty string = component renders a neutral gradient placeholder instead. */
  imageUrl: string;
  /** PLACEHOLDER — operator replaces with the real affiliate/tracking link. */
  affiliateUrl: string;
  network: 'amazon' | 'rakuten' | 'a8' | 'other';
  disclosureRequired: true;
}

export const PRODUCTS: Product[] = [
  {
    id: 'sleep-mask-weighted',
    name: 'Blackout Sleep Mask',
    nameJa: '遮光アイマスク',
    blurb: 'A contoured, fully light-blocking sleep mask for reducing light exposure before and during sleep.',
    blurbJa: '就寝前後の光刺激を減らすための、立体裁断の遮光アイマスク。',
    category: 'sleep',
    matchKeywords: ['sleep', 'memory', 'hippocampus', 'learning', 'insomnia', 'circadian', '睡眠', '記憶', '海馬'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-sleep-mask',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'analog-timer',
    name: 'Analog Kitchen Timer',
    nameJa: 'アナログキッチンタイマー',
    blurb: 'A simple mechanical timer for structuring focused work intervals without a phone screen in view.',
    blurbJa: 'スマホ画面を見ずに作業時間を区切るための、シンプルな機械式タイマー。',
    category: 'dopamine-reward',
    matchKeywords: ['dopamine', 'reward', 'hedonic adaptation', 'dopamine reset', 'procrastination', 'behavioral design', 'prediction error', 'ドーパミン'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-analog-timer',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'noise-isolating-headphones',
    name: 'Over-Ear Noise-Isolating Headphones',
    nameJa: '遮音性オーバーイヤーヘッドホン',
    blurb: 'Passive noise-isolating headphones for reducing auditory distraction during focused tasks.',
    blurbJa: '集中作業中の聴覚的な気を散らす要因を減らすための、遮音性ヘッドホン。',
    category: 'focus-attention',
    matchKeywords: ['focus', 'attention', 'adhd', 'executive function', 'default mode network', '集中力', '注意', 'ADHD'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-headphones',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'l-theanine-caffeine',
    name: 'L-Theanine + Caffeine Capsules',
    nameJa: 'L-テアニン＋カフェイン配合サプリメント',
    blurb: 'A combined L-theanine and caffeine supplement, commonly used to take the edge off caffeine\'s stimulant effect.',
    blurbJa: 'カフェインの刺激感を和らげる目的で使われる、L-テアニンとカフェインを組み合わせたサプリメント。',
    category: 'caffeine-adenosine',
    matchKeywords: ['caffeine', 'adenosine', 'alertness', 'stimulant', 'カフェイン'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-l-theanine',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'resistance-bands',
    name: 'Adjustable Resistance Bands Set',
    nameJa: '負荷調整式トレーニングチューブセット',
    blurb: 'A set of resistance bands for at-home aerobic and strength intervals, no gym required.',
    blurbJa: '自宅で有酸素・筋力トレーニングの負荷を調整できる、トレーニングチューブのセット。',
    category: 'exercise-bdnf',
    matchKeywords: ['exercise', 'bdnf', 'neuroplasticity', 'depression', 'aerobic', '運動'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-resistance-bands',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha Supplement',
    nameJa: 'アシュワガンダサプリメント',
    blurb: 'An adaptogenic herb supplement often used as part of stress-management routines.',
    blurbJa: 'ストレスマネジメントの一環として使われることの多い、アダプトゲン系ハーブのサプリメント。',
    category: 'stress-cortisol',
    matchKeywords: ['stress', 'cortisol', 'anxiety', 'burnout', 'recovery', 'ストレス', 'コルチゾール', '不安', 'バーンアウト'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-ashwagandha',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'zafu-cushion',
    name: 'Meditation Cushion (Zafu)',
    nameJa: '座禅用坐布（座蒲）',
    blurb: 'A round meditation cushion for supporting an upright, stable seated posture during practice.',
    blurbJa: '座る姿勢を安定させるための、円形の座禅用坐布。',
    category: 'meditation-mindfulness',
    matchKeywords: ['meditation', 'mindfulness', 'zen', 'buddhism', 'default mode network', '瞑想', 'マインドフルネス', '禅', '仏教'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-zafu',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'phone-lockbox',
    name: 'Time-Lock Phone Box',
    nameJa: '時限式スマホロックボックス',
    blurb: 'A lockable box that keeps a phone physically inaccessible for a set duration, for reducing compulsive checking.',
    blurbJa: '設定した時間はスマホを物理的に取り出せなくする、時限式のロックボックス。',
    category: 'digital-detox',
    matchKeywords: ['smartphone addiction', 'digital detox', 'attention', 'dopamine', 'focus', 'スマホ依存', 'デジタルデトックス'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-phone-lockbox',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'cold-plunge-basin',
    name: 'Portable Cold Plunge Basin',
    nameJa: '携帯用コールドプランジバス',
    blurb: 'A portable basin sized for at-home cold-water immersion sessions.',
    blurbJa: '自宅で冷水浴を行うためのサイズの、携帯用コールドプランジバス。',
    category: 'cold-exposure',
    matchKeywords: ['cold exposure', 'cold plunge', 'cortisol', 'resilience', 'recovery', '寒冷曝露'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-cold-plunge',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'omega-3-fish-oil',
    name: 'Omega-3 Fish Oil Capsules',
    nameJa: 'オメガ3フィッシュオイルサプリメント',
    blurb: 'A standard omega-3 (EPA/DHA) supplement, one of the more commonly studied nutrients in brain-health research.',
    blurbJa: '脳の健康に関する研究で比較的よく取り上げられる栄養素、オメガ3（EPA/DHA）のサプリメント。',
    category: 'nutrition',
    matchKeywords: ['nutrition', 'omega-3', 'brain health', 'neuroplasticity', 'bdnf', 'memory', '栄養'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-omega-3',
    network: 'amazon',
    disclosureRequired: true,
  },
  {
    id: 'gratitude-journal',
    name: 'Guided Gratitude Journal',
    nameJa: '感謝日記（ガイド付きジャーナル）',
    blurb: 'A structured daily journal with prompts for gratitude and reflection practice.',
    blurbJa: '感謝と内省の習慣づけのための、設問付きの日記帳。',
    category: 'gratitude-social',
    matchKeywords: ['gratitude', 'positive emotion', 'wellbeing', 'empathy', 'loneliness', 'social pain', 'connection', 'social brain', '感謝', '孤独'],
    imageUrl: '',
    affiliateUrl: 'https://example.com/REPLACE-WITH-AFFILIATE-LINK-gratitude-journal',
    network: 'amazon',
    disclosureRequired: true,
  },
];

/**
 * Picks the single best-matching product for an article, by keyword overlap
 * against the article's tags and title. Returns null when nothing matches —
 * callers must render nothing in that case (never show an unrelated product).
 */
export function matchProduct(tags: string[] = [], title = ''): Product | null {
  const haystack = [...tags.map(t => t.toLowerCase()), title.toLowerCase()];
  let best: Product | null = null;
  let bestScore = 0;

  for (const product of PRODUCTS) {
    let score = 0;
    for (const keyword of product.matchKeywords) {
      const k = keyword.toLowerCase();
      if (haystack.some(h => h.includes(k))) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = product;
    }
  }

  return bestScore > 0 ? best : null;
}

// ── Operator: adding a real affiliate link ──────────────────────────────
// 1. Find the product by `id` above.
// 2. Replace `affiliateUrl` with the real tracking link.
// 3. Set `network` to the correct program ('amazon' | 'rakuten' | 'a8' | 'other').
// 4. Optionally set `imageUrl` to a real product photo path (leave '' for
//    the neutral gradient placeholder).
// 5. Do NOT remove `disclosureRequired: true` — it gates the 広告/PR label
//    in RelatedProduct.astro and must stay true for every product.
