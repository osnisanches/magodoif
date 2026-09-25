import { useEffect } from "react";

interface Props {
  onDone: () => void;
}

export function PotionFinale({ onDone }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2200);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-hidden">
      <div
        className="size-40 rounded-full"
        style={{
          background:
            "conic-gradient(from 90deg, #d4af37, #7c5cbf, #5eead4, #d4af37)",
          animation: "potion-swirl 2.1s var(--ease-out) forwards",
          filter: "blur(8px)",
        }}
      />
      <p className="font-display absolute text-xl text-fg sm:text-2xl">Preparando sua poção mágica...</p>
    </div>
  );
}
