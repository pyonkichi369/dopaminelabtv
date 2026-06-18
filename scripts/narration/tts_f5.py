"""
DopamineLabTV — F5-TTS Narration Generator
Converts a narration script to high-quality audio using F5-TTS (local, ¥0).

Falls back to edge-tts when no reference voice is provided.

Usage:
    # With custom voice (recommended — voice cloning)
    python tts_f5.py script.txt --ref my-voice.wav --ref-text "参照音声のテキスト"

    # Fallback: edge-tts (no reference needed)
    python tts_f5.py script.txt --use-edge

    # Full pipeline with whisperx subtitles
    python tts_f5.py script.txt --ref voice.wav --ref-text "テキスト" --subtitles

Output (in same directory as script or --out-dir):
    narration.wav       F5-TTS audio
    narration.mp3       MP3 (for render.py compatibility)
    narration.srt       SRT subtitles
    narration.vtt       VTT subtitles
"""
import argparse
import asyncio
import subprocess
import sys
from pathlib import Path


def split_into_chunks(text: str, max_chars: int = 150) -> list[str]:
    """Split narration text into F5-TTS-friendly chunks (max ~150 chars each)."""
    sentences = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        # Split on sentence-ending punctuation
        import re
        parts = re.split(r"(?<=[。！？\.\!\?])", line)
        for p in parts:
            p = p.strip()
            if p:
                sentences.append(p)

    # Merge short sentences into chunks
    chunks = []
    current = ""
    for s in sentences:
        if len(current) + len(s) <= max_chars:
            current = (current + s) if current else s
        else:
            if current:
                chunks.append(current)
            current = s
    if current:
        chunks.append(current)
    return chunks


def generate_f5tts(
    script_path: Path,
    ref_audio: Path,
    ref_text: str,
    out_dir: Path,
) -> Path:
    """Generate narration using F5-TTS with voice cloning."""
    text = script_path.read_text(encoding="utf-8").strip()
    chunks = split_into_chunks(text)

    print(f"  F5-TTS: {len(chunks)} チャンク生成中...", file=sys.stderr)

    chunk_wavs = []
    for i, chunk in enumerate(chunks):
        chunk_wav = out_dir / f"_chunk_{i:03d}.wav"
        cmd = [
            "f5-tts_infer-cli",
            "--model", "F5TTS_v1_Base",
            "--ref_audio", str(ref_audio),
            "--ref_text", ref_text,
            "--gen_text", chunk,
            "--output_dir", str(out_dir),
            "--output_file", chunk_wav.name,
            "--remove_silence",
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  ⚠️  chunk {i} 失敗: {result.stderr[:100]}", file=sys.stderr)
            continue
        if chunk_wav.exists():
            chunk_wavs.append(chunk_wav)
        print(f"  [{i+1}/{len(chunks)}] {chunk[:30]}...", file=sys.stderr)

    if not chunk_wavs:
        raise RuntimeError("F5-TTS: 全チャンク生成失敗")

    # Concatenate all chunks
    out_wav = out_dir / "narration.wav"
    if len(chunk_wavs) == 1:
        chunk_wavs[0].rename(out_wav)
    else:
        # Use ffmpeg to concatenate
        list_file = out_dir / "_concat_list.txt"
        list_file.write_text(
            "\n".join(f"file '{p.name}'" for p in chunk_wavs), encoding="utf-8"
        )
        subprocess.run(
            ["ffmpeg", "-y", "-f", "concat", "-safe", "0",
             "-i", str(list_file), "-c", "copy", str(out_wav)],
            check=True, capture_output=True,
        )
        list_file.unlink(missing_ok=True)
        for w in chunk_wavs:
            w.unlink(missing_ok=True)

    print(f"  ✅ F5-TTS 音声: {out_wav}", file=sys.stderr)
    return out_wav


async def generate_edge_tts(script_path: Path, out_dir: Path) -> Path:
    """Fallback: edge-tts (online, no reference needed, free)."""
    import edge_tts

    text = script_path.read_text(encoding="utf-8").strip()
    out_mp3 = out_dir / "narration.mp3"
    out_vtt = out_dir / "narration.vtt"

    print("  edge-tts (フォールバック) で生成中...", file=sys.stderr)
    communicate = edge_tts.Communicate(text, voice="ja-JP-NanamiNeural", rate="+5%")
    sub = edge_tts.SubMaker()

    with open(out_mp3, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] in ("WordBoundary", "SentenceBoundary"):
                sub.feed(chunk)

    # Convert SRT → VTT (edge-tts 7.x returns SRT format only)
    srt = sub.get_srt()
    import re as _re
    vtt_lines = ["WEBVTT", ""]
    for block in srt.strip().split("\n\n"):
        lines = block.strip().splitlines()
        if len(lines) >= 3:
            # Skip sequence number (lines[0]), keep timestamp + text
            ts = lines[1].replace(",", ".")
            vtt_lines.append(ts)
            vtt_lines.extend(lines[2:])
            vtt_lines.append("")
    out_vtt.write_text("\n".join(vtt_lines), encoding="utf-8")
    print(f"  ✅ edge-tts 音声: {out_mp3}", file=sys.stderr)
    return out_mp3


def wav_to_mp3(wav_path: Path) -> Path:
    """Convert WAV to MP3 for render.py compatibility."""
    mp3_path = wav_path.with_suffix(".mp3")
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(wav_path), "-codec:a", "libmp3lame", "-q:a", "2", str(mp3_path)],
        check=True, capture_output=True,
    )
    print(f"  ✅ MP3変換: {mp3_path}", file=sys.stderr)
    return mp3_path


