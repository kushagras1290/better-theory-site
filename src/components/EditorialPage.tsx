import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function EditorialPage({
  kicker,
  title,
  body,
  stats,
}: {
  kicker: string;
  title: string;
  body: string;
  stats: readonly string[];
}) {
  return (
    <main className="page">
      <section className="hero">
        <div className="section hero-grid">
          <Reveal>
            <p className="kicker">{kicker}</p>
            <h1>{title}</h1>
            <p className="lead">{body}</p>
            <div className="cta-row">
              <Link className="button primary" href="/work">
                See work
              </Link>
              <Link className="button" href="/contact">
                Start a brief
              </Link>
            </div>
          </Reveal>
          <Reveal className="hero-panel" delay={0.16}>
            {stats.map((stat) => (
              <div className="metric-card" key={stat}>
                <strong>{stat}</strong>
                <span>{kicker} signal</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="band alt">
        <div className="section capability-grid">
          {["Clarity", "Spectacle", "Reliability"].map((item, index) => (
            <Reveal className="text-panel" delay={index * 0.08} key={item}>
              <p className="kicker">Principle</p>
              <h3>{item}</h3>
              <p>Glass surface. Branch logic. Fast route change.</p>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
