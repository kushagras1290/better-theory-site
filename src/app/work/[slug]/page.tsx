import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { getProject, projects } from "@/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="page">
      <section className="detail-hero">
        <div className="section">
          <Reveal>
            <div className="project-topline">
              <span>{project.client}</span>
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
            <h1>{project.title}</h1>
            <p className="lead">{project.tagline}</p>
          </Reveal>
          <Reveal
            className="detail-visual"
            delay={0.12}
            style={
              {
                "--c1": project.palette[0],
                "--c2": project.palette[1],
              } as CSSProperties
            }
          >
            <span aria-hidden="true" />
          </Reveal>
        </div>
      </section>
      <section className="band alt">
        <div className="section stat-grid">
          {project.metrics.map((metric) => (
            <Reveal className="metric-card" key={metric}>
              <strong>{metric}</strong>
              <span>Measured project signal</span>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="band">
        <div className="section chapter-grid">
          {project.chapters.map((chapter, index) => (
            <Reveal className="text-panel" delay={index * 0.08} key={chapter}>
              <p className="kicker">Chapter {String(index + 1).padStart(2, "0")}</p>
              <h3>{chapter}</h3>
              <p>{project.tagline}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
