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

Verified working in this repo's dev container: a full film renders to mp4 with
its score. Three things have to be set up first.

- **ffmpeg.** `render.mjs` shells out to `ffmpeg` by name. Playwright's copy
  (`/opt/pw-browsers/ffmpeg-*/ffmpeg-linux`) only has VP8 and the WebM muxer, so
  it is enough for `--grid` and `--only` but the mp4 step fails on it with no
  useful message. Install a real one: `apt-get install -y ffmpeg`. Check with
  `ffmpeg -encoders | grep -E 'libx264|aac'` before a full render.
- **Chrome.** The container runs as root and Chrome refuses to start as root
  without `--no-sandbox`. `render.mjs` launches with `{executablePath, headless}`
  and no way to pass browser flags, so point `CHROME` at a wrapper rather than
  editing the vendored script.
- **rembg**, for a doodle film only. Without it `photo.mjs` falls back to a
  colour flood that fails on anything but a flat backdrop. `pip install
  "rembg[cpu,cli]"`; the first run downloads the model and takes about a minute.

```bash
apt-get install -y ffmpeg
mkdir -p bin
cat > bin/chrome-nosandbox <<'EOF'
#!/bin/sh
exec /opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox --disable-dev-shm-usage "$@"
EOF
chmod +x bin/chrome-nosandbox
export CHROME="$PWD/bin/chrome-nosandbox"

node render.mjs <film>.html --grid 24 --ar 9:16    # 24 frames of the whole film, seconds
node render.mjs <film>.html --ar 9:16              # mp4, contact sheet, score, <film>-final.mp4
```

Films are rendered into a scratch folder, not into this repo — `out/` is
already gitignored.
