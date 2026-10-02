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
    role: "??? Software Engineer // Java Instructor",
    tagline: "A WILD DEVELOPER APPEARED!",
    // One or two short lines for the hero "intro box".
    introLines: [
      "??? Hi, I'm Marko — welcome to my portfolio.",
      "??? Scroll down to see my quests, items & stats.",
    ],
  },

  // "TRAINER CARD" — your about-me stat screen.
  trainer: {
    photo: null, // e.g. "assets/avatar.png" — leave null to keep the blob mascot
    class: "??? FULL-STACK DEVELOPER",
    location: "??? Switzerland",
    bio: "??? Write 2-3 sentences about yourself here: who you are, what you're into, what you're working on right now.",
    // Path to your CV/resume PDF — drop the file into assets/ and point this
    // at it. Leave as "" to hide the "Get Scroll of Resume" button entirely.
    resumeUrl: "assets/resume.pdf",
    // Skill bars, 0-100. Add/remove as many as you like.
    stats: [
      { label: "JAVA", value: 0 },
      { label: "SPRING", value: 0 },
      { label: "SQL", value: 0 },
      { label: "JAVASCRIPT", value: 0 },
      { label: "GIT", value: 0 },
      { label: "TEACHING", value: 0 },
    ],
  },

  // "QUEST LOG" — education. status: "done" or "active".
  education: [
    {
      status: "done",
      title: "??? Bachelor of Science in ???",
      place: "??? University / School name",
      period: "??? 20XX",
      notes: "??? One line about your thesis, focus or honors.",
    },
    {
      status: "active",
      title: "??? Master of Science in ???",
      place: "??? University / School name",
      period: "??? 20XX – present",
      notes: "??? One line about your focus area or thesis topic.",
    },
  ],

  // "WORLD MAP" — work experience. icon: "briefcase" or "book".
  work: [
    {
      icon: "briefcase",
      role: "??? Your Job Title",
      company: "??? Company name",
      period: "??? 20XX – present",
      description: "??? What you do day to day, in a sentence or two.",
    },
    {
      icon: "book",
      role: "Java Instructor",
      company: "Digicomp Academy AG",
      period: "??? 20XX – present",
      description:
        "??? Teaching Java courses at Digicomp Academy AG — add details on who you teach, which courses, or anything you're proud of.",
    },
  ],

  // "ITEM BAG" — projects. Each one renders as a treasure chest card.
  // Add as many entries as you like; the grid wraps automatically.
  projects: [
    {
      name: "??? Project One",
      tech: ["Java", "???"],
      description: "??? Short description of what this project does.",
      link: "", // GitHub/live link, or leave empty
    },
    {
      name: "??? Project Two",
      tech: ["???"],
      description: "??? Short description of what this project does.",
      link: "",
    },
    {
      name: "??? Project Three",
      tech: ["???"],
      description: "??? Short description of what this project does.",
      link: "",
    },
    {
      name: "??? Project Four",
      tech: ["???"],
      description: "??? Short description of what this project does.",
      link: "",
    },
  ],

  // "TALK TO NPC" — contact / social links. Leave a value "" to hide it.
  contact: {
    email: "",
    github: "https://github.com/markocerkez",
    linkedin: "",
    message:
      "??? Want to team up, hire me, or just say hi? Reach out below!",
  },

  footer: {
    text: "??? Marko Cerkez — built pixel by pixel.",
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
