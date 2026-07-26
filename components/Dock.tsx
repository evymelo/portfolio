"use client";

import { useState } from "react";
import Image from "next/image";
import { AppConfig } from "@/lib/apps-config";

const TOOLTIP_BORDER_BY_ACCENT: Record<string, string> = {
  "bg-os-pink": "border-os-pink",
  "bg-os-lilac": "border-os-lilac",
  "bg-os-slate": "border-os-slate",
};

interface TooltipState {
  title: string;
  left: number;
  top: number;
  borderClass: string;
}

interface DockProps {
  apps: AppConfig[];
  openIds: string[];
  activeId: string | null;
  onIconClick: (id: string) => void;
}

export default function Dock({ apps, openIds, activeId, onIconClick }: DockProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <div className="absolute inset-x-0 bottom-3 z-[999] flex justify-center px-3">
      {tooltip && (
        <div
          className={`pointer-events-none fixed z-[1000] -translate-x-1/2 -translate-y-full rounded-md border bg-white/90 px-2.5 py-1 font-body text-[11px] font-medium text-os-ink shadow-window backdrop-blur-xs ${tooltip.borderClass}`}
          style={{ left: tooltip.left, top: tooltip.top - 8 }}
        >
          {tooltip.title}
        </div>
      )}
      <div className="os-scroll flex max-w-full items-end gap-1 overflow-x-auto rounded-2xl border border-white/40 bg-white/25 px-2 py-2 shadow-window backdrop-blur-md sm:gap-2.5 sm:px-3.5">
        {apps.map((app) => {
          const isOpen = openIds.includes(app.id);
          const isActive = activeId === app.id;
          const borderClass = TOOLTIP_BORDER_BY_ACCENT[app.accent] ?? "border-os-mist";

          return (
            <button
              key={app.id}
              onClick={() => onIconClick(app.id)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  title: app.title,
                  left: rect.left + rect.width / 2,
                  top: rect.top,
                  borderClass,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  title: app.title,
                  left: rect.left + rect.width / 2,
                  top: rect.top,
                  borderClass,
                });
              }}
              onBlur={() => setTooltip(null)}
              aria-label={app.title}
              aria-current={isActive}
              className="group relative flex shrink-0 flex-col items-center gap-1 rounded-xl px-1 py-1 outline-none transition focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 sm:h-11 sm:w-11 ${
                  isActive
                    ? "-translate-y-1.5 bg-white/50 shadow-icon"
                    : "group-hover:-translate-y-1 group-hover:bg-white/30"
                }`}
              >
                <Image
                  src={app.icon}
                  alt=""
                  width={30}
                  height={30}
                  className="pointer-events-none h-6 w-6 select-none object-contain sm:h-8 sm:w-8"
                />
              </span>
              <span
                className={`h-1 w-1 rounded-full transition-opacity ${
                  isOpen ? "bg-os-ink/70 opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
