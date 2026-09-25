import { SEED_KEYWORDS } from "./catalog";
import type { Keyword, PersistedCatalog } from "./types";
import { STORAGE_KEY, STORAGE_VERSION } from "./types";

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

export function saveKeywords(keywords: Keyword[]) {
  if (!canUseStorage()) return;
  const payload: PersistedCatalog = { version: STORAGE_VERSION, keywords };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function resetKeywords(): Keyword[] {
  if (canUseStorage()) localStorage.removeItem(STORAGE_KEY);
  return SEED_KEYWORDS.map((k) => ({ ...k }));
}

export function exportKeywords(keywords: Keyword[]) {
  const payload: PersistedCatalog = { version: STORAGE_VERSION, keywords };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mago-das-vocacoes-palavras.json";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importKeywords(file: File): Promise<Keyword[]> {
  const text = await file.text();
  const parsed = JSON.parse(text) as PersistedCatalog;
  if (!parsed || !Array.isArray(parsed.keywords)) {
    throw new Error("Arquivo inválido.");
  }
  const keywords = parsed.keywords.filter(
    (k) => k && typeof k.id === "string" && typeof k.text === "string" && k.ownerCourseId,
  );
  saveKeywords(keywords);
  return keywords;
}
