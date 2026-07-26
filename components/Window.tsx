"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useDraggable } from "@/lib/useDraggable";

interface WindowProps {
  id: string;
  title: string;
  accent: string;
  zIndex: number;
  initialPosition: { x: number; y: number };
  size: { width: number; height: number };
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export default function Window({
  title,
  accent,
  zIndex,
  initialPosition,
  size,
  onClose,
  onFocus,
  children,
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { position, onPointerDown } = useDraggable(initialPosition, isMaximized);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const style: React.CSSProperties = isMaximized
    ? { top: 12, left: 12, right: 12, bottom: 88, width: "auto", height: "auto", zIndex }
    : {
        top: position.y,
        left: position.x,
        width: size.width,
        height: isMinimized ? "auto" : size.height,
        maxWidth: "calc(100vw - 24px)",
        maxHeight: "calc(100vh - 24px)",
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onMouseDown={onFocus}
      className="absolute flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-window backdrop-blur-sm animate-window-in"
    >
      <div
        onPointerDown={onPointerDown}
        className={`flex shrink-0 cursor-grab items-center gap-2 px-4 py-3 active:cursor-grabbing ${accent}`}
      >
        <div className="flex items-center gap-2">
          <button
            aria-label="Fechar"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f19a9a] transition hover:brightness-90"
          >
            <X className="h-2.5 w-2.5 text-[#7a2f2f]" strokeWidth={3} />
          </button>
          <button
            aria-label="Minimizar"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized((v) => !v);
            }}
            className="h-3.5 w-3.5 rounded-full bg-[#f0d99a] transition hover:brightness-90"
          />
          <button
            aria-label="Maximizar"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized((v) => !v);
            }}
            className="h-3.5 w-3.5 rounded-full bg-[#a9d9ae] transition hover:brightness-90"
          />
        </div>
        <div className="ml-2 flex items-center gap-2">
          <span className="font-display text-sm font-medium text-os-ink">
            {title}
          </span>
        </div>
      </div>

      {!isMinimized && (
        <div className="os-scroll flex-1 overflow-y-auto bg-white/80 p-5">
          {children}
        </div>
      )}
    </div>
  );
}
