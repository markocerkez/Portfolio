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
  // Reassigned by wireMenuToggle(); lets wireNav() collapse the mobile
  // drawer before scrolling (see wireNav for why that ordering matters).
  let closeMobileMenuInstant = function () {};

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Storage can throw (privacy mode, blocked cookies, sandboxed iframes) —
     every call site just wants "best effort", so centralize the try/catch. */
  function storageGet(store, key) {
    try {
      return store.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function storageSet(store, key, value) {
    try {
      store.setItem(key, value);
    } catch (e) {}
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
    const opened = new Set();
    SITE_DATA.projects.forEach((p, i) => {
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
      const markOpened = () => {
        opened.add(i);
        if (opened.size >= SITE_DATA.projects.length) unlockAchievement("treasure_hunter");
      };
      div.addEventListener("mouseenter", () => {
        playBlip(880);
        markOpened();
      });
      div.addEventListener("focus", markOpened);
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

  /* ---------- achievements ---------- */
  const ACHIEVEMENTS = [
    { id: "explorer", title: "World Explorer", desc: "Visit every section of the site.", icon: "badgeCompass" },
    { id: "treasure_hunter", title: "Treasure Hunter", desc: "Open every chest in the Item Bag.", icon: "chestClosed" },
    { id: "cartographer", title: "Cartographer", desc: "Open the overworld map.", icon: "badgeMap" },
    { id: "weather_watcher", title: "Weather Watcher", desc: "Try every kind of weather.", icon: "cloud:medium" },
    { id: "night_owl", title: "Night Owl", desc: "Switch to night mode.", icon: "moon" },
    { id: "secret_grove", title: "Secret Grove", desc: "Find the hidden easter egg.", icon: "leaf" },
    { id: "completionist", title: "Completionist", desc: "Unlock every other achievement.", icon: "badgeTrophy" },
  ];
  /* icon is a SPRITES name, or "cloud:<name>" for a CLOUDS entry */
  function badgeIconSVG(iconName, size) {
    if (iconName.startsWith("cloud:")) return cloudSprite(iconName.slice(6), size || 4);
    return sprite(iconName, size || 4);
  }
  let unlockedAchievements = new Set();
  function loadAchievements() {
    try {
      unlockedAchievements = new Set(JSON.parse(storageGet(localStorage, "achievements") || "[]"));
    } catch (e) {
      unlockedAchievements = new Set();
    }
  }
  function saveAchievements() {
    storageSet(localStorage, "achievements", JSON.stringify([...unlockedAchievements]));
  }
  function renderAchievements() {
    const wrap = $("#badge-shelf");
    if (!wrap) return;
    wrap.innerHTML = "";
    ACHIEVEMENTS.forEach((a) => {
      const unlocked = unlockedAchievements.has(a.id);
      const div = document.createElement("div");
      div.className = "badge " + (unlocked ? "is-unlocked" : "is-locked");
      const iconSvg = unlocked ? badgeIconSVG(a.icon) : sprite("badgeLocked", 4);
      div.innerHTML = `
        <span class="badge__icon">${iconSvg}</span>
        <span class="badge__title">${unlocked ? a.title : "???"}</span>
        <p class="badge__desc">${unlocked ? a.desc : "Hidden until unlocked."}</p>`;
      wrap.appendChild(div);
    });
  }
  function unlockAchievement(id, opts) {
    opts = opts || {};
    if (unlockedAchievements.has(id)) return;
    unlockedAchievements.add(id);
    saveAchievements();
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a && !opts.silent) {
      showToast(`ACHIEVEMENT UNLOCKED\n${a.title} — ${a.desc}`);
      playBlip(988);
      setTimeout(() => playBlip(1318), 120);
    }
    renderAchievements();
    const others = ACHIEVEMENTS.filter((x) => x.id !== "completionist");
    if (id !== "completionist" && others.every((x) => unlockedAchievements.has(x.id))) {
      setTimeout(() => unlockAchievement("completionist"), 1200);
    }
  }

  /* ---------- menu + scroll ---------- */
  function wireNav() {
    $$(".menu button, #scroll-start").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.target || "about";
        const el = document.getElementById(id);
        // Collapse the mobile drawer (if open) *before* scrolling, not
        // after: closing it animated at the same time as the scroll
        // shrinks the sticky header mid-animation and the scroll
        // overshoots the target. Closing it first means scrollIntoView
        // measures the already-collapsed layout.
        closeMobileMenuInstant();
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        playBlip(520);
      });
    });
    $("#back-to-top").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      playBlip(520);
    });
  }

  /* ---------- collapsible mobile menu ---------- */
  function wireMenuToggle() {
    const btn = $("#menu-toggle");
    const controls = $("#topbar-controls");
    if (!btn || !controls) return;
    // Must match the CSS breakpoint below — the menu only actually
    // collapses (and should only go inert) under this width. Above it,
    // .topbar__controls is always fully visible regardless of the
    // is-open class, so it must never be inert there.
    const mobileQuery = window.matchMedia("(max-width: 760px)");

    function syncInert() {
      controls.inert = mobileQuery.matches && !controls.classList.contains("is-open");
    }

    function setOpen(open) {
      controls.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "✕ CLOSE" : "☰ MENU";
      syncInert();
    }

    btn.addEventListener("click", () => {
      const open = !controls.classList.contains("is-open");
      setOpen(open);
      playBlip(open ? 660 : 440);
    });

    // picking anything inside closes the menu again — it's meant to be a
    // quick drawer on a phone, not a panel you leave open over the page.
    // (wireNav's own click handler already closes it instantly before
    // scrolling for nav buttons; this animated path covers the other
    // controls — map/weather/theme/sound — which don't scroll.)
    controls.addEventListener("click", (e) => {
      if (e.target.closest("button")) setOpen(false);
    });

    closeMobileMenuInstant = function () {
      if (!controls.classList.contains("is-open")) return;
      controls.style.transition = "none";
      setOpen(false);
      void controls.offsetHeight; // force reflow before re-enabling the transition
      requestAnimationFrame(() => {
        controls.style.transition = "";
      });
    };

    mobileQuery.addEventListener("change", syncInert);
    syncInert();
  }

  /* ---------- reveal-on-scroll ---------- */
  function wireReveal() {
    const panels = $$(".panel");
    const statFills = $$(".stat-bar__fill");
    const visited = new Set();
    const explorerTargets = ["about", "education", "work", "projects", "contact"];
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
            visited.add(entry.target.id);
            if (explorerTargets.every((id) => visited.has(id))) {
              unlockAchievement("explorer");
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
      unlockAchievement("night_owl");
    } else {
      document.documentElement.removeAttribute("data-theme");
      $("#theme-toggle").textContent = "🌙 NIGHT";
    }
  }

  function wireTheme() {
    renderStars($("#hero-stars"), 40);
    renderStars($("#ambient-stars"), 50);
    $("#hero-moon").innerHTML = sprite("moon", 5);

    applyTheme(storageGet(localStorage, "theme") || "day");

    $("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "night" ? "day" : "night";
      applyTheme(next);
      storageSet(localStorage, "theme", next);
      playBlip(next === "night" ? 440 : 660);
    });
  }

  /* ---------- weather ---------- */
  function wireWeather() {
    const states = ["clear", "rain", "snow"];
    const labels = { clear: "☀ CLEAR", rain: "🌧 RAIN", snow: "❄ SNOW" };
    let idx = 0;
    const tried = new Set();
    const field = $("#weather-field");
    const btn = $("#weather-toggle");

    function renderWeather(state) {
      field.innerHTML = "";
      btn.textContent = labels[state];
      if (state !== "clear") {
        tried.add(state);
        if (tried.has("rain") && tried.has("snow")) unlockAchievement("weather_watcher");
      }
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

  /* ---------- tab-title easter egg ---------- */
  function wireTabTitleTrick() {
    const original = document.title;
    document.addEventListener("visibilitychange", () => {
      document.title = document.hidden ? "👋 Come back!" : original;
    });
  }

  /* ---------- boot screen ---------- */
  function wireBoot() {
    const screen = $("#boot-screen");
    if (!screen) return;
    const seen = storageGet(sessionStorage, "booted") === "1";
    if (seen || prefersReducedMotion()) {
      screen.remove();
      return;
    }
    const fill = $("#boot-fill");
    let pct = 0;
    const id = setInterval(() => {
      pct += 8 + Math.random() * 12;
      if (pct >= 100) {
        pct = 100;
        fill.style.width = "100%";
        clearInterval(id);
        storageSet(sessionStorage, "booted", "1");
        setTimeout(() => {
          screen.classList.add("is-hidden");
          setTimeout(() => screen.remove(), 500);
        }, 250);
        return;
      }
      fill.style.width = pct + "%";
    }, 90);
  }

  /* ---------- scroll effects: XP bar fill + "current section" compass ----------
     Both only need to know the scroll position, so they share one
     rAF-gated listener instead of each registering their own. */
  const SECTION_LABELS = {
    about: "TRAINER CARD",
    education: "QUEST LOG",
    work: "WORLD MAP",
    projects: "ITEM BAG",
    contact: "TALK TO NPC",
    patches: "PATCH NOTES",
  };
  function wireScrollEffects() {
    const fill = $("#xp-fill");
    const compass = $("#compass");
    const compassLabel = $("#compass-label");
    const sections = $$("main section");

    function updateXpBar() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      fill.style.width = pct + "%";
    }

    function updateCompass() {
      const markerY = window.innerHeight * 0.35;
      let current = null;
      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= markerY && r.bottom >= markerY) {
          current = sec.id;
          break;
        }
      }
      if (current && SECTION_LABELS[current]) {
        compassLabel.textContent = SECTION_LABELS[current];
        compass.classList.add("is-visible");
      } else {
        compass.classList.remove("is-visible");
      }
    }

    let ticking = false;
    function update() {
      updateXpBar();
      updateCompass();
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
    window.addEventListener("resize", updateXpBar);
    update();
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
    MAP_PINS.forEach((p, i) => {
      // The pop-in animation lives on this wrapper so it never fights
      // with the pin button's own rotate/hover transform.
      const wrap = document.createElement("div");
      wrap.className = "map-pin-pop";
      wrap.style.left = `calc(var(--tile-size) * ${p.col} + var(--tile-size) / 2)`;
      wrap.style.top = `calc(var(--tile-size) * ${p.row} + var(--tile-size) / 2)`;
      wrap.style.setProperty("--i", i);

      const btn = document.createElement("button");
      btn.className = "map-pin";
      btn.title = p.title;
      btn.innerHTML = `<span>${p.label}</span>`;
      btn.addEventListener("click", () => {
        closeMap();
        const el = document.getElementById(p.target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        playBlip(520);
      });
      wrap.appendChild(btn);
      pins.appendChild(wrap);
    });
    stage.appendChild(pins);
  }

  function openMap() {
    $("#map-modal").classList.add("is-open");
    $("#map-modal").setAttribute("aria-hidden", "false");
    playBlip(740);
    unlockAchievement("cartographer");
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

  /* ---------- toast queue (achievements + easter egg share this) ---------- */
  const toastQueue = [];
  let toastBusy = false;
  function showToast(text, duration) {
    toastQueue.push({ text, duration: duration || 4200 });
    if (!toastBusy) advanceToastQueue();
  }
  function advanceToastQueue() {
    const next = toastQueue.shift();
    if (!next) {
      toastBusy = false;
      return;
    }
    toastBusy = true;
    const toast = $("#egg-toast");
    toast.textContent = next.text;
    toast.classList.add("is-visible");
    setTimeout(() => {
      toast.classList.remove("is-visible");
      // leave time for the fade-out transition before the next one appears
      setTimeout(advanceToastQueue, 300);
    }, next.duration);
  }

  /* ---------- easter egg: Konami code / mascot taps → shiny + leaves ---------- */

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
    showToast("ACHIEVEMENT UNLOCKED\nSecret Grove Found! A shiny blob rustles by.");
    unlockAchievement("secret_grove", { silent: true });
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
    wireBoot();
    loadAchievements();
    renderAchievements();
    renderAmbient();
    renderHero();
    renderTrainer();
    renderEducation();
    renderWork();
    renderProjects();
    renderContact();
    renderPatchNotes();
    wireNav();
    wireMenuToggle();
    wireReveal();
    wireBlink();
    wireSound();
    wireMap();
    wireEasterEgg();
    wireTheme();
    wireWeather();
    wireScrollEffects();
    wireCursor();
    wireTabTitleTrick();
    setTimeout(typeHeroText, 400);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
