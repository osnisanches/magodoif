import { useCallback, useEffect, useRef, useState } from "react";
import { LEVEL_SLOTS, SLOTS } from "@/lib/game/engine";
import type { CloudWord } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface Props {
  words: CloudWord[];
  levelSelect: boolean;
  disabled?: boolean;
  onDrop: (word: CloudWord) => boolean;
  dropZoneRef: React.RefObject<HTMLElement | null>;
}

interface DragState {
  id: string;
  x: number;
  y: number;
  grabX: number;
  grabY: number;
  w: number;
  h: number;
  over: boolean;
}

export function WordCloud({ words, levelSelect, disabled, onDrop, dropZoneRef }: Props) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const [gone, setGone] = useState<Set<string>>(new Set());
  const ids = words.map((w) => w.instanceId).join("|");
  const dragRef = useRef<DragState | null>(null);
  dragRef.current = drag;

  useEffect(() => {
    setGone(new Set());
  }, [ids]);

  const hitZone = (x: number, y: number) => {
    const zone = dropZoneRef.current?.getBoundingClientRect();
    if (!zone) return false;
    const pad = 22;
    return (
      x >= zone.left - pad && x <= zone.right + pad && y >= zone.top - pad && y <= zone.bottom + pad
    );
  };

  const onPointerDown = useCallback(
    (word: CloudWord, e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      e.preventDefault();
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* synthetic / already captured */
        }
      const r = e.currentTarget.getBoundingClientRect();
      setDrag({
        id: word.instanceId,
        x: e.clientX,
        y: e.clientY,
        grabX: e.clientX - r.left,
        grabY: e.clientY - r.top,
        w: r.width,
        h: r.height,
        over: false,
      });
    },
    [disabled],
  );

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setDrag((d) =>
      d ? { ...d, x: e.clientX, y: e.clientY, over: hitZone(e.clientX, e.clientY) } : d,
    );
  };

  const onPointerUp = (word: CloudWord, e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const ok = hitZone(e.clientX, e.clientY);
    setDrag(null);
    if (ok) {
      const accepted = onDrop(word);
      if (accepted) {
        setGone((g) => new Set(g).add(word.instanceId));
        if (navigator.vibrate) navigator.vibrate(18);
      }
    }
  };

  const slots = levelSelect ? LEVEL_SLOTS : SLOTS;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-full">
      <div
        className="absolute inset-0 bg-center bg-cover opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}game/smoke.png)` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-transparent to-bg/40" />
      <div className="word-cloud-field absolute left-[20%] right-[20%] top-16 bottom-[35%] sm:top-20">
        {words.map((word, i) => {
        if (gone.has(word.instanceId)) return null;
        const slot = slots[word.slot] ?? slots[i % slots.length];
        const dragging = drag?.id === word.instanceId;
        return (
          <div
            key={word.instanceId}
            className="word-cloud-item absolute"
            data-slot={word.slot < slots.length ? word.slot : i % slots.length}
            style={
              dragging && drag
                ? {
                    left: drag.x - drag.grabX,
                    top: drag.y - drag.grabY,
                    width: drag.w,
                    position: "fixed",
                    zIndex: 60,
                    transform: "none",
                  }
                : { zIndex: 1 }
            }
          >
            <button
              type="button"
              className={cn(
                "pointer-events-auto touch-none select-none rounded-full border font-medium text-fg",
                "border-primary/35 bg-surface/85 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md",
                "min-h-11 max-w-[46vw] px-4 py-2.5 sm:max-w-[260px]",
                levelSelect
                  ? "px-6 py-3.5 font-display text-lg tracking-wide sm:text-xl"
                  : "text-sm sm:text-base",
                !dragging && "chip-enter chip-float",
                dragging && "scale-110 border-primary bg-surface",
                disabled && "opacity-40",
              )}
              style={
                dragging
                  ? {
                      animation: "none",
                      boxShadow: drag?.over
                        ? "0 0 0 2px var(--color-primary), 0 12px 40px rgba(212,175,55,0.45)"
                        : undefined,
                    }
                  : { animationDelay: `${(i % 5) * 0.4}s, ${i * 0.07}s` }
              }
              onPointerDown={(e) => onPointerDown(word, e)}
              onPointerMove={onPointerMove}
              onPointerUp={(e) => onPointerUp(word, e)}
              onPointerCancel={() => setDrag(null)}
            >
              {word.text}
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
}
