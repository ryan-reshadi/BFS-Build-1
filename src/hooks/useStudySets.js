import { useCallback, useMemo, useState } from "react";
import { QUESTIONS } from "../data/questions.js";
import { STUDY_GUIDE } from "../data/studyGuide.js";
import { resolveFlashcards } from "../utils/flashcards.js";
import {
  DEFAULT_SET_ID,
  createStudySetId,
  validateAndNormalizeStudySet,
} from "../utils/studySetValidation.js";

const SETS_STORAGE_KEY = "fbla-bfs-study-sets-v1";
const ACTIVE_SET_KEY = "fbla-bfs-active-set-v1";

function buildDefaultSet() {
  const flashcards = resolveFlashcards(QUESTIONS);
  return {
    id: DEFAULT_SET_ID,
    name: "FBLA Banking & Financial Systems (Built-in)",
    description: "Default national prep question bank, study guide, and flashcards.",
    questions: QUESTIONS,
    studyGuide: STUDY_GUIDE,
    flashcards,
    isBuiltIn: true,
    createdAt: 0,
  };
}

function loadSetsFromStorage() {
  try {
    const raw = JSON.parse(localStorage.getItem(SETS_STORAGE_KEY));
    if (raw?.sets?.length) {
      const hasDefault = raw.sets.some((s) => s.id === DEFAULT_SET_ID);
      if (!hasDefault) {
        return [buildDefaultSet(), ...raw.sets];
      }
      return raw.sets;
    }
  } catch {
    /* ignore */
  }
  return [buildDefaultSet()];
}

function loadActiveSetId(sets) {
  try {
    const saved = localStorage.getItem(ACTIVE_SET_KEY);
    if (saved && sets.some((s) => s.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return sets[0]?.id ?? DEFAULT_SET_ID;
}

function persistSets(sets) {
  localStorage.setItem(SETS_STORAGE_KEY, JSON.stringify({ sets }));
}

function persistActiveSetId(id) {
  localStorage.setItem(ACTIVE_SET_KEY, id);
}

export function useStudySets() {
  const [sets, setSets] = useState(loadSetsFromStorage);
  const [activeSetId, setActiveSetId] = useState(() => loadActiveSetId(loadSetsFromStorage()));

  const activeSet = useMemo(
    () => sets.find((s) => s.id === activeSetId) ?? sets[0] ?? buildDefaultSet(),
    [sets, activeSetId]
  );

  const selectSet = useCallback((id) => {
    setActiveSetId(id);
    persistActiveSetId(id);
  }, []);

  const addSet = useCallback((normalized, options = {}) => {
    const newSet = {
      id: createStudySetId(),
      name: normalized.name,
      description: normalized.description,
      questions: normalized.questions,
      studyGuide: normalized.studyGuide,
      flashcards: normalized.flashcards,
      isBuiltIn: false,
      createdAt: Date.now(),
    };

    setSets((prev) => {
      const next = [...prev, newSet];
      persistSets(next);
      return next;
    });

    if (options.activate) {
      selectSet(newSet.id);
    }

    return newSet.id;
  }, [selectSet]);

  const importFromJson = useCallback((raw, fallbackName, options = {}) => {
    const normalized = validateAndNormalizeStudySet(raw, fallbackName);
    return addSet(normalized, options);
  }, [addSet]);

  const deleteSet = useCallback((id) => {
    const target = sets.find((s) => s.id === id);
    if (!target || target.isBuiltIn) return false;

    setSets((prev) => {
      const next = prev.filter((s) => s.id !== id);
      persistSets(next);
      return next;
    });

    if (activeSetId === id) {
      selectSet(DEFAULT_SET_ID);
    }

    return true;
  }, [sets, activeSetId, selectSet]);

  return {
    sets,
    activeSet,
    activeSetId,
    selectSet,
    importFromJson,
    deleteSet,
  };
}
