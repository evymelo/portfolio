"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

const COLORS = ["bg-os-pink/50", "bg-os-lilac/50", "bg-os-mist", "bg-os-slate/30"];

export default function NotesApp() {
  const [notes, setNotes] = useLocalStorage<Note[]>("portfolio-os:notes", []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");

  const selectedNote = notes.find((n) => n.id === selectedId) || null;

  useEffect(() => {
    if (selectedNote) {
      setDraftTitle(selectedNote.title);
      setDraftContent(selectedNote.content);
    }
  }, [selectedId]); 

  function createNote() {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Nova nota",
      content: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setDraftTitle(newNote.title);
    setDraftContent(newNote.content);
  }

  function saveNote() {
    if (!selectedId) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId
          ? { ...n, title: draftTitle || "Sem título", content: draftContent, updatedAt: Date.now() }
          : n
      )
    );
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setDraftTitle("");
      setDraftContent("");
    }
  }

  return (
    <div className="flex h-full min-h-[380px] gap-4">
      <div className="flex w-40 shrink-0 flex-col gap-2 sm:w-48">
        <button
          onClick={createNote}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-os-ink/80 px-3 py-2 font-body text-xs font-medium text-white transition hover:bg-os-ink"
        >
          <Plus className="h-3.5 w-3.5" />
          Nova nota
        </button>

        <div className="os-scroll flex flex-1 flex-col gap-1.5 overflow-y-auto">
          {notes.length === 0 && (
            <p className="mt-4 text-center font-body text-xs text-os-ink/40">
              Nenhuma nota ainda.
              <br />
              Crie a primeira! ✏️
            </p>
          )}
          {notes
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((note, i) => (
              <button
                key={note.id}
                onClick={() => setSelectedId(note.id)}
                className={`group flex flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left transition ${
                  COLORS[i % COLORS.length]
                } ${selectedId === note.id ? "ring-2 ring-os-ink/30" : ""}`}
              >
                <span className="line-clamp-1 font-display text-xs font-semibold text-os-ink">
                  {note.title || "Sem título"}
                </span>
                <span className="line-clamp-1 font-body text-[11px] text-os-ink/50">
                  {note.content || "Sem conteúdo"}
                </span>
              </button>
            ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {selectedNote ? (
          <>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={saveNote}
              placeholder="Título"
              className="w-full rounded-lg bg-os-mist/70 px-3 py-2 font-display text-sm font-semibold text-os-ink outline-none placeholder:text-os-ink/30"
            />
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              onBlur={saveNote}
              placeholder="Escreva sua anotação aqui..."
              className="os-scroll flex-1 resize-none rounded-lg bg-os-mist/50 px-3 py-2.5 font-body text-sm leading-relaxed text-os-ink outline-none placeholder:text-os-ink/30"
            />
            <div className="flex items-center justify-between">
              <span className="font-body text-[11px] text-os-ink/40">
                Salva automaticamente ao clicar fora do campo
              </span>
              <button
                onClick={() => deleteNote(selectedNote.id)}
                className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 font-body text-xs font-medium text-red-500 transition hover:bg-red-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-os-ink/30">
            <StickyNote className="h-8 w-8" />
            <p className="font-body text-sm">Selecione ou crie uma nota</p>
          </div>
        )}
      </div>
    </div>
  );
}
