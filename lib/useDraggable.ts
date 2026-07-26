"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

export function useDraggable(initial: Position, disabled: boolean = false) {
  const [position, setPosition] = useState<Position>(initial);
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: position.x,
        origY: position.y,
      };
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position, disabled]
  );

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setPosition({
        x: dragState.current.origX + dx,
        y: dragState.current.origY + dy,
      });
    }
    function onUp() {
      dragState.current = null;
      setIsDragging(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return { position, setPosition, onPointerDown, isDragging };
}
