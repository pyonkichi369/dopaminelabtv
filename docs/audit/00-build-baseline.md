# t01 — Build Baseline

## Package manager

`package-lock.json` is present → **npm**.

Install command used: `npm ci` (clean, lockfile-exact install; 386 packages, 14s, no errors).

## Build command (use this for verification in all later tasks)

```
npm run build
```

This resolves to the `build` script in `package.json`:

```
node scripts/generate-og.mjs && (python3 scripts/generate-og-ja.py || echo 'JA OGP skipped (Pillow/font unavailable — use pre-built images)') && astro build
```

Steps: (1) generate English OGP images, (2) generate Japanese OGP images (best-effort — falls back silently if Pillow/font is unavailable, since pre-built images already exist in `public/og/`), (3) `astro build`.

## Result

- Ran `npm ci` → succeeded, no errors (7 pre-existing npm audit advisories, unrelated to build health, not addressed here).
- Ran `npm run build` → **exit code 0**.
- Python OGP step completed normally (Pillow available in this environment; no fallback triggered).
- Astro build: **245 pages built** in ~2.5s, `[build] Complete!`.

## Changes made to reach green

None. The build was already green on the first `npm ci` + `npm run build` run — no application code, config, or dependency changes were required.

## Node version requirement (read this before running the build)

`npm run build` **requires Node >= 18**. `scripts/generate-og.mjs` loads `sharp`, whose
prebuilt native binary is not loadable on Node 16 — the build dies in
`node_modules/sharp/lib/constructor.js` before Astro ever runs.

The machine's default `node` on PATH is **v16.16.0**, so a fresh shell that does not activate
nvm will fail the build even though nothing is wrong with the repo. Verified working versions
are installed under nvm (`v20.18.3`, `v22.13.0`). Prefix the build with:

```
export PATH="$HOME/.nvm/versions/node/v22.13.0/bin:$PATH"
npm run build
```

There is no `engines` field or `.nvmrc` in the repo to pin this; adding one is an operator
decision and was not made here.

## Notes for later tasks

- Baseline was established without touching Substack-related code/components — that work starts in a later task.
- Re-run `npm run build` after each subsequent change in this project to confirm the build stays green.
- A `sharp`/`ERR_DLOPEN_FAILED`-style build failure is almost always the Node-16-on-PATH issue
  above, not a regression in the change under test.
