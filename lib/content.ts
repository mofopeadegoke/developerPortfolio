// All site copy lives here, sourced from "public/daniel master resume.pdf".

export const profile = {
  name: "Daniel Adegoke",
  fullName: "Daniel Mofopefoluwa Adegoke",
  role: "Software Engineer",
  location: "Famagusta, Cyprus",
  availability: "Open to relocation (EU, UK, US, Canada, Singapore) or remote",
  email: "mofopeadegoke@gmail.com",
  github: "https://github.com/mofopeadegoke",
  linkedin: "https://www.linkedin.com/in/mofopefoluwa-daniel-adegoke-abc/",
  resume: "/daniel%20master%20resume.pdf",
  resumeFileName: "Daniel_Adegoke_Resume.pdf",
  revised: "Oct 2026",
};

export const hero = {
  lead: "I owned the frontend architecture for four production apps, and I write C++ geometry from first principles.",
  detail:
    "React and TypeScript at work, Next.js, PostgreSQL and the Claude API for full-stack apps, C++ when the problem goes below the UI.",
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
      "Owned frontend architecture for 2 production web applications (React, TypeScript) and 2 production mobile applications (React Native), working with designers and backend developers in two-week Agile sprints and code review.",
      "Built and maintained a shared library of 25+ reusable, accessible UI components (Material-UI, Tailwind CSS) that other developers built on, removing duplicated styling across the product.",
      "Wrote Jest unit tests that increased test coverage by 30%, alongside component tests with React Testing Library for the shared library and core user flows.",
      "Built the apps' server-state layer on TanStack Query for caching and data synchronisation with backend APIs.",
      "Sped up the web and mobile apps with lazy loading, memoisation and code splitting, and improved WCAG accessibility.",
    ],
    stack: ["React", "React Native", "TypeScript", "TanStack Query", "Jest", "React Testing Library", "Material-UI", "Tailwind CSS"],
  },
  {
    role: "Software Developer Intern",
    company: "Technolink Software",
    location: "Remote",
    start: "Jun 2025",
    end: "Sep 2025",
    summary: "APIs behind an AI-driven automation system.",
    points: [
      "Built and maintained 10+ JWT-secured REST API endpoints in Python and PHP powering an AI-driven automation system used across 2 internal products.",
      "Configured AI agent workflows on Model Context Protocol (MCP) servers to route AI support requests.",
      "Diagnosed and resolved 10+ production issues in a live automation pipeline, tracing each symptom to its root cause.",
    ],
    stack: ["Python", "PHP", "REST", "JWT", "MCP"],
  },
  {
    role: "Software Developer Intern",
    company: "Ozbul Software",
    location: "Remote",
    start: "Jun 2025",
    end: "Aug 2025",
    summary: "The internship that led to a full-time offer.",
    points: [
      "Built a stock management web application with a small team using TypeScript, React and C#, working across the frontend and its integration with the C# backend.",
      "Built 20+ reusable, responsive, mobile-first React and TypeScript components and led a refactor of a legacy monolithic frontend into 10+ modular components, work that led directly to a full-time offer.",
    ],
    stack: ["React", "TypeScript", "C#"],
  },
  {
    role: "Frontend Developer",
    company: "Mensa Philosophical Circle",
    location: "Remote",
    start: "Jun 2023",
    end: "Dec 2023",
    summary: "Interactive, accessible features shipped weekly.",
    points: [
      "Prototyped and shipped 10+ interactive, accessible web features with React and browser APIs.",
      "Iterated weekly on member feedback to improve usability.",
    ],
    stack: ["React", "JavaScript", "Browser APIs", "Accessibility"],
  },
  {
    role: "Frontend Developer",
    company: "Learning on the go",
    location: "Nigeria",
    start: "Aug 2022",
    end: "Nov 2022",
    summary: "Mobile-first interfaces for an education platform.",
    points: [
      "Built responsive, mobile-first educational web interfaces to make learning material more accessible.",
      "Focused on client-side performance and clean HTML, CSS and JavaScript for a smooth user experience.",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
  },
];

export type ProjectKey = "smart-bookmarks" | "omniplexus" | "inscribe" | "gear" | "wormhole";

