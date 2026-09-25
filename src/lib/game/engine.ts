import { COURSES, LEVELS } from "./catalog";
import type {
  CloudWord,
  Course,
  GameResult,
  Ingredient,
  Keyword,
  LevelId,
  Scores,
} from "./types";

export const MAX_INGREDIENTS = 6;
export const MAX_CLOUD = 6;

export const SLOTS: Array<{ x: number; y: number }> = [
  { x: 16, y: 16 },
  { x: 50, y: 10 },
  { x: 84, y: 18 },
  { x: 28, y: 44 },
  { x: 72, y: 42 },
  { x: 50, y: 64 },
];

export const LEVEL_SLOTS: Array<{ x: number; y: number }> = [
  { x: 22, y: 42 },
  { x: 50, y: 28 },
  { x: 78, y: 42 },
];

let seq = 0;
function nid(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}-${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyScores(): Scores {
  const points: Record<string, number> = {};
  const direct: Record<string, number> = {};
  for (const c of COURSES) {
    points[c.id] = 0;
    direct[c.id] = 0;
  }
  return { points, direct };
}

export function applyIngredient(scores: Scores, ingredient: Ingredient): Scores {
  if (ingredient.kind === "level" || !ingredient.ownerCourseId || !ingredient.axis) {
    return scores;
  }
  const points = { ...scores.points };
  const direct = { ...scores.direct };
  const owner = ingredient.ownerCourseId;
  points[owner] = (points[owner] ?? 0) + 2;
  direct[owner] = (direct[owner] ?? 0) + 1;
  for (const course of COURSES) {
    if (course.axis === ingredient.axis && course.id !== owner) {
      points[course.id] = (points[course.id] ?? 0) + 1;
    }
  }
  return { points, direct };
}

export function revertIngredient(scores: Scores, ingredient: Ingredient): Scores {
  if (ingredient.kind === "level" || !ingredient.ownerCourseId || !ingredient.axis) {
    return scores;
  }
  const points = { ...scores.points };
  const direct = { ...scores.direct };
  const owner = ingredient.ownerCourseId;
  points[owner] = Math.max(0, (points[owner] ?? 0) - 2);
  direct[owner] = Math.max(0, (direct[owner] ?? 0) - 1);
  for (const course of COURSES) {
    if (course.axis === ingredient.axis && course.id !== owner) {
      points[course.id] = Math.max(0, (points[course.id] ?? 0) - 1);
    }
  }
  return { points, direct };
}

export function computeResult(level: LevelId, scores: Scores): GameResult | null {
  const pool = COURSES.filter((c) => c.level === level);
  if (pool.length === 0) return null;
  const ranked = [...pool].sort((a, b) => {
    const pa = scores.points[a.id] ?? 0;
    const pb = scores.points[b.id] ?? 0;
    if (pb !== pa) return pb - pa;
    return (scores.direct[b.id] ?? 0) - (scores.direct[a.id] ?? 0);
  });
  const winner = ranked[0];
  const runnersUp = ranked.slice(1, 3).map((course) => ({
    course,
    points: scores.points[course.id] ?? 0,
    direct: scores.direct[course.id] ?? 0,
  }));
  return {
    course: winner,
    points: scores.points[winner.id] ?? 0,
    direct: scores.direct[winner.id] ?? 0,
    runnersUp,
  };
}

function levelCourseIds(level: LevelId): Set<string> {
  return new Set(COURSES.filter((c) => c.level === level).map((c) => c.id));
}

export function keywordsForLevel(keywords: Keyword[], level: LevelId): Keyword[] {
  const ids = levelCourseIds(level);
  return keywords.filter((k) => k.enabled && ids.has(k.ownerCourseId));
}

function shuffle<T>(items: T[], rand: () => number = Math.random): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function take<T>(items: T[], n: number): T[] {
  return items.slice(0, Math.max(0, n));
}

export function makeLevelCloud(now = Date.now()): CloudWord[] {
  return LEVELS.map((level, i) => ({
    instanceId: nid("lvl"),
    keywordId: `level:${level.id}`,
    text: level.text.toUpperCase(),
    kind: "level" as const,
    level: level.id,
    slot: i,
    bornAt: now,
  }));
}

function toCloudWord(keyword: Keyword, slot: number, now: number): CloudWord {
  return {
    instanceId: nid("w"),
    keywordId: keyword.id,
    text: keyword.text,
    kind: "affinity",
    ownerCourseId: keyword.ownerCourseId,
    axis: keyword.axis,
    slot,
    bornAt: now,
  };
}

function rebalance(cloud: CloudWord[]): CloudWord[] {
  return cloud.slice(0, MAX_CLOUD).map((w, i) => ({ ...w, slot: i }));
}

function freeSlots(cloud: CloudWord[], max = MAX_CLOUD): number[] {
  const used = new Set(cloud.map((w) => w.slot));
  const slots: number[] = [];
  for (let i = 0; i < max; i++) {
    if (!used.has(i)) slots.push(i);
  }
  return slots;
}

function pickDiverse(pool: Keyword[], n: number): Keyword[] {
  const byAxis = new Map<string, Keyword[]>();
  for (const k of shuffle(pool)) {
    const list = byAxis.get(k.axis) ?? [];
    list.push(k);
    byAxis.set(k.axis, list);
  }
  const axes = shuffle([...byAxis.keys()]);
  const picked: Keyword[] = [];
  let guard = 0;
  while (picked.length < n && guard < 40) {
    for (const axis of axes) {
      const list = byAxis.get(axis);
      if (!list?.length) continue;
      picked.push(list.shift()!);
      if (picked.length >= n) break;
    }
    guard += 1;
  }
  return picked;
}

export function makeAffinityCloud(
  keywords: Keyword[],
  level: LevelId,
  exclude: Set<string>,
  now = Date.now(),
): CloudWord[] {
  const pool = keywordsForLevel(keywords, level).filter((k) => !exclude.has(k.id));
  const picked = pickDiverse(pool, Math.min(MAX_CLOUD, Math.max(6, pool.length)));
  return rebalance(picked.map((k, i) => toCloudWord(k, i, now)));
}

export function relatedKeywords(
  dropped: CloudWord,
  keywords: Keyword[],
  level: LevelId,
  exclude: Set<string>,
  count = 3,
): Keyword[] {
  const pool = keywordsForLevel(keywords, level).filter(
    (k) => !exclude.has(k.id) && k.id !== dropped.keywordId,
  );
  const sameCourse = shuffle(pool.filter((k) => k.ownerCourseId === dropped.ownerCourseId));
  const sameAxis = shuffle(
    pool.filter((k) => k.axis === dropped.axis && k.ownerCourseId !== dropped.ownerCourseId),
  );
  const others = shuffle(
    pool.filter((k) => k.axis !== dropped.axis),
  );
  const picked: Keyword[] = [];
  picked.push(...take(sameCourse, 2));
  picked.push(...take(sameAxis, 1));
  for (const extra of [...sameCourse.slice(2), ...sameAxis.slice(1), ...others]) {
    if (picked.length >= count) break;
    if (!picked.some((p) => p.id === extra.id)) picked.push(extra);
  }
  return take(picked, count);
}

export function injectRelated(
  cloud: CloudWord[],
  dropped: CloudWord,
  keywords: Keyword[],
  level: LevelId,
  exclude: Set<string>,
  now = Date.now(),
): CloudWord[] {
  const next = cloud.filter((w) => w.instanceId !== dropped.instanceId);
  const related = relatedKeywords(dropped, keywords, level, exclude, 3);
  const slots = freeSlots(next);
  const injected = related.map((k, i) => toCloudWord(k, slots[i] ?? i % MAX_CLOUD, now));
  let merged = [...next, ...injected];
  if (merged.length > MAX_CLOUD) {
    const freshIds = new Set(injected.map((w) => w.instanceId));
    const sortable = [...merged].sort((a, b) => a.bornAt - b.bornAt);
    const remove = sortable.filter((w) => !freshIds.has(w.instanceId)).slice(0, merged.length - MAX_CLOUD);
    const drop = new Set(remove.map((w) => w.instanceId));
    merged = merged.filter((w) => !drop.has(w.instanceId));
  }
  return rebalance(merged);
}

export function cycleCloud(
  cloud: CloudWord[],
  keywords: Keyword[],
  level: LevelId,
  exclude: Set<string>,
  now = Date.now(),
  staleMs = 9000,
): CloudWord[] {
  if (cloud.length === 0 || cloud[0]?.kind === "level") return cloud;
  const stale = cloud.filter((w) => now - w.bornAt >= staleMs);
  if (stale.length === 0) return cloud;
  const victim = stale[0];
  const pool = keywordsForLevel(keywords, level).filter(
    (k) => !exclude.has(k.id) && !cloud.some((w) => w.keywordId === k.id),
  );
  if (pool.length === 0) return cloud;
  const replacement = pickDiverse(pool, 1)[0];
  if (!replacement) return cloud;
  return rebalance(
    cloud.map((w) =>
      w.instanceId === victim.instanceId ? toCloudWord(replacement, w.slot, now) : w,
    ),
  );
}

export function ingredientFromCloud(word: CloudWord): Ingredient {
  return {
    keywordId: word.keywordId,
    text: word.text,
    kind: word.kind,
    level: word.level,
    ownerCourseId: word.ownerCourseId,
    axis: word.axis,
  };
}

export function describeMatch(course: Course, ingredients: Ingredient[]): string {
  const names = ingredients.filter((i) => i.kind === "affinity").map((i) => i.text);
  if (names.length === 0) return course.blurb;
  const shown = names.slice(-4);
  return `As essências ${shown.map((n) => `“${n}”`).join(", ")} revelaram afinidade com ${course.shortName}.`;
}
