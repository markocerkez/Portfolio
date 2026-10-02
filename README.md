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
- `trainer.resumeUrl`: drop your CV as `assets/resume.pdf` (or wherever)
  and point this at it to show a "Get Scroll of Resume" download
  button. Leave it as `""` to hide the button — it's a placeholder path
  right now and will 404 until you add the file.
- `patchNotes`: a changelog for the site itself, shown in its own
  "Patch Notes" section. Add a new entry to the top of the array whenever
  you update your portfolio — fun flavor, and a real history of changes.

## Fun extras

- The **MAP** button in the top bar opens a small overworld-style map
  (grass, path, a pond, trees) with numbered flags that jump you to each
  section — closes with the ✕ button, a click outside, or Esc.
- The **NIGHT / DAY** button swaps the sky, ground and ambient layer
  to a night palette with twinkling stars and a moon. Remembered across
  visits (`localStorage`).
- The **CLEAR / RAIN / SNOW** button cycles light weather effects
  over the whole page.
- Dialogue boxes (hero intro, NPC chat) type themselves out letter by
  letter, old-RPG style.
- A thin XP bar under the top bar fills up as you scroll through the page.
- A tiny pixel arrow replaces the normal mouse cursor on desktop (skipped
  on touch devices).
- There's a hidden easter egg: enter the classic Konami code
  (↑ ↑ ↓ ↓ ← → ← → B A) anywhere on the page, or tap the mascot blob 7
  times quickly — a "shiny" golden blob appears and leaves rain down for
  a few seconds. Pure fun, no effect on content.
- A brief pixel "LOADING..." boot screen plays on your first visit each
  browser session (skipped after that, and skipped entirely under
  reduced motion).
- Switch away from the tab and the title changes to "Come back!" —
  reverts the moment you switch back.
- A small compass in the bottom-left corner names whichever section is
  currently in view as you scroll.
- Seven achievements (explore every section, open every chest, open the
  map, try all the weather, go full night owl, find the secret grove,
  and a bonus one for unlocking everything) are tracked in
  `localStorage` and shown as a badge shelf in the Patch Notes section —
  locked ones show as "???" until you earn them.
- All motion (ambient background, weather, typewriter text, stars, boot
  screen, badge pop-ins) is disabled automatically for visitors with
  `prefers-reduced-motion` set.

## Social preview image

`index.html` has Open Graph / Twitter Card meta tags pointing at
`assets/og-image.png` (already generated) so the link looks good when
shared on LinkedIn, Twitter, etc. They assume the site lives at
`https://cerkez.ch/` — update the URLs in `<head>` if that ever changes.

If you want to regenerate the preview image (e.g. after changing the
palette), `assets/og-image-source.html` is the template used to make it —
it reuses the real sprites/palette but never pulls from `content.js`, so
a `???` placeholder can never end up in a shared link preview. See the
comment at the top of that file for the regenerate command.

## Preview locally

No build step needed — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploying to cerkez.ch

This repo already includes a `CNAME` file set to `cerkez.ch`, which is what
GitHub Pages needs for a custom domain. **Don't delete this file** — if
it's missing, GitHub Pages will refuse to serve the custom domain even
once DNS is correct. (It went missing once already — restored it.)

### 1. GitHub side

1. **Settings → Pages** → Source: deploy from the `main` branch, root.
2. Under "Custom domain", type `cerkez.ch` and save. GitHub will show a
   DNS check that fails until step 2 below is done — that's expected,
   leave the field saved and move on.
3. Come back after DNS has propagated (see below) and tick
   **Enforce HTTPS** once it's no longer greyed out — the certificate
   takes a few minutes to a few hours to issue after GitHub can verify
   the domain.

### 2. Hostpoint side (your registrar)

1. Log into the **Hostpoint Control Panel** → **Domains** →
   **Edit DNS zone** for `cerkez.ch`.
2. Switch to manual editing and add these records. For the root domain
   itself, leave the **Name** field blank (not `@`) — that's Hostpoint's
   convention for "this applies to cerkez.ch itself, no subdomain".

   | Type | Name | Value |
   |---|---|---|
   | A | *(blank)* | `185.199.108.153` |
   | A | *(blank)* | `185.199.109.153` |
   | A | *(blank)* | `185.199.110.153` |
   | A | *(blank)* | `185.199.111.153` |
   | AAAA (optional, IPv6) | *(blank)* | `2606:50c0:8000::153` |
   | AAAA (optional, IPv6) | *(blank)* | `2606:50c0:8001::153` |
   | AAAA (optional, IPv6) | *(blank)* | `2606:50c0:8002::153` |
   | AAAA (optional, IPv6) | *(blank)* | `2606:50c0:8003::153` |
   | CNAME (optional) | `www` | `markocerkez.github.io` |

3. Save/apply. If Hostpoint already has a default A record pointing
   `cerkez.ch` somewhere (e.g. a parking page), replace rather than
   duplicate it — two A records with the same name but different IPs is
   fine (that's normal for GitHub Pages, which needs all four), but don't
   leave an old unrelated IP in there too.

### 3. Wait and verify

DNS changes can take anywhere from a few minutes to a few hours to
propagate. To check without waiting blindly:

```bash
dig cerkez.ch +short
# should eventually list the four 185.199.10x.153 addresses
```

Once that resolves correctly, `https://cerkez.ch` should load the site
(it may show a GitHub Pages "not secure" warning for a bit until the
certificate from step 1.3 finishes issuing — that's expected, not a
sign something's wrong). Until then, `https://markocerkez.github.io/Portfolio/`
keeps working regardless of DNS.

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
