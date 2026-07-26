"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = useCallback(() => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    setTimeout(() => onUnlock(), 550);
  }, [isUnlocking, onUnlock]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") handleUnlock();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUnlock]);

  const timeStr = now
    ? now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const dayOfWeek = now
    ? now.toLocaleDateString("pt-BR", { weekday: "long" })
    : "";

  const dateStr = now
    ? now.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const capitalizedDay = dayOfWeek
    ? dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
    : "";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleUnlock}
      className={`fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-between overflow-hidden ${
        isUnlocking ? "animate-lock-out" : "animate-fade-in"
      }`}
    >
      <Image
        src="/wallpaper-lockscreen.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-os-ink/10" />

      <div className="relative z-10 mt-24 flex flex-col items-center gap-2 text-white drop-shadow-[0_4px_18px_rgba(74,70,87,0.55)] sm:mt-32">
        <span className="font-display text-lg font-medium tracking-wide sm:text-xl">
          {capitalizedDay}
        </span>
        <span className="font-display text-[5.5rem] font-semibold leading-none sm:text-[8rem]">
          {timeStr}
        </span>
        <span className="font-body text-base font-medium sm:text-lg">
          {dateStr}
        </span>
      </div>

      <div className="relative z-10 mb-16 flex flex-col items-center gap-3 text-white/90">
        <div className="h-9 w-9 animate-bounce rounded-full border-2 border-white/70" />
        <p className="font-body text-sm font-medium tracking-wide sm:text-base">
          Pressione Enter ou clique para entrar
        </p>
      </div>
    </div>
  );
}
