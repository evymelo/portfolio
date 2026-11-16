"use client";

import { useCallback, useEffect, useState } from "react";
import { THEME_KEY } from "./theme-boot";

export type Theme = "day" | "night";

function readSaved(): Theme | null {
  try {
    const v = JSON.parse(localStorage.getItem(THEME_KEY) ?? "null");
    return v === "day" || v === "night" ? v : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("day");

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const t = readSaved() ?? (mql.matches ? "night" : "day");
      apply(t);
      setThemeState(t);
    };
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(t));
    } catch {}
    apply(t);
    setThemeState(t);
  }, []);

  return [theme, setTheme] as const;
}
