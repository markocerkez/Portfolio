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
};
