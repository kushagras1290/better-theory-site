import Link from "next/link";
import { navItems } from "@/data/pages";

export function Navigation() {
  return (
    <header className="nav">
      <Link className="brand" href="/" aria-label="Better Theory home">
        <span>Better Theory</span>
        <span>Creative systems</span>
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link className="nav-link" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
