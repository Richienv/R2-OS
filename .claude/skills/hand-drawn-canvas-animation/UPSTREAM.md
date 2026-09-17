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

The skill renders through headless Chrome plus ffmpeg. Neither is on `PATH` in
this repo's dev container by default; Playwright's copies are:

```bash
export CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
export PATH="/opt/pw-browsers/ffmpeg-1011:$PATH"   # binary is named ffmpeg-linux
```

`scripts/render.mjs` needs `ffmpeg` on `PATH`; symlink or alias
`ffmpeg-linux` to `ffmpeg` if you use the Playwright build. Films are rendered
into a scratch folder, not into this repo — `out/` is already gitignored.
