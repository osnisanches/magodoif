import { SEED_KEYWORDS } from "./catalog";
import type { Course, Keyword, PersistedCatalog } from "./types";
import { COURSES_STORAGE_KEY, STORAGE_KEY, STORAGE_VERSION } from "./types";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadKeywords(): Keyword[] {
  if (!canUseStorage()) return SEED_KEYWORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_KEYWORDS;
    const parsed = JSON.parse(raw) as PersistedCatalog;
    if (!parsed || parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.keywords)) {
      return SEED_KEYWORDS;
    }
    return parsed.keywords.filter(
      (k) => k && typeof k.id === "string" && typeof k.text === "string" && k.ownerCourseId,
    );
  } catch {
    return SEED_KEYWORDS;
  }
}

export function loadCourses(fallback: Course[]): Course[] {
  if (!canUseStorage()) return fallback.map((course) => ({ ...course }));
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) return fallback.map((course) => ({ ...course }));
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback.map((course) => ({ ...course }));
    return parsed.filter(
      (course): course is Course =>
        course &&
        typeof course.id === "string" &&
        typeof course.name === "string" &&
        typeof course.shortName === "string" &&
        typeof course.level === "string" &&
        typeof course.axis === "string" &&
        typeof course.blurb === "string" &&
        Array.isArray(course.highlights),
    );
  } catch {
    return fallback.map((course) => ({ ...course }));
  }
}

export function saveCourses(courses: Course[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
}

export function saveKeywords(keywords: Keyword[]) {
  if (!canUseStorage()) return;
  const payload: PersistedCatalog = { version: STORAGE_VERSION, keywords };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function resetKeywords(): Keyword[] {
  if (canUseStorage()) localStorage.removeItem(STORAGE_KEY);
  return SEED_KEYWORDS.map((k) => ({ ...k }));
}

export function exportKeywords(keywords: Keyword[], courses?: Course[]) {
  const payload: PersistedCatalog = {
    version: STORAGE_VERSION,
    keywords,
    ...(courses ? { courses } : {}),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mago-das-vocacoes-palavras.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importCatalog(file: File): Promise<PersistedCatalog> {
  const text = await file.text();
  const parsed = JSON.parse(text) as PersistedCatalog;
  if (!parsed || !Array.isArray(parsed.keywords)) {
    throw new Error("Arquivo inválido.");
  }
  const keywords = parsed.keywords.filter(
    (k) => k && typeof k.id === "string" && typeof k.text === "string" && k.ownerCourseId,
  );
  saveKeywords(keywords);
  const courses = Array.isArray(parsed.courses)
    ? parsed.courses.filter(
        (course) =>
          course &&
          typeof course.id === "string" &&
          typeof course.name === "string" &&
          typeof course.shortName === "string" &&
          typeof course.level === "string" &&
          typeof course.axis === "string" &&
          typeof course.blurb === "string" &&
          Array.isArray(course.highlights),
      )
    : undefined;
  if (courses) saveCourses(courses);
  return { version: STORAGE_VERSION, keywords, ...(courses ? { courses } : {}) };
}