export type Project = {
  key: ProjectKey;
  title: string;
  role: string;
  years: string;
  result: string;
  points: string[];
  stack: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    key: "smart-bookmarks",
    title: "Smart Bookmarks",
    role: "Full-stack AI web app, sole developer",
    years: "2026",
    result: "Paste a link, and Claude summarises and tags it for you",
    points: [
      "Built and shipped a full-stack Next.js app where Claude reads each saved link and writes a two-sentence summary and tags, reusing the tags you already have. Saves return instantly while the analysis runs in the background.",
      "Secured server-side fetching of user-submitted URLs against SSRF: every redirect is checked for non-public IP addresses, with a timeout, a 2 MB size cap and HTML-only responses.",
      "Treated AI output as untrusted, requesting structured JSON and validating it with Zod; every query is scoped to the user signed in with GitHub OAuth.",
      "Accent-insensitive search in any language with PostgreSQL full-text search and a trigram index for Chinese and Japanese, covered by 35+ Vitest and Playwright tests against a real database.",
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle ORM", "Claude API", "Zod", "Vitest", "Playwright"],
    links: [
      { label: "Live demo", href: "https://smart-bookmarks-livid.vercel.app/" },
      { label: "Source on GitHub", href: "https://github.com/mofopeadegoke/smart-bookmarks" },
    ],
  },
  {
    key: "omniplexus",
    title: "Omniplexus",
    role: "Modular robotics framework, self-generating UI",
    years: "2026",
    result: "Control panels that build themselves from a device's data",
    points: [
      "Built the desktop application for a modular robotics framework with a small team, on Gorgon, an open-source C++ UI engine with effectively no public documentation.",
      "Owned the self-generating UI layer: it reads a device's data at runtime and builds its control panel automatically, so a new hardware module never means rewriting UI code.",
      "Fixed crashes and linker errors by reading the engine's source and tracing its internals, going from no working build to fluent with the engine over the project.",
    ],
    stack: ["C++", "Gorgon engine", "Desktop"],
    links: [{ label: "Source on GitHub", href: "https://github.com/CezeriLab-EUL/OmniPlexus" }],
  },
  {
    key: "inscribe",
    title: "Inscribe",
    role: "Browser extension, founder and sole developer",
    years: "2022 – present",
    result: "4,000+ installs, run single-handedly for 3+ years",
    points: [
      "Designed, built and run a React browser extension on my own, integrating third-party services directly from the client with no backend of my own.",
      "Shipped 5 core modules including tagging, search and multi-format export (PDF, PNG, Markdown).",
      "Full English and Turkish localisation from a single codebase.",
      "Tested with Vitest and React Testing Library.",
    ],
    stack: ["React", "TypeScript", "Vitest", "Browser extension", "i18n"],
    links: [
      {
        label: "Edge Add-ons",
        href: "https://microsoftedge.microsoft.com/addons/detail/inscribe/gcobiohplbeljjficipnjpdbpkldkiih",
      },
    ],
  },
  {
    key: "gear",
    title: "Parametric Gear Library",
    role: "Native C++ library",
    years: "2026",
    result: "3D gear models from 5 parameters, geometry written from scratch",
    points: [
      "Generates parametric 3D gear models from 5 configurable parameters.",
      "Implements the computational geometry from first principles rather than wrapping an existing package. The gear at the top of this page uses the same involute maths.",
    ],
    stack: ["C++", "Computational geometry", "STL"],
    links: [{ label: "Source on GitHub", href: "https://github.com/mofopeadegoke/gearGeneration" }],
  },
  {
    key: "wormhole",
    title: "Wormhole",
    role: "Real-time 3D simulation",
    years: "2025",
    result: "A wormhole tunnel rendered in real time in the browser",
    points: [
      "Real-time WebGL visualisation of a wormhole tunnel with distortion effects, built with Three.js and custom shaders.",
    ],
    stack: ["Three.js", "WebGL", "Shaders"],
    links: [
      { label: "Live demo", href: "https://three-js-t-unnel.vercel.app/" },
      { label: "Source on GitHub", href: "https://github.com/mofopeadegoke/threeJsTUnnel" },
    ],
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
      { name: "Python", usedIn: "Technolink, AI agents" },
      { name: "C++", usedIn: "Omniplexus, Gear Library" },
      { name: "C#", usedIn: "Ozbul stock app" },
      { name: "SQL", usedIn: "Smart Bookmarks" },
      { name: "PHP", usedIn: "Technolink" },
      { name: "Java" },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "React", usedIn: "Ozbul, Inscribe" },
      { name: "Next.js (App Router)", usedIn: "Smart Bookmarks, this site" },
      { name: "React Native", usedIn: "Ozbul mobile apps" },
      { name: "TanStack Query", usedIn: "Ozbul" },
      { name: "Component libraries and design systems", usedIn: "Ozbul, 25+ components" },
      { name: "Material-UI", usedIn: "Ozbul" },
      { name: "Tailwind CSS", usedIn: "Ozbul, this site" },
      { name: "SCSS, HTML5, CSS3" },
      { name: "Responsive, mobile-first design" },
    ],
  },
  {
    name: "Backend and data",
    skills: [
      { name: "Node.js" },
      { name: "Django" },
      { name: "REST API design", usedIn: "Technolink" },
      { name: "PostgreSQL, full-text search", usedIn: "Smart Bookmarks" },
      { name: "Drizzle ORM", usedIn: "Smart Bookmarks" },
      { name: "OAuth", usedIn: "Smart Bookmarks" },
      { name: "JWT authentication", usedIn: "Technolink" },
      { name: "Object-oriented design" },
    ],
  },
  {
    name: "AI and systems",
    skills: [
      { name: "Claude API, structured outputs", usedIn: "Smart Bookmarks" },
      { name: "AI agent development in Python", usedIn: "MARK AI" },
      { name: "Model Context Protocol (MCP)", usedIn: "Technolink" },
      { name: "AI-assisted development workflows" },
      { name: "Computational geometry", usedIn: "Gear Library" },
      { name: "Low-level C++ UI rendering", usedIn: "Omniplexus" },
      { name: "Native library design", usedIn: "Gear Library" },
      { name: "Crash and linker diagnosis", usedIn: "Omniplexus" },
    ],
  },
  {
    name: "Testing and quality",
    skills: [
      { name: "Vitest", usedIn: "Smart Bookmarks, Inscribe" },
      { name: "Jest", usedIn: "Ozbul, +30% coverage" },
      { name: "Playwright", usedIn: "Smart Bookmarks" },
      { name: "React Testing Library", usedIn: "Ozbul, Inscribe" },
      { name: "Web performance optimisation", usedIn: "Ozbul" },
      { name: "Web security (SSRF)", usedIn: "Smart Bookmarks" },
      { name: "Accessibility (WCAG)", usedIn: "Ozbul, Mensa" },
    ],
  },
  {
    name: "Tooling",
    skills: [
      { name: "Git and GitHub" },
      { name: "Vercel", usedIn: "Smart Bookmarks, this site" },
      { name: "Vite, Webpack" },
      { name: "pnpm" },
      { name: "Linux command line" },
      { name: "Agile / Scrum", usedIn: "Ozbul" },
    ],
  },
];

