/* Renders SITE_DATA into the page and wires up the small
   game-ish interactions (menu scroll, blink animation, reveal
   on scroll, chest-hover sound). No content lives in this file. */

(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function sprite(name, size) {
    return pixelSpriteSVG(SPRITES[name], PIXEL_PALETTE, size || 6);
  }
  function cloudSprite(name, size) {
    return pixelSpriteSVG(CLOUDS[name], PIXEL_PALETTE, size || 6);
  }

  let shinyMode = false;

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Reveals `text` into `el` one character at a time, old-RPG style.
     Returns a promise that resolves once the full line is in. Instantly
     fills the text for anyone who prefers reduced motion. */
  function typewriter(el, text, speed) {
    return new Promise((resolve) => {
      if (prefersReducedMotion()) {
        el.textContent = text;
        resolve();
        return;
      }
      el.textContent = "";
      let i = 0;
      (function step() {
        el.textContent += text[i];
        i++;
        if (i < text.length) setTimeout(step, speed || 28);
        else resolve();
      })();
    });
  }

  /* ---------- ambient background: clouds, floating motes, butterflies ---------- */
  function renderAmbient() {
    const root = $("#ambient-bg");

    ["medium", "small", "large"].forEach((size, i) => {
      const el = document.createElement("div");
      el.className = `ambient-cloud ambient-cloud--${i + 1}`;
      el.innerHTML = cloudSprite(size, 6);
      root.appendChild(el);
    });

    const moteColors = ["#ffd34d", "#ff8fab", "#9fe6c2"];
    const moteCount = 16;
    for (let i = 0; i < moteCount; i++) {
      const m = document.createElement("div");
      m.className = "mote";
      const dur = 9 + Math.random() * 9;
      m.style.setProperty("--x", Math.random() * 100 + "%");
      m.style.setProperty("--dur", dur + "s");
      m.style.setProperty("--delay", -(Math.random() * dur) + "s");
      m.style.setProperty("--sway", Math.round((Math.random() - 0.5) * 80) + "px");
      m.style.setProperty("--size", 2 + Math.round(Math.random() * 3) + "px");
      m.style.setProperty("--mote-color", moteColors[i % moteColors.length]);
      root.appendChild(m);
    }

    ["a", "b"].forEach((variant) => {
      const b = document.createElement("div");
      b.className = `butterfly butterfly--${variant}`;
      const wings = document.createElement("div");
      wings.className = "butterfly__wings";
      wings.innerHTML = sprite("butterfly", 2.4);
      b.appendChild(wings);
      root.appendChild(b);
    });
  }

  /* ---------- hero ---------- */
  function renderHero() {
    $("#cloud-1").innerHTML = cloudSprite("medium", 7);
    $("#cloud-2").innerHTML = cloudSprite("small", 7);
    $("#cloud-3").innerHTML = cloudSprite("large", 7);

    const ground = $("#hero-ground");
    const scenery = document.createElement("div");
    scenery.className = "hero__scenery";
    const placements = [
      { type: "tree", left: "4%", scale: 5 },
      { type: "bush", left: "13%", scale: 5 },
      { type: "bush", left: "82%", scale: 5 },
      { type: "tree", left: "91%", scale: 5 },
    ];
    placements.forEach((p) => {
      const el = document.createElement("div");
      el.className = p.type === "tree" ? "scenery-tree" : "scenery-bush";
      el.style.left = p.left;
      el.innerHTML = sprite(p.type, p.scale);
      scenery.appendChild(el);
    });
    ground.before(scenery);

    $("#hero-mascot").innerHTML = sprite("blobIdle", 8);
    $("#hero-name").textContent = SITE_DATA.meta.name;
    $("#hero-role").textContent = SITE_DATA.meta.role;
    $("#hero-intro-lines").innerHTML = "";
  }

  /* Types the hero dialogue box out, tagline first then each intro line,
     then reveals the "waiting for input" cursor. */
  async function typeHeroText() {
    await typewriter($("#hero-tagline"), SITE_DATA.meta.tagline, 32);
    const introWrap = $("#hero-intro-lines");
    for (const line of SITE_DATA.meta.introLines) {
      const p = document.createElement("p");
      introWrap.appendChild(p);
      await typewriter(p, line, 20);
    }
    $("#hero-dialog .dialog-box__cursor").classList.add("is-ready");
  }

  /* ---------- trainer card ---------- */
  function renderTrainer() {
    const t = SITE_DATA.trainer;
    const portrait = $("#trainer-portrait");
    if (t.photo) {
      portrait.innerHTML = `<img src="${t.photo}" alt="${SITE_DATA.meta.name}">`;
    } else {
      portrait.innerHTML = sprite("blobIdle", 7);
    }
    $("#trainer-name").textContent = SITE_DATA.meta.name;
    $("#trainer-class").textContent = t.class;
    $("#trainer-location").textContent = t.location;
    $("#trainer-bio").textContent = t.bio;

    const resumeWrap = $("#trainer-resume");
    resumeWrap.innerHTML = t.resumeUrl
      ? `<a class="key-item" href="${t.resumeUrl}" download>📜 GET SCROLL OF RESUME</a>`
      : "";

    const statsWrap = $("#trainer-stats");
    statsWrap.innerHTML = "";
    t.stats.forEach((s) => {
      const div = document.createElement("div");
      div.className = "stat-bar";
      div.innerHTML = `
        <div class="stat-bar__label"><span>${s.label}</span><span>${s.value}/100</span></div>
        <div class="stat-bar__track"><div class="stat-bar__fill" data-value="${s.value}"></div></div>`;
      statsWrap.appendChild(div);
    });
  }

  /* ---------- quest log (education) ---------- */
  function renderEducation() {
    const wrap = $("#quest-log");
    wrap.innerHTML = "";
    SITE_DATA.education.forEach((edu) => {
      const done = edu.status === "done";
      const div = document.createElement("div");
      div.className = "quest " + (done ? "quest--done" : "quest--active");
      div.innerHTML = `
        <div class="quest__icon">${done ? "✓" : "…"}</div>
        <div>
          <p class="quest__title">${edu.title}</p>
          <p class="quest__place">${edu.place} — ${edu.period}</p>
          <p class="quest__notes">${edu.notes}</p>
        </div>
        <div class="quest__status">${done ? "QUEST COMPLETE" : "IN PROGRESS"}</div>`;
      wrap.appendChild(div);
    });
  }

  /* ---------- world map (work) ---------- */
  function renderWork() {
    const wrap = $("#world-map");
    wrap.innerHTML = "";
    const icons = { briefcase: "💼", book: "📘" };
    SITE_DATA.work.forEach((job) => {
      const div = document.createElement("div");
      div.className = "location";
      div.innerHTML = `
        <div class="location__pin"><span>${icons[job.icon] || "📍"}</span></div>
        <p class="location__role">${job.role}</p>
        <p class="location__company">${job.company}</p>
        <p class="location__period">${job.period}</p>
        <p class="location__desc">${job.description}</p>`;
      wrap.appendChild(div);
    });
  }

  /* ---------- item bag (projects) ---------- */
  function renderProjects() {
    const wrap = $("#item-bag");
    wrap.innerHTML = "";
    const closed = sprite("chestClosed", 4);
    const open = sprite("chestOpen", 4);
    SITE_DATA.projects.forEach((p) => {
      const div = document.createElement("div");
      div.className = "item";
      div.tabIndex = 0;
      const techHtml = (p.tech || []).map((t) => `<span>${t}</span>`).join("");
      const linkHtml = p.link
        ? `<a class="item__link" href="${p.link}" target="_blank" rel="noopener">OPEN ▸</a>`
        : "";
      div.innerHTML = `
        <div class="item__chest">
          <div class="chest-closed">${closed}</div>
          <div class="chest-open">${open}</div>
        </div>
        <p class="item__name">${p.name}</p>
        <div class="item__tech">${techHtml}</div>
        <p class="item__desc">${p.description}</p>
        ${linkHtml}`;
      div.addEventListener("mouseenter", () => playBlip(880));
      wrap.appendChild(div);
    });
  }

  /* ---------- contact ---------- */
  function renderContact() {
    $("#npc-mascot").innerHTML = sprite("blobIdle", 7);
    const links = $("#contact-links");
    links.innerHTML = "";
    const c = SITE_DATA.contact;
    if (c.email) links.innerHTML += `<a href="mailto:${c.email}">✉ EMAIL</a>`;
    if (c.github) links.innerHTML += `<a href="${c.github}" target="_blank" rel="noopener">GITHUB</a>`;
    if (c.linkedin) links.innerHTML += `<a href="${c.linkedin}" target="_blank" rel="noopener">LINKEDIN</a>`;
    $("#footer-text").textContent = SITE_DATA.footer.text;
  }

  let contactTyped = false;
  async function typeContactText() {
    if (contactTyped) return;
    contactTyped = true;
    await typewriter($("#contact-message"), SITE_DATA.contact.message, 22);
    $("#contact .dialog-box__cursor").classList.add("is-ready");
  }

  /* ---------- patch notes ---------- */
  function renderPatchNotes() {
    const wrap = $("#patch-notes");
    wrap.innerHTML = "";
    SITE_DATA.patchNotes.forEach((p) => {
      const div = document.createElement("div");
      div.className = "patch";
      const items = p.notes.map((n) => `<li>${n}</li>`).join("");
      div.innerHTML = `<span class="patch__version">${p.version}</span><ul class="patch__notes">${items}</ul>`;
      wrap.appendChild(div);
    });
  }

  /* ---------- menu + scroll ---------- */
  function wireNav() {
    $$(".menu button, #scroll-start").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.target || "about";
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        playBlip(520);
      });
    });
    $("#back-to-top").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      playBlip(520);
    });
  }

  /* ---------- reveal-on-scroll ---------- */
  function wireReveal() {
    const panels = $$(".panel");
    const statFills = $$(".stat-bar__fill");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (entry.target.id === "about") {
              statFills.forEach((f) => {
                f.style.width = f.dataset.value + "%";
              });
            }
            if (entry.target.id === "contact") {
              typeContactText();
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    panels.forEach((p) => io.observe(p));
  }

  /* ---------- mascot blink ---------- */
  function wireBlink() {
    const mascots = $$("#hero-mascot, #npc-mascot");
    setInterval(() => {
      if (shinyMode) return; // shiny mascot doesn't blink — it sparkles instead
      mascots.forEach((m) => {
        m.innerHTML = sprite("blobBlink", m.id === "hero-mascot" ? 8 : 7);
      });
      setTimeout(() => {
        if (shinyMode) return;
        mascots.forEach((m) => {
          m.innerHTML = sprite("blobIdle", m.id === "hero-mascot" ? 8 : 7);
        });
      }, 150);
    }, 3200);
  }

  /* ---------- tiny 8-bit beep (no audio files, self-generated) ---------- */
  let audioCtx = null;
  let soundOn = false;
  function playBlip(freq) {
    if (!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = freq || 660;
      gain.gain.value = 0.04;
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {
      /* audio not available — silently ignore */
    }
  }
  function wireSound() {
    const btn = $("#sound-toggle");
    btn.addEventListener("click", () => {
      soundOn = !soundOn;
      btn.textContent = "SFX: " + (soundOn ? "ON" : "OFF");
      btn.setAttribute("aria-pressed", String(soundOn));
      if (soundOn) playBlip(660);
    });
  }

  /* ---------- day / night theme ---------- */
  function renderStars(container, count) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 70 + "%";
      s.style.setProperty("--dur", 2 + Math.random() * 3 + "s");
      s.style.setProperty("--delay", -(Math.random() * 4) + "s");
      s.style.setProperty("--peak", (0.4 + Math.random() * 0.5).toFixed(2));
      container.appendChild(s);
    }
  }

  function applyTheme(theme) {
    if (theme === "night") {
      document.documentElement.setAttribute("data-theme", "night");
      $("#theme-toggle").textContent = "☀ DAY";
    } else {
      document.documentElement.removeAttribute("data-theme");
      $("#theme-toggle").textContent = "🌙 NIGHT";
    }
  }

  function wireTheme() {
    renderStars($("#hero-stars"), 40);
    renderStars($("#ambient-stars"), 50);
    $("#hero-moon").innerHTML = sprite("moon", 5);

    let saved = "day";
    try {
      saved = localStorage.getItem("theme") || "day";
    } catch (e) {}
    applyTheme(saved);

    $("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "night" ? "day" : "night";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      playBlip(next === "night" ? 440 : 660);
    });
  }

  /* ---------- weather ---------- */
  function wireWeather() {
    const states = ["clear", "rain", "snow"];
    const labels = { clear: "☀ CLEAR", rain: "🌧 RAIN", snow: "❄ SNOW" };
    let idx = 0;
    const field = $("#weather-field");
    const btn = $("#weather-toggle");

    function renderWeather(state) {
      field.innerHTML = "";
      btn.textContent = labels[state];
      if (prefersReducedMotion() || state === "clear") return;
      const count = state === "rain" ? 44 : 26;
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = state === "rain" ? "rain-drop" : "snow-flake";
        el.style.left = Math.random() * 100 + "%";
        if (state === "rain") {
          const dur = 0.5 + Math.random() * 0.4;
          el.style.animationDuration = dur + "s";
          el.style.animationDelay = -(Math.random() * dur) + "s";
        } else {
          const dur = 6 + Math.random() * 6;
          el.style.animationDuration = dur + "s";
          el.style.animationDelay = -(Math.random() * dur) + "s";
          el.style.setProperty("--size", 3 + Math.round(Math.random() * 3) + "px");
          el.style.setProperty("--sway", Math.round((Math.random() - 0.5) * 100) + "px");
        }
        field.appendChild(el);
      }
    }

    btn.addEventListener("click", () => {
      idx = (idx + 1) % states.length;
      renderWeather(states[idx]);
      playBlip(520 + idx * 80);
    });
  }

  /* ---------- XP bar: fills as you scroll through the page ---------- */
  function wireXpBar() {
    const fill = $("#xp-fill");
    let ticking = false;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      fill.style.width = pct + "%";
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- custom pixel cursor ---------- */
  function wireCursor() {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    const arrow = "data:image/svg+xml," + encodeURIComponent(sprite("cursor", 2));
    const point = "data:image/svg+xml," + encodeURIComponent(sprite("cursorPoint", 3));
    document.documentElement.style.cursor = `url("${arrow}") 1 1, auto`;
    const style = document.createElement("style");
    style.textContent = `
      button, a, .item, .map-pin, .hero__mascot, input, select, textarea, [role="button"] {
        cursor: url("${point}") 10 10, pointer;
      }
    `;
    document.head.appendChild(style);
  }

  /* ---------- overworld mini-map ---------- */
  const TILE_MAP = [
    "ggtggggtggg",
    "ggpppppppgg",
    "gtpggtggpgg",
    "ggpgwwggppg",
    "ggpgwwgtpgg",
    "gtpppppppgg",
    "gggtgggggtg",
  ];
  const MAP_PINS = [
    { row: 1, col: 3, label: "01", target: "about", title: "Trainer Card" },
    { row: 1, col: 7, label: "02", target: "education", title: "Quest Log" },
    { row: 3, col: 8, label: "03", target: "work", title: "World Map" },
    { row: 5, col: 5, label: "04", target: "projects", title: "Item Bag" },
    { row: 5, col: 8, label: "05", target: "contact", title: "Talk to NPC" },
    { row: 1, col: 5, label: "06", target: "patches", title: "Patch Notes" },
  ];

  function renderMap() {
    const stage = $("#map-stage");
    const tiles = document.createElement("div");
    tiles.className = "map-modal__tiles";
    TILE_MAP.forEach((row, r) => {
      row.split("").forEach((cell, c) => {
        const tile = document.createElement("div");
        const alt = (r + c) % 2 === 0;
        if (cell === "w") tile.className = "tile tile--water";
        else if (cell === "p") tile.className = "tile tile--path";
        else tile.className = "tile " + (alt ? "tile--grass" : "tile--grass-alt");
        if (cell === "t") {
          const t = document.createElement("div");
          t.className = "tile__tree";
          t.innerHTML = sprite("tree", 2);
          tile.appendChild(t);
        }
        tiles.appendChild(tile);
      });
    });
    stage.appendChild(tiles);

    const pins = document.createElement("div");
    pins.className = "map-modal__pins";
    MAP_PINS.forEach((p) => {
      const btn = document.createElement("button");
      btn.className = "map-pin";
      btn.title = p.title;
      btn.style.left = `calc(var(--tile-size) * ${p.col} + var(--tile-size) / 2)`;
      btn.style.top = `calc(var(--tile-size) * ${p.row} + var(--tile-size) / 2)`;
      btn.innerHTML = `<span>${p.label}</span>`;
      btn.addEventListener("click", () => {
        closeMap();
        const el = document.getElementById(p.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        playBlip(520);
      });
      pins.appendChild(btn);
    });
    stage.appendChild(pins);
  }

  function openMap() {
    $("#map-modal").classList.add("is-open");
    $("#map-modal").setAttribute("aria-hidden", "false");
    playBlip(740);
  }
  function closeMap() {
    $("#map-modal").classList.remove("is-open");
    $("#map-modal").setAttribute("aria-hidden", "true");
  }
  function wireMap() {
    renderMap();
    $("#map-toggle").addEventListener("click", openMap);
    $("#map-close").addEventListener("click", closeMap);
    $("#map-modal").addEventListener("click", (e) => {
      if (e.target.id === "map-modal") closeMap();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMap();
    });
  }

  /* ---------- easter egg: Konami code / mascot taps → shiny + leaves ---------- */
  function showToast(text) {
    const toast = $("#egg-toast");
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 4200);
  }

  function spawnLeaves(count) {
    const field = $("#leaf-field");
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const leaf = document.createElement("div");
        leaf.className = "falling-leaf";
        leaf.innerHTML = sprite("leaf", 3);
        leaf.style.left = Math.random() * 100 + "vw";
        leaf.style.setProperty("--drift", Math.round((Math.random() - 0.5) * 160) + "px");
        const duration = 3 + Math.random() * 2.5;
        leaf.style.animationDuration = duration + "s";
        field.appendChild(leaf);
        setTimeout(() => leaf.remove(), duration * 1000 + 200);
      }, i * 110);
    }
  }

  function triggerEasterEgg() {
    const mascots = $$("#hero-mascot, #npc-mascot");
    shinyMode = true;
    mascots.forEach((m, i) => {
      m.innerHTML = sprite("blobShiny", m.id === "hero-mascot" ? 8 : 7);
      m.classList.add("is-shiny");
    });
    spawnLeaves(18);
    showToast("🍃 ACHIEVEMENT UNLOCKED\nSecret Grove Found! A shiny blob rustles by.");
    playBlip(988);
    setTimeout(() => playBlip(1318), 120);
    clearTimeout(triggerEasterEgg._t);
    triggerEasterEgg._t = setTimeout(() => {
      shinyMode = false;
      mascots.forEach((m) => {
        m.classList.remove("is-shiny");
        m.innerHTML = sprite("blobIdle", m.id === "hero-mascot" ? 8 : 7);
      });
    }, 8000);
  }

  function wireEasterEgg() {
    const code = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "KeyB", "KeyA",
    ];
    let pos = 0;
    document.addEventListener("keydown", (e) => {
      const key = e.code === "KeyB" || e.code === "KeyA" ? e.code : e.key;
      pos = key === code[pos] ? pos + 1 : key === code[0] ? 1 : 0;
      if (pos === code.length) {
        pos = 0;
        triggerEasterEgg();
      }
    });

    let taps = 0;
    let tapTimer = null;
    const hero = $("#hero-mascot");
    hero.addEventListener("click", () => {
      hero.classList.remove("is-squish");
      void hero.offsetWidth; // restart animation
      hero.classList.add("is-squish");
      playBlip(600 + taps * 30);
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (taps = 0), 1400);
      if (taps >= 7) {
        taps = 0;
        triggerEasterEgg();
      }
    });
  }

  function init() {
    renderAmbient();
    renderHero();
    renderTrainer();
    renderEducation();
    renderWork();
    renderProjects();
    renderContact();
    renderPatchNotes();
    wireNav();
    wireReveal();
    wireBlink();
    wireSound();
    wireMap();
    wireEasterEgg();
    wireTheme();
    wireWeather();
    wireXpBar();
    wireCursor();
    setTimeout(typeHeroText, 400);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
