"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HOUSES, TOTAL_STAGES } from "@/lib/village-data";
import { useLocalStorage } from "@/lib/useLocalStorage";
import type { Theme } from "@/lib/useTheme";
import House3D from "./House3D";
import Scenery from "./Scenery";
import HouseInterior from "./HouseInterior";
import { Bow, Heart, IconBadge, RoofDecor } from "./Decor";
import { INITIAL_ROT, INITIAL_TILT, billboardTransform } from "./primitives";

interface Cam {
  rot: number;
  tilt: number;
  zoom: number;
  fx: number;
  fy: number;
  fz: number;
}

const TILT_MIN = 34;
const TILT_MAX = 74;
const OVERVIEW_TILT = 62;

function baseZoom() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < 768) return Math.max(w / 780, 0.4);
  return Math.min(w / 1500, h / 1080);
}

const PERSPECTIVE = 1700;
const WORLD_TOP = 0.58;
const PERSPECTIVE_Y = 0.35;
const LABEL_LIFT = 60;

function project(c: Cam, px: number, py: number, pz: number, W: number, H: number) {
  const r = (c.rot * Math.PI) / 180;
  const t = (c.tilt * Math.PI) / 180;
  const x = px - c.fx;
  const y = py - c.fy;
  const z = pz - c.fz;
  const x1 = x * Math.cos(r) - y * Math.sin(r);
  const y1 = x * Math.sin(r) + y * Math.cos(r);
  const y2 = y1 * Math.cos(t) - z * Math.sin(t);
  const z2 = y1 * Math.sin(t) + z * Math.cos(t);
  const X = W * 0.5 + x1 * c.zoom;
  const Y = H * WORLD_TOP + y2 * c.zoom;
  const Z = z2 * c.zoom;
  const k = PERSPECTIVE / (PERSPECTIVE - Z);
  return { x: W * 0.5 + (X - W * 0.5) * k, y: H * PERSPECTIVE_Y + (Y - H * PERSPECTIVE_Y) * k, depth: Z };
}

