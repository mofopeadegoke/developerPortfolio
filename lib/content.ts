// All site copy lives here, sourced from "public/daniel master resume.pdf".

export const profile = {
  name: "Daniel Adegoke",
  fullName: "Daniel Mofopefoluwa Adegoke",
  role: "Software Engineer",
  location: "Famagusta, Cyprus",
  availability: "Open to relocation (US, EU, UK, Canada, Singapore) or remote",
  email: "mofopeadegoke@gmail.com",
  github: "https://github.com/mofopeadegoke",
  linkedin: "https://www.linkedin.com/in/mofopefoluwa-daniel-adegoke-abc/",
  resume: "/daniel%20master%20resume.pdf",
  resumeFileName: "Daniel_Adegoke_Resume.pdf",
  revised: "Sep 2026",
};

export const hero = {
  lead: "I own the frontend architecture for four production apps, and I write C++ geometry from first principles.",
  detail:
    "React and TypeScript at work, Python for Django apps and AI agents, C++ when the problem goes below the UI.",
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
    end: "Present",
    summary: "Frontend owner for two web apps and two mobile apps.",
    points: [
      "Own frontend architecture for 2 production web applications (React, TypeScript) and 2 production mobile applications (React Native), keeping design and behaviour consistent across both.",
      "Built and maintain a shared library of 25+ reusable, accessible UI components (Material-UI, Tailwind CSS) that other developers build their interfaces on.",
      "Work with designers and backend developers in two-week Agile sprints, taking features from design to production code and taking part in code review.",
    ],
    stack: ["React", "React Native", "TypeScript", "Material-UI", "Tailwind CSS"],
  },
  {
    role: "Software Developer Intern",
    company: "Technolink Software",
    location: "Remote",
    start: "Jun 2025",
    end: "Sep 2025",
    summary: "APIs behind an AI-driven automation system.",
    points: [
      "Built and maintained REST API endpoints in Python and PHP powering an AI-driven automation system used across 2 internal products.",
      "Designed secure RESTful APIs with JWT authentication for reliable data exchange between connected services.",
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
      "Built and maintained 20+ reusable, responsive, mobile-first React components for the company's core product, work that led directly to being invited back as a full-time hire.",
    ],
    stack: ["React", "TypeScript", "C#"],
  },
  {
    role: "Frontend Developer",
    company: "Mensa Philosophical Circle",
    location: "Remote",
    start: "Jun 2023",
    end: "Dec 2023",
    summary: "Responsive, accessible web interfaces.",
    points: [
      "Developed and maintained responsive web interfaces, turning design mockups into functional, accessible frontend code with modern JavaScript frameworks.",
      "Worked with the organisation's stakeholders to improve the user experience and keep the site working across browsers.",
    ],
    stack: ["JavaScript", "HTML", "CSS", "Accessibility"],
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

export type ProjectKey = "omniplexus" | "inscribe" | "gear" | "wormhole";

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
    ],
    stack: ["React", "Browser extension", "i18n"],
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
      { name: "TypeScript", usedIn: "Ozbul" },
      { name: "JavaScript (ES6+)", usedIn: "Wormhole" },
      { name: "Python", usedIn: "Technolink, AI agents" },
      { name: "C++", usedIn: "Omniplexus, Gear Library" },
      { name: "C#", usedIn: "Ozbul stock app" },
      { name: "PHP", usedIn: "Technolink" },
      { name: "Java" },
      { name: "SQL" },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "React", usedIn: "Ozbul, Inscribe" },
      { name: "React Native", usedIn: "Ozbul mobile apps" },
      { name: "Component libraries and design systems", usedIn: "Ozbul, 25+ components" },
      { name: "Material-UI", usedIn: "Ozbul" },
      { name: "Tailwind CSS", usedIn: "Ozbul, this site" },
      { name: "SCSS, HTML5, CSS3" },
      { name: "Responsive, mobile-first design" },
      { name: "Accessibility" },
    ],
  },
  {
    name: "Backend and APIs",
    skills: [
      { name: "REST API design", usedIn: "Technolink" },
      { name: "JWT authentication", usedIn: "Technolink" },
      { name: "Django" },
      { name: "PHP", usedIn: "Technolink" },
    ],
  },
  {
    name: "Systems and AI",
    skills: [
      { name: "Computational geometry", usedIn: "Gear Library" },
      { name: "Low-level C++ rendering", usedIn: "Omniplexus" },
      { name: "Native library design", usedIn: "Gear Library" },
      { name: "Crash and linker diagnosis", usedIn: "Omniplexus" },
      { name: "AI agent development in Python", usedIn: "MARK AI" },
      { name: "AI-assisted development workflows" },
    ],
  },
  {
    name: "Tooling",
    skills: [
      { name: "Git and GitHub" },
      { name: "Linux command line" },
      { name: "Vite, Webpack" },
      { name: "Agile / Scrum", usedIn: "Ozbul" },
    ],
  },
];

export const about = {
  paragraphs: [
    "I work across the whole stack but I'm happiest where interfaces meet hard engineering: a component library other developers can trust, or an undocumented C++ engine I had to learn by reading its source.",
    "I graduated in June 2026 with a B.Sc. in Software Engineering and have been shipping software since 2022, when I launched Inscribe.",
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
  { result: "Top 0.1%", event: "Teknofest, AI in Aviation", year: "2026" },
  { result: "Top 0.1%", event: "Teknofest, Robotics", year: "2025" },
  { result: "Top 0.5%", event: "Teknofest, Tourism", year: "2025" },
  { result: "Top 10%", event: "MARK AI marketing agent (Python)", year: "2025" },
  { result: "Finalist", event: "Construct AI", year: "2024" },
  { result: "Finalist", event: "EMUSoft", year: "2025" },
];
