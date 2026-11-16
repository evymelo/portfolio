import { memo, useEffect, useRef } from "react";
import { HOUSES } from "@/lib/village-data";
import { Billboard, Flat } from "./primitives";
import { tint } from "@/lib/night";

export const GROUND = { w: 1320, h: 1220 };

const WAYPOINTS: [number, number][] = [
  [0, 432],
  [-210, 390],
  [-340, 210],
  [-485, 210],
  [-470, -110],
  [-300, -160],
  [-150, -185],
  [40, -290],
  [180, -200],
  [262, -62],
  [350, -82],
  [485, 60],
  [472, 300],
  [360, 282],
  [200, 220],
  [0, 45],
];

function catmull(points: [number, number][], step = 30): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const n = Math.max(2, Math.round(len / step));
    for (let s = 0; s < n; s++) {
      const t = s / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

const STONES = catmull(WAYPOINTS);

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

const POND = { x: -160, y: 60, w: 170, h: 110 };

function blocked(x: number, y: number, margin: number) {
  for (const h of HOUSES) {
    if (Math.abs(x - h.x) < h.size.w / 2 + margin && Math.abs(y - h.y) < h.size.d / 2 + margin + 30) return true;
  }
  if (Math.abs(x - POND.x) < POND.w / 2 + 20 && Math.abs(y - POND.y) < POND.h / 2 + 20) return true;
  return STONES.some(([sx, sy]) => Math.hypot(sx - x, sy - y) < 34);
}

const rand = rng(7);
const TREES: { x: number; y: number; kind: number; s: number }[] = [];
for (let a = 0; a < 360; a += 22) {
  const r = (a * Math.PI) / 180;
  const x = Math.cos(r) * (GROUND.w / 2 - 70) * (0.92 + rand() * 0.08);
  const y = Math.sin(r) * (GROUND.h / 2 - 70) * (0.92 + rand() * 0.08);
  if (!blocked(x, y, 40)) TREES.push({ x, y, kind: Math.floor(rand() * 3), s: 0.8 + rand() * 0.45 });
}
for (const [x, y] of [
  [170, 40],
  [-130, -320],
  [210, 400],
  [-470, 380],
  [-560, -330],
] as const) {
  if (!blocked(x, y, 30)) TREES.push({ x, y, kind: Math.floor(rand() * 3), s: 0.9 });
}

const FLOWERS: { x: number; y: number; f: string }[] = [];
const FLOWER_SET = ["🌷", "🌸", "🌼", "🍓", "🍄"];
for (let i = 0; i < 120 && FLOWERS.length < 14; i++) {
  const x = (rand() - 0.5) * (GROUND.w - 180);
  const y = (rand() - 0.5) * (GROUND.h - 180);
  if (!blocked(x, y, 24)) FLOWERS.push({ x, y, f: FLOWER_SET[Math.floor(rand() * FLOWER_SET.length)] });
}
const PETAL_COLORS = ["#FF9DBB", "#FFFFFF", "#FFD86B", "#C8B6FF", "#FFB6CF"];
const GROUND_FLOWERS: { x: number; y: number; c: string; r: number }[] = [];
for (let i = 0; i < 260 && GROUND_FLOWERS.length < 60; i++) {
  const x = (rand() - 0.5) * (GROUND.w - 120);
  const y = (rand() - 0.5) * (GROUND.h - 120);
  if (!blocked(x, y, 16)) GROUND_FLOWERS.push({ x, y, c: PETAL_COLORS[Math.floor(rand() * PETAL_COLORS.length)], r: 3 + rand() * 2 });
}

const LAMPS: { x: number; y: number }[] = [];
for (let i = 6; i < STONES.length; i += 17) {
  const [sx, sy] = STONES[i];
  for (const [dx, dy] of [[42, 0], [-42, 0], [0, 42], [0, -42]]) {
    const x = sx + dx;
    const y = sy + dy;
    if (!blocked(x, y, 18)) {
      LAMPS.push({ x, y });
      break;
    }
  }
}

const TREE_COLORS = [
  ["#FFB6CF", "#FF8FB1"],
  ["#A8E6B8", "#7ACB91"],
  ["#FFD6E7", "#F7A8C6"],
];

function Tree({ kind, s, night }: { kind: number; s: number; night: boolean }) {
  const [c1, c2] = TREE_COLORS[kind].map((c) => (night ? tint(c, 0.5) : c));
  return (
    <svg width={90 * s} height={120 * s} viewBox="0 0 90 120" style={{ display: "block" }}>
      <rect x="39" y="72" width="12" height="46" rx="6" fill={night ? tint("#B07A55", 0.5) : "#B07A55"} />
      <circle cx="45" cy="48" r="34" fill={c2} />
      <circle cx="30" cy="56" r="22" fill={c1} />
      <circle cx="58" cy="40" r="24" fill={c1} />
      <circle cx="44" cy="30" r="20" fill={c1} />
      <circle cx="34" cy="34" r="5" fill="#fff" opacity={night ? 0.2 : 0.55} />
      <circle cx="62" cy="58" r="4" fill="#fff" opacity={night ? 0.15 : 0.45} />
    </svg>
  );
}

function Cloud({ w, night }: { w: number; night: boolean }) {
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 200 100" style={{ display: "block", opacity: night ? 0.45 : 0.92 }}>
      <path d="M40 90 C10 90 8 58 36 56 C34 26 74 18 88 42 C98 12 150 14 152 50 C186 48 192 90 160 90Z" fill={night ? "#8C86C4" : "#fff"} />
    </svg>
  );
}

