"use client";

import Image from "next/image";

interface DesktopIconProps {
  title: string;
  icon: string;
  onOpen: () => void;
}

export default function DesktopIcon({ title, icon, onOpen }: DesktopIconProps) {
  return (
    <button
      onClick={onOpen}
      className="group flex w-20 flex-col items-center gap-1.5 rounded-xl p-1.5 outline-none transition focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95"
    >
      <Image
        src={icon}
        alt=""
        width={56}
        height={56}
        className="pointer-events-none h-14 w-14 select-none object-contain drop-shadow-[0_6px_10px_rgba(74,70,87,0.55)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
      />
      <span className="font-display text-xs font-medium text-white drop-shadow-[0_2px_6px_rgba(74,70,87,0.7)] sm:text-sm">
        {title}
      </span>
    </button>
  );
}
