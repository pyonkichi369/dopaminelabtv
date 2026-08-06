# dopaminelabtv — Session Handoff

## Last Session
date: 2026-07-03
summary: The Dopamine Times（週刊研究紙）実装 + 死んだnoteリンク除去 + ビルド修復

## Completed
- [x] The Dopamine Times 実装: `src/content/times/` + `/times` アーカイブ + `/times/vol-NNN` 号面（新聞デザイン、7セクション固定）
- [x] 収益スタック: Bookshelf アフィリエイト枠（PR表記+nofollow sponsored）+ note CTA（メール取得フォームは廃止済み）
- [x] 配線: ナビ/フッター/トップ最新号モジュール/rss-ja/sitemap/JSON-LD (CreativeWorkSeries)
- [x] Makefile: `make times-new`（Vol自動採番）/ `make times-release VOL=NNN`（draft解除→build→push→X告知3本）
- [x] 死んだnoteリンク2本を除去（2026-06-20のnote全記事削除で404化していた: kyuka-ga-nou-wo-kaifuku-shinai-riyu, naze-shuchu-dekinai）
- [x] ビルド修復: 未使用の @astrojs/sitemap 統合を削除（Astro 4非互換でexit 1、robots.txtは手書きsitemap.xml.tsを参照）→ exit 0
- [x] vol-001.md 作成済み（draft: true、7セクションFILLスケルトン、date 2026-07-05）

## Deploy Incident (resolved 2026-07-03)
- 本番が2026-05-15から7週間凍結していた。原因2つ: (1) 5/15導入の @astrojs/sitemap がAstro 4非互換で全ビルド失敗 (2) 6/18以降の作業がmasterに積まれたがワークフローはmainのみ監視
- 修正: sitemap統合削除 + deploy.yml trigger を [main, master] に + Pages environment 保護ルールに master 追加（gh api）
- 教訓: pushしたら `gh run list` でデプロイ成功まで確認する。緑になるまで「公開済み」と言わない
- デプロイ済み: 4コミット（og/fix(site)/feat(times)/fix(deploy)）。/times/ 本番200確認、6月記事も初めて公開された

## Completed (追加 2026-07-03)
- [x] 疲労係数チェック `/ja/fatigue/` 本番公開 — 厚労省チェックリスト準拠13問、係数0-100、4段階判定+記事レコメンド、localStorage履歴(前回比+トレンドバー)、毎週日曜Times連動再測定導線、GA4 quiz_id=fatigue_keisu_ja
- [x] EN版 `/fatigue/` 本番公開 — 日英で履歴共有(同一localStorageキー)、hreflangペア自動生成、相互リンク、GA4 quiz_id=fatigue_keisu_en。※ENはルート直下(/en/プレフィックスは存在しない構造)
- [x] ドーパミン負債スコア `/ja/dopamine-debt/` + `/dopamine-debt/` 本番公開 — 「刺激の前借り」メタファー13問、SAS-SV参考の編集部チェックと正直に開示、疲労係数と相互リンク、トップは2項目の測定メニュー化
- [x] SNS共有ブロック（ShareBlock.astro）本番公開 — Web Share API(モバイル)+X/LINE/Threads/コピーの統一UI。4測定結果画面+記事フッター(PostLayout、両言語)+Times号面に配線。**判断: 記事フッターの旧LinkedIn/Pinterest共有UIをShareBlockに統一で置換（operator未確認、要望あれば復元可）**
- [x] サウンドラボ `/ja/sound/` + `/sound/` 本番公開 — ブラウザ内Web Audio API生成(音声ファイル¥0): ピンク/ブラウン/ホワイトノイズ+バイノーラルビート4種(深い眠り/リラックス/静かな集中/40Hzフォーカス)。エビデンス階層を正直表示(中程度/限定的、PubMed検索リンクのみで個別PMID未引用)、バイノーラルはヘッドホン必須バッジ、スリープタイマー(15/30/60/90分)、iOS向けジェスチャー起動のAudioContext

## Pending
- [ ] Vol.001 コンテンツ制作（7/4土ドラフト → 7/5日 `make times-release VOL=001`）— Experimentセクションで疲労係数の再測定を課題にすると連動する
- [ ] Amazonアソシエイト審査申請（operator作業。それまでBookshelfはA8/楽天リンクで運用可）
- [ ] note記事の再公開に合わせて `make link-note` で1本ずつ再配線（note側は6/20全削除で現在0本 — 配線対象が存在しない）
- [ ] Phase 2: 土曜cronでドラフト自動生成（AEGIS側、Vol.002までに）
- [ ] シリーズ再分類（48記事中4本しかシリーズ登録なし — 低コストのリピート施策）

## Next Recommended Action
7/4にVol.001ドラフト制作 → 7/5 `make times-release VOL=001` で創刊

## Key Notes
- **Stack**: Astro + MDX, `src/content/posts/ja/`, Times: `src/content/times/`
- **Role**: Brand Layer — pyonkichi369 の知見を脳科学/禅/密教でリフレーム
- **Funnel**: X discovery → note (¥500/¥980) → dopaminelabtv.com hub。Times = 毎週日曜のリピート装置 + 号末収益枠
- **CTA先**: dopaminelabtv.com のみ（Gumroad 直リンク禁止）
- **Times原則**: 全ての数字・主張に出典必須（出典なし項目は落とす）。広告はアフィリエイト/スポンサー枠のみ、AdSense非推奨（ブランド矛盾+収益性なし）
- **注意**: 前セッション由来の未コミット変更あり（Makefile pyonkichi除去 + public/og/ PNG再生成）