export default function Village({ night, onThemeChange }: { night: boolean; onThemeChange: (theme: Theme) => void }) {
  const [visited, setVisited] = useLocalStorage<string[]>("vila-visited", []);
  const [openId, setOpenId] = useState<string | null>(null);
  const [flying, setFlying] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [labelsReady, setLabelsReady] = useState(false);
  const [curtain, setCurtain] = useState<"day" | "night" | null>(null);

  const worldRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const base = useRef(0.6);
  const mode = useRef<"overview" | "house">("overview");
  const cam = useRef<Cam>({ rot: INITIAL_ROT, tilt: INITIAL_TILT, zoom: 0.12, fx: 0, fy: 0, fz: 0 });
  const tgt = useRef<Cam>({ rot: INITIAL_ROT, tilt: INITIAL_TILT, zoom: 0.12, fx: 0, fy: 0, fz: 0 });
  const lastInteract = useRef(0);
  const dragMoved = useRef(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef(0);
  const flyTimer = useRef<ReturnType<typeof setTimeout>>();
  const downAt = useRef({ x: 0, y: 0 });

  const nextHouse = useMemo(() => HOUSES.find((h) => !visited.includes(h.id)) ?? null, [visited]);
  const allDone = visited.length >= TOTAL_STAGES && HOUSES.every((h) => visited.includes(h.id));
  const openHouse = HOUSES.find((h) => h.id === openId) ?? null;

  const overview = useCallback((rot?: number) => {
    mode.current = "overview";
    Object.assign(tgt.current, {
      rot: rot ?? tgt.current.rot,
      tilt: OVERVIEW_TILT,
      zoom: base.current,
      fx: 0,
      fy: 30,
      fz: 0,
    });
  }, []);

  useEffect(() => {
    base.current = baseZoom();
    lastInteract.current = performance.now();
    Object.assign(cam.current, { rot: -70, tilt: 40, zoom: base.current * 0.6, fx: 0, fy: 30, fz: 0 });
    Object.assign(tgt.current, cam.current);
    const intro = setTimeout(() => overview(-22), 60);

    let raf = 0;
    let dirty = true;
    let last = performance.now();

    const billboards = Array.from(worldRef.current?.querySelectorAll<HTMLElement>(".v-billboard") ?? []).map((el) => ({
      el,
      x: Number(el.dataset.bx),
      y: Number(el.dataset.by),
      z: Number(el.dataset.bz),
    }));

    const placeLabels = () => {
      const scene = sceneRef.current;
      if (!scene) return;
      const W = scene.clientWidth;
      const H = scene.clientHeight;
      HOUSES.forEach((h, i) => {
        const label = labelRefs.current[i];
        if (!label) return;
        const p = project(cam.current, h.x, h.y, h.size.h + h.size.roof + LABEL_LIFT, W, H);
        const s = Math.min(1, Math.max(0.65, cam.current.zoom / base.current));
        label.style.transform = `translate3d(${Math.round(p.x)}px, ${Math.round(p.y)}px, 0) scale(${s.toFixed(3)})`;
        label.style.zIndex = String(Math.round(2000 + p.depth));
      });
    };

    const loop = (now: number) => {
      const c = cam.current;
      const t = tgt.current;
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
      last = now;

      const settled =
        Math.abs(t.rot - c.rot) < 0.01 &&
        Math.abs(t.tilt - c.tilt) < 0.01 &&
        Math.abs(t.zoom - c.zoom) < 0.0005 &&
        Math.abs(t.fx - c.fx) < 0.05 &&
        Math.abs(t.fy - c.fy) < 0.05 &&
        Math.abs(t.fz - c.fz) < 0.05;
      if (settled && !dirty) {
        raf = requestAnimationFrame(loop);
        return;
      }

      if (
        mode.current === "overview" &&
        Math.abs(t.zoom - c.zoom) < base.current * 0.08 &&
        Math.abs(t.rot - c.rot) < 10
      ) {
        setLabelsReady(true);
      }

      const k = 1 - Math.exp(-dt / 0.2);
      if (settled) {
        Object.assign(c, t);
        dirty = false;
      } else {
        c.rot += (t.rot - c.rot) * k;
        c.tilt += (t.tilt - c.tilt) * k;
        c.zoom += (t.zoom - c.zoom) * k;
        c.fx += (t.fx - c.fx) * k;
        c.fy += (t.fy - c.fy) * k;
        c.fz += (t.fz - c.fz) * k;
        dirty = true;
      }

      const el = worldRef.current;
      if (el) {
        const wc = settled ? "" : "transform";
        if (el.style.willChange !== wc) el.style.willChange = wc;
        el.style.transform = `scale3d(${c.zoom}, ${c.zoom}, ${c.zoom}) rotateX(${c.tilt}deg) rotateZ(${c.rot}deg) translate3d(${-c.fx}px, ${-c.fy}px, ${-c.fz}px)`;
      }
      for (const b of billboards) b.el.style.transform = billboardTransform(b.x, b.y, b.z, c.rot, c.tilt);
      placeLabels();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => {
      base.current = baseZoom();
      if (mode.current === "overview") tgt.current.zoom = base.current;
      dirty = true;
      placeLabels();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(intro);
      clearTimeout(flyTimer.current);
      window.removeEventListener("resize", onResize);
    };
  }, [overview]);

  const curtainTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => curtainTimers.current.forEach(clearTimeout), []);

  function toggleTheme() {
    if (curtain) return;
    const next = night ? "day" : "night";
    setCurtain(next);
    curtainTimers.current = [
      setTimeout(() => onThemeChange(next), 260),
      setTimeout(() => setCurtain(null), 700),
    ];
  }

  const touch = () => (lastInteract.current = performance.now());

  const enterHouse = useCallback(
    (id: string) => {
      const h = HOUSES.find((x) => x.id === id);
      if (!h) return;
      touch();
      setFlying(true);
      mode.current = "house";
      const rot = Math.round(cam.current.rot / 360) * 360;
      const isMobile = window.innerWidth < 768;
      Object.assign(tgt.current, {
        rot,
        tilt: 64,
        zoom: base.current * (isMobile ? 2.6 : 2.1),
        fx: h.x,
        fy: h.y + h.size.d * 0.2,
        fz: h.size.h * 0.55,
      });
      clearTimeout(flyTimer.current);
      flyTimer.current = setTimeout(() => {
        setFlying(false);
        setOpenId(id);
        setVisited((v) => (v.includes(id) ? v : [...v, id]));
      }, 950);
    },
    [setVisited]
  );

  const closeHouse = useCallback(() => {
    setOpenId(null);
    touch();
    overview();
  }, [overview]);

  const goNext = useCallback(
    (id: string) => {
      setOpenId(null);
      enterHouse(id);
    },
    [enterHouse]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const prev = pointers.current.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      touch();

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist.current) zoomBy(dist / pinchDist.current);
        pinchDist.current = dist;
        dragMoved.current = true;
        return;
      }
      if (Math.abs(dx) + Math.abs(dy) > 0) {
        if (!dragMoved.current && Math.abs(e.clientX - downAt.current.x) + Math.abs(e.clientY - downAt.current.y) < 6) return;
        dragMoved.current = true;
        tgt.current.rot += dx * 0.32;
        tgt.current.tilt = Math.min(TILT_MAX, Math.max(TILT_MIN, tgt.current.tilt - dy * 0.18));
      }
    };
    const onUp = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
      if (pointers.current.size < 2) pinchDist.current = 0;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const locked = !!openId || flying;

  function onPointerDown(e: React.PointerEvent) {
    if (locked || mode.current !== "overview") return;
    dragMoved.current = false;
    downAt.current = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }

  function zoomBy(f: number) {
    if (mode.current !== "overview") return;
    const b = base.current;
    tgt.current.zoom = Math.min(b * 2.2, Math.max(b * 0.65, tgt.current.zoom * f));
  }

  function rotateBy(deg: number) {
    touch();
    tgt.current.rot += deg;
  }

  function onSelect(id: string) {
    if (dragMoved.current || locked) return;
    enterHouse(id);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openId || flying) return;
      if (e.key === "ArrowLeft") rotateBy(-30);
      else if (e.key === "ArrowRight") rotateBy(30);
      else if (e.key === "+" || e.key === "=") zoomBy(1.15);
      else if (e.key === "-") zoomBy(1 / 1.15);
      else return;
      touch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const stageNumber = (id: string) => HOUSES.findIndex((h) => h.id === id) + 1;
  const nextAfterOpen = openHouse ? HOUSES.find((h) => h.id !== openHouse.id && !visited.includes(h.id)) ?? null : null;

  return (
    <div className={`v-root ${night ? "v-night" : ""}`}>
      <div className="v-sky" aria-hidden>
        <div className="v-sky-night" />
        <div className="v-sun" />
        <div className="v-moon" />
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="v-sparkle" style={{ left: `${(i * 73) % 100}%`, top: `${(i * 37) % 55}%` }}>
            ✦
          </span>
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={`s${i}`}
            className="v-star"
            style={{ left: `${(i * 47 + 11) % 100}%`, top: `${(i * 29 + 5) % 62}%`, width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2 }}
          />
        ))}
      </div>

      <div
        ref={sceneRef}
        className={`v-scene ${locked ? "" : "cursor-grab active:cursor-grabbing"}`}
        onPointerDown={onPointerDown}
        onWheel={(e) => {
          touch();
          zoomBy(Math.exp(-e.deltaY * 0.0012));
        }}
        aria-label="Vila 3D: arraste para girar e clique nas casas"
      >
        <div ref={worldRef} className="v-world v-3d">
          <Scenery night={night} />
          {HOUSES.map((h, i) => (
            <House3D
              key={h.id}
              house={h}
              index={i}
              isNext={nextHouse?.id === h.id && !openId}
              onSelect={onSelect}
              onHover={setHoverId}
              night={night}
            />
          ))}
        </div>
      </div>

      <div className={`v-labels ${locked || !labelsReady ? "v-labels-hidden" : ""}`} aria-hidden={locked || !labelsReady}>
        {HOUSES.map((h, i) => {
          const done = visited.includes(h.id);
          const isNext = nextHouse?.id === h.id && !openId;
          return (
            <div key={h.id} ref={(el) => { labelRefs.current[i] = el; }} className="v-label">
              <button
                onClick={() => !locked && enterHouse(h.id)}
                onPointerEnter={() => setHoverId(h.id)}
                onPointerLeave={() => setHoverId(null)}
                className={`v-tag ${hoverId === h.id ? "v-tag-hover" : ""} ${isNext ? "v-tag-next" : ""}`}
                style={{ ["--accent" as string]: h.palette.accent }}
                aria-label={`Entrar: ${h.label}${done ? " (visitada)" : ""}`}
                tabIndex={locked || !labelsReady ? -1 : 0}
              >
                <span className="v-tag-num" style={{ background: done ? h.palette.accent : night ? "#2c2559" : "#fff", color: done ? "#fff" : h.palette.accent }}>
                  {done ? "✓" : i + 1}
                </span>
                <span className="v-tag-label whitespace-nowrap">{h.label}</span>
              </button>
              {isNext && (
                <div className="v-arrow" style={{ color: h.palette.accent }}>
                  ▼
                </div>
              )}
            </div>
          );
        })}
      </div>

      <header className={`v-hud-top ${openId ? "v-hud-hidden" : ""}`}>
        <div className="v-pill flex items-center gap-2 px-4 py-2">
          <Bow size={30} />
          <span className="v-title font-display text-lg font-bold">Vila da Evelyn</span>
        </div>
        <button
          onClick={toggleTheme}
          className="v-pill v-theme-toggle"
          aria-label={night ? "Mudar para o dia" : "Mudar para a noite"}
          title={night ? "Dia" : "Noite"}
        >
          <span key={night ? "night" : "day"} className="v-theme-icon" aria-hidden>
            {night ? "🌙" : "☀️"}
          </span>
        </button>
      </header>

      {!openId && (
        <aside className="v-guide" key={nextHouse?.id ?? "done"} aria-live="polite">
          <div className="v-guide-avatar">
            {nextHouse ? <RoofDecor kind={nextHouse.decor} size={40} /> : <Bow size={44} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="v-guide-kicker font-display text-xs font-semibold uppercase tracking-wide">
              {allDone ? "Tour completo" : `Etapa ${visited.length + 1} de ${TOTAL_STAGES}`}
            </p>
            <p className="v-guide-text mt-0.5 text-[15px] font-semibold leading-snug">
              {allDone
                ? (
                  <>
                    Você conheceu a vila inteirinha!{" "}
                    <span className="inline-block align-[-2px]">
                      <Heart size={15} />
                    </span>{" "}
                    Obrigada pela visita. Volte em qualquer casa quando quiser.
                  </>
                )
                : nextHouse?.guide}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {nextHouse && (
                <button onClick={() => enterHouse(nextHouse.id)} disabled={locked} className="v-btn" style={{ background: nextHouse.palette.accent }}>
                  {flying ? "Indo até lá…" : `Ir até: ${nextHouse.label} →`}
                </button>
              )}
              {allDone && (
                <>
                  <button onClick={() => enterHouse("correio")} className="v-btn" style={{ background: "#E25B5B" }}>
                    <span className="inline-flex items-center gap-2">
                      <IconBadge size={24}>
                        <RoofDecor kind="mail" size={18} />
                      </IconBadge>
                      Ver contatos
                    </span>
                  </button>
                  <button
                    onClick={() => setVisited([])}
                    className="v-btn-ghost"
                  >
                    Recomeçar tour
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>
      )}

      {!openId && (
        <div className="v-controls" role="group" aria-label="Controles da câmera">
          <button onClick={() => rotateBy(-45)} aria-label="Girar para a esquerda">↺</button>
          <button onClick={() => { touch(); zoomBy(1.2); }} aria-label="Aproximar">＋</button>
          <button onClick={() => { touch(); zoomBy(1 / 1.2); }} aria-label="Afastar">－</button>
          <button onClick={() => { touch(); overview(Math.round(cam.current.rot / 360) * 360 - 22); }} aria-label="Centralizar vila">⌂</button>
          <button onClick={() => rotateBy(45)} aria-label="Girar para a direita">↻</button>
        </div>
      )}

      {curtain && <div className={`v-curtain v-curtain-${curtain}`} aria-hidden />}

      {openHouse && (
        <HouseInterior
          key={openHouse.id}
          house={openHouse}
          stage={stageNumber(openHouse.id)}
          total={TOTAL_STAGES}
          nextHouse={nextAfterOpen}
          night={night}
          onClose={closeHouse}
          onNext={goNext}
        />
      )}

    </div>
  );
}
