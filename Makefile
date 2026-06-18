POSTS_DIR  := src/content/posts/ja
PYONKI_DIR := $(HOME)/Workspace/ZENERA/pyonkichi369.github.io

.PHONY: dev build new link-note status release

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
# Runs: link-note → build → push dopaminelabtv → push pyonkichi369 → print X posts
release:
	@test -n "$(SLUG)" || (echo "ERROR: SLUG required." && exit 1)
	@test -n "$(NOTE_URL)" || (echo "ERROR: NOTE_URL required. Run after posting to note.com." && exit 1)
	@echo "▶ [1/4] note URL を記事に紐付け..."
	@$(MAKE) link-note SLUG=$(SLUG) NOTE_URL="$(NOTE_URL)" PRICE="$(PRICE)"
	@echo ""
	@echo "▶ [2/4] dopaminelabtv ビルド..."
	@npm run build
	@echo ""
	@echo "▶ [3/4] dopaminelabtv を push..."
	@git add -A && git commit -m "content(dl): publish $(SLUG) with note link" && git push || echo "  (変更なし or push 済み)"
	@echo ""
	@echo "▶ [4/4] pyonkichi369.com を push（変更があれば）..."
	@cd $(PYONKI_DIR) && git add -A && git commit -m "content: sync $(SLUG)" && git push 2>/dev/null || echo "  (変更なし)"
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
