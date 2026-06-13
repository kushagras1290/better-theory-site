import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

export function MetricStrip() {
  return (
    <div className="stat-grid">
      {[
        ["15+", "public pages and generated project routes"],
        ["WebGL", "persistent shader and particle stage"],
        ["Motion", "Framer-powered reveal and navigation rhythm"],
      ].map(([value, label]) => (
        <Reveal className="metric-card" key={value}>
          <strong>{value}</strong>
          <span>{label}</span>
        </Reveal>
      ))}
    </div>
  );
}

export function Marquee() {
  const words = ["WebGL", "Realtime", "AI", "Motion", "Commerce", "Culture", "Data", "Cloudflare"];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...words, ...words].map((word, index) => (
          <span key={`${word}-${index}`}>{word}</span>
        ))}
      </div>
    </div>
  );
}

export function CapabilityBand() {
  const items = [
    ["WebGL direction", "Shader-backed atmospheres, reactive particles, and spatial scenes that support content instead of hiding it."],
    ["Motion systems", "Framer Motion choreography, page rhythm, hover intent, and reduced-motion fallbacks."],
    ["Production delivery", "Static export, semantic routes, documented deployment, and Cloudflare Pages compatibility."],
  ];

  return (
    <section className="band alt">
      <div className="section capability-grid">
        {items.map(([title, body], index) => (
          <Reveal className="text-panel" delay={index * 0.08} key={title}>
            <p className="kicker">Capability</p>
            <h3>{title}</h3>
            <p>{body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FeaturedWork() {
  return (
    <section className="band">
      <div className="section work-header">
        <div>
          <p className="kicker">Selected work</p>
          <h2>Ten fictional case studies with real interaction depth.</h2>
        </div>
        <Link className="button" href="/work">
          View all work
        </Link>
      </div>
      <div className="section project-grid">
        {projects.slice(0, 4).map((project, index) => (
          <Reveal delay={index * 0.06} key={project.slug}>
            <Link
              className="project-card"
              href={`/work/${project.slug}`}
              style={
                {
                  "--c1": project.palette[0],
                  "--c2": project.palette[1],
                } as CSSProperties
              }
            >
              <div className="project-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
