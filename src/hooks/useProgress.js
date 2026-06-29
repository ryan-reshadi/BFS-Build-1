import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SET_ID } from "../utils/studySetValidation.js";

const PROGRESS_KEY_V1 = "fbla-bfs-progress-v1";
const PROGRESS_KEY = "fbla-bfs-progress-v2";

const DEFAULTS = {
  answered: {},
  incorrect: [],
  bookmarks: [],
  flashKnown: [],
  flashReview: [],
  formulaKnowledge: {},
  testsTaken: 0,
  totalCorrect: 0,
  totalAnswered: 0,
};

function emptyProgress() {
  return { ...DEFAULTS };
}

function migrateV1Progress() {
  try {
    const v1 = JSON.parse(localStorage.getItem(PROGRESS_KEY_V1));
    if (!v1) return null;
    const bySet = { [DEFAULT_SET_ID]: { ...DEFAULTS, ...v1 } };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ bySet }));
    return bySet;
  } catch {
    return null;
  }
}

function loadBySet() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (raw?.bySet) return raw.bySet;
  } catch {
    /* ignore */
  }

  const migrated = migrateV1Progress();
  if (migrated) return migrated;

  return {};
}

function readProgress(setId) {
  const bySet = loadBySet();
  return { ...DEFAULTS, ...(bySet[setId] || {}) };
}

function writeProgress(setId, progress) {
  const bySet = loadBySet();
  bySet[setId] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ bySet }));
}

export function useProgress(activeSetId) {
  const [progress, setProgress] = useState(() => readProgress(activeSetId));

  useEffect(() => {
    setProgress(readProgress(activeSetId));
  }, [activeSetId]);

  const saveProgress = useCallback((next) => {
    setProgress((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      writeProgress(activeSetId, updated);
      return updated;
    });
  }, [activeSetId]);

  const resetProgress = useCallback(() => {
    const cleared = emptyProgress();
    writeProgress(activeSetId, cleared);
    setProgress(cleared);
  }, [activeSetId]);

  const deleteProgressForSet = useCallback((setId) => {
    const bySet = loadBySet();
    delete bySet[setId];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ bySet }));
    if (setId === activeSetId) {
      setProgress(emptyProgress());
    }
  }, [activeSetId]);

  return { progress, saveProgress, resetProgress, deleteProgressForSet };
}
