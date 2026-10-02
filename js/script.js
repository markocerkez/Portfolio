/* Renders SITE_DATA into the page and wires up the small
   game-ish interactions (menu scroll, blink animation, reveal
   on scroll, chest-hover sound). No content lives in this file. */

(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function sprite(name, size) {
    return pixelSpriteSVG(SPRITES[name], PIXEL_PALETTE, size || 6);
  }

  /* ---------- hero ---------- */
  function renderHero() {
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
    $("#hero-tagline").textContent = SITE_DATA.meta.tagline;
    const introWrap = $("#hero-intro-lines");
    introWrap.innerHTML = "";
    SITE_DATA.meta.introLines.forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      introWrap.appendChild(p);
    });
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
    $("#contact-message").textContent = SITE_DATA.contact.message;
    const links = $("#contact-links");
    links.innerHTML = "";
    const c = SITE_DATA.contact;
    if (c.email) links.innerHTML += `<a href="mailto:${c.email}">✉ EMAIL</a>`;
    if (c.github) links.innerHTML += `<a href="${c.github}" target="_blank" rel="noopener">GITHUB</a>`;
    if (c.linkedin) links.innerHTML += `<a href="${c.linkedin}" target="_blank" rel="noopener">LINKEDIN</a>`;
    $("#footer-text").textContent = SITE_DATA.footer.text;
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
      mascots.forEach((m) => {
        m.innerHTML = sprite("blobBlink", m.id === "hero-mascot" ? 8 : 7);
      });
      setTimeout(() => {
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

  function init() {
    renderHero();
    renderTrainer();
    renderEducation();
    renderWork();
    renderProjects();
    renderContact();
    wireNav();
    wireReveal();
    wireBlink();
    wireSound();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
