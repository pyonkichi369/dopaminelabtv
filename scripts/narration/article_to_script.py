"""
DopamineLabTV — Article to Narration Script
Converts a markdown article to a YouTube narration script using Ollama (local, ¥0).

Usage:
    python article_to_script.py src/content/posts/ja/adhd-wa-kowareta-nou-dewa-nai.md
    python article_to_script.py src/content/posts/ja/adhd-wa-kowareta-nou-dewa-nai.md --out workspace/youtube/adhd/script.txt
"""
import argparse
import re
import sys
from pathlib import Path

import requests
import yaml


OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5:14b"

SCRIPT_SYSTEM_PROMPT = """あなたはYouTubeナレーション脚本家です。
以下のルールに従って、ブログ記事をYouTubeナレーション用スクリプトに変換してください。

ルール:
1. 話し言葉に変換する（「〜である」→「〜です」「〜だ」→「〜なんです」）
2. 1文を30文字以内に区切る（聴きやすいテンポ）
3. セクション見出しは読み上げず、自然な接続詞で繋ぐ
4. 冒頭30秒はフック（なぜ重要か、何が得られるか）
5. マークダウン記法を全て除去
6. 箇条書きは「まず...次に...そして...」のように読み上げに変換
7. 数字・統計は「約〜億」など丸める
8. 締めくくりは「チャンネル登録・高評価よろしくお願いします」を含めない
9. 純粋な話し言葉テキストのみ出力（コメント・記号不要）
10. 目安: 元記事の60〜70%の文字数
"""


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Extract YAML frontmatter and body from markdown."""
    if not content.startswith("---"):
        return {}, content
    end = content.find("---", 3)
    if end == -1:
        return {}, content
    try:
        meta = yaml.safe_load(content[3:end])
    except yaml.YAMLError:
        meta = {}
    body = content[end + 3:].strip()
    return meta or {}, body


def clean_markdown(text: str) -> str:
    """Strip markdown formatting for LLM input."""
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    text = re.sub(r"^[-*+]\s+", "・", text, flags=re.MULTILINE)
    text = re.sub(r"^\d+\.\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def generate_script_with_ollama(title: str, excerpt: str, body: str) -> str:
    """Use Ollama (local LLM) to convert article to narration script."""
    article_text = f"タイトル: {title}\n\n概要: {excerpt}\n\n本文:\n{clean_markdown(body)}"

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"{SCRIPT_SYSTEM_PROMPT}\n\n---\n\n{article_text}",
        "stream": False,
        "options": {"temperature": 0.7, "num_predict": 4096},
    }

    print(f"  Ollama ({OLLAMA_MODEL}) でスクリプト生成中...", file=sys.stderr)
    try:
        resp = requests.post(OLLAMA_URL, json=payload, timeout=120)
        resp.raise_for_status()
        return resp.json()["response"].strip()
    except requests.exceptions.ConnectionError:
        print("  ⚠️  Ollama未起動。フォールバック: マークダウン除去のみ", file=sys.stderr)
        return clean_markdown(body)


def article_to_script(article_path: Path) -> tuple[dict, str]:
    """Convert a markdown article to narration script. Returns (meta, script)."""
    content = article_path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(content)

    title = meta.get("title", article_path.stem)
    excerpt = meta.get("excerpt", "")

    print(f"📄 記事: {title}", file=sys.stderr)
    print(f"   文字数: {len(body):,}", file=sys.stderr)

    script = generate_script_with_ollama(title, excerpt, body)

    print(f"   スクリプト文字数: {len(script):,}", file=sys.stderr)
    return meta, script


def main():
    parser = argparse.ArgumentParser(description="Markdown article → narration script")
    parser.add_argument("article", type=Path, help="Path to .md article file")
    parser.add_argument("--out", type=Path, default=None, help="Output script path (default: stdout)")
    parser.add_argument("--no-llm", action="store_true", help="Skip LLM, just clean markdown")
    args = parser.parse_args()

    if not args.article.exists():
        print(f"Error: {args.article} not found", file=sys.stderr)
        sys.exit(1)

    content = args.article.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(content)

    if args.no_llm:
        script = clean_markdown(body)
    else:
        _, script = article_to_script(args.article)

    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(script, encoding="utf-8")
        print(f"✅ 保存: {args.out}", file=sys.stderr)
    else:
        print(script)


if __name__ == "__main__":
    main()
