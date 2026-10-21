import { IRACSolution, CaseBrief, NoteSynthesis } from "../types";
import { PRELOADED_LANDMARK_CASES } from "../data/defaultVault";

const IRAC_STORAGE_KEY = "leximind_irac_solutions_v1";
const CASES_STORAGE_KEY = "leximind_case_briefs_v1";
const NOTES_STORAGE_KEY = "leximind_syntheses_v1";
const FAVORITES_STORAGE_KEY = "leximind_favorites_v1";

export const getStoredIRACSolutions = (): IRACSolution[] => {
  try {
    const data = localStorage.getItem(IRAC_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load IRAC solutions from storage:", err);
    return [];
  }
};

export const saveIRACSolution = (solution: IRACSolution): void => {
  try {
    const current = getStoredIRACSolutions();
    const updated = [solution, ...current.filter((item) => item.id !== solution.id)];
    localStorage.setItem(IRAC_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save IRAC solution:", err);
  }
};

export const deleteIRACSolution = (id: string): void => {
  try {
    const current = getStoredIRACSolutions();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(IRAC_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete IRAC solution:", err);
  }
};

export const getStoredCaseBriefs = (): CaseBrief[] => {
  try {
    const data = localStorage.getItem(CASES_STORAGE_KEY);
    if (!data) {
      // Initialize with preloaded cases
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(PRELOADED_LANDMARK_CASES));
      return PRELOADED_LANDMARK_CASES;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to load case briefs:", err);
    return PRELOADED_LANDMARK_CASES;
  }
};

export const saveCaseBrief = (brief: CaseBrief): void => {
  try {
    const current = getStoredCaseBriefs();
    const updated = [brief, ...current.filter((item) => item.id !== brief.id)];
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save case brief:", err);
  }
};

export const toggleFavoriteCase = (id: string): void => {
  try {
    const current = getStoredCaseBriefs();
    const updated = current.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to toggle favorite:", err);
  }
};

export const deleteCaseBrief = (id: string): void => {
  try {
    const current = getStoredCaseBriefs();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete case brief:", err);
  }
};

export const getStoredSyntheses = (): NoteSynthesis[] => {
  try {
    const data = localStorage.getItem(NOTES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load syntheses:", err);
    return [];
  }
};

export const saveNoteSynthesis = (synthesis: NoteSynthesis): void => {
  try {
    const current = getStoredSyntheses();
    const updated = [synthesis, ...current.filter((item) => item.id !== synthesis.id)];
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save synthesis:", err);
  }
};

export const deleteNoteSynthesis = (id: string): void => {
  try {
    const current = getStoredSyntheses();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete synthesis:", err);
  }
};

const STATUTE_BOOKMARKS_KEY = "leximind_statute_bookmarks_v1";

export const getBookmarkedStatuteIds = (): string[] => {
  try {
    const data = localStorage.getItem(STATUTE_BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load statute bookmarks:", err);
    return [];
  }
};

export const toggleStatuteBookmark = (statuteId: string): boolean => {
  try {
    const current = getBookmarkedStatuteIds();
    const exists = current.includes(statuteId);
    const updated = exists ? current.filter((id) => id !== statuteId) : [...current, statuteId];
    localStorage.setItem(STATUTE_BOOKMARKS_KEY, JSON.stringify(updated));
    return !exists;
  } catch (err) {
    console.error("Failed to toggle statute bookmark:", err);
    return false;
  }
};

