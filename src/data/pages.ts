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

export const traversalNodes = [
  { href: "/", label: "Root", side: "center", depth: 0 },
  { href: "/work", label: "Work canopy", side: "left", depth: 1 },
  { href: "/studio", label: "Studio limb", side: "right", depth: 2 },
  { href: "/labs", label: "Lab graft", side: "left", depth: 3 },
  { href: "/capabilities", label: "Capability rings", side: "right", depth: 4 },
  { href: "/process", label: "Process cambium", side: "left", depth: 5 },
  { href: "/awards", label: "Proof fruit", side: "right", depth: 6 },
  { href: "/manifesto", label: "Manifesto crown", side: "left", depth: 7 },
  { href: "/contact", label: "Contact seed", side: "right", depth: 8 },
] as const;

export function getTraversalIndex(pathname: string) {
  if (pathname.startsWith("/work/")) return 1;
  const index = traversalNodes.findIndex((node) => node.href === pathname);
  return index >= 0 ? index : 0;
}

export const pageCopy = {
  studio: {
    kicker: "Studio",
    title: "Studio limb.",
    body: "A small build room for immersive systems.",
    stats: ["18 makers", "5 disciplines", "1 integrated build room"],
  },
  labs: {
    kicker: "Labs",
    title: "Lab grafts.",
    body: "Shaders, motion tests, and interface mutations.",
    stats: ["64 experiments", "12 shipped patterns", "0 throwaway demos"],
  },
  capabilities: {
    kicker: "Capabilities",
    title: "Capabilities ring.",
    body: "WebGL, motion, AI, systems, deploy.",
    stats: ["WebGL", "Framer Motion", "Cloudflare"],
  },
  process: {
    kicker: "Process",
    title: "Process cambium.",
    body: "Frame it. Prototype it. Ship it.",
    stats: ["01 Frame", "02 Prototype", "03 Ship"],
  },
  awards: {
    kicker: "Proof",
    title: "Proof fruit.",
    body: "Attention is measured by behavior.",
    stats: ["126 fictional wins", "99 UX score target", "AA baseline"],
  },
  manifesto: {
    kicker: "Manifesto",
    title: "Manifesto crown.",
    body: "Alive, legible, fast, useful.",
    stats: ["No dead pages", "No generic cursor", "No passive portfolio"],
  },
  contact: {
    kicker: "Contact",
    title: "Contact seed.",
    body: "Bring the impossible brief.",
    stats: ["hello@better-theory.local", "Global remote", "48h response"],
  },
} as const;
