"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  age: number;
};

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!canvas || !dot || !ring) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points: Point[] = [];
    const maxPoints = navigator.maxTouchPoints > 0 ? 36 : 108;
    let width = 0;
    let height = 0;
    let raf = 0;
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let tx = rx;
    let ty = ry;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      points.push({ x: tx, y: ty, age: 0 });
      while (points.length > maxPoints) points.shift();
      dot.style.left = `${tx}px`;
      dot.style.top = `${ty}px`;
    };

    const draw = () => {
      raf = window.requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;

      for (let i = points.length - 1; i >= 0; i -= 1) {
        points[i].age += 1;
        if (points[i].age > maxPoints) points.splice(i, 1);
      }

      for (let i = 1; i < points.length; i += 1) {
        const prev = points[i - 1];
        const point = points[i];
        const t = i / points.length;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(point.x, point.y);
        ctx.lineCap = "round";
        ctx.lineWidth = 2 + t * 14;
        ctx.strokeStyle = `hsla(${170 + t * 120}, 96%, ${54 + t * 22}%, ${0.06 + t * 0.52})`;
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    draw();

    const onVisibilityChange = () => {
      if (document.hidden) window.cancelAnimationFrame(raf);
      else draw();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* EFFECT: custom cursor comet trail */}
      <canvas ref={canvasRef} className="cursor-canvas" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
