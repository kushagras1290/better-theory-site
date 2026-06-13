import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

export function MetricStrip() {
  return (
    <div className="stat-grid">
      {[
        ["21", "nodes"],
        ["WebGL", "tree"],
        ["Motion", "travel"],
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

export function TreeScroll() {
  const layers = [
    ["01", "Roots", "Origin paths."],
    ["02", "Trunk", "Primary route spine."],
    ["03", "Branches", "Studio, labs, process."],
    ["04", "Subbranches", "Work case paths."],
    ["05", "Canopy", "The whole system."],
  ];

  return (
    <section className="tree-scroll" aria-label="Tree scroll traversal">
      <div className="section tree-scroll__stage">
        <div>
          <p className="kicker">Scroll traversal</p>
          <h2>Go deeper into the tree.</h2>
        </div>
        <div className="tree-scroll__steps">
          {layers.map(([number, title, body]) => (
            <Reveal className="tree-step" key={title}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CapabilityBand() {
  const items = [
    ["Tree stage", "A large route-aware WebGL organism."],
    ["Branch travel", "Primary pages and subpages mapped as limbs."],
    ["Sheer UI", "Glass controls, tiny labels, less copy."],
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
          <p className="kicker">Branches</p>
          <h2>Case-study limbs.</h2>
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
              <p>{project.tagline}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
