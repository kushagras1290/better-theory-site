export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  tagline: string;
  summary: string;
  metrics: [string, string, string];
  palette: [string, string, string];
  services: string[];
  chapters: string[];
};

export const projects: Project[] = [
  {
    slug: "neural-opera",
    title: "Neural Opera",
    client: "Luma Arts",
    year: "2026",
    category: "AI Performance",
    tagline: "A browser-native opera where audience emotion rewrites the score in real time.",
    summary:
      "A real-time WebGL stage, generative score engine, and synchronized typographic system for a touring digital performance.",
    metrics: ["4.8M viewers", "38 ms median input loop", "17 markets"],
    palette: ["#00f5d4", "#f72585", "#f8f7ff"],
    services: ["Realtime systems", "WebGL stagecraft", "AI prototyping"],
    chapters: ["Emotion capture", "Generative scene language", "Live control room"],
  },
  {
    slug: "orbit-retail",
    title: "Orbit Retail",
    client: "Aster Commerce",
    year: "2026",
    category: "Spatial Commerce",
    tagline: "A product catalog that behaves like a cinematic spacecraft dashboard.",
    summary:
      "A high-performance 3D storefront with gesture-led browsing, configurable products, and analytics-aware journeys.",
    metrics: ["31% lift in add-to-cart", "96 Lighthouse UX score", "11 product worlds"],
    palette: ["#ffea00", "#00bbf9", "#111111"],
    services: ["3D commerce", "Interaction design", "Performance engineering"],
    chapters: ["Product constellations", "Checkout compression", "Behavior telemetry"],
  },
  {
    slug: "climate-signal",
    title: "Climate Signal",
    client: "Northline Foundation",
    year: "2025",
    category: "Data Storytelling",
    tagline: "A living atlas that turns climate data into navigable sensory evidence.",
    summary:
      "An editorial platform with realtime datasets, scroll-bound WebGL maps, and accessible data explainers.",
    metrics: ["92 datasets", "7 languages", "2.1M report downloads"],
    palette: ["#80ffdb", "#48bfe3", "#ffffff"],
    services: ["Data visualization", "Narrative systems", "Accessibility"],
    chapters: ["Signal model", "Map choreography", "Public evidence kit"],
  },
  {
    slug: "sonic-archive",
    title: "Sonic Archive",
    client: "Muse One",
    year: "2025",
    category: "Culture Platform",
    tagline: "A museum collection heard, touched, and remixed through the browser.",
    summary:
      "A sound-led archive using procedural visuals, spatial audio cues, and collection-safe editorial workflows.",
    metrics: ["14K artifacts", "61% longer sessions", "AA accessible"],
    palette: ["#ffffff", "#caffbf", "#ff006e"],
    services: ["Editorial CMS", "Audio interaction", "Collection UX"],
    chapters: ["Archive model", "Spatial listening", "Curator workbench"],
  },
  {
    slug: "hyperdrive-sport",
    title: "Hyperdrive Sport",
    client: "Velocity League",
    year: "2026",
    category: "Fan Experience",
    tagline: "A match-center that feels faster than the match itself.",
    summary:
      "A broadcast companion with predictive overlays, reactive particle states, and second-screen fan rituals.",
    metrics: ["9.4M match sessions", "120 fps motion budget", "44 live events"],
    palette: ["#ffbe0b", "#3a86ff", "#ffffff"],
    services: ["Live data UX", "Motion systems", "Edge delivery"],
    chapters: ["Live state graph", "Fan rituals", "Broadcast sync"],
  },
  {
    slug: "afterdark-os",
    title: "Afterdark OS",
    client: "Nocturne Labs",
    year: "2026",
    category: "Product Launch",
    tagline: "A launch site that unlocks like an operating system from the future.",
    summary:
      "A launch platform with command-palette navigation, shader-backed modules, and persistent personalization.",
    metrics: ["810K waitlist joins", "12 launch modules", "18% referral loop"],
    palette: ["#f8f7ff", "#00f5d4", "#ff4d6d"],
    services: ["Launch strategy", "Frontend architecture", "Interaction systems"],
    chapters: ["OS metaphor", "Progressive reveals", "Referral mechanics"],
  },
  {
    slug: "clean-room",
    title: "Clean Room",
    client: "Helio Robotics",
    year: "2025",
    category: "Technical Brand",
    tagline: "Robotics made tactile through glass, light, and precise technical storytelling.",
    summary:
      "A product narrative with refractive WebGL materials, motion-driven specs, and conversion-focused engineering pages.",
    metrics: ["23 enterprise pilots", "44% scroll depth gain", "5 product systems"],
    palette: ["#f8f7ff", "#00bbf9", "#b8f2e6"],
    services: ["Technical storytelling", "3D art direction", "Lead funnels"],
    chapters: ["Material language", "Proof architecture", "Enterprise paths"],
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    client: "Atlas Supply",
    year: "2025",
    category: "Editorial Commerce",
    tagline: "A field guide, commerce layer, and documentary interface in one system.",
    summary:
      "A content-commerce system with expedition journals, tactile product cards, and cinematic route transitions.",
    metrics: ["3.6x content revenue", "28 editorial drops", "16 countries"],
    palette: ["#d9ed92", "#00f5d4", "#111111"],
    services: ["Editorial systems", "Commerce UX", "Content operations"],
    chapters: ["Route system", "Product context", "Editorial cadence"],
  },
  {
    slug: "signal-market",
    title: "Signal Market",
    client: "Nova Finance",
    year: "2026",
    category: "Financial Interface",
    tagline: "Dense market intelligence made cinematic without losing trust.",
    summary:
      "A financial dashboard with high-density motion, audit-friendly interactions, and anomaly visualization.",
    metrics: ["42 ms chart input", "AA contrast", "6 desk workflows"],
    palette: ["#ffffff", "#70e000", "#00bbf9"],
    services: ["Product design", "Data engineering", "Design systems"],
    chapters: ["Information density", "Risk states", "Trader confidence"],
  },
  {
    slug: "future-commons",
    title: "Future Commons",
    client: "Civic Lab",
    year: "2025",
    category: "Public Platform",
    tagline: "A participatory city prototype with beautiful, legible civic tooling.",
    summary:
      "A public planning portal with scenario simulations, civic workshops, and accessible interactive maps.",
    metrics: ["140K residents reached", "27 workshop kits", "9 city pilots"],
    palette: ["#f8f7ff", "#ffd60a", "#00f5d4"],
    services: ["Civic UX", "Simulation design", "Workshop systems"],
    chapters: ["Scenario engine", "Community inputs", "Policy export"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