export const about = {
  paragraphs: [
    "I work across the whole stack but I'm happiest where interfaces meet hard engineering: a component library other developers can trust, or an undocumented C++ engine I had to learn by reading its source.",
    "I graduated in June 2026 with a B.Sc. in Software Engineering and have been shipping software since 2022, when I launched Inscribe.",
    "Lately I've moved into full-stack and AI work: Smart Bookmarks runs on Next.js and PostgreSQL and uses Claude to summarise and tag what you save.",
  ],
  education: {
    degree: "B.Sc. Software Engineering",
    school: "European University of Lefke, Northern Cyprus",
    graduated: "June 2026",
    standing: "CGPA 3.81 / 4.00, ranked top 3 in the department and top 4 in the faculty",
  },
};

export type Achievement = {
  result: string;
  event: string;
  year?: string;
  href?: string;
};

export const achievements: Achievement[] = [
  {
    result: "Winner",
    event: "Codespace x Couchbase Hackathon",
    year: "2023",
    href: "https://github.com/mofopeadegoke/TechSpace-Project-Organik",
  },
  { result: "Top 0.1%", event: "Teknofest, Robotics", year: "2025" },
  { result: "Top 0.5%", event: "Teknofest, Tourism", year: "2025" },
  { result: "Top 1%", event: "Teknofest, AI in Aviation", year: "2026" },
  { result: "Top 10%", event: "MARK AI marketing agent (Python)", year: "2025" },
  { result: "Finalist", event: "Construct AI", year: "2024" },
  { result: "Finalist", event: "EMUSoft", year: "2025" },
];
