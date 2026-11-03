export const identity = {
  name: "Pulichara Giridhar",
  firstName: "Pulichara",
  lastName: "Giridhar",
  shortName: "Giridhar",
  role: "Full-Stack Engineer",
  positioning: "AI-native builder",
  location: "Hyderabad, IN",
  email: "giridharsonu123@gmail.com",
  github: "https://github.com/giridhar0025",
  linkedin: "https://linkedin.com/in/pulichara-giridhar",
  resume: "/giridhar-resume.pdf",
  availability: "Available for select builds",
  description:
    "Full-stack engineer building production systems across web, mobile, and API — plus the agent harnesses that make AI-generated code shippable.",
} as const;

export const heroCopy = {
  eyebrow: "Portfolio / Simulation 0.9.7",
  status: "System online",
  summary:
    "4+ years building production interfaces, APIs, and the AI-assisted delivery systems that keep them shipping.",
  scrollHint: "Scroll to decrypt",
};

export const navItems = [
  { label: "Index", href: "#top", index: "00" },
  { label: "Work", href: "#work", index: "05" },
  { label: "AI Protocol", href: "#protocol", index: "06" },
  { label: "Channel", href: "#channel", index: "07" },
] as const;

export const sectionIndex = [
  { id: "hero", label: "Index", index: "01" },
  { id: "choice", label: "Choice", index: "02" },
  { id: "manifesto", label: "Manifesto", index: "03" },
  { id: "construct", label: "The Construct", index: "04" },
  { id: "work", label: "Work", index: "05" },
  { id: "protocol", label: "AI Protocol", index: "06" },
  { id: "channel", label: "Channel", index: "07" },
  { id: "exit", label: "Exit", index: "08" },
] as const;

export const bootLines = [
  { prompt: ">", text: "booting construct / rev 0.9.7", delay: 0 },
  { prompt: ">", text: "loading identity ................ OK", delay: 180 },
  { prompt: ">", text: "compiling shaders ............... OK", delay: 360 },
  { prompt: ">", text: "mounting agent harness .......... OK", delay: 590 },
  { prompt: ">", text: "checking reality ................ NULL", delay: 800 },
  { prompt: ">", text: "welcome back, operator.", delay: 1080 },
] as const;

export const choiceCopy = {
  label: "02 / Decision point",
  title: "Two doors. Same operator.",
  description:
    "The system does not care which one you take. Your timeline might.",
  options: [
    {
      id: "work",
      pill: "red",
      index: "R",
      title: "See the work",
      detail: "Shipped systems, hard constraints, measurable outcomes.",
      action: "#work",
      cta: "Take the red pill",
    },
    {
      id: "contact",
      pill: "blue",
      index: "B",
      title: "Open a channel",
      detail: "A question, a collaboration, or an interesting problem.",
      action: "#channel",
      cta: "Take the blue pill",
    },
  ],
} as const;

export const manifesto = {
  label: "03 / Operating principles",
  words: [
    "I build systems,",
    "not screens.",
    "The edge cases",
    "are the product.",
    "AI in the loop.",
    "A human on the wheel.",
  ],
  body:
    "Four years turning ambiguous scope into production software across HR-tech, supply chain, and healthcare. Currently at Divami Design Labs, engineering the AI-assisted delivery system for a 40-person design org.",
  readout: [
    ["Experience", "4+ years"],
    ["Focus", "Full-stack / AI systems"],
    ["Base", "Hyderabad, IN"],
  ],
  sideNote: "There is no spoon. There is only the interface.",
} as const;

export const construct = {
  label: "04 / The construct",
  mode: "Loading program",
  hint: "Scroll to compile",
  closing: "There is no world. Only the render.",
  panels: [
    {
      id: "construct",
      index: "01",
      key: "Construct",
      kicker: "Program 01 // Environment load",
      title: "Reality is a loadable program.",
      body:
        "Strip the world back to its wireframe. No spoon, no room, no rules — just geometry waiting for an observer to make it real.",
      detail: "LOADING: SPARRING PROGRAM / WIREFRAME 4,096 LINES",
      status: "Compiling environment",
    },
    {
      id: "bullet-time",
      index: "02",
      key: "Bullet time",
      kicker: "Program 02 // Local time suspended",
      title: "The clock is a render loop.",
      body:
        "Step outside the update cycle. The round holds. Causality waits. You were never inside the frame — you were the reason it rendered.",
      detail: "DODGE THIS // SIM RATE 0.000×",
      status: "Observer lock",
    },
    {
      id: "deja-vu",
      index: "03",
      key: "Déjà vu",
      kicker: "Program 03 // Loop detected",
      title: "A glitch is the simulation showing its seam.",
      body:
        "The same frame arrives twice. A black cat crosses the corridor. Somewhere in the code, something remembers you.",
      detail: "DÉJÀ VU // LOOP 01 // CAUSALITY RESYNC",
      status: "Replay detected",
    },
  ],
} as const;