function Lamp({ night }: { night: boolean }) {
  return (
    <svg width="44" height="96" viewBox="0 0 44 96" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id="v-lamp-glow">
          <stop offset="0" stopColor="#FFE6A0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFE6A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {night && <circle cx="22" cy="20" r="30" fill="url(#v-lamp-glow)" />}
      <rect x="19" y="30" width="6" height="64" rx="3" fill={night ? "#5B5480" : "#C9B7E8"} />
      <rect x="13" y="90" width="18" height="6" rx="3" fill={night ? "#5B5480" : "#C9B7E8"} />
      <path d="M10 12 Q22 0 34 12 Z" fill={night ? "#7A5FA8" : "#F7A8C6"} />
      <rect x="12" y="12" width="20" height="18" rx="6" fill={night ? "#FFE08A" : "#FFF6EC"} stroke={night ? "#F7B84B" : "#E7D3C1"} strokeWidth="2" />
    </svg>
  );
}

function GroundCanvas({ night }: { night: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { w, h } = GROUND;
    const q = Math.min(1.5, Math.max(1, window.devicePixelRatio || 1));
    canvas.width = Math.round(w * q);
    canvas.height = Math.round(h * q);
    ctx.scale(q, q);
    ctx.translate(w / 2, h / 2);

    const c = (hex: string, amount = 0.5) => (night ? tint(hex, amount) : hex);
    const ellipse = (x: number, y: number, rx: number, ry: number, fill: string | CanvasGradient, rot = 0) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    };

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 160);
    ctx.clip();
    const grass = ctx.createRadialGradient(0, -h * 0.1, 0, 0, -h * 0.1, Math.max(w, h) * 0.75);
    grass.addColorStop(0, c("#c7f0c9", 0.6));
    grass.addColorStop(0.55, c("#aee6b4", 0.62));
    grass.addColorStop(1, c("#98dca2", 0.65));
    ctx.fillStyle = grass;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    const speck = rng(99);
    for (let i = 0; i < 500; i++) {
      const light = i % 2 === 0;
      ellipse((speck() - 0.5) * w, (speck() - 0.5) * h, light ? 2 : 3, light ? 2 : 3, light ? (night ? "rgba(200,190,255,0.18)" : "rgba(255,255,255,0.35)") : "rgba(120,190,130,0.35)");
    }
    ctx.restore();
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 155);
    ctx.lineWidth = 10;
    ctx.strokeStyle = night ? "rgba(180,170,255,0.18)" : "rgba(255,255,255,0.35)";
    ctx.stroke();

    ctx.save();
    ctx.filter = "blur(6px)";
    HOUSES.forEach((hs) => ellipse(hs.x, hs.y + 6, hs.size.w / 2 + 30, hs.size.d / 2 + 30, "rgba(80,60,90,0.17)"));
    ctx.restore();
    TREES.forEach((t) => ellipse(t.x, t.y + 4, 30 * t.s, 18 * t.s, "rgba(60,90,60,0.16)"));

    HOUSES.forEach((hs) => {
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.roundRect(hs.x - 28, hs.y + hs.size.d / 2 + 7, 56, 30, 14);
      ctx.fillStyle = c(hs.palette.accent, 0.3);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    ellipse(POND.x, POND.y, POND.w / 2 + 12, POND.h / 2 + 12, c("#E9F6FF"));
    const water = ctx.createLinearGradient(POND.x - POND.w / 2, POND.y - POND.h / 2, POND.x + POND.w / 2, POND.y + POND.h / 2);
    water.addColorStop(0, c("#BFE6FF", 0.6));
    water.addColorStop(1, c("#8FD0F5", 0.6));
    ellipse(POND.x, POND.y, POND.w / 2, POND.h / 2, water);
    if (night) {
      ellipse(POND.x + 20, POND.y - 8, 26, 26, "rgba(255,248,214,0.18)");
      ellipse(POND.x + 20, POND.y - 8, 16, 16, "rgba(255,248,214,0.85)");
    } else {
      ellipse(POND.x - 30, POND.y - 18, 20, 9, "rgba(255,255,255,0.6)");
    }
    ellipse(POND.x - 40, POND.y + 10, 17, 13, c("#7ACB91"), (20 * Math.PI) / 180);
    ellipse(POND.x + 30, POND.y - 20, 14, 11, c("#7ACB91"), (-40 * Math.PI) / 180);

    STONES.forEach(([x, y], i) => {
      const big = i % 3 === 0;
      const rot = (((i * 37) % 180) * Math.PI) / 180;
      ellipse(x, y + 2.5, big ? 15 : 12, big ? 11 : 9, c("#E7D3C1", 0.55), rot);
      ellipse(x, y, big ? 15 : 12, big ? 11 : 9, c("#FFF6EC", 0.45), rot);
    });

    if (night) {
      LAMPS.forEach((l) => {
        const pool = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, 90);
        pool.addColorStop(0, "rgba(255,214,120,0.38)");
        pool.addColorStop(1, "rgba(255,214,120,0)");
        ellipse(l.x, l.y, 90, 90, pool);
      });
      HOUSES.forEach((hs) => {
        const cy = hs.y + hs.size.d / 2 + 24;
        const pool = ctx.createRadialGradient(hs.x, cy, 0, hs.x, cy, 70);
        pool.addColorStop(0, "rgba(255,214,120,0.32)");
        pool.addColorStop(1, "rgba(255,214,120,0)");
        ellipse(hs.x, cy, 70, 50, pool);
      });
    }

    GROUND_FLOWERS.forEach((f) => {
      for (let a = 0; a < 360; a += 72) {
        const r = (a * Math.PI) / 180;
        ellipse(f.x + f.r * Math.cos(r), f.y + f.r * Math.sin(r), f.r * 0.75, f.r * 0.75, c(f.c, 0.4));
      }
      ellipse(f.x, f.y, f.r * 0.5, f.r * 0.5, c("#FFD86B", 0.3));
    });
  }, [night]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden />;
}

