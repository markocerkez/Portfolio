/*
  Tiny pixel-art engine.
  Each sprite is defined as an array of text rows. Every character is one
  "pixel". "." is transparent, any other character is looked up in a
  palette object to get its color. Rows don't need to be the same length -
  anything out of range is just treated as transparent.
*/

/* Every key MUST be exactly one character — sprite rows below are
   indexed character-by-character, so a two-letter key would silently
   never match and that pixel would render as transparent. */
const PIXEL_PALETTE = {
  // blob mascot
  k: "#1b1032", // outline (also reused as the shared ink outline below)
  g: "#5fe88a", // body light
  d: "#2bb673", // body dark
  w: "#f4fff6", // eye white
  p: "#1b1032", // pupil
  b: "#ff8fab", // blush
  // chest
  o: "#a9701f", // wood light
  n: "#5c3a1a", // wood dark
  y: "#ffd34d", // gold light
  u: "#c98f1c", // gold dark
  // tree / bush
  l: "#2f9e4f", // leaf light
  v: "#1f7a3a", // leaf dark
  t: "#6b4226", // trunk light
  s: "#4a2d18", // trunk dark
  // heart (unused by default, kept for optional future use)
  r: "#ff4d6d",
  m: "#c9184a",
  // cloud
  f: "#d7ecfb", // cloud underside shade
  // water (mini-map)
  a: "#5ec8f5", // water light
  z: "#2f8fd4", // water dark
  // butterfly wing
  x: "#ff8f3c",
  // trainer portrait skin tone
  h: "#e8b894",
  // trainer portrait shirt
  c: "#3b6ea5",
};

function pixelSpriteSVG(rows, palette, pixelSize) {
  pixelSize = pixelSize || 1;
  const h = rows.length;
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
  let rects = "";
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (!ch || ch === ".") continue;
      const color = palette[ch];
      if (!color) continue;
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" ` +
    `width="${w * pixelSize}" height="${h * pixelSize}" ` +
    `shape-rendering="crispEdges" style="image-rendering:pixelated;display:block">${rects}</svg>`
  );
}

/* Builds a blocky silhouette from overlapping rectangles: any cell inside
   the union gets `outline` if it touches empty space, otherwise `fill`.
   Used for shapes (like the clouds) that are easier to describe as a few
   stacked rectangles than to hand-count pixel-by-pixel. */
function rectUnionRows(rects, fill, outline) {
  let w = 0, h = 0;
  rects.forEach((r) => {
    w = Math.max(w, r.x + r.w);
    h = Math.max(h, r.y + r.h);
  });
  const grid = Array.from({ length: h }, () => Array(w).fill(false));
  rects.forEach((r) => {
    for (let y = r.y; y < r.y + r.h; y++) {
      for (let x = r.x; x < r.x + r.w; x++) grid[y][x] = true;
    }
  });
  const rows = [];
  for (let y = 0; y < h; y++) {
    let row = "";
    for (let x = 0; x < w; x++) {
      if (!grid[y][x]) { row += "."; continue; }
      const edge =
        !(grid[y - 1] && grid[y - 1][x]) ||
        !(grid[y + 1] && grid[y + 1][x]) ||
        !grid[y][x - 1] ||
        !grid[y][x + 1];
      row += edge ? outline : fill;
    }
    rows.push(row);
  }
  return rows;
}

/* Overwrites specific [x, y] cells of a sprite (built by rectUnionRows or
   hand-written) with a different character — used to add small accents
   (a spine line, a flap crease, a latch) onto a plain rectangular base
   without hand-counting a whole new grid. Returns new rows; doesn't
   mutate the input. */
function withPixels(rows, points, ch) {
  const grid = rows.map((r) => r.split(""));
  points.forEach(([x, y]) => {
    if (grid[y] && x >= 0 && x < grid[y].length) grid[y][x] = ch;
  });
  return grid.map((r) => r.join(""));
}

