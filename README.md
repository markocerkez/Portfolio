# Portfolio — cerkez.ch

A single-page, retro/pixel-art portfolio (Pokémon dialog boxes, a quest log,
a world map, a treasure-chest item bag, an openable overworld mini-map)
built with plain HTML/CSS/JS — no build step, no framework.

## Fill in your info

Everything you see on the page (name, bio, education, work, projects,
contact links) lives in **one file**: `js/content.js`. Open it, replace
every `???` placeholder with your real text, save, and refresh the page.
You don't need to touch any other file for normal content changes.

Things worth knowing while filling it in:

- `trainer.stats` are skill bars from 0–100.
- `education[].status` is `"done"` or `"active"`.
- `work[].icon` is `"briefcase"` or `"book"`.
- `projects` is an array — add or remove entries freely, the grid wraps.
- Leave `contact.email` / `linkedin` as `""` to hide that link entirely.
- `trainer.photo`: set to a path like `"assets/avatar.png"` to show a real
  photo instead of the pixel mascot (drop the image into `assets/`).

## Fun extras

- The **🗺 MAP** button in the top bar opens a small overworld-style map
  (grass, path, a pond, trees) with numbered flags that jump you to each
  section — closes with the ✕ button, a click outside, or Esc.
- There's a hidden easter egg: enter the classic Konami code
  (↑ ↑ ↓ ↓ ← → ← → B A) anywhere on the page, or tap the mascot blob 7
  times quickly — a "shiny" golden blob appears and leaves rain down for
  a few seconds. Pure fun, no effect on content.

## Preview locally

No build step needed — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploying to cerkez.ch

This repo already includes a `CNAME` file set to `cerkez.ch`, which is what
GitHub Pages needs for a custom domain.

1. In the GitHub repo: **Settings → Pages** → set source to the `main`
   branch (root).
2. At your domain registrar / DNS provider for `cerkez.ch`, point the apex
   domain at GitHub Pages:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - (optional) `CNAME` record for `www` → `markocerkez.github.io`
3. Back in GitHub Pages settings, enable **Enforce HTTPS** once the
   certificate is issued (can take a few minutes to hours after DNS
   propagates).

If you'd rather host elsewhere (Netlify, Vercel, Cloudflare Pages), it's a
static site — just point the host at the repo root; the `CNAME` file is
harmless to leave in place or can be deleted if unused.

## Structure

```
index.html        page structure / mount points
css/style.css      all styling
js/sprites.js      tiny pixel-art renderer + sprite data
js/content.js      <- YOUR CONTENT GOES HERE
js/script.js       renders content.js into the page, wires up interactions
assets/            put photos/images you reference from content.js here
```
