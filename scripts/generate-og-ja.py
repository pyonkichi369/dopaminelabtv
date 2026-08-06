#!/usr/bin/env python3
"""
Generates JA per-article OGP images using Pillow + Hiragino font.
Output: public/og/[slug].png  (1200×630)
Run via: python3 scripts/generate-og-ja.py
"""

import os
import re
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent.parent
POSTS_JA = ROOT / 'src' / 'content' / 'posts' / 'ja'
OG_DIR = ROOT / 'public' / 'og'
OG_DIR.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
BG_COLOR    = (250, 245, 236)  # --bg washi cream
CARD_COLOR  = (243, 234, 216)  # --bg-card
ACCENT      = (180, 72, 64)    # --accent vermillion
TEXT_COLOR  = (30, 25, 16)     # --text ink
MUTED       = (126, 110, 90)   # --text-muted
GOLD        = (138, 111, 46)   # --gold

FONT_MINCHO = '/System/Library/Fonts/ヒラギノ明朝 ProN.ttc'
FONT_GOTHIC = '/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc'

def parse_frontmatter(content):
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return {}
    result = {}
    for line in match.group(1).split('\n'):
        if ':' not in line:
            continue
        key, _, val = line.partition(':')
        result[key.strip()] = val.strip().strip('"\'')
    return result

# Beyond 4 lines the title block collides with the eyebrow/footer —
# truncate with an ellipsis instead of overflowing the canvas.
MAX_LINES = 4

def wrap_ja(text, max_chars=16):
    lines = []
    for i in range(0, len(text), max_chars):
        lines.append(text[i:i+max_chars])
    if len(lines) > MAX_LINES:
        lines = lines[:MAX_LINES]
        lines[-1] = lines[-1][:max_chars - 1] + '…'
    return lines

def draw_og(title, slug):
    img = Image.new('RGB', (W, H), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Card background
    draw.rectangle([40, 40, W-40, H-40], fill=CARD_COLOR)

    # Left accent bar
    draw.rectangle([40, 40, 56, H-40], fill=ACCENT)

    # Eyebrow label: "DOPAMINE LAB TV"
    try:
        font_eyebrow = ImageFont.truetype(FONT_GOTHIC, 22, index=0)
    except Exception:
        font_eyebrow = ImageFont.load_default()
    draw.text((80, 72), 'DOPAMINE LAB TV', font=font_eyebrow, fill=ACCENT)

    # Divider line
    draw.rectangle([80, 108, W-80, 110], fill=ACCENT)

    # Title text
    lines = wrap_ja(title, max_chars=16)
    n = len(lines)
    font_size = 70 if n == 1 else 60 if n == 2 else 50
    try:
        font_title = ImageFont.truetype(FONT_MINCHO, font_size, index=1)
    except Exception:
        try:
            font_title = ImageFont.truetype(FONT_MINCHO, font_size, index=0)
        except Exception:
            font_title = ImageFont.load_default()

    line_height = int(font_size * 1.45)
    block_height = n * line_height
    start_y = (H - block_height) // 2 - 10

    for i, line in enumerate(lines):
        draw.text((80, start_y + i * line_height), line, font=font_title, fill=TEXT_COLOR)

    # Footer bar
    draw.rectangle([40, H-100, W-40, H-40], fill=ACCENT)
    try:
        font_footer = ImageFont.truetype(FONT_GOTHIC, 20, index=0)
    except Exception:
        font_footer = ImageFont.load_default()
    draw.text((80, H-76), 'dopaminelabtv.com  ·  神経科学 × 日本哲学', font=font_footer, fill=(250, 245, 236))

    out_path = OG_DIR / f'{slug}.png'
    img.save(str(out_path), 'PNG', optimize=True)
    size_kb = out_path.stat().st_size // 1024
    print(f'✓ og/{slug}.png ({size_kb}KB)  "{title}"')

# Static pages that set ogImage="/og/..." in src/pages — kept in sync with
# the .astro files; scripts/check-og.mjs fails the build if one is missing.
STATIC_PAGES = [
    ('totonou',       'totonou — Focus & Reset App'),
    ('glossary',      'Japanese Philosophy Glossary'),
    ('protocols',     'Totonou Protocols — Practical Reset Methods'),
    ('research',      'Research & Evidence'),
    ('ja/totonou',    'totonou — 集中力・リセットアプリ'),
    ('ja/glossary',   '禅語・仏教・神道・武士道辞典'),
    ('ja/protocols',  'ととのうプロトコル — 実践的リセット法'),
    ('ja/research',   '参考文献・エビデンスライブラリ'),
]

if __name__ == '__main__':
    missing = []
    for md_file in sorted(POSTS_JA.glob('*.md')):
        slug = md_file.stem
        content = md_file.read_text(encoding='utf-8')
        fm = parse_frontmatter(content)
        title = fm.get('title', '')
        if not title:
            missing.append(md_file.name)
            continue
        draw_og(title, slug)

    (OG_DIR / 'ja').mkdir(parents=True, exist_ok=True)
    for slug, title in STATIC_PAGES:
        draw_og(title, slug)

    # A post without a title ships a page whose og:image points at a PNG
    # that was never generated — fail instead of warning.
    if missing:
        raise SystemExit(f'✗ posts missing title frontmatter (no OGP generated): {", ".join(missing)}')
