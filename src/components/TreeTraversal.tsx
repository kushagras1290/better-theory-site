"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { projects } from "@/data/projects";
import { getTraversalIndex, traversalNodes } from "@/data/pages";

export function TreeTraversal() {
  const pathname = usePathname();
  const activeIndex = getTraversalIndex(pathname);
  const activeProject = pathname.startsWith("/work/") ? pathname.split("/").pop() : "";

  return (
    <aside className="tree-traversal" aria-label="Tree route traversal">
      <div className="tree-traversal__label">Route Tree</div>
      <svg className="tree-traversal__svg" viewBox="0 0 180 440" aria-hidden="true">
        <path
          className="tree-traversal__trunk"
          d="M90 410 C82 330 100 292 90 228 C80 164 92 98 90 30"
        />
        {traversalNodes.slice(1).map((node, index) => {
          const y = 72 + index * 42;
          const isLeft = node.side === "left";
          const endX = isLeft ? 38 : 142;
          const controlX = isLeft ? 58 : 122;
          return (
            <path
              className="tree-traversal__branch"
              d={`M90 ${y} C${controlX} ${y - 18} ${controlX} ${y + 18} ${endX} ${y}`}
              key={node.href}
            />
          );
        })}
        {projects.slice(0, 6).map((project, index) => {
          const y = 112 + index * 28;
          return (
            <path
              className="tree-traversal__twig"
              d={`M38 ${y} C18 ${y - 8} 20 ${y + 12} 10 ${y + 18}`}
              key={project.slug}
            />
          );
        })}
      </svg>
      <div className="tree-traversal__nodes">
        {traversalNodes.map((node, index) => {
          const active = activeIndex === index;
          return (
            <Link
              className="tree-traversal__node"
              data-active={active ? "true" : "false"}
              href={node.href}
              key={node.href}
              style={{ "--node-offset": index % 2 === 0 ? "0px" : "-18px" } as CSSProperties}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{node.label}</strong>
            </Link>
          );
        })}
      </div>
      <div className="tree-traversal__subnodes" aria-label="Work subbranches">
        {projects.slice(0, 6).map((project, index) => (
          <Link
            className="tree-traversal__subnode"
            data-active={activeProject === project.slug ? "true" : "false"}
            href={`/work/${project.slug}`}
            key={project.slug}
            style={{ "--subnode-offset": `${index * -4}px` } as CSSProperties}
          >
            {project.title}
          </Link>
        ))}
      </div>
    </aside>
  );
}
