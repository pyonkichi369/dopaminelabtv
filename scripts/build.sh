#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# Astro 4 and sharp (generate-og.mjs) require Node >= 18, but non-interactive
# shells on this machine resolve `node` to the system Node 16 — pick the newest
# nvm-installed Node that satisfies the requirement before building.
node_major() { "$1" -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }

if [ "$(node_major node)" -lt 18 ]; then
  best_major=0
  best_bin=""
  for bin in "$HOME"/.nvm/versions/node/*/bin; do
    [ -x "$bin/node" ] || continue
    m="$(node_major "$bin/node")"
    if [ "$m" -ge 18 ] && [ "$m" -gt "$best_major" ]; then
      best_major="$m"
      best_bin="$bin"
    fi
  done
  if [ -n "$best_bin" ]; then
    export PATH="$best_bin:$PATH"
  else
    echo "error: Node >= 18 required (found $(node --version 2>/dev/null || echo none)); install one via nvm" >&2
    exit 1
  fi
fi

node scripts/generate-og.mjs
python3 scripts/generate-og-ja.py || echo 'JA OGP skipped (Pillow/font unavailable — use pre-built images)'
# Fail closed: every og:image a page references must exist (catches a skipped
# JA generation with no pre-built image, or a post missing its OGP).
node scripts/check-og.mjs
./node_modules/.bin/astro build
# Fail closed: every internal href in the generated HTML must resolve to a
# built route (catches stale slugs, missing translated counterparts, typos).
node scripts/check-links.mjs
# Fail closed: unique titles/descriptions, valid JSON-LD, article hreflang
# pairs present (catches duplicate meta and unpaired translations).
exec node scripts/check-meta.mjs