/* Stacks `top` on `base` (non-"." cells of top win), padding both to a
   shared size first. Used to build a sprite out of separate shapes — a
   hair cap over a face, say — without hand-merging grids by eye. */
function layerSprites(base, top, offsetX, offsetY) {
  offsetX = offsetX || 0;
  offsetY = offsetY || 0;
  const h = Math.max(base.length, top.length + offsetY);
  const w = Math.max(
    base.reduce((m, r) => Math.max(m, r.length), 0),
    top.reduce((m, r) => Math.max(m, r.length), 0) + offsetX
  );
  const grid = Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => (base[y] && base[y][x]) || ".")
  );
  top.forEach((row, y) => {
    row.split("").forEach((ch, x) => {
      if (ch !== ".") grid[y + offsetY][x + offsetX] = ch;
    });
  });
  return grid.map((r) => r.join(""));
}

/* Recolors cells of a `rectUnionRows` result that are still the generic
   fill placeholder and fall inside one of `rects`, leaving every outline
   cell (and anything already recolored by an earlier pass) untouched.
   Used to build a multi-region shape (e.g. hair + skin) as a single
   silhouette — so the only outline pixels are the shape's true outer
   edges — then paint each region afterwards instead of outlining each
   region separately and getting a doubled seam where they meet. */
function paintFillRects(rows, rects, placeholder, color) {
  const grid = rows.map((r) => r.split(""));
  rects.forEach((r) => {
    for (let y = r.y; y < r.y + r.h; y++) {
      for (let x = r.x; x < r.x + r.w; x++) {
        if (grid[y] && grid[y][x] === placeholder) grid[y][x] = color;
      }
    }
  });
  return grid.map((r) => r.join(""));
}

const CLOUDS = {
  small: rectUnionRows(
    [
      { x: 2, y: 3, w: 9, h: 3 },
      { x: 0, y: 5, w: 13, h: 2 },
      { x: 5, y: 1, w: 4, h: 3 },
    ],
    "w",
    "k"
  ),
  medium: rectUnionRows(
    [
      { x: 2, y: 3, w: 12, h: 3 },
      { x: 0, y: 6, w: 17, h: 2 },
      { x: 4, y: 1, w: 5, h: 3 },
      { x: 10, y: 2, w: 5, h: 3 },
    ],
    "w",
    "k"
  ),
  large: rectUnionRows(
    [
      { x: 2, y: 4, w: 16, h: 3 },
      { x: 0, y: 7, w: 21, h: 2 },
      { x: 4, y: 1, w: 6, h: 4 },
      { x: 11, y: 2, w: 7, h: 4 },
    ],
    "w",
    "k"
  ),
};

const BUTTERFLY_WING = rectUnionRows(
  [
    { x: 0, y: 0, w: 5, h: 3 },
    { x: 1, y: 3, w: 4, h: 2 },
    { x: 2, y: 5, w: 2, h: 1 },
  ],
  "x",
  "k"
);
const BUTTERFLY = [
  "....k.k....",
  ...BUTTERFLY_WING.map(
    (row, i) => row.split("").reverse().join("") + "k" + row
  ),
];

/* Small UI icons — replace every emoji used in buttons/labels/links so
   nothing on the page falls back to the platform's color emoji font. */
