"use client";

import { useEffect, useState } from "react";
import { Bow, Heart } from "./Decor";

const STEPS = [
  "Amarrando os lacinhos…",
  "Plantando as florzinhas…",
  "Assando o pudim do Pompompurin…",
  "Chamando as nuvens do Cinnamoroll…",
  "Escondendo as travessuras da Kuromi…",
  "Abrindo as portinhas da vila…",
];

const MIN_MS = 3200;

export default function LoadingScreen({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const done = progress >= 100;

  useEffect(() => {
    const start = performance.now();
    let fontsReady = false;
    if (document.fonts?.ready) document.fonts.ready.then(() => (fontsReady = true));
    else fontsReady = true;
    const fallback = setTimeout(() => (fontsReady = true), MIN_MS + 1500);
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / MIN_MS);
      const eased = 1 - Math.pow(1 - t, 2.2);
      const value = eased * 100;
      setProgress(fontsReady ? value : Math.min(value, 99));
      if (t < 1 || !fontsReady) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const onKey = (e: KeyboardEvent) => e.key === "Enter" && enter();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done]);

  function enter() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 650);
  }

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length))];
  const hearts = 10;

  return (
    <div className={`v-loading ${leaving ? "v-loading-out" : ""}`}>
      <div className="v-loading-dots" aria-hidden />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="v-loading-house">
          <div className="v-loading-bow">
            <Bow size={86} />
          </div>
          <svg width="150" height="130" viewBox="0 0 150 130" aria-hidden>
            <path d="M12 62 L75 12 L138 62Z" fill="#F25C7A" stroke="#D9445F" strokeWidth="4" strokeLinejoin="round" />
            <rect className="v-load-wall" x="26" y="60" width="98" height="64" rx="8" strokeWidth="4" />
            <path d="M62 124 V96 a13 13 0 0 1 26 0 V124Z" fill="#F7B2C1" />
            <circle className="v-load-window" cx="46" cy="84" r="9" fill="#FFE9A8" stroke="#FFD86B" strokeWidth="3" />
            <circle className="v-load-window" cx="104" cy="84" r="9" fill="#FFE9A8" stroke="#FFD86B" strokeWidth="3" />
          </svg>
        </div>

        <h1 className="v-load-title mt-6 font-display text-4xl font-bold sm:text-5xl">
          Vila da Evelyn
        </h1>
        <p className="v-load-subtitle mt-2 font-display text-lg"><span className="inline-flex items-center gap-1.5">
            um portfólio feito com lacinhos <Bow size={24} />
          </span>
        </p>

        <div className="mt-8 flex gap-1.5" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          {Array.from({ length: hearts }).map((_, i) => {
            const on = progress >= ((i + 1) / hearts) * 100 - 0.01;
            return (
              <span key={i} className={on ? "v-heart-pop" : "opacity-40"}>
                <Heart size={22} filled={on} />
              </span>
            );
          })}
        </div>
        <p className="v-load-status mt-3 h-6 font-body text-sm font-semibold">
          {done ? "Tudo pronto!" : step} <span className="tabular-nums">{Math.round(progress)}%</span>
        </p>

        <button
          onClick={enter}
          disabled={!done}
          className={`mt-7 rounded-full px-8 py-3 font-display text-lg font-semibold text-white shadow-[0_8px_0_#B3264A] transition-all duration-300 ${
            done
              ? "translate-y-0 bg-[#F25C7A] opacity-100 hover:-translate-y-0.5 hover:bg-[#ff6f8b] active:translate-y-1 active:shadow-[0_3px_0_#B3264A]"
              : "pointer-events-none translate-y-3 bg-[#F25C7A] opacity-0"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            Entrar na vila
            <Heart size={18} color="#fff" filled={false} />
          </span>
        </button>
      </div>
    </div>
  );
}
