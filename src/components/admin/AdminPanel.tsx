import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { AXIS_META, COURSES, SEED_KEYWORDS, levelLabel } from "@/lib/game/catalog";
import { exportKeywords, importKeywords, resetKeywords } from "@/lib/game/persist";
import { useGame } from "@/lib/game/store";
import type { Keyword } from "@/lib/game/types";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const selectClass =
  "h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

interface Props {
  onBack?: () => void;
}

export function AdminPanel({ onBack }: Props) {
  const keywords = useGame((s) => s.keywords);
  const hydrate = useGame((s) => s.hydrate);
  const setKeywords = useGame((s) => s.setKeywords);
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [text, setText] = useState("");
  const [courseId, setCourseId] = useState(COURSES[0]?.id ?? "informatica");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return keywords.filter((k) => {
      if (courseFilter !== "all" && k.ownerCourseId !== courseFilter) return false;
      if (q && !k.text.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [keywords, query, courseFilter]);

  const addWord = () => {
    const value = text.trim();
    if (!value) return;
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) return;
    const id = `${courseId}-${slugify(value)}-${Date.now().toString(36)}`;
    const next: Keyword = {
      id,
      text: value,
      ownerCourseId: courseId,
      axis: course.axis,
      enabled: true,
    };
    setKeywords([next, ...keywords]);
    setText("");
  };

  const remove = (id: string) => setKeywords(keywords.filter((k) => k.id !== id));

  const toggle = (id: string) =>
    setKeywords(keywords.map((k) => (k.id === id ? { ...k, enabled: !k.enabled } : k)));

  const onReset = () => {
    if (!confirm("Restaurar o vocabulário original do campus?")) return;
    setKeywords(resetKeywords());
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      setError(null);
      const next = await importKeywords(file);
      setKeywords(next);
    } catch {
      setError("Não foi possível ler este arquivo.");
    }
  };

  return (
    <div className="h-[100dvh] overflow-y-auto bg-bg text-fg">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">IFPA Campus Bragança</p>
            <h1 className="font-display mt-1 text-3xl font-semibold">Painel de essências</h1>
            <p className="mt-1 text-sm text-muted">
              Cadastre palavras, vincule a um curso e o eixo é herdado automaticamente.
            </p>
          </div>
          {onBack ? (
            <Button type="button" variant="secondary" onClick={onBack}>
              <ArrowLeft />
              Voltar ao jogo
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link to="/">
                <ArrowLeft />
                Voltar ao jogo
              </Link>
            </Button>
          )}
        </div>

        <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]">
            <div className="space-y-1.5">
              <Label htmlFor="word">Nova palavra</Label>
              <Input
                id="word"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex.: Manguezal"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addWord();
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course">Curso dono</Label>
              <select
                id="course"
                className={selectClass}
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortName} · {levelLabel(c.level)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addWord} className="w-full sm:w-auto">
                <Plus />
                Adicionar
              </Button>
            </div>
          </div>
        </section>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar palavras"
            className="max-w-xs"
          />
          <select
            className={selectClass + " max-w-xs"}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">Todos os cursos</option>
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortName}
              </option>
            ))}
          </select>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => exportKeywords(keywords)}>
              <Download />
              Exportar
            </Button>
            <Button type="button" variant="secondary" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload />
                Importar
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={(e) => {
                    void onImport(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw />
              Restaurar
            </Button>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-axis-humanas">{error}</p>}

        <p className="mt-4 text-sm text-subtle tabular-nums">
          {list.length} palavras · seed original {SEED_KEYWORDS.length}
        </p>

        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {list.map((k) => {
            const course = COURSES.find((c) => c.id === k.ownerCourseId);
            return (
              <li key={k.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggle(k.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className={k.enabled ? "font-medium text-fg" : "font-medium text-subtle line-through"}>
                    {k.text}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {course?.shortName ?? k.ownerCourseId} · {AXIS_META[k.axis].name}
                  </p>
                </button>
                <Badge variant={k.enabled ? "gold" : "default"}>{k.enabled ? "Ativa" : "Off"}</Badge>
                <Button type="button" variant="ghost" size="icon" aria-label="Excluir" onClick={() => remove(k.id)}>
                  <Trash2 />
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