const ICON_SUN = rectUnionRows(
  [
    { x: 2, y: 0, w: 5, h: 2 },
    { x: 0, y: 2, w: 9, h: 5 },
    { x: 2, y: 7, w: 5, h: 2 },
  ],
  "y",
  "k"
);
const ICON_SCROLL = rectUnionRows(
  [
    { x: 1, y: 0, w: 9, h: 1 },
    { x: 0, y: 1, w: 11, h: 5 },
    { x: 1, y: 6, w: 9, h: 1 },
  ],
  "o",
  "k"
);
const ICON_BRIEFCASE = withPixels(
  rectUnionRows(
    [
      { x: 3, y: 0, w: 3, h: 1 },
      { x: 0, y: 2, w: 9, h: 5 },
    ],
    "n",
    "k"
  ),
  [
    [3, 3], [4, 3], [5, 3],
    [3, 4], [4, 4], [5, 4],
  ],
  "y"
);
const ICON_BOOK = withPixels(
  rectUnionRows([{ x: 0, y: 0, w: 9, h: 7 }], "z", "k"),
  [[4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],
  "k"
);
const ICON_PIN = rectUnionRows(
  [
    { x: 2, y: 0, w: 1, h: 1 },
    { x: 1, y: 1, w: 3, h: 1 },
    { x: 0, y: 2, w: 5, h: 1 },
    { x: 1, y: 3, w: 3, h: 1 },
    { x: 2, y: 4, w: 1, h: 1 },
  ],
  "w",
  "k"
);
const ICON_ENVELOPE = withPixels(
  rectUnionRows([{ x: 0, y: 0, w: 11, h: 7 }], "w", "k"),
  [
    [1, 1], [2, 2], [3, 2], [4, 3], [5, 3],
    [9, 1], [8, 2], [7, 2], [6, 3],
  ],
  "k"
);
const ICON_RAIN_CLOUD = [
  ...rectUnionRows(
    [
      { x: 1, y: 1, w: 7, h: 2 },
      { x: 0, y: 3, w: 9, h: 2 },
    ],
    "w",
    "k"
  ),
  "..k...k..",
  "..a...a..",
];
const ICON_SNOWFLAKE = (() => {
  const n = 7, mid = 3;
  const grid = Array.from({ length: n }, () => Array(n).fill("."));
  for (let i = 0; i < n; i++) {
    grid[mid][i] = "a";
    grid[i][mid] = "a";
    grid[i][i] = "a";
    grid[i][n - 1 - i] = "a";
  }
  grid[mid][mid] = "w";
  return grid.map((r) => r.join(""));
})();

/* Trainer card portrait: a bigger, more detailed pixel-art head+shoulders.
   Hair, face and shoulders are unioned into ONE silhouette first (so only
   the shape's true outer edges get outlined), then each region is
   recolored — avoids the doubled black seam you'd get from outlining
   hair and face as two separate shapes and stacking them. Eyebrows,
   glasses, nose and beard are stamped on last as accents, same build-up
   as the UI icons. */
const PORTRAIT_HAIR_RECTS = [
  { x: 3, y: 0, w: 7, h: 1 },   // top peak
  { x: 1, y: 1, w: 11, h: 3 },  // cap, flush with where the face starts
  { x: 1, y: 4, w: 2, h: 2 },   // left sideburn
  { x: 10, y: 4, w: 2, h: 2 },  // right sideburn
];
const PORTRAIT_FACE_RECTS = [
  { x: 2, y: 4, w: 9, h: 7 },   // main face
  { x: 1, y: 6, w: 1, h: 3 },   // left ear
  { x: 11, y: 6, w: 1, h: 3 },  // right ear
  { x: 3, y: 11, w: 7, h: 2 },  // jaw
  { x: 5, y: 13, w: 3, h: 1 },  // chin
  { x: 5, y: 14, w: 3, h: 1 },  // neck
];
const PORTRAIT_SHOULDER_RECTS = [{ x: 0, y: 15, w: 12, h: 5 }];
const PORTRAIT_SILHOUETTE = rectUnionRows(
  [...PORTRAIT_HAIR_RECTS, ...PORTRAIT_FACE_RECTS, ...PORTRAIT_SHOULDER_RECTS],
  "1",
  "k"
);
const PORTRAIT_BASE = paintFillRects(
  paintFillRects(
    paintFillRects(PORTRAIT_SILHOUETTE, PORTRAIT_HAIR_RECTS, "1", "t"),
    PORTRAIT_FACE_RECTS,
    "1",
    "h"
  ),
  PORTRAIT_SHOULDER_RECTS,
  "1",
  "c"
);
const PORTRAIT_BROWS_NOSE = withPixels(
  PORTRAIT_BASE,
  [
    [3, 5], [4, 5], [5, 5], [7, 5], [8, 5], [9, 5], // eyebrows
    [6, 8], [6, 9], // nose bridge/tip shadow
  ],
  "s"
);
const PORTRAIT_GLASSES = withPixels(
  PORTRAIT_BROWS_NOSE,
  [
    // two lens rings + bridge. Centers are left bare for the final pass
    // to fill with a bright "glare" so each ring reads as a ring.
    [3, 6], [4, 6], [5, 6],
    [3, 7], [5, 7],
    [3, 8], [4, 8], [5, 8],
    [7, 6], [8, 6], [9, 6],
    [7, 7], [9, 7],
    [7, 8], [8, 8], [9, 8],
    [6, 7],
  ],
  "k"
);
const PORTRAIT_BEARD = withPixels(
  withPixels(
    PORTRAIT_GLASSES,
    [
      [5, 10], [6, 10], [7, 10], // mustache
      [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11],
      [3, 12], [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12],
      [5, 13], [6, 13], [7, 13], // chin
    ],
    "n"
  ),
  [[4, 12], [8, 12], [6, 13]], // beard shading for a bit of texture
  "s"
);
const PORTRAIT_WITH_LENSES = withPixels(PORTRAIT_BEARD, [[4, 7], [8, 7]], "w");

const SPRITES = {
  blobIdle: [
    ".....kkkkkk.....",
    "...kkggggggkk...",
    "..kggggggggggk..",
    ".kgddggggggddgk.",
    ".kgddggggggddgk.",
    "kggggwwkkwwggggk",
    "kggggwpkkwpggggk",
    "kgggggkkkkggggbk",
    "kbggggggggggggbk",
    ".kgggggggggggk..",
    "..kgdddddddgk...",
    "...kkgggggkk....",
    "....kkkkkkk.....",
  ],
  blobBlink: [
    ".....kkkkkk.....",
    "...kkggggggkk...",
    "..kggggggggggk..",
    ".kgddggggggddgk.",
    ".kgddggggggddgk.",
    "kgggggkkkkggggk",
    "kgggggkkkkggggk",
    "kgggggkkkkggggbk",
    "kbggggggggggggbk",
    ".kgggggggggggk..",
    "..kgdddddddgk...",
    "...kkgggggkk....",
    "....kkkkkkk.....",
  ],
  chestClosed: [
    ".kkkkkkkkkkkkkk.",
    "kooooooooooooook",
    "koyyyyyyyyyyyyok",
    "kkkkkkkkkkkkkkkk",
    "knnnnnyyyynnnnnk",
    "knnnnnyyyynnnnnk",
    "knnnnnnnnnnnnnnk",
    "knnnnnnnnnnnnnnk",
    "knnnnnnnnnnnnnnk",
    ".kkkkkkkkkkkkkk.",
  ],
  chestOpen: [
    "..kooooooook....",
    ".kooooooooook...",
    "konnnnnnnnnnok..",
    "kkkkkkkkkkkkkk..",
    ".k..y....y..k...",
    ".k.yyy..yyy.k...",
    ".knnnnnnnnnnk...",
    "knnnnnyyyynnnnk.",
    "knnnnnnnnnnnnnk.",
    ".kkkkkkkkkkkkk..",
  ],
  tree: [
    ".......kk.......",
    "......klk.......",
    ".....kllk.......",
    "....klvlk.......",
    "...klllllk......",
    "..kvllllvlk.....",
    ".klllllllllk....",
    "kllvllllvllk....",
    ".klllllllllk....",
    "...kkttkk.......",
    "....ktsk........",
    "....ktsk........",
    "...kkkkk........",
  ],
  bush: [
    "...kkkk...kkkk...",
    "..kllkkkkkllk....",
    ".kllvllllvllk....",
    "kllllllllllllk...",
    "kvllllllllllvk...",
    ".kkkkkkkkkkkkk...",
  ],
  heart: [
    ".rr.rr.",
    "rmrrmr.",
    "rrrrrr.",
    ".rrrr..",
    "..rr...",
  ],
  leaf: [
    "..kk...",
    ".klvk..",
    "kllvlk.",
    "klvllk.",
    ".kvllk.",
    "..kllk.",
    "...kk..",
  ],
  butterfly: BUTTERFLY,
  iconSun: ICON_SUN,
  iconScroll: ICON_SCROLL,
  iconBriefcase: ICON_BRIEFCASE,
  iconBook: ICON_BOOK,
  iconPin: ICON_PIN,
  iconEnvelope: ICON_ENVELOPE,
  iconRainCloud: ICON_RAIN_CLOUD,
  iconSnowflake: ICON_SNOWFLAKE,
  trainerPortrait: PORTRAIT_WITH_LENSES,
  moon: [
    "..kkkk..",
    ".kwwwwk.",
    "kwwwuwwk",
    "kwwwwwwk",
    "kwuwwwwk",
    "kwwwwwwk",
    ".kwwwwk.",
    "..kkkk..",
  ],
  // custom cursor sprites — a default arrow and a "selection diamond"
  // for anything clickable, built once at load and set as the page cursor
  cursor: [
    "k.......",
    "kk......",
    "kwk.....",
    "kwwk....",
    "kwwwk...",
    "kwwwwk..",
    "kwwwwwk.",
    "kwwwwwww",
    "kwwkkk..",
    "kk.k....",
    "k..k....",
  ],
  cursorPoint: [
    "...k...",
    "..kwk..",
    ".kwwwk.",
    "kwwwwwk",
    ".kwwwk.",
    "..kwk..",
    "...k...",
  ],
  // achievement badge icons
  badgeCompass: [
    "....k....",
    "...kwk...",
    "..kwrwk..",
    ".kwrrrwk.",
    "kwwrkrwwk",
    ".kwzzzwk.",
    "..kwzwk..",
    "...kwk...",
    "....k....",
  ],
  badgeMap: [
    "kkkkkkkkk",
    "koooooook",
    "koooooook",
    "koooroook",
    "koorrrook",
    "koooroook",
    "koooooook",
    "kkkkkkkkk",
  ],
  badgeTrophy: [
    ".kkkkkkk.",
    "kyyyyyyyk",
    "kyyyyyyyk",
    ".kyyyyyk.",
    "k.kyyyk.k",
    "k..kyk..k",
    "...kyk...",
    "..kuuuk..",
    "..kuuuk..",
    ".kuuuuuk.",
  ],
  // shown for a locked/unearned achievement — deliberately generic so it
  // never spoils what the real icon looks like
  badgeLocked: [
    ".kkkk..",
    "kk..kk.",
    "....kk.",
    "...kk..",
    "..kk...",
    "..kk...",
    ".......",
    "..kk...",
    "..kk...",
  ],
  // golden "shiny" variant of the blob mascot — easter-egg only
  blobShiny: [
    ".....kkkkkk.....",
    "...kkyyyyyykk...",
    "..kyyyyyyyyyyk..",
    ".kyuuyyyyyyuugk.",
    ".kyuuyyyyyyuugk.",
    "kyyyyykkkkyyyyyk",
    "kyyyyykkkkyyyyyk",
    "kyyyyykkkkyyyyyk",
    "kwyyyyyyyyyyyywk",
    ".kyyyyyyyyyyyk..",
    "..kyuuuuuuuyk...",
    "...kkyyyyykk....",
    "....kkkkkkk.....",
  ],
};
