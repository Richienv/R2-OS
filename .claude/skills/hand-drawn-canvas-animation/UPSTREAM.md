# Upstream

Vendored verbatim from [alesha-pro/tools](https://github.com/alesha-pro/tools/tree/main/skills/hand-drawn-canvas-animation),
MIT licensed (see `LICENSE`). Author: Alexey Fateev ([@superalesha](https://x.com/superalesha)).

- Commit: `cf1191e838fa89a1b4b869e1ba2dcff72097447d`
- Vendored: 2026-09-17

Do not edit files here. To update, re-copy the whole directory from upstream:

```bash
git clone --depth 1 https://github.com/alesha-pro/tools /tmp/alesha-tools
rm -rf .claude/skills/hand-drawn-canvas-animation
cp -R /tmp/alesha-tools/skills/hand-drawn-canvas-animation .claude/skills/
cp /tmp/alesha-tools/LICENSE .claude/skills/hand-drawn-canvas-animation/LICENSE
```

Then restore this file and bump the commit SHA above.

## Running it here

Verified working in this repo's dev container. The skill renders through
headless Chrome plus ffmpeg, and neither is on `PATH` by default — Playwright's
copies are under `/opt/pw-browsers`. Two wrinkles:

- `render.mjs` shells out to `ffmpeg` by name, so the Playwright binary
  (`ffmpeg-linux`) needs a symlink under that name on `PATH`.
- The container runs as root, and Chrome refuses to start as root without
  `--no-sandbox`. `render.mjs` launches with `{executablePath, headless}` and
  no way to pass browser flags, so point `CHROME` at a wrapper rather than
  editing the vendored script.

```bash
mkdir -p bin
cat > bin/chrome-nosandbox <<'EOF'
#!/bin/sh
exec /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox --disable-dev-shm-usage "$@"
EOF
chmod +x bin/chrome-nosandbox
ln -sf /opt/pw-browsers/ffmpeg-1011/ffmpeg-linux bin/ffmpeg

export CHROME="$PWD/bin/chrome-nosandbox"
export PATH="$PWD/bin:$PATH"
node render.mjs <film>.html --only 0,12 --ar 1:1
```

Films are rendered into a scratch folder, not into this repo — `out/` is
already gitignored.
