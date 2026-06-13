export const navItems = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/labs", label: "Labs" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/process", label: "Process" },
  { href: "/awards", label: "Proof" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/contact", label: "Contact" },
];

export const pageCopy = {
  studio: {
    kicker: "Studio",
    title: "A compact senior team for difficult internet objects.",
    body:
      "We combine art direction, product strategy, realtime engineering, and production discipline. The result is not just spectacle. It is a faster route from impossible brief to stable shipped system.",
    stats: ["18 makers", "5 disciplines", "1 integrated build room"],
  },
  labs: {
    kicker: "Labs",
    title: "Prototypes that become production language.",
    body:
      "Labs is where shader studies, AI behaviors, browser performance tests, and spatial interface patterns are pressure-tested before they become client work.",
    stats: ["64 experiments", "12 shipped patterns", "0 throwaway demos"],
  },
  capabilities: {
    kicker: "Capabilities",
    title: "Strategy, motion, WebGL, AI, systems, and deployment in one loop.",
    body:
      "The site is built around the same capabilities it sells: cinematic frontend craft, technical storytelling, data-led interaction, robust routing, and deployment-ready engineering.",
    stats: ["WebGL", "Framer Motion", "Cloudflare"],
  },
  process: {
    kicker: "Process",
    title: "Less ceremony. More working interface.",
    body:
      "We run tight discovery, build visual prototypes early, validate performance continuously, and leave teams with documented systems instead of one-off campaign debris.",
    stats: ["01 Frame", "02 Prototype", "03 Ship"],
  },
  awards: {
    kicker: "Proof",
    title: "Awards are a side effect. Measurable behavior is the target.",
    body:
      "The work is designed to win attention, but it is judged by adoption, recall, conversion, retention, accessibility, and operational maintainability.",
    stats: ["126 fictional wins", "99 UX score target", "AA baseline"],
  },
  manifesto: {
    kicker: "Manifesto",
    title: "The better website is alive, legible, fast, and useful.",
    body:
      "Beauty without navigation is a screensaver. Motion without meaning is delay. We build interfaces that feel rare while still giving users control, context, and a clear next move.",
    stats: ["No dead pages", "No generic cursor", "No passive portfolio"],
  },
  contact: {
    kicker: "Contact",
    title: "Bring the impossible brief. Leave with a production path.",
    body:
      "For launches, cultural platforms, spatial commerce, realtime data stories, and AI-led experiences. The first response should include the problem, deadline, and what must not break.",
    stats: ["hello@better-theory.local", "Global remote", "48h response"],
  },
} as const;
