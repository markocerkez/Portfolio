/* ============================================================
   LANGUAGES - UI strings + German overrides for SITE_DATA.
   English lives in content.js (SITE_DATA) and in I18N.en below.
   SITE_DATA_DE only lists what differs; script.js merges it over
   SITE_DATA by position, so arrays here must keep the same order
   and length as their English twins. Swiss spelling: "ss", no ß.
   ============================================================ */

const I18N = {
  en: {
    skip: "Skip to content",
    loading: "LOADING...",
    nav_about: "ABOUT",
    nav_education: "EDUCATION",
    nav_work: "EXPERIENCE",
    nav_projects: "PROJECTS",
    nav_contact: "CONTACT",
    nav_patches: "CHANGELOG",
    h_about: "ABOUT ME",
    h_education: "EDUCATION",
    h_work: "EXPERIENCE",
    h_projects: "PROJECTS",
    h_contact: "CONTACT",
    h_patches: "CHANGELOG",
    map: "MAP",
    map_title: "Open the overworld map",
    weather_title: "Cycle the weather",
    theme_title: "Toggle day / night",
    sound_title: "Toggle sound",
    lang_title: "Switch language",
    lang_label: "LANG: EN",
    sfx: "SFX: ",
    on: "ON",
    off: "OFF",
    clear: "CLEAR",
    rain: "RAIN",
    snow: "SNOW",
    day: "DAY",
    night: "NIGHT",
    press_start: "PRESS START ▾",
    lbl_name: "NAME",
    lbl_role: "ROLE",
    lbl_from: "FROM",
    resume: "GET SCROLL OF RESUME",
    done: "COMPLETED",
    progress: "IN PROGRESS",
    open: "OPEN ▸",
    projects_hint: "Hover or tap a chest to open it.",
    map_header: "OVERWORLD MAP",
    map_hint: "Click a numbered flag to warp to that part of the site.",
    close: "✕ CLOSE",
    top: "▲ TOP",
    achievements: "ACHIEVEMENTS",
    locked: "Hidden until unlocked.",
    ach_unlocked: "ACHIEVEMENT UNLOCKED",
    grove: "Secret Grove Found! A shiny blob rustles by.",
    come_back: "Come back!",
    game_btn: "▶ BLOB CATCH",
    game_title: "BLOB CATCH",
    game_hint: "Catch as many blobs as you can in 20 seconds.",
    game_score: "SCORE",
    game_best: "BEST",
    game_time: "TIME",
    game_start: "START",
    game_again: "PLAY AGAIN",
    game_over: "TIME'S UP!",
    game_new_best: "NEW BEST!",
    meta_desc: "Marko Cerkez - portfolio: education, experience and projects, retro-game style.",
    meta_og: "A retro, pixel-art portfolio - about, education, experience, projects and more.",
    keys_help: "KEYS\n1-6 jump to a section\nJ / K next / previous section\nM map   ? this help",
  },
  de: {
    skip: "Zum Inhalt springen",
    loading: "LADEN...",
    nav_about: "ÜBER MICH",
    nav_education: "AUSBILDUNG",
    nav_work: "ERFAHRUNG",
    nav_projects: "PROJEKTE",
    nav_contact: "KONTAKT",
    nav_patches: "CHANGELOG",
    h_about: "ÜBER MICH",
    h_education: "AUSBILDUNG",
    h_work: "ERFAHRUNG",
    h_projects: "PROJEKTE",
    h_contact: "KONTAKT",
    h_patches: "CHANGELOG",
    map: "KARTE",
    map_title: "Weltkarte öffnen",
    weather_title: "Wetter wechseln",
    theme_title: "Tag / Nacht umschalten",
    sound_title: "Ton ein- / ausschalten",
    lang_title: "Sprache wechseln",
    lang_label: "SPRACHE: DE",
    sfx: "SFX: ",
    on: "EIN",
    off: "AUS",
    clear: "KLAR",
    rain: "REGEN",
    snow: "SCHNEE",
    day: "TAG",
    night: "NACHT",
    press_start: "START DRÜCKEN ▾",
    lbl_name: "NAME",
    lbl_role: "ROLLE",
    lbl_from: "WOHNORT",
    resume: "LEBENSLAUF-ROLLE HOLEN",
    done: "ABGESCHLOSSEN",
    progress: "IN ARBEIT",
    open: "ÖFFNEN ▸",
    projects_hint: "Mit der Maus über eine Truhe fahren oder tippen, um sie zu öffnen.",
    map_header: "WELTKARTE",
    map_hint: "Klicke auf eine nummerierte Flagge, um zu diesem Abschnitt zu springen.",
    close: "✕ SCHLIESSEN",
    top: "▲ NACH OBEN",
    achievements: "ERFOLGE",
    locked: "Verborgen, bis freigeschaltet.",
    ach_unlocked: "ERFOLG FREIGESCHALTET",
    grove: "Geheimer Hain gefunden! Ein glänzender Blob raschelt vorbei.",
    come_back: "Komm zurück!",
    game_btn: "▶ BLOB-JAGD",
    game_title: "BLOB-JAGD",
    game_hint: "Fange in 20 Sekunden so viele Blobs wie möglich.",
    game_score: "PUNKTE",
    game_best: "REKORD",
    game_time: "ZEIT",
    game_start: "START",
    game_again: "NOCHMAL",
    game_over: "ZEIT ABGELAUFEN!",
    game_new_best: "NEUER REKORD!",
    meta_desc: "Marko Cerkez - Portfolio: Ausbildung, Erfahrung und Projekte im Retro-Game-Stil.",
    meta_og: "Ein Retro-Portfolio im Pixel-Look - über mich, Ausbildung, Erfahrung, Projekte und mehr.",
    keys_help: "TASTEN\n1-6 zum Abschnitt springen\nJ / K nächster / voriger Abschnitt\nM Karte   ? diese Hilfe",
  },
};

