"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

const SYMBOLS = ["🌙", "⭐️", "🌸", "☕️", "🎧", "💜"];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function buildDeck(): Card[] {
  const deck = [...SYMBOLS, ...SYMBOLS]
    .map((symbol, i) => ({ id: i, symbol, isFlipped: false, isMatched: false }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

export default function GameApp() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const startNewGame = useCallback(() => {
    setCards(buildDeck());
    setFlippedIds([]);
    setMoves(0);
    setIsLocked(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const isWon = cards.length > 0 && cards.every((c) => c.isMatched);

  function handleFlip(id: number) {
    if (isLocked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedIds.length === 2) return;

    const nextFlipped = [...flippedIds, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = card; 

      if (first.symbol === second.symbol) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setIsLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
          setIsLocked(false);
        }, 700);
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-os-ink">
          Jogo da Memória
        </h2>
        <button
          onClick={startNewGame}
          aria-label="Reiniciar jogo"
          className="flex items-center gap-1.5 rounded-full bg-os-mist px-3 py-1.5 font-body text-xs font-medium text-os-ink/70 transition hover:bg-os-lilac/50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reiniciar
        </button>
      </div>

      <p className="font-body text-xs text-os-ink/50">Jogadas: {moves}</p>

      <div className="grid grid-cols-4 gap-2.5">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl transition-all duration-200 ${
              card.isFlipped || card.isMatched
                ? "bg-white shadow-sm"
                : "bg-os-lilac/60 hover:bg-os-lilac/80"
            } ${card.isMatched ? "opacity-60" : ""}`}
          >
            {(card.isFlipped || card.isMatched) ? card.symbol : ""}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="mt-1 flex items-center gap-1.5 rounded-full bg-os-pink px-4 py-2 text-os-ink">
          <Sparkles className="h-4 w-4" />
          <span className="font-display text-sm font-semibold">
            Você venceu em {moves} jogadas!
          </span>
        </div>
      )}
    </div>
  );
}
