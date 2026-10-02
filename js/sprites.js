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
