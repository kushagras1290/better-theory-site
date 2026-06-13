import Link from "next/link";
import { FeaturedWork, MetricStrip, TreeScroll } from "@/components/PageBlocks";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="section hero-grid">
          <div>
            <Reveal>
              <p className="kicker">Branch traversal</p>
              <h1>Enter the living tree.</h1>
              <p className="lead">
                A sleek WebGL route organism. Trunk, branches, subbranches.
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
            <p className="kicker">Structure</p>
            <h3>Trunk. Branch. Subbranch.</h3>
            <p>Less text. More traversal.</p>
          </Reveal>
        </div>
      </section>
      <TreeScroll />
      <FeaturedWork />
    </main>
  );
}
