import { FlaskConical, Undo2, Volume2, VolumeX } from "lucide-react";
import { MAX_INGREDIENTS } from "@/lib/game/engine";
import { AXIS_META, levelLabel } from "@/lib/game/catalog";
import type { Ingredient, LevelId } from "@/lib/game/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  ingredients: Ingredient[];
  level: LevelId | null;
  canUndo: boolean;
  muted: boolean;
  onUndo: () => void;
  onRefresh: () => void;
  onMute: () => void;
}

export function Hud({ count, ingredients, level, canUndo, muted, onUndo, onRefresh, onMute }: Props) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-40 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1 sm:px-5">
      <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-xl border border-border bg-bg/80 px-3 py-2 backdrop-blur-md sm:px-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0"
          disabled={!canUndo}
          onClick={onUndo}
        >
          <Undo2 />
          Desfazer último
        </Button>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-muted">
            <span className="truncate">
              {level ? `Nível · ${levelLabel(level)}` : "Escolha o nível de formação"}
            </span>
            <span className="tabular-nums text-primary">{count}/{MAX_INGREDIENTS}</span>
          </div>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2">
            {Array.from({ length: MAX_INGREDIENTS }).map((_, i) => {
              const ing = ingredients[i];
              const filled = i < count;
              const color =
                ing?.axis && ing.axis in AXIS_META
                  ? AXIS_META[ing.axis].glow
                  : "var(--color-primary)";
              return (
                <span
                  key={i}
                  className={cn("h-full flex-1 border-r border-bg/40 last:border-0 transition-colors duration-300")}
                  style={{ background: filled ? color : "transparent" }}
                />
              );
            })}
          </div>
        </div>

        {level && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-primary hover:bg-primary/15"
            aria-label="Novas palavras"
            title="Sortear outro grupo de palavras"
            onClick={onRefresh}
          >
            <FlaskConical />
          </Button>
        )}

        <Button type="button" variant="ghost" size="icon" aria-label={muted ? "Ativar som" : "Silenciar"} onClick={onMute}>
          {muted ? <VolumeX /> : <Volume2 />}
        </Button>
      </div>
    </footer>
  );
}
