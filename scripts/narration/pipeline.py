"""
DopamineLabTV — Full Narration Pipeline
Article .md → Script → F5-TTS Audio → Subtitles → render-ready directory

Usage:
    # Quick test (edge-tts, no reference needed)
    python pipeline.py src/content/posts/ja/adhd-wa-kowareta-nou-dewa-nai.md

    # Production (F5-TTS with your voice)
    python pipeline.py src/content/posts/ja/adhd-wa-kowareta-nou-dewa-nai.md \\
        --voice-ref ~/my-voice-sample.wav \\
        --voice-ref-text "こんにちは。私の名前はドーパミンラボです。" \\
        --subtitles

    # Skip LLM script gen (use existing script)
    python pipeline.py --script workspace/youtube/adhd/script.txt \\
        --voice-ref ~/my-voice-sample.wav

Output structure:
    workspace/youtube/<slug>/
        script.txt          Narration script
        narration.wav       F5-TTS audio (WAV)
        narration.mp3       MP3 (for render.py)
        narration.srt       SRT subtitles
        narration.vtt       VTT subtitles
        render.py           → copy from template, edit TITLE/SUBTITLE
"""
import argparse
import re
import shutil
import sys
from pathlib import Path

# Path setup
DLTV_ROOT = Path(__file__).parent.parent.parent
SCRIPTS_DIR = Path(__file__).parent
RENDER_TEMPLATE = DLTV_ROOT / "workspace/youtube/yt-long_law-of-attraction/render.py"


def slugify(title: str) -> str:
    """Convert title to URL-safe slug."""
    slug = re.sub(r"[^\w\s-]", "", title.lower())
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug[:50] or "video"


def create_render_py(out_dir: Path, title: str, slug: str):
    """Copy render.py template and patch TITLE variable."""
    if not RENDER_TEMPLATE.exists():
        print("  ⚠️  render.py テンプレート未発見。手動でコピーしてください", file=sys.stderr)
        return

    render_src = RENDER_TEMPLATE.read_text(encoding="utf-8")
    # Patch TITLE constant
    render_src = re.sub(
        r'^TITLE\s*=\s*".*?"',
        f'TITLE = "{title}"',
        render_src,
        flags=re.MULTILINE,
    )
    render_out = out_dir / "render.py"
    render_out.write_text(render_src, encoding="utf-8")
    print(f"  ✅ render.py: {render_out}", file=sys.stderr)


def run_pipeline(
    article_path: Path | None,
    script_path: Path | None,
    voice_ref: Path | None,
    voice_ref_text: str,
    subtitles: bool,
    out_dir: Path | None,
    no_llm: bool,
):
    # --- Determine output directory ---
    if out_dir is None:
        if article_path:
            import yaml
            content = article_path.read_text(encoding="utf-8")
            slug = article_path.stem
            out_dir = DLTV_ROOT / "workspace" / "youtube" / f"yt-long_{slug}"
        elif script_path:
            out_dir = script_path.parent
        else:
            print("Error: --article or --script required", file=sys.stderr)
            sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"\n🎬 DopamineLabTV ナレーションパイプライン", file=sys.stderr)
    print(f"   出力: {out_dir}", file=sys.stderr)

    # --- Step 1: Article → Script ---
    final_script = out_dir / "script.txt"

    if script_path and script_path.exists():
        shutil.copy2(script_path, final_script)
        print(f"\n[1/3] スクリプト: {script_path} (既存使用)", file=sys.stderr)
    elif article_path:
        print(f"\n[1/3] 記事 → スクリプト変換", file=sys.stderr)
        sys.path.insert(0, str(SCRIPTS_DIR))
        from article_to_script import article_to_script, parse_frontmatter

        content = article_path.read_text(encoding="utf-8")
        meta, _ = parse_frontmatter(content)
        title = meta.get("title", article_path.stem)

        if no_llm:
            from article_to_script import clean_markdown, parse_frontmatter as pf
            _, body = pf(content)
            script_text = clean_markdown(body)
        else:
            _, script_text = article_to_script(article_path)

        final_script.write_text(script_text, encoding="utf-8")
        print(f"   スクリプト保存: {final_script}", file=sys.stderr)

        # Create render.py from template
        create_render_py(out_dir, title, article_path.stem)
    else:
        print("Error: --article または --script を指定してください", file=sys.stderr)
        sys.exit(1)

    # --- Step 2: Script → Audio ---
    print(f"\n[2/3] スクリプト → 音声生成", file=sys.stderr)

    tts_args = [sys.executable, str(SCRIPTS_DIR / "tts_f5.py"), str(final_script)]

    if voice_ref and voice_ref.exists():
        print(f"   モード: F5-TTS (参照音声: {voice_ref.name})", file=sys.stderr)
        tts_args += ["--ref", str(voice_ref), "--ref-text", voice_ref_text]
    else:
        print("   モード: edge-tts (フォールバック)", file=sys.stderr)
        tts_args.append("--use-edge")

    if subtitles:
        tts_args.append("--subtitles")

    tts_args += ["--out-dir", str(out_dir)]

    import subprocess
    result = subprocess.run(tts_args)
    if result.returncode != 0:
        print("  ❌ 音声生成失敗", file=sys.stderr)
        sys.exit(1)

    # --- Step 3: Summary ---
    print(f"\n[3/3] 完了サマリー", file=sys.stderr)
    for f in ["script.txt", "narration.wav", "narration.mp3", "narration.srt", "narration.vtt", "render.py"]:
        p = out_dir / f
        status = "✅" if p.exists() else "⬜"
        size = f" ({p.stat().st_size // 1024}KB)" if p.exists() else ""
        print(f"   {status} {f}{size}", file=sys.stderr)

    print(f"\n🚀 次のステップ:", file=sys.stderr)
    print(f"   cd {out_dir}", file=sys.stderr)
    print(f"   # render.py の TITLE 変数を確認して実行:", file=sys.stderr)
    print(f"   python render.py", file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(description="DopamineLabTV full narration pipeline")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--article", type=Path, help="Source .md article file")
    group.add_argument("--script", type=Path, help="Existing narration script .txt")

    # Positional shortcut: pipeline.py article.md
    parser.add_argument("positional_article", nargs="?", type=Path, default=None)

    parser.add_argument("--voice-ref", type=Path, default=None, help="Reference voice .wav")
    parser.add_argument("--voice-ref-text", default="", help="Transcript of reference audio")
    parser.add_argument("--subtitles", action="store_true", help="Generate SRT/VTT")
    parser.add_argument("--out-dir", type=Path, default=None)
    parser.add_argument("--no-llm", action="store_true", help="Skip Ollama, just clean markdown")
    parser.add_argument("--use-edge", action="store_true", help="Force edge-tts (no voice ref needed)")

    args = parser.parse_args()

    article = args.article or args.positional_article

    run_pipeline(
        article_path=article,
        script_path=args.script,
        voice_ref=None if args.use_edge else args.voice_ref,
        voice_ref_text=args.voice_ref_text,
        subtitles=args.subtitles,
        out_dir=args.out_dir,
        no_llm=args.no_llm,
    )


if __name__ == "__main__":
    main()
