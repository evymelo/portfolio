"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, CalendarDays } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { MONTH_NAMES, WEEKDAY_LABELS, getMonthMatrix, toDateKey } from "@/lib/calendar-utils";

interface CalEvent {
  id: string;
  text: string;
}

type EventsMap = Record<string, CalEvent[]>;

export default function CalendarApp() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [draft, setDraft] = useState("");
  const [events, setEvents] = useLocalStorage<EventsMap>("portfolio-os:events", {});

  const weeks = getMonthMatrix(viewYear, viewMonth);
  const selectedKey = toDateKey(viewYear, viewMonth, selectedDay);
  const dayEvents = events[selectedKey] || [];

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDay(1);
  }

  function addEvent() {
    if (!draft.trim()) return;
    setEvents((prev) => {
      const list = prev[selectedKey] || [];
      return {
        ...prev,
        [selectedKey]: [...list, { id: crypto.randomUUID(), text: draft.trim() }],
      };
    });
    setDraft("");
  }

  function removeEvent(id: string) {
    setEvents((prev) => ({
      ...prev,
      [selectedKey]: (prev[selectedKey] || []).filter((e) => e.id !== id),
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-os-ink">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => changeMonth(-1)}
            aria-label="Mês anterior"
            className="rounded-full p-1.5 transition hover:bg-os-mist"
          >
            <ChevronLeft className="h-4 w-4 text-os-ink/60" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            aria-label="Próximo mês"
            className="rounded-full p-1.5 transition hover:bg-os-mist"
          >
            <ChevronRight className="h-4 w-4 text-os-ink/60" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((d, i) => (
          <span key={i} className="font-body text-[11px] font-medium text-os-ink/40">
            {d}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (day === null) return <div key={di} />;
              const key = toDateKey(viewYear, viewMonth, day);
              const hasEvents = (events[key] || []).length > 0;
              const isSelected = day === selectedDay;
              const isToday = key === todayKey;
              return (
                <button
                  key={di}
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex aspect-square items-center justify-center rounded-lg font-body text-xs font-medium transition ${
                    isSelected
                      ? "bg-os-ink text-white"
                      : isToday
                      ? "bg-os-pink/60 text-os-ink"
                      : "text-os-ink/70 hover:bg-os-mist"
                  }`}
                >
                  {day}
                  {hasEvents && !isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-os-ink/60" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-os-mist pt-3">
        <p className="font-display text-sm font-semibold text-os-ink">
          {selectedDay} de {MONTH_NAMES[viewMonth]}
        </p>

        <div className="flex gap-1.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEvent()}
            placeholder="Adicionar evento ou lembrete..."
            className="flex-1 rounded-lg bg-os-mist/70 px-3 py-2 font-body text-sm text-os-ink outline-none placeholder:text-os-ink/30"
          />
          <button
            onClick={addEvent}
            aria-label="Adicionar"
            className="flex items-center justify-center rounded-lg bg-os-ink/80 px-3 transition hover:bg-os-ink"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="os-scroll flex max-h-32 flex-col gap-1.5 overflow-y-auto">
          {dayEvents.length === 0 && (
            <p className="flex items-center gap-1.5 font-body text-xs text-os-ink/40">
              <CalendarDays className="h-3.5 w-3.5" />
              Nenhum evento para este dia.
            </p>
          )}
          {dayEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between rounded-lg bg-os-lilac/30 px-3 py-1.5"
            >
              <span className="font-body text-xs text-os-ink">{ev.text}</span>
              <button onClick={() => removeEvent(ev.id)} aria-label="Remover evento">
                <Trash2 className="h-3.5 w-3.5 text-os-ink/50 transition hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
