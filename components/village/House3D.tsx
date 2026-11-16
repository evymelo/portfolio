"use client";

import { useState } from "react";
import type { House } from "@/lib/village-data";
import { Billboard, Face } from "./primitives";
import { Heart, RoofDecor } from "./Decor";
import { WINDOW_DAY, WINDOW_GLOW, WINDOW_NIGHT, nightPalette } from "@/lib/night";

interface Props {
  house: House;
  index: number;
  isNext: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  night: boolean;
}

function shingles(color: string) {
  return {
    backgroundColor: color,
    backgroundImage:
      "radial-gradient(circle at 50% 0, rgba(0,0,0,0.13) 0 8px, transparent 9px), radial-gradient(circle at 50% 0, rgba(0,0,0,0.13) 0 8px, transparent 9px)",
    backgroundSize: "22px 16px",
    backgroundPosition: "0 0, 11px 8px",
  };
}

function Window({ p, round = true, night }: { p: House["palette"]; round?: boolean; night: boolean }) {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: round ? "50%" : 8,
        background: night ? WINDOW_NIGHT : WINDOW_DAY,
        border: `4px solid ${p.trim}`,
        boxShadow: night ? WINDOW_GLOW : "inset 0 -6px 0 rgba(255,170,90,.25)",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, margin: "auto", width: 3, background: p.trim }} />
      <div style={{ position: "absolute", inset: 0, margin: "auto", height: 3, background: p.trim }} />
    </div>
  );
}

function darken(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * f).toString(16).padStart(2, "0");
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`;
}

export default function House3D({ house, onSelect, onHover, night }: Props) {
  const [hover, setHover] = useState(false);
  const { w, d, h } = house.size;
  const roof = d / 2;
  const p = night ? nightPalette(house.palette) : house.palette;
  const backWall = darken(p.wallSide, 0.9);

  const slope = Math.sqrt((d / 2) ** 2 + roof ** 2);
  const angle = (Math.atan2(roof, d / 2) * 180) / Math.PI;
  const roofW = w + 22;
  const eave = 12;
  const roofL = slope + eave;
  const roofY = d / 4 + ((eave / 2) * (d / 2)) / slope;
  const roofZ = h + roof / 2 - ((eave / 2) * roof) / slope;
  const lift = hover ? 14 : 0;

  return (
    <div
      className="v-3d"
      style={{ transform: `translate3d(${house.x}px, ${house.y}px, 0)` }}
      onPointerEnter={() => {
        setHover(true);
        onHover(house.id);
      }}
      onPointerLeave={() => {
        setHover(false);
        onHover(null);
      }}
      onClick={() => onSelect(house.id)}
      data-house={house.id}
    >
      <div
        className="v-3d v-house-body"
        style={{ transform: `translateZ(${1 + lift}px)`, cursor: "pointer" }}
      >
        <Face
          w={w}
          h={h}
          className="v-cull"
          transform={`translate3d(0, ${d / 2}px, ${h / 2}px) rotateX(-90deg)`}
          style={{ background: p.wall, borderBottom: `8px solid ${p.wallSide}` }}
        >
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-5 pb-0">
            <div className="mb-8">
              <Window p={p} night={night} />
            </div>
            <div
              style={{
                width: 42,
                height: 64,
                borderRadius: "21px 21px 4px 4px",
                background: p.door,
                border: `4px solid ${p.trim}`,
                borderBottom: "none",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", right: 6, top: 34, width: 6, height: 6, borderRadius: 9, background: p.trim }} />
            </div>
            <div className="mb-8">
              <Window p={p} night={night} />
            </div>
          </div>
          <div className="absolute left-1/2 top-3 -translate-x-1/2">
            <Heart size={20} color={p.accent} />
          </div>
        </Face>
        <Face w={w} h={h} className="v-cull" transform={`translate3d(0, ${-d / 2}px, ${h / 2}px) rotateX(-90deg) rotateY(180deg)`} style={{ background: backWall }} />
        {[-1, 1].map((s) => (
          <Face
            key={s}
            w={d}
            h={h}
            className="v-cull"
            transform={`translate3d(${(s * w) / 2}px, 0, ${h / 2}px) rotateZ(90deg) rotateX(-90deg)${s > 0 ? " rotateY(180deg)" : ""}`}
            style={{ background: p.wallSide, borderBottom: `8px solid ${p.wallSide}` }}
          >
            <div className="flex h-full items-center justify-center">
              <Window p={p} round={false} night={night} />
            </div>
          </Face>
        ))}
        {[-1, 1].map((s) => (
          <Face
            key={`g${s}`}
            w={d / Math.SQRT2}
            h={d / Math.SQRT2}
            className="v-cull"
            transform={`translate3d(${(s * w) / 2}px, 0, ${h}px) rotateZ(90deg) rotateX(-90deg)${s > 0 ? " rotateY(180deg)" : ""} rotate(45deg)`}
            style={{ background: `linear-gradient(to bottom right, ${p.wallSide} 50%, transparent 50%)` }}
          />
        ))}
        <Face
          w={roofW}
          h={roofL}
          className="v-cull"
          transform={`translate3d(0, ${roofY}px, ${roofZ}px) rotateX(${-angle}deg)`}
          style={{ ...shingles(p.roof), borderRadius: "0 0 10px 10px" }}
        />
        <Face
          w={roofW}
          h={roofL}
          className="v-cull"
          transform={`translate3d(0, ${-roofY}px, ${roofZ}px) rotateX(${angle}deg)`}
          style={{ ...shingles(p.roofBack), borderRadius: "10px 10px 0 0" }}
        />

        <Billboard z={h + roof + 2}>
          <div>
            <RoofDecor kind={house.decor} size={house.id === "kitty" ? 92 : 74} />
          </div>
        </Billboard>
      </div>

    </div>
  );
}
