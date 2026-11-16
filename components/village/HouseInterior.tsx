"use client";

import { useEffect, useRef, useState } from "react";
import type { House } from "@/lib/village-data";
import { CONTACT_LINKS, PROJECTS, SKILL_GROUPS, openLink } from "@/lib/portfolio-data";
import { ContactIcon, Heart, RoofDecor } from "./Decor";
import { interiorNightPalette } from "@/lib/night";

interface Props {
  house: House;
  stage: number;
  total: number;
  nextHouse: House | null;
  onClose: () => void;
  onNext: (id: string) => void;
  night: boolean;
}

export default function HouseInterior({ house, stage, total, nextHouse, night, onClose, onNext }: Props) {
  const nativelyDark = house.id === "kuromi";
  const p = night && !nativelyDark ? interiorNightPalette(house.palette) : house.palette;
  const dark = nativelyDark || night;
  const [closing, setClosing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  function close(after?: () => void) {
    if (closing) return;
    setClosing(true);
    setTimeout(() => (after ? after() : onClose()), 420);
  }

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const card = dark ? "bg-white/10 border-white/15" : "bg-white/80 border-white";
  const text = dark ? "text-white/85" : "text-[#4A4657]";

  return (
    <div
      className={`v-interior ${closing ? "v-interior-out" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="house-title"
      style={{ ["--room" as string]: p.room, ["--accent" as string]: p.accent, ["--door" as string]: p.door }}
    >
      <div className="v-door v-door-left" style={{ background: p.door, borderColor: p.trim }} aria-hidden />
      <div className="v-door v-door-right" style={{ background: p.door, borderColor: p.trim }} aria-hidden />

      <div className="v-room" style={{ background: p.room }}>
        <div className="v-wallpaper" style={{ color: p.accent }} aria-hidden />

        <div className="relative mx-auto flex h-full max-w-3xl flex-col px-4 pb-4 pt-4 sm:px-8 sm:pt-8">
          <div className="flex items-center justify-between gap-3">
            <span
              className="rounded-full px-3 py-1 font-display text-sm font-semibold"
              style={{ background: p.accent, color: "#fff" }}
            >
              Etapa {stage} de {total}
            </span>
            <button
              ref={closeRef}
              onClick={() => close()}
              className="rounded-full border-2 px-4 py-1.5 font-display text-sm font-semibold transition hover:scale-105"
              style={{ borderColor: p.accent, color: dark ? "#fff" : p.ink, background: dark ? "transparent" : "#fff" }}
            >
              ← Sair da casa
            </button>
          </div>

          <div className="v-room-scroll mt-4 flex-1 overflow-y-auto pb-6 pr-1">
            <div className="v-room-item flex items-center gap-4" style={{ animationDelay: ".55s" }}>
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] border-4 shadow-md sm:h-24 sm:w-24"
                style={{ background: dark ? "#3A3149" : "#fff", borderColor: p.accent }}
              >
                <RoofDecor kind={house.decor} size={64} />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-display text-sm font-semibold" style={{ color: p.accent }}>
                  <span className="shrink-0" aria-hidden>
                    <RoofDecor kind={house.decor} size={18} />
                  </span>
                  {house.label}
                  {house.company && <> · {house.company}</>}
                </p>
                <h2 id="house-title" className="font-display text-2xl font-bold leading-tight sm:text-3xl" style={{ color: p.ink }}>
                  {house.title}
                </h2>
                <p className={`mt-0.5 font-semibold ${text} opacity-80`}>{house.tagline}</p>
              </div>
            </div>

            <p className={`v-room-item mt-5 rounded-3xl border-2 p-4 leading-relaxed sm:p-5 ${card} ${text}`} style={{ animationDelay: ".65s" }}>
              {house.summary}
            </p>

            {house.metrics && (
              <div className="v-room-item mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3" style={{ animationDelay: ".75s" }}>
                {house.metrics.map((m) => (
                  <div key={m.label} className={`rounded-3xl border-2 p-4 text-center ${card}`}>
                    <div className="font-display text-3xl font-bold" style={{ color: p.accent }}>
                      {m.value}
                    </div>
                    <div className={`text-sm font-semibold ${text} opacity-80`}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {house.highlights.length > 0 && (
              <ul className="v-room-item mt-4 space-y-2" style={{ animationDelay: ".85s" }}>
                {house.highlights.map((h) => (
                  <li key={h} className={`flex items-start gap-2.5 rounded-2xl border-2 px-4 py-2.5 ${card} ${text}`}>
                    <span className="mt-0.5 shrink-0">
                      <Heart size={16} color={p.accent} />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {house.stack.length > 0 && (
              <div className="v-room-item mt-5" style={{ animationDelay: ".95s" }}>
                <p className="mb-2 font-display text-sm font-semibold" style={{ color: p.ink }}>
                  Na caixinha de ferramentas
                </p>
                <div className="flex flex-wrap gap-2">
                  {house.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border-2 px-3 py-1 text-sm font-semibold"
                      style={{ borderColor: p.accent, color: dark ? "#fff" : p.ink, background: dark ? "transparent" : "#fff" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {house.kind === "about" && <AboutExtras p={p} card={card} text={text} dark={dark} />}
            {house.kind === "contact" && <ContactExtras p={p} card={card} text={text} dark={dark} />}
          </div>

          {nextHouse ? (
            <button
              onClick={() => close(() => onNext(nextHouse.id))}
              className="v-room-item flex w-full items-center justify-between gap-3 rounded-3xl px-5 py-3.5 text-left font-display font-semibold text-white shadow-lg transition hover:brightness-105 active:scale-[.99]"
              style={{ background: p.accent, animationDelay: "1s" }}
            >
              <span className="min-w-0">
                <span className="block text-xs opacity-85">Próxima etapa</span>
                <span className="mt-0.5 flex items-center gap-2 text-lg">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm" aria-hidden>
                    <RoofDecor kind={nextHouse.decor} size={24} />
                  </span>
                  <span className="truncate">{nextHouse.label}</span>
                </span>
              </span>
              <span className="text-2xl">→</span>
            </button>
          ) : (
            <button
              onClick={() => close()}
              className="v-room-item w-full rounded-3xl px-5 py-3.5 font-display text-lg font-semibold text-white shadow-lg"
              style={{ background: p.accent, animationDelay: "1s" }}
            >
              <span className="inline-flex items-center gap-2">
                Voltar para a vila
                <Heart size={18} color="#fff" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

type Extras = { p: House["palette"]; card: string; text: string; dark: boolean };

function AboutExtras({ p, card, text, dark }: Extras) {
  return (
    <>
      <div className="v-room-item mt-6" style={{ animationDelay: "1s" }}>
        <p className="mb-2 font-display text-sm font-semibold" style={{ color: p.ink }}>
          Habilidades favoritas
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SKILL_GROUPS.map((g) => (
            <div key={g.category} className={`rounded-3xl border-2 p-4 ${card}`}>
              <p className="mb-2 font-display font-semibold" style={{ color: p.accent }}>
                {g.category}
              </p>
              {g.items.map((s) => (
                <div key={s.name} className="mb-2 last:mb-0">
                  <div className={`flex justify-between text-sm font-semibold ${text}`}>
                    <span>{s.name}</span>
                  </div>
                  <div className={`mt-1 h-2.5 overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-[#FFE3EA]"}`}>
                    <div className="v-bar h-full rounded-full" style={{ width: `${s.level}%`, background: p.accent }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="v-room-item mt-6" style={{ animationDelay: "1.05s" }}>
        <p className="mb-2 font-display text-sm font-semibold" style={{ color: p.ink }}>
          Projetinhos pessoais
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {PROJECTS.map((pr) => (
            <button
              key={pr.slug}
              onClick={() => pr.link !== "#" && openLink(pr.link)}
              className={`rounded-3xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${card}`}
            >
              <p className="font-display font-semibold" style={{ color: p.ink }}>
                {pr.title}
              </p>
              <p className={`text-xs font-semibold ${text} opacity-70`}>{pr.tags.join(" · ")}</p>
              <p className={`mt-1 text-sm ${text}`}>{pr.description}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function ContactExtras({ p, card, text }: Extras) {
  return (
    <div className="v-room-item mt-5 grid gap-3 sm:grid-cols-3" style={{ animationDelay: ".85s" }}>
      {CONTACT_LINKS.map((c) => (
        <button
          key={c.kind}
          onClick={() => openLink(c.href)}
          className={`rounded-3xl border-2 p-4 text-left transition hover:-translate-y-0.5 ${card}`}
        >
          <ContactIcon kind={c.kind} color={p.accent} size={36} />
          <p className="mt-1 font-display font-semibold capitalize" style={{ color: p.ink }}>
            {c.kind}
          </p>
          <p className={`truncate text-sm ${text}`}>{c.label}</p>
        </button>
      ))}
    </div>
  );
}
