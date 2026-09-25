import { create } from "zustand";
import { AXIS_META } from "./catalog";
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
import { loadKeywords, saveKeywords } from "./persist";
import type { AxisId, CloudWord, GameResult, Ingredient, Keyword, LevelId, Scores } from "./types";
import { playDrop, playReveal, playUndo, playWhoosh } from "./audio";

export type Phase = "title" | "playing" | "brewing" | "result";

interface GameState {
  phase: Phase;
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
  finishBrew: () => void;
  restart: () => void;
  setKeywords: (keywords: Keyword[]) => void;
  setMuted: (muted: boolean) => void;
}

function usedSet(used: string[], cloud: CloudWord[]) {
  return new Set([...used, ...cloud.map((w) => w.keywordId)]);
}

export const useGame = create<GameState>((set, get) => ({
  phase: "title",
  keywords: [],
  selectedLevel: null,
  ingredients: [],
  scores: emptyScores(),
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
    set({ keywords: loadKeywords(), reducedMotion: reduced });
  },

  start: () => {
    set({
      phase: "playing",
      selectedLevel: null,
      ingredients: [],
      scores: emptyScores(),
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
      const cloud = makeAffinityCloud(state.keywords, word.level, new Set(used));
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
    const scores = applyIngredient(state.scores, ingredient);
    const used = [...state.used, word.keywordId];
    const exclude = usedSet(used, state.cloud.filter((w) => w.instanceId !== word.instanceId));
    const cloud = injectRelated(state.cloud, word, state.keywords, state.selectedLevel, exclude);
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

    const scores = revertIngredient(state.scores, last);
    const used = state.used.filter((id) => id !== last.keywordId);
    const level = state.selectedLevel!;
    const cloud = makeAffinityCloud(state.keywords, level, new Set(used));
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
    const cloud = cycleCloud(state.cloud, state.keywords, state.selectedLevel, exclude);
    if (cloud !== state.cloud) set({ cloud });
  },

  finishBrew: () => {
    const state = get();
    if (!state.selectedLevel) return;
    playWhoosh();
    playReveal();
    const result = computeResult(state.selectedLevel, state.scores);
    set({ phase: "result", result });
  },

  restart: () => {
    get().start();
  },

  setKeywords: (keywords) => {
    saveKeywords(keywords);
    set({ keywords });
  },

  setMuted: (muted) => set({ muted }),
}));
