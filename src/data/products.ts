// Research-contextual product catalog.
//
// Each article's tags are matched against `matchKeywords` to surface ONE
// contextually relevant product (never a random or unrelated one). If no
// product scores a match, the calling layout renders nothing — this file
// has no concept of a "default" product.
//
// REAL A8.net CATALOG (2026-07-12): programs below are drawn from the
// operator's approved A8.net affiliate program export (328 programs,
// programs_a18030633481_20260712003018.csv). Only programs that genuinely
// relate to a neuroscience/health topic on the site were selected — most
// of the 328 (job-change agents, VPS hosting, fortune telling, points
// sites, etc.) do not belong here and were excluded.
//
// `affiliateUrl` is still a placeholder: "A8-PASTE-LINK:<programId>". The
// operator finds the program by `programId` in the A8.net dashboard and
// replaces the placeholder with the real px.a8.net tracking link. See the
// README note at the bottom of this file.

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
  /** PLACEHOLDER — operator replaces with the real A8.net tracking link for this programId. */
  affiliateUrl: string;
  network: 'amazon' | 'rakuten' | 'a8' | 'other';
  /** A8.net プログラムID — lets the operator find the program in the A8 dashboard. */
  programId: string;
  disclosureRequired: true;
}

export const PRODUCTS: Product[] = [
  {
    id: 'totonoe-light-circadian-alarm',
    name: 'Totonoe Light Plain (Light Therapy Alarm Clock)',
    nameJa: '光目覚まし時計 トトノエライトプレーン',
    blurb: 'A light-emitting alarm clock designed to simulate sunrise and help regulate the body\'s wake-sleep rhythm.',
    blurbJa: '日の出のような光で体内時計・生活リズムを整えることを目的とした光目覚まし時計。',
    category: 'sleep-circadian',
    matchKeywords: ['circadian', '概日リズム', '体内時計', '光目覚まし', '起床', '朝', 'morning', 'circadian rhythm', 'wake up'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000011588036',
    network: 'a8',
    programId: 's00000011588036',
    disclosureRequired: true,
  },
  {
    id: 'awarefy-mental-care-app',
    name: 'Awarefy (Mental Care App)',
    nameJa: 'Awarefy（アウェアファイ）',
    blurb: 'A mental-care app with over 1 million downloads, offering mood tracking, journaling, and CBT-based self-help exercises.',
    blurbJa: '100万ダウンロード突破のメンタルケアアプリ。気分の記録・日記・認知行動療法（CBT）に基づくセルフケア機能を提供する。',
    category: 'stress-mental-care',
    matchKeywords: ['stress', 'anxiety', 'mindfulness', 'mood', 'journaling', 'gratitude', 'anger', 'emotion regulation', 'ストレス', '不安', 'マインドフルネス', '瞑想', '感情調節', '怒り', '感謝', '日記'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000024926001',
    network: 'a8',
    programId: 's00000024926001',
    disclosureRequired: true,
  },
  {
    id: 'kimochi-online-counseling',
    name: 'Kimochi (Online Psychological Counseling)',
    nameJa: 'Kimochi オンライン心理カウンセリング',
    blurb: 'An online counseling platform staffed exclusively by licensed clinical psychologists (公認心理師).',
    blurbJa: '国家資格「公認心理師」のみが登録するオンライン心理カウンセリングサービス。',
    category: 'stress-counseling',
    matchKeywords: ['counseling', 'burnout', 'anxiety', 'therapy', 'loneliness', 'カウンセリング', '燃え尽き', '不安', 'ストレス', '孤独'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000026504001',
    network: 'a8',
    programId: 's00000026504001',
    disclosureRequired: true,
  },
  {
    id: 'soelu-online-yoga',
    name: 'SOELU (Online Yoga & Fitness)',
    nameJa: 'SOELU（ソエル）',
    blurb: 'A live, instructor-led online yoga and fitness platform taken from home.',
    blurbJa: '自宅からライブ受講できる、インストラクター主導のオンラインヨガ・フィットネスサービス。',
    category: 'exercise-bdnf',
    matchKeywords: ['exercise', 'bdnf', 'neuroplasticity', 'yoga', '運動', 'ヨガ', '神経可塑性'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000020569001',
    network: 'a8',
    programId: 's00000020569001',
    disclosureRequired: true,
  },
  {
    id: 'lava-hot-yoga-studio',
    name: 'Hot Yoga Studio LAVA',
    nameJa: 'ホットヨガスタジオLAVA',
    blurb: 'A nationwide hot yoga studio chain offering trial sessions.',
    blurbJa: '全国展開するホットヨガスタジオチェーン。体験レッスンを提供。',
    category: 'exercise-stress',
    matchKeywords: ['exercise', 'yoga', '運動', 'ヨガ'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000007809001',
    network: 'a8',
    programId: 's00000007809001',
    disclosureRequired: true,
  },
  {
    id: 'rizap-private-gym',
    name: 'RIZAP (Private Personal Training Gym)',
    nameJa: 'RIZAP（ライザップ）',
    blurb: 'A private personal-training gym program with one-on-one coaching.',
    blurbJa: 'マンツーマン指導によるプライベートジムのパーソナルトレーニングプログラム。',
    category: 'exercise-bdnf',
    matchKeywords: ['exercise', 'bdnf', 'depression', 'neuroplasticity', '運動', '筋トレ', 'うつ病', '神経可塑性'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000015695001',
    network: 'a8',
    programId: 's00000015695001',
    disclosureRequired: true,
  },
  {
    id: 'naturecan-fitness-protein',
    name: 'Naturecan Fitness Protein',
    nameJa: 'Naturecan（ネイチャーカン）フィットネスプロテイン',
    blurb: 'A protein supplement product line from Naturecan, aimed at post-exercise nutrition.',
    blurbJa: '運動後の栄養補給を目的とした、Naturecanのプロテイン・サプリメント商品ライン。',
    category: 'exercise-nutrition',
    matchKeywords: ['exercise', 'nutrition', 'protein', '運動', '栄養', 'プロテイン'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000022232001',
    network: 'a8',
    programId: 's00000022232001',
    disclosureRequired: true,
  },
  {
    id: 'megumi-no-lutein',
    name: 'Megumi no Lutein 30 (Lutein Supplement)',
    nameJa: 'めぐみのルテイン30',
    blurb: 'A subscription lutein supplement marketed for eye strain and blurred/tired vision.',
    blurbJa: '目のかすみ・ぼやけ・疲労感に向けた、ルテイン配合の定期便サプリメント。',
    category: 'focus-attention',
    matchKeywords: ['focus', 'eye strain', 'screen fatigue', '集中力', '目の疲れ', 'スクリーン', '目'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000010234015',
    network: 'a8',
    programId: 's00000010234015',
    disclosureRequired: true,
  },
  {
    id: 'teals-epsom-salt-bath',
    name: "Tea'lets Epsom Salt Bath Soak",
    nameJa: 'ティールズ エプソムソルト',
    blurb: 'A US-origin Epsom salt bath product marketed for physical and mental unwinding during bath time.',
    blurbJa: 'アメリカ生まれのエプソムソルト。心身をゆるめるバスタイムを目的とした入浴剤。',
    category: 'stress-recovery',
    matchKeywords: ['stress', 'recovery', 'relaxation', 'bath', 'magnesium', 'ストレス', '疲労回復', 'リラックス', '入浴'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000020835003',
    network: 'a8',
    programId: 's00000020835003',
    disclosureRequired: true,
  },
  {
    id: 'mykinso-gut-flora-test',
    name: 'Mykinso (At-Home Gut Microbiome Test)',
    nameJa: 'マイキンソー（Mykinso）',
    blurb: 'An at-home gut microbiome (flora) testing kit, one of the largest such services in Japan.',
    blurbJa: '国内最大級の、自宅でできる腸内フローラ検査キット。',
    category: 'nutrition-gut-brain',
    matchKeywords: ['microbiome', 'gut-brain axis', 'gut microbiome', 'gut flora', '腸内フローラ', '腸活', 'セロトニン', '腸脳相関'],
    imageUrl: '',
    affiliateUrl: 'A8-PASTE-LINK:s00000027011001',
    network: 'a8',
    programId: 's00000027011001',
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
// 1. Find the product by `programId` below (matches the プログラムID column
//    in your A8.net program export / dashboard).
// 2. In the A8.net dashboard, generate the ad's tracking link (通常リンク)
//    for that program.
// 3. Replace `affiliateUrl` — currently "A8-PASTE-LINK:<programId>" — with
//    the real px.a8.net link.
// 4. `network` is already 'a8' for every product in this file.
// 5. Optionally set `imageUrl` to a real product photo path (leave '' for
//    the neutral gradient placeholder).
// 6. Do NOT remove `disclosureRequired: true` — it gates the 広告/PR label
//    in RelatedProduct.astro and must stay true for every product.
// 7. `mykinso-gut-flora-test` does not currently match any live article's
//    tags (no gut-brain-axis article exists yet) — it was kept because gut
//    microbiome / serotonin is a legitimate neuroscience topic and a likely
//    future article subject. It will start surfacing automatically once an
//    article is tagged with matching keywords (see matchKeywords above).
