import type { HousePalette } from "./village-data";

const NIGHT_RGB = [36, 31, 69];

export function tint(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return `#${rgb
    .map((v, i) => Math.round(v + (NIGHT_RGB[i] - v) * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function nightPalette(p: HousePalette): HousePalette {
  return {
    ...p,
    wall: tint(p.wall, 0.42),
    wallSide: tint(p.wallSide, 0.52),
    roof: tint(p.roof, 0.45),
    roofBack: tint(p.roofBack, 0.55),
    door: tint(p.door, 0.3),
    trim: tint(p.trim, 0.3),
    accent: tint(p.accent, 0.2),
  };
}

function lighten(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((v) => Math.round(v + (255 - v) * amount).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function interiorNightPalette(p: HousePalette): HousePalette {
  return {
    ...p,
    room: tint(p.room, 0.86),
    ink: lighten(p.accent, 0.45),
    door: tint(p.door, 0.3),
    trim: tint(p.trim, 0.3),
  };
}

export const WINDOW_DAY = "linear-gradient(160deg, #FFFDE8 0%, #FFE9A8 100%)";
export const WINDOW_NIGHT = "radial-gradient(circle at 50% 45%, #FFF6C8 0%, #FFD86B 70%, #F7B84B 100%)";
export const WINDOW_GLOW = "0 0 16px 5px rgba(255, 210, 110, 0.75)";
