// All site copy lives here. Facts follow "public/daniel master resume.pdf",
// plus detail the one-page resume leaves out for space. Where the two differ,
// the resume wins, except the year Daniel started coding (2020), which the
// resume currently misstates.

export const profile = {
  name: "Daniel Adegoke",
  fullName: "Daniel Mofopefoluwa Adegoke",
  role: "Software Engineer",
  location: "Famagusta, Cyprus",
  city: "Famagusta",
  timeZone: "Europe/Nicosia",
  availability:
    "Remote contract ready (GMT-1 to GMT+5) and open to relocation (EU, UK, US, Canada). Nigerian citizen in Cyprus, visa required for onsite EU",
  status: "Available for work",
  email: "mofopeadegoke@gmail.com",
  github: "https://github.com/mofopeadegoke",
  linkedin: "https://www.linkedin.com/in/mofopefoluwa-daniel-adegoke-abc/",
  resume: "/daniel%20master%20resume.pdf",
  resumeFileName: "Daniel_Adegoke_Resume.pdf",
  revised: "Nov 2026",
};

export const hero = {
  headline: ["I build the interface,", "and whatever's under it."],
  detail:
    "Frontend architecture for four production apps, pull requests merged into open-source AI tooling, and C++ written from first principles.",
};

/** A number set as giant type, stated in the words beside it. */
export type Proof = {
  /** The digits that count up; omitted for figures that are not a plain count. */
  count?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  figure: string;
  caption: string;
};

