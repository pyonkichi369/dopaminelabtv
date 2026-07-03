POSTS_DIR  := src/content/posts/ja
TIMES_DIR  := src/content/times

.PHONY: dev build new link-note status release times-new times-release

dev:
	npm run dev

build:
	npm run build

# make new SLUG=asa-no-zen TITLE="朝の禅ルーティン"
new:
	@test -n "$(SLUG)" || (echo "ERROR: SLUG required." && exit 1)
	@test -n "$(TITLE)" || (echo "ERROR: TITLE required." && exit 1)
	@FILE=$(POSTS_DIR)/$(SLUG).md; \
	test ! -f $$FILE || (echo "ERROR: $$FILE already exists" && exit 1); \
	printf -- '---\ntitle: "%s"\ndate: "%s"\nexcerpt: ""\ntags: []\nreadTime: 5\nnoteUrl: ""\nnotePrice:\n---\n\n本文をここに書く。\n' "$(TITLE)" "$$(date +%Y-%m-%d)" > $$FILE; \
	echo "Created: $$FILE"

# make link-note SLUG=asa-no-zen NOTE_URL="https://note.com/dopaminelabtv/n/xxx" PRICE=500
link-note:
	@test -n "$(SLUG)" || (echo "ERROR: SLUG required." && exit 1)
	@test -n "$(NOTE_URL)" || (echo "ERROR: NOTE_URL required." && exit 1)
	@FILE=$(POSTS_DIR)/$(SLUG).md; \
	test -f $$FILE || (echo "ERROR: $$FILE not found" && exit 1); \
	sed -i '' 's|noteUrl: ""|noteUrl: "$(NOTE_URL)"|' $$FILE; \
	if [ -n "$(PRICE)" ]; then sed -i '' 's|notePrice:|notePrice: $(PRICE)|' $$FILE; fi; \
	echo "Linked: $(SLUG) → $(NOTE_URL)"

# make release SLUG=asa-no-zen NOTE_URL="https://note.com/..." PRICE=500
# Runs: link-note → build → push dopaminelabtv → print X posts
# NOTE: pyonkichi369 is a separate independent site — not pushed here
release:
	@test -n "$(SLUG)" || (echo "ERROR: SLUG required." && exit 1)
	@test -n "$(NOTE_URL)" || (echo "ERROR: NOTE_URL required. Run after posting to note.com." && exit 1)
	@echo "▶ [1/3] note URL を記事に紐付け..."
	@$(MAKE) link-note SLUG=$(SLUG) NOTE_URL="$(NOTE_URL)" PRICE="$(PRICE)"
	@echo ""
	@echo "▶ [2/3] dopaminelabtv ビルド..."
	@npm run build
	@echo ""
	@echo "▶ [3/3] dopaminelabtv を push..."
	@git add -A && git commit -m "content(dl): publish $(SLUG) with note link" && git push || echo "  (変更なし or push 済み)"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✅ デプロイ完了"
	@echo ""
	@TITLE=$$(grep '^title:' $(POSTS_DIR)/$(SLUG).md | sed 's/title: *//;s/"//g'); \
	URL="https://note.com/dopaminelabtv"; \
	echo "📣 X 投稿3本セット（コピペ用）"; \
	echo ""; \
	echo "【①公開日】"; \
	echo ""; \
	echo "$$TITLE"; \
	echo ""; \
	echo "この記事を書いて、はじめて言語化できたことがある。"; \
	echo ""; \
	echo "有料版はこちら → $$URL"; \
	echo ""; \
	echo "---"; \
	echo "【②翌日】"; \
	echo ""; \
	echo "昨日の記事から1文だけ引用する。"; \
	echo ""; \
	echo "→ note で全文: $$URL"; \
	echo ""; \
	echo "---"; \
	echo "【③3日後】"; \
	echo ""; \
	echo "「$$TITLE」を読んだ人から反応をもらった。"; \
	echo ""; \
	echo "実際に試してみた話を補足する。"; \
	echo "→ $$URL"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Pipeline status
