import { create } from "zustand";
import { AXIS_META, COURSES } from "./catalog";
import {
  applyIngredient,
  computeResult,
  cycleCloud,
  emptyScores,
  ingredientFromCloud,
  injectRelated,
  makeAffinityCloud,
  makeLevelCloud,
  MAX_INGREDIENTS,
  revertIngredient,
} from "./engine";
import { loadCourses, loadKeywords, saveCourses, saveKeywords } from "./persist";
import type { AxisId, CloudWord, Course, GameResult, Ingredient, Keyword, LevelId, Scores } from "./types";
import { playDrop, playReveal, playUndo, playWhoosh } from "./audio";

export type Phase = "title" | "playing" | "brewing" | "result";

interface GameState {
  phase: Phase;
  courses: Course[];
  keywords: Keyword[];
  selectedLevel: LevelId | null;
  ingredients: Ingredient[];
  scores: Scores;
  cloud: CloudWord[];
  used: string[];
  cauldronAxis: AxisId | "gold";
  burst: number;
  result: GameResult | null;
  reducedMotion: boolean;
  muted: boolean;
  hydrate: () => void;
  start: () => void;
  dropWord: (word: CloudWord) => boolean;
  undo: () => void;
  cycle: () => void;
  refreshWords: () => void;
  finishBrew: () => void;
  restart: () => void;
  setKeywords: (keywords: Keyword[]) => void;
  setCourses: (courses: Course[]) => void;
  setMuted: (muted: boolean) => void;
}

function usedSet(used: string[], cloud: CloudWord[]) {
  return new Set([...used, ...cloud.map((w) => w.keywordId)]);
}

export const useGame = create<GameState>((set, get) => ({
  phase: "title",
  courses: COURSES,
  keywords: [],
  selectedLevel: null,
  ingredients: [],
  scores: emptyScores(COURSES),
  cloud: [],
  used: [],
  cauldronAxis: "gold",
  burst: 0,
  result: null,
  reducedMotion: false,
  muted: false,

  hydrate: () => {
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    set({ keywords: loadKeywords(), courses: loadCourses(COURSES), reducedMotion: reduced });
  },

  start: () => {
    set({
      phase: "playing",
      selectedLevel: null,
      ingredients: [],
      scores: emptyScores(get().courses),
      cloud: makeLevelCloud(),
      used: [],
      cauldronAxis: "gold",
      result: null,
      burst: 0,
    });
  },

  dropWord: (word) => {
    const state = get();
    if (state.phase !== "playing") return false;
    if (state.ingredients.length >= MAX_INGREDIENTS) return false;
    if (!state.cloud.some((w) => w.instanceId === word.instanceId)) return false;

    if (word.kind === "level" && word.level) {
      const used = [word.keywordId];
      const cloud = makeAffinityCloud(state.keywords, word.level, new Set(used), state.courses);
      playDrop(0);
      set({
        selectedLevel: word.level,
        ingredients: [ingredientFromCloud(word)],
        cloud,
        used,
        cauldronAxis: "gold",
        burst: state.burst + 1,
      });
      return true;
    }

    if (!state.selectedLevel) return false;

    const ingredient = ingredientFromCloud(word);
    const ingredients = [...state.ingredients, ingredient];
    const scores = applyIngredient(state.scores, ingredient, state.courses);
    const used = [...state.used, word.keywordId];
    const exclude = usedSet(used, state.cloud.filter((w) => w.instanceId !== word.instanceId));
    const cloud = injectRelated(
      state.cloud,
      word,
      state.keywords,
      state.selectedLevel,
      exclude,
      state.courses,
    );
    const axis = (word.axis ?? "gold") as AxisId | "gold";
    const complete = ingredients.length >= MAX_INGREDIENTS;

    playDrop(Object.keys(AXIS_META).indexOf(word.axis ?? "tech"));
    set({
      ingredients,
      scores,
      used,
      cloud: complete ? [] : cloud,
      cauldronAxis: axis,
      burst: state.burst + 1,
      phase: complete ? "brewing" : "playing",
    });
    return true;
  },

  undo: () => {
    const state = get();
    if (state.phase !== "playing" && state.phase !== "brewing") return;
    if (state.ingredients.length === 0) return;
    const last = state.ingredients[state.ingredients.length - 1];
    const ingredients = state.ingredients.slice(0, -1);
    playUndo();

    if (ingredients.length === 0 || last.kind === "level") {
      set({
        phase: "playing",
        selectedLevel: null,
        ingredients: [],
        scores: emptyScores(),
        cloud: makeLevelCloud(),
        used: [],
        cauldronAxis: "gold",
        result: null,
      });
      return;
    }

    const scores = revertIngredient(state.scores, last, state.courses);
    const used = state.used.filter((id) => id !== last.keywordId);
    const level = state.selectedLevel!;
    const cloud = makeAffinityCloud(state.keywords, level, new Set(used), state.courses);
    set({
      phase: "playing",
      ingredients,
      scores,
      used,
      cloud,
      result: null,
      cauldronAxis: (ingredients.at(-1)?.axis as AxisId | undefined) ?? "gold",
    });
  },

  cycle: () => {
    const state = get();
    if (state.phase !== "playing" || !state.selectedLevel) return;
    const exclude = usedSet(state.used, state.cloud);
    const cloud = cycleCloud(state.cloud, state.keywords, state.selectedLevel, exclude, state.courses);
    if (cloud !== state.cloud) set({ cloud });
  },

  refreshWords: () => {
    const state = get();
    if (state.phase !== "playing" || !state.selectedLevel) return;
    const exclude = usedSet(state.used, state.cloud);
    const cloud = makeAffinityCloud(state.keywords, state.selectedLevel, exclude, state.courses);
    if (cloud.length > 0) set({ cloud });
  },

  finishBrew: () => {
    const state = get();
    if (!state.selectedLevel) return;
    playWhoosh();
    playReveal();
    const result = computeResult(state.selectedLevel, state.scores, state.courses);
    set({ phase: "result", result });
  },

  restart: () => {
    get().start();
  },

  setKeywords: (keywords) => {
    saveKeywords(keywords);
    set({ keywords });
  },

  setCourses: (courses) => {
    const courseIds = new Set(courses.map((course) => course.id));
    const keywords = get().keywords.filter((keyword) => courseIds.has(keyword.ownerCourseId));
    saveCourses(courses);
    saveKeywords(keywords);
    set({ courses, keywords });
  },

  setMuted: (muted) => set({ muted }),
}));