export type Project = {
  slug: string;
  index: string;
  name: string;
  product: string;
  domain: string;
  role: string;
  period: string;
  status: string;
  summary: string;
  notes: string[];
  stack: string[];
  metrics: { value: string; label: string }[];
  visual: "kapwa" | "harness" | "luminate" | "revcdi";
};

export const projects: Project[] = [
  {
    slug: "kapwa",
    index: "T-01",
    name: "Kapwa",
    product: "genhrx.ai",
    domain: "HR-tech platform",
    role: "Full-stack engineer · project inception",
    period: "Mar 2026 — present",
    status: "Live",
    summary:
      "One typed product core, three surfaces: React 19 web, React Native mobile, and a FastAPI backend in a single Nx monorepo. Most production code now ships through a governed agent harness — reviewed, tested, and held to the same bar.",
    notes: [
      "Owns features end-to-end across the FastAPI backend, shared TypeScript libraries, and both client surfaces.",
      "Engineered the project from scratch, including the agent rules, hooks, workflows, and skills now used by the team.",
    ],
    stack: ["React 19", "React Native", "Expo", "TypeScript", "FastAPI", "Nx", "Playwright"],
    metrics: [
      { value: "3", label: "surfaces, one typed core" },
      { value: "8+", label: "API modules contract-tested" },
      { value: "20+", label: "design-system wrappers shipped" },
    ],
    visual: "kapwa",
  },
  {
    slug: "agent-harness",
    index: "T-02",
    name: "The Harness",
    product: "AI delivery system",
    domain: "Agent infrastructure",
    role: "Architect · team enablement",
    period: "Jan 2025 — present",
    status: "Operational",
    summary:
      "A repeatable AI delivery system built around context, tools, guardrails, and review. MCP servers expose design files, browser state, and live docs. Rules, hooks, and custom skills turn agent output from a gamble into a process.",
    notes: [
      "Configured Figma, browser, and Context7 MCP servers so agents work against real design and codebase context.",
      "Wrote the internal playbooks and trained all 40 engineers in prompt and context engineering.",
    ],
    stack: ["Claude Code", "MCP", "Figma", "Context7", "Custom skills", "Hooks", "Playwright"],
    metrics: [
      { value: "40", label: "engineers enabled" },
      { value: "3", label: "MCP servers in use" },
      { value: "1", label: "shared delivery harness" },
    ],
    visual: "harness",
  },
  {
    slug: "luminate",
    index: "T-03",
    name: "Luminate",
    product: "Blue Yonder",
    domain: "Supply-chain platform",
    role: "Frontend engineer · contract",
    period: "Sep 2024 — Dec 2024",
    status: "Shipped",
    summary:
      "Re-architected a multi-KPI card into a pluggable chart system used by four product teams. Built the Algorithm Manager from zero: sequencing rules, performance tuning, and API integration for production planning.",
    notes: [
      "Delivered Manufacturing Order and Parts planning modules across multiple sprints with zero critical post-release defects.",
      "Connected sequencing-rule configuration to backend APIs and tuned rendering for dense planning data.",
    ],
    stack: ["React", "TypeScript", "Data visualization", "REST APIs", "Performance"],
    metrics: [
      { value: "4+", label: "product teams on one component" },
      { value: "0→1", label: "Algorithm Manager UI" },
      { value: "Zero", label: "critical post-release defects" },
    ],
    visual: "luminate",
  },
  {
    slug: "revcdi",
    index: "T-04",
    name: "RevCDI",
    product: "Reventics",
    domain: "Healthcare data",
    role: "Frontend engineer · contract",
    period: "Feb 2023 — Jan 2024",
    status: "Shipped",
    summary:
      "Fifteen-plus features built from scratch across dashboards, reporting, and complex healthcare data. Owned the task-queue module end-to-end and lifted processing efficiency by roughly 30%.",
    notes: [
      "Built dashboards and reporting views over complex clinical documentation data.",
      "Took the task-queue module from design through deployment, including the workflow states and queue prioritization.",
    ],
    stack: ["React", "TypeScript", "Data visualization", "Reporting", "Workflow UI"],
    metrics: [
      { value: "15+", label: "features shipped from scratch" },
      { value: "~30%", label: "task-queue efficiency lift" },
      { value: "E2E", label: "module ownership" },
    ],
    visual: "revcdi",
  },
];