status:
	@echo "=== note link あり ==="; \
	grep -rl 'noteUrl: "https' $(POSTS_DIR)/ 2>/dev/null | xargs -I{} basename {} .md || echo "  (none)"; \
	echo ""; \
	echo "=== note link なし ==="; \
	grep -rl 'noteUrl: ""' $(POSTS_DIR)/ 2>/dev/null | xargs -I{} basename {} .md || echo "  (none)"

# make times-new — creates the next The Dopamine Times issue skeleton (auto-increments Vol)
times-new:
	@mkdir -p $(TIMES_DIR); \
	LAST=$$(ls $(TIMES_DIR)/vol-*.md 2>/dev/null | sed 's/.*vol-0*\([0-9]*\)\.md/\1/' | sort -n | tail -1); \
	NEXT=$$(( $${LAST:-0} + 1 )); \
	VOL=$$(printf "%03d" $$NEXT); \
	FILE=$(TIMES_DIR)/vol-$$VOL.md; \
	test ! -f $$FILE || (echo "ERROR: $$FILE already exists" && exit 1); \
	printf -- '---\nvol: %d\ndate: "%s"\ntitle: ""\nexcerpt: ""\ndraft: true\nnoteUrl: ""\nbookTitle: ""\nbookUrl: ""\n---\n\n## 今週の脳\n\n<!-- FILL: 出典付きの統計を1つ（研究名・数値・出典リンク） -->\n\n## Research\n\n<!-- FILL: 論文1本 — PubMedリンク＋3行要約 -->\n\n## Attention Risk\n\n<!-- FILL: 今週のSNS・アプリの仕様変更を1つ、神経科学の視点で解説 -->\n\n## Dopamine News\n\n<!-- FILL: 出典リンク付きの見出しを3本（箇条書き） -->\n\n## Experiment\n\n<!-- FILL: 今週の行動実験の内容＋先週の実験結果の報告 -->\n\n## Bookshelf\n\n<!-- FILL: 今週の一冊の紹介文（書名・著者・推薦理由）。frontmatterの bookTitle / bookUrl にも反映すること -->\n\n## 編集後記\n\n<!-- FILL: 編集後記 -->\n' "$$NEXT" "$$(date +%Y-%m-%d)" > $$FILE; \
	echo "Created: $$FILE"

# make times-release VOL=001 — publishes an issue: draft:false → build → commit → push → prints X announcement
times-release:
	@test -n "$(VOL)" || (echo "ERROR: VOL required (e.g. VOL=001)." && exit 1)
	@FILE=$(TIMES_DIR)/vol-$(VOL).md; \
	test -f $$FILE || (echo "ERROR: $$FILE not found" && exit 1); \
	echo "▶ [1/3] draft: false に切り替え..."; \
	sed -i '' 's/draft: true/draft: false/' $$FILE; \
	echo ""; \
	echo "▶ [2/3] dopaminelabtv ビルド..."; \
	npm run build; \
	echo ""; \
	echo "▶ [3/3] dopaminelabtv を push..."; \
	git add -A && git commit -m "content(times): publish The Dopamine Times Vol.$(VOL)" && git push || echo "  (変更なし or push 済み)"; \
	echo ""; \
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
	echo "✅ デプロイ完了"; \
	echo ""; \
	TITLE=$$(grep '^title:' $$FILE | sed 's/title: *//;s/"//g'); \
	URL="https://dopaminelabtv.com/times/vol-$(VOL)"; \
	echo "📣 X 投稿3本セット（コピペ用）"; \
	echo ""; \
	echo "【①創刊号公開】"; \
	echo ""; \
	echo "The Dopamine Times Vol.$(VOL) 公開。"; \
	echo "$$TITLE"; \
	echo ""; \
	echo "脳とドーパミンの週刊研究紙、毎週配信。"; \
	echo "→ $$URL"; \
	echo ""; \
	echo "---"; \
	echo "【②翌日】"; \
	echo ""; \
	echo "今週号から1本だけ引用する。"; \
	echo ""; \
	echo "→ 全文はこちら: $$URL"; \
	echo ""; \
	echo "---"; \
	echo "【③3日後】"; \
	echo ""; \
	echo "今週号の「Experiment」セクション、実際に試した人の反応。"; \
	echo ""; \
	echo "→ $$URL"; \
	echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