def generate_subtitles_whisperx(audio_path: Path, out_dir: Path) -> tuple[Path, Path]:
    """Generate SRT/VTT subtitles using WhisperX (local, high accuracy)."""
    try:
        import whisperx
    except ImportError:
        print("  ⚠️  whisperx未インストール。字幕生成をスキップ", file=sys.stderr)
        return None, None

    print("  WhisperX で字幕生成中 (初回はモデルDL)...", file=sys.stderr)
    import torch
    device = "mps" if torch.backends.mps.is_available() else "cpu"

    model = whisperx.load_model("large-v2", device, compute_type="float32", language="ja")
    audio = whisperx.load_audio(str(audio_path))
    result = model.transcribe(audio, batch_size=8, language="ja")

    # Align
    model_a, metadata = whisperx.load_align_model(language_code="ja", device=device)
    result = whisperx.align(result["segments"], model_a, metadata, audio, device)

    # Write SRT
    srt_path = out_dir / "narration.srt"
    vtt_path = out_dir / "narration.vtt"

    _write_srt(result["segments"], srt_path)
    _write_vtt(result["segments"], vtt_path)

    print(f"  ✅ 字幕: {srt_path}", file=sys.stderr)
    return srt_path, vtt_path


def _format_time_srt(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _format_time_vtt(seconds: float) -> str:
    return _format_time_srt(seconds).replace(",", ".")


def _write_srt(segments: list, path: Path):
    lines = []
    for i, seg in enumerate(segments, 1):
        lines.append(str(i))
        lines.append(f"{_format_time_srt(seg['start'])} --> {_format_time_srt(seg['end'])}")
        lines.append(seg["text"].strip())
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def _write_vtt(segments: list, path: Path):
    lines = ["WEBVTT", ""]
    for seg in segments:
        lines.append(f"{_format_time_vtt(seg['start'])} --> {_format_time_vtt(seg['end'])}")
        lines.append(seg["text"].strip())
        lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Script → narration audio + subtitles")
    parser.add_argument("script", type=Path, help="Narration script .txt file")
    parser.add_argument("--ref", type=Path, default=None, help="Reference voice .wav (for F5-TTS)")
    parser.add_argument("--ref-text", default="", help="Transcript of reference audio")
    parser.add_argument("--use-edge", action="store_true", help="Force edge-tts fallback")
    parser.add_argument("--subtitles", action="store_true", help="Generate SRT/VTT with WhisperX")
    parser.add_argument("--out-dir", type=Path, default=None, help="Output directory (default: script dir)")
    args = parser.parse_args()

    if not args.script.exists():
        print(f"Error: {args.script} not found", file=sys.stderr)
        sys.exit(1)

    out_dir = args.out_dir or args.script.parent
    out_dir.mkdir(parents=True, exist_ok=True)

    # Generate audio
    if args.use_edge or args.ref is None:
        audio_path = asyncio.run(generate_edge_tts(args.script, out_dir))
    else:
        if not args.ref.exists():
            print(f"Error: reference audio {args.ref} not found", file=sys.stderr)
            sys.exit(1)
        wav_path = generate_f5tts(args.script, args.ref, args.ref_text, out_dir)
        audio_path = wav_to_mp3(wav_path)

    # Generate subtitles
    if args.subtitles:
        generate_subtitles_whisperx(audio_path, out_dir)

    print(f"\n✅ 完了: {out_dir}", file=sys.stderr)
    print(f"   次のステップ: python render.py  (in {out_dir})", file=sys.stderr)


if __name__ == "__main__":
    main()
