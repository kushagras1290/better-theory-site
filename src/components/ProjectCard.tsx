import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
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
        <span>{project.year}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.tagline}</p>
      <div className="project-meta">
        <span>{project.client}</span>
        <span>{project.services[0]}</span>
      </div>
    </Link>
  );
}
