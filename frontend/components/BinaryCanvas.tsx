"use client";

import { useEffect, useRef } from "react";

export default function BinaryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const cells = useRef<{ val: string; opacity: number; hover: number; hoverColor: number }[]>([]);
  const rafId = useRef<number>(0);
  const CELL = 26;
  const RADIUS = 140;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.ceil(canvas.width / CELL);
      const rows = Math.ceil(canvas.height / CELL);
      cells.current = Array.from({ length: cols * rows }, () => ({
        val: Math.random() > 0.5 ? "1" : "0",
        opacity: Math.random() * 0.06 + 0.02,
        hover: 0,
        hoverColor: Math.random(),
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      rafId.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / CELL);
      ctx.font = `${CELL - 10}px 'Courier New', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 0;

      cells.current.forEach((cell, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = col * CELL + CELL / 2;
        const cy = row * CELL + CELL / 2;
        const dx = cx - mouse.current.x;
        const dy = cy - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS) {
          if (Math.random() < 0.06) cell.val = Math.random() > 0.5 ? "1" : "0";
          cell.hover = Math.min(cell.hover + 0.1, 1);
        } else {
          cell.hover = Math.max(cell.hover - 0.03, 0);
        }

        const alpha = cell.opacity + cell.hover * 0.22;

        if (cell.hover > 0.01) {
          const h = cell.hover;
          const hc = cell.hoverColor;
          let r: number, g: number, b: number;
          if (hc < 0.33) { r = 147; g = 114; b = 255; }      
          else if (hc < 0.66) { r = 80; g = 200; b = 180; }   
          else { r = 255; g = 142; b = 107; }                 

          const base = 60;
          const bright = base + h * 90;
          ctx.fillStyle = `rgba(${Math.round(base + (r - base) * h)},${Math.round(base + (g - base) * h)},${Math.round(base + (b - base) * h)},${alpha})`;
        } else {
          const base = 60;
          const bright = base + cell.hover * 130;
          ctx.fillStyle = `rgba(${bright},${bright},${bright},${alpha})`;
        }

        ctx.fillText(cell.val, cx, cy);
      });
    };

    rafId.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "#080810" }}
    />
  );
}
