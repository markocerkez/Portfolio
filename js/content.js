/* ============================================================
   CARTRIDGE DATA — edit this file to fill in your real info.
   Everything shown on the page is pulled from the SITE_DATA
   object below. "???" marks a placeholder — swap it out, keep
   quotes and commas as they are, save, and refresh the page.
   No other file needs to change.
   ============================================================ */

const SITE_DATA = {
  meta: {
    // Shown in the browser tab and at the very top of the page.
    name: "MARKO CERKEZ",
    role: "Software Engineer // Java Trainer",
    tagline: "A WILD DEVELOPER APPEARED!",
    // One or two short lines for the hero "intro box".
    introLines: [
      "Hi, I'm Marko — Software Engineer and Java Trainer based in Switzerland.",
      "Scroll down to see my quests, items & stats.",
    ],
  },

  // "TRAINER CARD" — your about-me stat screen.
  trainer: {
    photo: null, // e.g. "assets/avatar.png" for a real photo — leave null for the pixel-art portrait
    class: "SOFTWARE ENGINEER & JAVA TRAINER",
    location: "Lenzburg, Switzerland",
    bio: "Ambitious software engineer with a passion for clean code, solving tricky problems, and teaching others how to do the same. Outside of work I'm usually 3D-printing prototypes, tinkering with my homelab, or training my dog.",
    // Path to your CV/resume PDF — drop the file into assets/ and point this
    // at it. Leave as "" to hide the "Get Scroll of Resume" button entirely.
    resumeUrl: "assets/resume.pdf", // currently the German CV — swap in an English one whenever you have it
    // Skill bars, 0-100. Rough estimates from your CV's skill bars —
    // tweak freely, these were never meant to be exact.
    stats: [
      { label: "JAVA", value: 85 },
      { label: "PYTHON", value: 80 },
      { label: "JAVASCRIPT", value: 70 },
      { label: "TYPESCRIPT", value: 65 },
      { label: "SQL", value: 60 },
      { label: "RUST", value: 25 },
    ],
  },

  // "QUEST LOG" — education. status: "done" or "active".
  education: [
    {
      status: "done",
      title: "Bachelor of Science in Software Systems",
      place: "University of Zürich",
      period: "2022 – 2025",
      notes: "Foundations in software engineering, algorithms, and systems design.",
    },
    {
      status: "active",
      title: "Master of Science in Software Systems",
      place: "University of Zürich",
      period: "2025 – present",
      notes: "Deepening expertise in software systems engineering.",
    },
  ],

  // "WORLD MAP" — work experience. icon: "briefcase" or "book".
  work: [
    {
      icon: "briefcase",
      role: "Software Engineer",
      company: "Sobrado Software AG",
      period: "Feb 2026 – present",
      description: "Building and maintaining software as part of the engineering team.",
    },
    {
      icon: "book",
      role: "Java Trainer",
      company: "Digicomp Academy AG",
      period: "Mar 2026 – present",
      description:
        "Teaching Java courses at Digicomp Academy AG. Previously spent almost 3 years there as Technical Service Supporter (hardware/software setup, network monitoring, course-room tech support) before moving into training.",
    },
    {
      icon: "briefcase",
      role: "Software Engineer",
      company: "ATEGRA Software Engineering",
      period: "Nov 2025 – Feb 2026",
      description:
        "Supported and maintained software for public-sector clients — user administration, infrastructure monitoring, and direct client support.",
    },
  ],

  // "ITEM BAG" — projects. Each one renders as a treasure chest card.
  // Add as many entries as you like; the grid wraps automatically.
  projects: [
    {
      name: "Info System",
      tech: ["???"],
      description: "A proof-of-concept information system built during my time at Digicomp Academy, from concept to implementation.",
      link: "", // GitHub/live link, or leave empty
    },
    {
      name: "Knock — Master's Project",
      tech: ["ESP32 / C++", "Spring Boot", "Vue 3 / TypeScript", "PostgreSQL"],
      description: "My Master's project at UZH, with the HASEL research group: a dedicated physical touchscreen device that lets co-located colleagues negotiate availability before interrupting each other — knock, pick a topic and urgency, and get an accept / defer / decline back in seconds. Built end-to-end with a team of three: ESP32-S3 firmware, a Spring Boot backend, and a Vue 3 web app.",
      link: "",
    },
    {
      name: "Bachelor's Thesis — Jupy-Canvas Enhancements",
      tech: ["Python", "Jupyter"],
      description: "My bachelor's thesis, extending Jupy-Canvas — a Jupyter-notebook-based coding tool — with new capabilities.",
      link: "",
    },
    {
      name: "Homelab & Self-Hosted Infrastructure",
      tech: ["???"],
      description: "A personal homelab running self-hosted services — an ongoing sandbox for learning networking, infrastructure, and ops.",
      link: "",
    },
  ],

  // "TALK TO NPC" — contact / social links. Leave a value "" to hide it.
  contact: {
    email: "marko.cerkez@bluewin.ch",
    github: "https://github.com/markocerkez",
    linkedin: "https://www.linkedin.com/in/marko.cerkez",
    message: "Want to team up, hire me, or just say hi? Reach out below!",
  },

  footer: {
    text: "Marko Cerkez — built pixel by pixel.",
  },

  // "PATCH NOTES" — a changelog for the site itself. Add a new entry
  // (to the top of the array) whenever you update your portfolio — it's
  // a nice bit of flavor and doubles as a real log of what changed.
  patchNotes: [
    {
      version: "v1.3",
      notes: [
        "Added a day/night cycle, typewriter dialogue, and toggleable weather.",
        "Added an XP bar, a resume scroll pickup, and a custom pixel cursor.",
      ],
    },
    {
      version: "v1.2",
      notes: [
        "8-bit clouds, floating pollen and fluttering butterflies now drift through the world.",
        "Fixed a bug where treasure chests and trees rendered as empty outlines.",
      ],
    },
    {
      version: "v1.1",
      notes: [
        "Added an openable overworld mini-map.",
        "Added a very well-hidden easter egg. Good luck finding it.",
      ],
    },
    {
      version: "v1.0",
      notes: [
        "Portfolio cartridge inserted: trainer card, quest log, world map, item bag and NPC dialogue online.",
      ],
    },
  ],
};