function Scenery({ night }: { night: boolean }) {
  return (
    <>
      {[
        { z: -44, c: "#B98763" },
        { z: -30, c: "#C99A74" },
        { z: -16, c: "#B98763" },
        { z: -6, c: "#8ED39D" },
      ].map((l) => (
        <Flat key={l.z} x={0} y={0} w={GROUND.w} h={GROUND.h} z={l.z} style={{ borderRadius: 160, background: night ? tint(l.c, 0.6) : l.c }} />
      ))}

      <Flat x={0} y={0} w={GROUND.w} h={GROUND.h} z={0}>
        <GroundCanvas night={night} />
      </Flat>

      {LAMPS.map((l, i) => (
        <Billboard key={`l${i}`} x={l.x} y={l.y} z={1}>
          <Lamp night={night} />
        </Billboard>
      ))}

      <Billboard x={POND.x + 30} y={POND.y - 20} z={2}>
        <span className="block text-[22px] leading-none">🌸</span>
      </Billboard>
      <Billboard x={POND.x - 40} y={POND.y + 10} z={2}>
        <span className="block text-[26px] leading-none">🐸</span>
      </Billboard>

      {TREES.map((t, i) => (
        <Billboard key={`t${i}`} x={t.x} y={t.y} z={1}>
          <Tree kind={t.kind} s={t.s} night={night} />
        </Billboard>
      ))}

      {FLOWERS.map((f, i) => (
        <Billboard key={`f${i}`} x={f.x} y={f.y} z={1}>
          <span className="block text-[22px] leading-none">{f.f}</span>
        </Billboard>
      ))}

      {[
        [-760, -380, 620, 240],
        [780, 320, 680, 200],
        [160, -760, 560, 280],
        [-640, 560, 700, 180],
      ].map(([x, y, z, w], i) => (
        <Billboard key={`c${i}`} x={x} y={y} z={z}>
          <Cloud w={w} night={night} />
        </Billboard>
      ))}
    </>
  );
}

export default memo(Scenery);