const ACHIEVEMENTS_DE = {
  explorer: { title: "Weltentdecker", desc: "Besuche jeden Abschnitt der Seite." },
  treasure_hunter: { title: "Schatzjäger", desc: "Öffne jede Truhe im Beutel." },
  cartographer: { title: "Kartograf", desc: "Öffne die Weltkarte." },
  weather_watcher: { title: "Wetterfrosch", desc: "Probiere jedes Wetter aus." },
  night_owl: { title: "Nachteule", desc: "Wechsle in den Nachtmodus." },
  secret_grove: { title: "Geheimer Hain", desc: "Finde das versteckte Easter Egg." },
  root_access: { title: "Root-Zugriff", desc: "Öffne den Entwicklermodus." },
  blob_catcher: { title: "Blob-Fänger", desc: "Erreiche 10 Punkte bei der Blob-Jagd." },
  completionist: { title: "Komplettist", desc: "Schalte alle anderen Erfolge frei." },
};

const SITE_DATA_DE = {
  meta: {
    role: "Software Engineer // Java-Trainer",
    tagline: "EIN WILDER ENTWICKLER ERSCHEINT!",
    introLines: [
      "Hallo, ich bin Marko - Software Engineer und Java-Trainer aus der Schweiz.",
      "Scrolle nach unten, um meine Quests, Items und Werte zu sehen.",
    ],
  },
  trainer: {
    class: "SOFTWARE ENGINEER & JAVA-TRAINER",
    location: "Lenzburg, Schweiz",
    bio: "Ehrgeiziger Software Engineer mit Leidenschaft für sauberen Code, knifflige Probleme und das Weitergeben von Wissen. Ausserhalb der Arbeit drucke ich Prototypen in 3D, tüftle an meinem Homelab oder trainiere meinen Hund.",
  },
  education: [
    { notes: "Grundlagen in Software Engineering, Algorithmen und Systemdesign." },
    { period: "2025 – heute", notes: "Vertiefung in Software-Systems-Engineering." },
  ],
  work: [
    {
      role: "Software Engineer",
      period: "Feb 2026 – heute",
      description: "Entwicklung und Wartung von Software im Engineering-Team.",
    },
    {
      role: "Java-Trainer",
      period: "Mär 2026 – heute",
      description:
        "Ich unterrichte Java-Kurse an der Digicomp Academy AG. Davor war ich fast 3 Jahre als Technical Service Supporter dort tätig (Hard- und Software-Setup, Netzwerküberwachung, technischer Support in den Kursräumen), bevor ich ins Training gewechselt habe.",
    },
    {
      role: "Software Engineer",
      period: "Nov 2025 – Feb 2026",
      description:
        "Unterstützung und Wartung von Software für Kunden der öffentlichen Hand - Benutzerverwaltung, Infrastrukturüberwachung und direkter Kundensupport.",
    },
  ],
  projects: [
    {
      description: "Ein Proof-of-Concept-Informationssystem, entstanden während meiner Zeit an der Digicomp Academy - vom Konzept bis zur Umsetzung.",
    },
    {
      name: "Knock - Masterprojekt",
      description:
        "Mein Masterprojekt an der UZH mit der HASEL-Forschungsgruppe: ein physisches Touchscreen-Gerät, mit dem Kolleginnen und Kollegen im selben Raum ihre Verfügbarkeit aushandeln, bevor sie sich gegenseitig unterbrechen - anklopfen, Thema und Dringlichkeit wählen und in Sekunden ein Annehmen / Verschieben / Ablehnen zurückbekommen. Im Dreierteam von Grund auf gebaut: ESP32-S3-Firmware, Spring-Boot-Backend und eine Vue-3-Web-App.",
    },
    {
      name: "Bachelorarbeit - Jupy-Canvas-Erweiterungen",
      description:
        "Meine Bachelorarbeit als Beitrag zu Jupy-Canvas: ein Tool, das Jupyter-Notebooks auf einer unbegrenzten 2D-Fläche neu denkt. Beliebig verzweigen, wobei jeder Zweig einen eigenen unabhängigen Kernel erhält; Kernel in Gruppen organisieren und über Kanten verbinden, wobei Änderungen in einem Eltern-Kernel automatisch an die Kinder weitergegeben werden.",
    },
    {
      name: "Homelab & selbst gehostete Infrastruktur",
      description: "Ein privates Homelab mit selbst gehosteten Diensten - eine dauerhafte Spielwiese, um Netzwerke, Infrastruktur und Betrieb zu lernen.",
    },
  ],
  contact: {
    message: "Lust auf Zusammenarbeit, Anstellung oder einfach Hallo sagen? Melde dich unten!",
  },
  footer: {
    text: "Marko Cerkez - Pixel für Pixel gebaut.",
  },
  patchNotes: [
    {
      notes: [
        "Tastenkürzel: 1-6 springen zu einem Abschnitt, J / K blättern durch, M öffnet die Karte, ? zeigt die Liste.",
        "Ton- und Wettereinstellungen werden jetzt zwischen Besuchen gespeichert.",
      ],
    },
    {
      notes: [
        "Die ganze Seite spricht jetzt auch Deutsch - umschalten mit dem SPRACHE-Knopf (startet in der Sprache deines Browsers).",
        "Blob-Jagd hinzugefügt, ein 20-Sekunden-Minispiel hinter der Karte. Erreiche 10 Punkte für ein Abzeichen.",
        "Entwicklermodus für alle, die den richtigen Befehl tippen. Zwei neue Erfolge zu finden.",
      ],
    },
    {
      notes: [
        "Das Wetter verändert jetzt die Landschaft - Regen und Schnee färben Himmel, Boden und Bäume um, statt nur Tropfen darüberzulegen.",
        "Der Nachtmodus ist jetzt ein vollständiges Dark Theme für die ganze Seite statt nur ein anderer Hero-Hintergrund.",
        "Alle Abschnitte tragen jetzt schlichte, CV-artige Titel, und das Trainer-Porträt wurde als Kopf-und-Schultern-Bild neu gestaltet.",
      ],
    },
    {
      notes: [
        "Tag-/Nacht-Zyklus, Schreibmaschinen-Dialoge und umschaltbares Wetter hinzugefügt.",
        "XP-Leiste, Lebenslauf-Rolle zum Einsammeln und ein eigener Pixel-Cursor hinzugefügt.",
      ],
    },
    {
      notes: [
        "8-Bit-Wolken, schwebender Blütenstaub und flatternde Schmetterlinge ziehen jetzt durch die Welt.",
        "Fehler behoben, bei dem Schatztruhen und Bäume nur als leere Umrisse dargestellt wurden.",
      ],
    },
    {
      notes: [
        "Begehbare Überwelt-Minikarte hinzugefügt.",
        "Ein sehr gut verstecktes Easter Egg hinzugefügt. Viel Glück beim Suchen.",
      ],
    },
    {
      notes: [
        "Portfolio-Modul eingesteckt: Trainerkarte, Questlog, Weltkarte, Itembeutel und NPC-Dialog sind online.",
      ],
    },
  ],
};
