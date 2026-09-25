import { useEffect, useRef } from "react";
import { AXIS_META } from "@/lib/game/catalog";
import type { AxisId } from "@/lib/game/types";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  kind: "mote" | "bubble" | "spark";
};

const AXIS_HEX: Record<AxisId | "gold", string> = {
  gold: "#d4af37",
  tech: "#5eead4",
  agro: "#86efac",
  pesca: "#67e8f9",
  ambiente: "#6ee7b7",
  turismo: "#fbbf24",
  naturais: "#c4b5fd",
  humanas: "#fdba74",
};

interface Props {
  cauldronAxis: AxisId | "gold";
  burst: number;
  reducedMotion: boolean;
}

export function ParticleLayer({ cauldronAxis, burst, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);
  const axisRef = useRef(cauldronAxis);
  axisRef.current = cauldronAxis;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let spawnAcc = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = (p: Particle) => {
      if (parts.current.length > 220) parts.current.shift();
      parts.current.push(p);
    };

    const cauldronOrigin = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      return { x: w * 0.5, y: h * 0.72 };
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (!reducedMotion) {
        spawnAcc += dt;
        const color = AXIS_HEX[axisRef.current] ?? AXIS_HEX.gold;
        if (spawnAcc > 0.08) {
          spawnAcc = 0;
          const origin = cauldronOrigin();
          spawn({
            x: origin.x + (Math.random() - 0.5) * 70,
            y: origin.y,
            vx: (Math.random() - 0.5) * 18,
            vy: -40 - Math.random() * 50,
            life: 0,
            max: 1.8 + Math.random() * 1.2,
            size: 3 + Math.random() * 7,
            color,
            kind: "bubble",
          });
          spawn({
            x: Math.random() * w,
            y: Math.random() * h * 0.7,
            vx: (Math.random() - 0.5) * 8,
            vy: -6 - Math.random() * 10,
            life: 0,
            max: 4 + Math.random() * 3,
            size: 1.2 + Math.random() * 1.8,
            color: "rgba(244,234,216,0.55)",
            kind: "mote",
          });
        }
      }

      const next: Particle[] = [];
      for (const p of parts.current) {
        p.life += dt;
        if (p.life >= p.max) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.kind === "bubble") {
          p.vx += Math.sin(p.life * 6) * 8 * dt;
          p.vy -= 12 * dt;
        }
        const t = p.life / p.max;
        const alpha = p.kind === "spark" ? 1 - t : 0.85 * (1 - t);
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const r = p.kind === "bubble" ? p.size * (0.7 + t) : p.size;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        next.push(p);
      }
      ctx.globalAlpha = 1;
      parts.current = next;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!burst) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const origin = {
      x: canvas.clientWidth * 0.5,
      y: canvas.clientHeight * 0.72,
    };
    const color = AXIS_HEX[cauldronAxis] ?? AXIS_HEX.gold;
    for (let i = 0; i < 42; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 160;
      parts.current.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 40,
        life: 0,
        max: 0.5 + Math.random() * 0.5,
        size: 2 + Math.random() * 3.5,
        color: i % 3 === 0 ? "#f4ead8" : color,
        kind: "spark",
      });
    }
  }, [burst, cauldronAxis]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ transform: "scale(1.2)", transformOrigin: "50% 72%" }}
        aria-hidden
      />
    </div>
  );
}

export function axisGlow(axis: AxisId | "gold") {
  if (axis === "gold") return "#d4af37";
  return AXIS_META[axis]?.glow ?? "#d4af37";
}
