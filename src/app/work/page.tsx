import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "A cinematic portfolio grid with ten deep project routes.",
};

export default function WorkPage() {
  return (
    <main className="page">
      <section className="hero">
        <div className="section">
          <Reveal>
            <p className="kicker">Work</p>
            <h1>Work branches.</h1>
            <p className="lead">
              Subbranches off the main tree. Pick a limb.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="band">
        <div className="section project-grid">
          {projects.map((project, index) => (
            <Reveal delay={(index % 4) * 0.05} key={project.slug}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