export const protocol = {
  label: "06 / AI protocol",
  title: "I don't just use AI. I build the system around it.",
  description:
    "The model is not the product. The leverage is the context, guardrails, and feedback loop around it. My job is to make AI-assisted delivery predictable enough to trust in production.",
  principle: "Agent proposes. Engineer verifies. Production decides.",
  stats: [
    { value: "40", label: "design-team engineers enabled" },
    { value: "3", label: "MCP integrations" },
    { value: "8+", label: "backend modules under API contract tests" },
  ],
  workflow: [
    {
      step: "01",
      key: "Spec",
      title: "Define the target",
      body:
        "Acceptance criteria, constraints, and interfaces are written before generation starts. Vague prompts produce vague code.",
    },
    {
      step: "02",
      key: "Context",
      title: "Expose the truth",
      body:
        "MCP connects the agent to design files, docs, browser state, and the codebase. Better context beats a cleverer prompt.",
    },
    {
      step: "03",
      key: "Harness",
      title: "Encode the standard",
      body:
        "Rules, hooks, skills, and workflows make the right implementation the default. Standards become executable.",
    },
    {
      step: "04",
      key: "Verify",
      title: "Earn the merge",
      body:
        "Types, tests, accessibility checks, and human review sit between generation and production. Every time.",
    },
  ],
  trace: [
    { time: "00.000", tag: "spec", text: "parse acceptance criteria + constraints" },
    { time: "00.184", tag: "mcp", text: "figma.get_design_context() → tokens" },
    { time: "00.391", tag: "map", text: "resolve existing component boundaries" },
    { time: "00.663", tag: "gen", text: "implement feature slice + tests" },
    { time: "01.204", tag: "guard", text: "typecheck · unit · playwright · a11y" },
    { time: "01.588", tag: "human", text: "review diff · approve merge" },
  ],
  capabilities: [
    {
      id: "frontend",
      label: "Frontend",
      role: "Product surface",
      command: "cat stack/frontend",
      summary: "Interface engineering that holds up under real product pressure.",
      items: ["React 19", "TypeScript", "React Native", "Expo", "Nx", "MUI", "Redux", "Vite"],
      evidence: "Cross-platform product delivery, design-system consolidation, test automation",
    },
    {
      id: "backend",
      label: "Backend",
      role: "System contract",
      command: "cat stack/backend",
      summary: "APIs and data flows that keep the interface honest.",
      items: ["Python", "FastAPI", "SQLAlchemy", "Alembic", "Node.js", "REST", "GraphQL", "AWS Lambda"],
      evidence: "Production API modules, contract testing, schema evolution",
    },
    {
      id: "ai",
      label: "AI systems",
      role: "Delivery leverage",
      command: "cat stack/ai-systems",
      summary: "Tooling that makes agent output repeatable, not magical.",
      items: ["Claude Code", "MCP", "Context engineering", "Agent skills", "Hooks", "Rules", "Spec-driven development"],
      evidence: "40-person enablement, 3 MCP integrations, reusable delivery harness",
    },
    {
      id: "quality",
      label: "Quality",
      role: "Release gate",
      command: "cat stack/quality",
      summary: "The part that turns a demo into something you can ship.",
      items: ["Jest", "Playwright", "Cypress", "API contract tests", "Performance budgets", "Accessibility"],
      evidence: "30% task-queue efficiency gain, zero critical post-release defects",
    },
  ],
} as const;

export const channel = {
  label: "07 / Open channel",
  kicker: "Signal received",
  title: "Let's build something that ships.",
  body:
    "I'm interested in products where interface craft, full-stack thinking, and AI leverage compound. If that sounds like your problem, open a line.",
  responseTime: "Usually within 48 hours",
  location: "Hyderabad, India · IST (UTC+5:30)",
} as const;

export const exitCopy = {
  label: "08 / Exit",
  title: "There is no spoon.",
  note: "There is only the system — and the people who choose to build it better.",
  built:
    "Designed and engineered by Pulichara Giridhar. Agents assisted. Human reviewed.",
} as const;

export const commandHelp = [
  { command: "whoami", description: "operator identity" },
  { command: "work", description: "jump to transmissions" },
  { command: "construct", description: "load the construct" },
  { command: "ai", description: "open the AI protocol" },
  { command: "contact", description: "open a channel" },
  { command: "resume", description: "download the PDF" },
  { command: "wake", description: "test the simulation" },
  { command: "clear", description: "clear the feed" },
] as const;