export const sections = [
  { id: "work", label: "Work" },
  { id: "open-source", label: "Open source" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "awards", label: "Competitions" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const proofs: Partial<Record<SectionId, Proof>> = {
  "open-source": { prefix: "Top ", count: 10, figure: "Top 10", caption: "My MCP App on Manufact's Productivity board" },
  experience: { count: 2020, figure: "2020", caption: "The year I started writing code" },
  skills: { prefix: "Top ", count: 5, suffix: "%", figure: "Top 5%", caption: "Of AI-fluent tech professionals verified by Calyptus" },
  about: { count: 3.81, decimals: 2, figure: "3.81", caption: "CGPA out of 4.00, High Honors" },
  awards: { count: 0.5, decimals: 1, suffix: "%", figure: "0.5%", caption: "Teknofest Tourism finalist, of ~4,000 teams" },
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    role: "Software Developer",
    company: "Ozbul Software",
    location: "Famagusta, Cyprus",
    start: "Mar 2026",
    end: "Sep 2026",
    summary: "Frontend owner for two web apps and two mobile apps.",
    points: [
      "Owned frontend architecture for 2 production web apps (React, TypeScript) and 2 React Native mobile apps, in Agile sprints with designers and backend developers.",
      "Contributed to and maintained a shared library of 25+ UI components (Material-UI, Tailwind CSS) with 3 frontend developers.",
      "Wrote Jest unit tests and React Testing Library component suites, increasing test coverage by an estimated 10–20%.",
      "Built the apps' server-state layers on TanStack Query for client-side caching and data synchronisation with backend APIs.",
    ],
    stack: ["React", "React Native", "TypeScript", "TanStack Query", "Jest", "React Testing Library", "Material-UI", "Tailwind CSS"],
  },
  {
    role: "Founder and Frontend Engineer",
    company: "Inscribe",
    location: "Remote",
    start: "2022",
    end: "Present",
    summary: "A productivity browser extension, grown solo to 4,000+ installs.",
    points: [
      "Grew a productivity browser extension on my own to 4,000+ installs.",
      "Refactored a monolith into modular components, and shipped search, export (PDF, PNG, Markdown) and English/Turkish localisation.",
    ],
    stack: ["React", "TypeScript", "Node.js", "Vitest"],
  },
  {
    role: "Software Developer Intern",
    company: "Technolink Software",
    location: "Remote",
    start: "Jun 2025",
    end: "Sep 2025",
    summary: "An MCP server that gave AI agents access to existing APIs.",
    points: [
      "Built a TypeScript MCP server that let AI agents call about 10 existing JWT-secured REST endpoints (PHP, C++).",
      "Diagnosed and resolved 10+ live production issues and data pipeline bottlenecks through root-cause analysis.",
    ],
    stack: ["TypeScript", "MCP", "REST", "JWT"],
  },
  {
    role: "Software Developer Intern",
    company: "Ozbul Software",
    location: "Remote",
    start: "Jun 2025",
    end: "Aug 2025",
    summary: "A stock management app, before the full-time role.",
    points: ["Developed 20+ responsive React and TypeScript components for a stock management app with a C# backend."],
    stack: ["React", "TypeScript", "C#"],
  },
  {
    role: "Frontend Developer",
    company: "Mensa Philosophical Circle",
    location: "Remote",
    start: "Jul 2023",
    end: "Dec 2023",
    summary: "A startup: interactive features, shipped weekly.",
    points: ["Prototyped and shipped 10+ interactive web features with React, iterating weekly on member feedback to improve usability."],
    stack: ["React", "JavaScript", "Browser APIs"],
  },
  {
    role: "Frontend Developer",
    company: "Learning on the Go",
    location: "Nigeria",
    start: "Aug 2022",
    end: "Nov 2022",
    summary: "A startup: fast interfaces for an education platform.",
    points: ["Built responsive interfaces and optimised loading to reach 100/100 Lighthouse scores."],
    stack: ["JavaScript", "HTML5", "CSS3", "Bootstrap"],
  },
];

export type ProjectKey = "uncooked" | "smart-bookmarks" | "inscribe" | "omniplexus" | "gear" | "wormhole";

export type Project = {
  key: ProjectKey;
  title: string;
  role: string;
  years: string;
  result: string;
  /** The project's own number, set large on its card. */
  metric?: { figure: string; label: string };
  points: string[];
  stack: string[];
  links: { label: string; href: string }[];
  /** Real captures of the live project, in /public/work. */
  media?: { poster: string; video?: string; alt: string };
};

export const projects: Project[] = [
  {
    key: "uncooked",
    title: "Uncooked",
    role: "Open-source plugin for Claude Code, Claude.ai and Gemini",
    years: "2026",
    result: "Tailors a resume to a job without adding anything untrue.",
    metric: { figure: "0.96", label: "Eval score, against 0.50 for plain Claude" },
    points: [
      "Built resume-tailoring and application-tracking skills that reword, reorder and cut, but never add a fact the candidate hasn't confirmed.",
      "Tested 20+ resume variants against OpenResume and Affinda, one change at a time, and turned the findings into the plugin's rules.",
      "Wrote an 11-case eval suite with regex checks and an LLM judge: on two job postings it scored 0.95–0.96, against 0.50 for plain Claude (Sonnet, 3 runs each). The scripts have 103 unit tests.",
    ],
    stack: ["Claude Code plugins", "LLM evals", "Python", "LaTeX"],
    // The project site (uncooked-plugin.vercel.app) returned 404 DEPLOYMENT_NOT_FOUND
    // in Nov 2026; add it back with a capture once it is redeployed.
    links: [{ label: "Source", href: "https://github.com/mofopeadegoke/uncooked" }],
  },
  {
    key: "smart-bookmarks",
    title: "Smart Bookmarks",
    role: "Full-stack Next.js app, sole developer",
    years: "2026",
    result: "Paste a link, and Claude summarises and tags it for you.",
    metric: { figure: "35+", label: "Vitest and Playwright tests against a real database" },
    points: [
      "Claude reads each saved link and writes a two-sentence summary and tags, reusing the tags you already have. Saves return instantly while analysis runs in the background.",
      "SSRF-safe page fetching: every redirect is checked for non-public IP addresses, with a timeout, a 2 MB cap and HTML-only responses.",
      "AI output is treated as untrusted: structured JSON validated with Zod, and every query scoped to the user signed in with Better Auth.",
      "Accent-insensitive PostgreSQL full-text search in any language, with a trigram index for Chinese and Japanese.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Better Auth", "Claude API", "Zod"],
    links: [
      { label: "Live demo", href: "https://smart-bookmarks-livid.vercel.app/" },
      { label: "Source", href: "https://github.com/mofopeadegoke/smart-bookmarks" },
    ],
    media: { poster: "/work/smart-bookmarks.jpg", alt: "The Smart Bookmarks sign-in page" },
  },
  {
    key: "inscribe",
    title: "Inscribe",
    role: "Browser extension, founder and sole developer",
    years: "2022 – present",
    result: "A productivity extension people keep installing.",
    metric: { figure: "4,000+", label: "Installs, grown solo" },
    points: [
      "Designed, built and run on my own since 2022.",
      "Refactored the original monolith into modular components, then shipped tagging, search and export to PDF, PNG and Markdown.",
      "Full English and Turkish localisation from one codebase, tested with Vitest and React Testing Library.",
    ],
    stack: ["React", "TypeScript", "Node.js", "Vitest", "i18n"],
    links: [
      {
        label: "Edge Add-ons",
        href: "https://microsoftedge.microsoft.com/addons/detail/inscribe/gcobiohplbeljjficipnjpdbpkldkiih",
      },
    ],
  },
  {
    key: "omniplexus",
    title: "Omniplexus",
    role: "Modular telemetry platform, co-developer in a 3-person team",
    years: "2026",
    result: "Control panels that build themselves from a device's data.",
    points: [
      "Owned the self-generating C++ UI runtime: it reads a device's data at runtime and builds its control panel, so a new hardware module never means rewriting UI code.",
      "Built on Gorgon, an open-source C++ UI engine with effectively no public documentation. Fixed crashes and linker errors by reading the engine's source.",
      "Also owned the platform's Crow WebSocket backend.",
    ],
    stack: ["C++", "Gorgon", "Crow", "WebSockets"],
    links: [{ label: "Source", href: "https://github.com/CezeriLab-EUL/OmniPlexus" }],
  },
  {
    key: "gear",
    title: "Parametric Gear Library",
    role: "Native C++ library",
    years: "2026",
    result: "3D gear models from five parameters, geometry from scratch.",
    metric: { figure: "5", label: "Parameters in, a 3D gear out" },
    points: [
      "Generates parametric 3D gear models from 5 configurable parameters.",
      "Implements the involute geometry from first principles rather than wrapping an existing package.",
    ],
    stack: ["C++", "Computational geometry", "STL"],
    links: [{ label: "Source", href: "https://github.com/mofopeadegoke/gearGeneration" }],
  },
  {
    key: "wormhole",
    title: "Wormhole",
    role: "Real-time 3D simulation",
    years: "2025",
    result: "A wormhole tunnel rendered live in the browser.",
    points: ["Real-time WebGL wormhole with distortion effects, built with Three.js and custom shaders."],
    stack: ["Three.js", "WebGL", "Shaders"],
    links: [
      { label: "Live demo", href: "https://three-js-t-unnel.vercel.app/" },
      { label: "Source", href: "https://github.com/mofopeadegoke/threeJsTUnnel" },
    ],
    media: { poster: "/work/wormhole.jpg", video: "/work/wormhole.webm", alt: "The Wormhole simulation running in a browser" },
  },
];

export type Contribution = {
  project: string;
  org: string;
  year: string;
  result: string;
  points: string[];
  links: { label: string; href: string }[];
};

export const openSource: Contribution[] = [
  {
    project: "mcp-use",
    org: "Open-source MCP SDK by Manufact (YC S25)",
    year: "2026",
    result: "Two pull requests merged, and an MCP App in the top 10.",
    points: [
      "Reported 4 issues and got 2 pull requests merged into the SDK's CLI.",
      "Built a 6-tool MCP App that ranked in the top 10 on Manufact's Productivity board.",
    ],
    links: [
      { label: "Merged: tool error text in screenshot", href: "https://github.com/mcp-use/mcp-use/pull/3079" },
      { label: "Merged: tool error text in client tools call", href: "https://github.com/mcp-use/mcp-use/pull/3067" },
    ],
  },
  {
    project: "Sim",
    org: "YC-backed open-source AI agent workflow builder",
    year: "2026",
    result: "A merged fix, found by building an agent with it.",
    points: [
      "Reported UI and design issues I hit while building an agent workflow.",
      "Authored a merged bug-fix pull request, with a design pull request in review.",
    ],
    links: [{ label: "Merged: Windows path separators in the docs build", href: "https://github.com/simstudioai/sim/pull/10067" }],
  },
];

export type SkillGroup = {
  name: string;
  skills: { name: string; usedIn?: string }[];
};

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    skills: [
      { name: "TypeScript", usedIn: "Ozbul, Smart Bookmarks" },
      { name: "JavaScript (ES6+)", usedIn: "Wormhole" },
      { name: "Python", usedIn: "Uncooked" },
      { name: "C++", usedIn: "Omniplexus, Gear Library" },
      { name: "C#", usedIn: "Ozbul stock app" },
      { name: "SQL", usedIn: "Smart Bookmarks" },
      { name: "PHP" },
      { name: "HTML5, CSS3, SCSS" },
    ],
  },
  {
    name: "Frontend and web",
    skills: [
      { name: "React", usedIn: "Ozbul, Inscribe" },
      { name: "Next.js (App Router)", usedIn: "Smart Bookmarks, this site" },
      { name: "React Native", usedIn: "Ozbul mobile apps" },
      { name: "TanStack Query", usedIn: "Ozbul" },
      { name: "Tailwind CSS, Material-UI", usedIn: "Ozbul, 25+ components" },
      { name: "Web Vitals", usedIn: "100/100 Lighthouse, Learning on the Go" },
    ],
  },
  {
    name: "Backend and AI",
    skills: [
      { name: "Node.js, REST APIs", usedIn: "Inscribe, Technolink" },
      { name: "PostgreSQL, Drizzle, Zod", usedIn: "Smart Bookmarks" },
      { name: "MCP", usedIn: "Technolink, mcp-use" },
      { name: "Claude API, structured outputs", usedIn: "Smart Bookmarks" },
      { name: "Claude Code plugins, LLM evals", usedIn: "Uncooked" },
      { name: "OAuth, JWT", usedIn: "Smart Bookmarks, Technolink" },
    ],
  },
  {
    name: "Testing and tools",
    skills: [
      { name: "Vitest, Jest, React Testing Library", usedIn: "Ozbul, Inscribe" },
      { name: "Playwright", usedIn: "Smart Bookmarks" },
      { name: "Git and GitHub PR workflows", usedIn: "mcp-use, Sim" },
      { name: "CI/CD with GitHub Actions" },
      { name: "Linux" },
      { name: "Agile / Scrum", usedIn: "Ozbul" },
    ],
  },
];

