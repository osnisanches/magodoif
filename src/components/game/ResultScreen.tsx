import { AXIS_META, levelLabel } from "@/lib/game/catalog";
import { describeMatch } from "@/lib/game/engine";
import type { GameResult, Ingredient } from "@/lib/game/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  result: GameResult;
  ingredients: Ingredient[];
  onRestart: () => void;
}

export function ResultScreen({ result, ingredients, onRestart }: Props) {
  const { course, runnersUp } = result;
  const axis = AXIS_META[course.axis];
  const affinities = ingredients.filter((i) => i.kind === "affinity");

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-bg/75 px-4 py-8 backdrop-blur-sm">
      <article className="w-full max-w-lg rounded-xl border border-border bg-surface px-6 py-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Poção revelada</p>
        <h2 className="font-display mt-2 text-3xl font-semibold leading-tight text-fg sm:text-4xl">
          {course.name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="gold">{levelLabel(course.level)}</Badge>
          <Badge>{axis.name}</Badge>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{course.blurb}</p>
        <p className="mt-3 text-sm text-fg/90">{describeMatch(course, ingredients)}</p>

        <ul className="mt-5 space-y-1.5 text-sm text-muted">
          {course.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {h}
            </li>
          ))}
        </ul>

        {affinities.length > 0 && (
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wider text-subtle">Ingredientes da poção</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {affinities.map((a) => (
                <Badge key={a.keywordId}>{a.text}</Badge>
              ))}
            </div>
          </div>
        )}

        {runnersUp.some((r) => r.points > 0) && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-wider text-subtle">Outras essências detectadas</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {runnersUp
                .filter((r) => r.points > 0)
                .map((r) => (
                  <li key={r.course.id} className="flex justify-between gap-3">
                    <span>{r.course.shortName}</span>
                    <span className="tabular-nums text-subtle">{r.points} pts</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <Button size="lg" className="mt-7 w-full" onClick={onRestart}>
          Nova poção
        </Button>
      </article>
    </div>
  );
}
