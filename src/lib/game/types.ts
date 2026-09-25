export type LevelId = "tecnico" | "graduacao" | "pos";

export type AxisId =
  | "tech"
  | "agro"
  | "pesca"
  | "ambiente"
  | "turismo"
  | "naturais"
  | "humanas";

export interface Course {
  id: string;
  name: string;
  shortName: string;
  level: LevelId;
  axis: AxisId;
  blurb: string;
  highlights: string[];
}

export interface Keyword {
  id: string;
  text: string;
  ownerCourseId: string;
  axis: AxisId;
  enabled: boolean;
}

export interface LevelOption {
  id: LevelId;
  text: string;
  hint: string;
}

export interface CloudWord {
  instanceId: string;
  keywordId: string;
  text: string;
  kind: "level" | "affinity";
  level?: LevelId;
  ownerCourseId?: string;
  axis?: AxisId;
  slot: number;
  bornAt: number;
}

export interface Ingredient {
  keywordId: string;
  text: string;
  kind: "level" | "affinity";
  level?: LevelId;
  ownerCourseId?: string;
  axis?: AxisId;
}

export interface Scores {
  points: Record<string, number>;
  direct: Record<string, number>;
}

export interface GameResult {
  course: Course;
  points: number;
  direct: number;
  runnersUp: Array<{ course: Course; points: number; direct: number }>;
}

export const STORAGE_KEY = "mago-vocacoes-v1";
export const STORAGE_VERSION = 1;

export interface PersistedCatalog {
  version: number;
  keywords: Keyword[];
}