export const about = {
  paragraphs: [
    "I work across the whole stack, but I'm happiest where interfaces meet hard engineering: a component library other developers can trust, or an undocumented C++ engine I had to learn by reading its source.",
    "I've been writing code since 2020 and shipping it since 2022, when I launched Inscribe. Lately that means full-stack and AI work: apps on Next.js and PostgreSQL that use Claude, an open-source plugin with its own evals, and fixes merged into other people's MCP and agent tooling.",
  ],
  education: {
    degree: "B.Sc. Software Engineering, High Honors",
    school: "European University of Lefke, Northern Cyprus",
    graduated: "June 2026",
    standing: "CGPA 3.81 / 4.00. Ranked top 3 in the department and top 4 in the faculty.",
  },
};

export type Achievement = {
  result: string;
  event: string;
  year?: string;
  href?: string;
};

export const achievements: Achievement[] = [
  { result: "Top 0.5%", event: "Teknofest Tourism finalist, of ~4,000 teams", year: "2025" },
  { result: "Top 1%", event: "Teknofest Robotics finalist, of ~4,000 teams", year: "2025" },
  { result: "Top 1%", event: "Teknofest AI in Aviation finalist, of ~5,000 teams", year: "2026" },
  {
    result: "1st place",
    event: "Codespace x Couchbase Hackathon, team lead",
    year: "2023",
    href: "https://github.com/mofopeadegoke/TechSpace-Project-Organik",
  },
  { result: "Finalist", event: "EMUSoft, 9th of 90 teams", year: "2025" },
  { result: "Finalist", event: "Construct AI", year: "2024" },
];

export const aiFluency = {
  result: "Top 5%",
  text: "of AI-fluent tech professionals, verified by Calyptus",
  href: "https://www.linkedin.com/in/mofopefoluwa-daniel-adegoke-abc/details/certifications/",
};
