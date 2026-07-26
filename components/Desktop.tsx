"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { APPS } from "@/lib/apps-config";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Dock from "./Dock";
import AboutApp from "./apps/AboutApp";
import ProjectsApp from "./apps/ProjectsApp";
import GalleryApp from "./apps/GalleryApp";
import SpotifyApp from "./apps/SpotifyApp";
import ContactApp from "./apps/ContactApp";
import SkillsApp from "./apps/SkillsApp";
import GameApp from "./apps/GameApp";
import NotesApp from "./apps/NotesApp";
import CalendarApp from "./apps/CalendarApp";

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  about: AboutApp,
  projects: ProjectsApp,
  gallery: GalleryApp,
  spotify: SpotifyApp,
  contact: ContactApp,
  skills: SkillsApp,
  game: GameApp,
  notes: NotesApp,
  calendar: CalendarApp,
};

interface OpenWindow {
  id: string;
  zIndex: number;
  position: { x: number; y: number };
}

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [topZ, setTopZ] = useState(10);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const openApp = useCallback(
    (id: string) => {
      setOpenWindows((prev) => {
        const existing = prev.find((w) => w.id === id);
        const newZ = topZ + 1;
        if (existing) {
          return prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w));
        }
        const offset = prev.length * 26;
        return [
          ...prev,
          {
            id,
            zIndex: newZ,
            position: {
              x: 120 + offset + (typeof window !== "undefined" ? Math.min(offset, 200) : 0),
              y: 90 + offset,
            },
          },
        ];
      });
      setTopZ((z) => z + 1);
      setActiveId(id);
    },
    [topZ]
  );

  const closeApp = useCallback(
    (id: string) => {
      setOpenWindows((prev) => {
        const remaining = prev.filter((w) => w.id !== id);
        if (activeId === id) {
          const next = remaining.reduce<OpenWindow | null>((top, w) => {
            if (!top || w.zIndex > top.zIndex) return w;
            return top;
          }, null);
          setActiveId(next ? next.id : null);
        }
        return remaining;
      });
    },
    [activeId]
  );

  const focusApp = useCallback(
    (id: string) => {
      setTopZ((z) => z + 1);
      setOpenWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: topZ + 1 } : w))
      );
      setActiveId(id);
    },
    [topZ]
  );

  const handleDockClick = useCallback(
    (id: string) => {
      const isOpen = openWindows.some((w) => w.id === id);
      if (isOpen) {
        focusApp(id);
      } else {
        openApp(id);
      }
    },
    [openWindows, focusApp, openApp]
  );

  const timeStr = now
    ? now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const dateStr = now
    ? now.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })
    : "";

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Image src="/wallpaper.png" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-os-ink/5" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-2.5 text-white">
        <span className="font-display text-sm font-semibold drop-shadow-[0_2px_6px_rgba(74,70,87,0.6)]">
          Evelyn Melo
        </span>
        <span className="font-body text-xs font-medium capitalize drop-shadow-[0_2px_6px_rgba(74,70,87,0.6)] sm:text-sm">
          {dateStr} · {timeStr}
        </span>
      </div>

      <div className="absolute left-4 top-16 z-10 grid grid-flow-col grid-rows-3 gap-x-3 gap-y-2 sm:top-20 sm:gap-x-5 sm:gap-y-3">
        {APPS.map((app) => (
          <DesktopIcon
            key={app.id}
            title={app.title}
            icon={app.icon}
            onOpen={() => openApp(app.id)}
          />
        ))}
      </div>

      {openWindows.map((w) => {
        const app = APPS.find((a) => a.id === w.id)!;
        const AppComponent = APP_COMPONENTS[w.id];
        return (
          <Window
            key={w.id}
            id={w.id}
            title={app.title}
            accent={app.accent}
            zIndex={w.zIndex}
            initialPosition={w.position}
            size={app.defaultSize}
            onClose={() => closeApp(w.id)}
            onFocus={() => focusApp(w.id)}
          >
            <AppComponent />
          </Window>
        );
      })}

      <Dock
        apps={APPS}
        openIds={openWindows.map((w) => w.id)}
        activeId={activeId}
        onIconClick={handleDockClick}
      />
    </div>
  );
}
