import Link from "next/link";
import { CapabilityBand, FeaturedWork, Marquee, MetricStrip } from "@/components/PageBlocks";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="section hero-grid">
          <div>
            <Reveal>
              <p className="kicker">Better than a work page</p>
              <h1>Interactive websites that behave like living systems.</h1>
              <p className="lead">
                A sharper, deeper, more navigable alternative to the cinematic agency portfolio:
                WebGL in the background, a real cursor trail, fast content routes, and project
                pages that explain the work instead of hiding it behind spectacle.
              </p>
              <div className="cta-row">
                <Link className="button primary" href="/work">
                  Enter the work
                </Link>
                <Link className="button" href="/manifesto">
                  Read the manifesto
                </Link>
              </div>
            </Reveal>
            <MetricStrip />
          </div>
          <Reveal className="hero-panel" delay={0.18}>
            <p className="kicker">Reference understood</p>
            <h3>Then rebuilt with more surface area.</h3>
            <p>
              The original reference leans on a custom canvas stage, shader scenes, mouse-fluid
              interactions, bloom, and project routing. This site keeps that cinematic ambition
              while adding stronger navigation, richer pages, and deployable production structure.
            </p>
          </Reveal>
        </div>
      </section>
      <Marquee />
      <FeaturedWork />
      <CapabilityBand />
    </main>
  );
}
