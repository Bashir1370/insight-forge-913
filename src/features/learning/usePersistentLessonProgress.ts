import { useCallback, useEffect, useMemo, useState } from "react";

type PersistedLessonProgress = {
  version: 1;
  currentIndex: number;
  maxUnlocked: number;
  answers: Record<number, number>;
};

const STORAGE_PREFIX = "hubgene:learning-progress:v1";

export function usePersistentLessonProgress({
  storageId,
  itemCount,
}: {
  storageId: string;
  itemCount: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [maxUnlocked, setMaxUnlocked] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const storageKey = useMemo(
    () => `${STORAGE_PREFIX}:${storageId}`,
    [storageId],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<PersistedLessonProgress>;
      const lastIndex = Math.max(0, itemCount - 1);
      const restoredCurrent = clampIndex(parsed.currentIndex, lastIndex);
      const restoredUnlocked = Math.max(
        restoredCurrent,
        clampIndex(parsed.maxUnlocked, lastIndex),
      );

      setCurrentIndex(restoredCurrent);
      setMaxUnlocked(restoredUnlocked);
      setAnswers(sanitizeAnswers(parsed.answers, lastIndex));
    } catch {
      // Corrupt or unavailable browser storage should never block a lesson.
    } finally {
      setHydrated(true);
    }
  }, [itemCount, storageKey]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    const payload: PersistedLessonProgress = {
      version: 1,
      currentIndex,
      maxUnlocked,
      answers,
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Browsers can disable or limit localStorage; keep the lesson usable.
    }
  }, [answers, currentIndex, hydrated, maxUnlocked, storageKey]);

  const resetProgress = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setMaxUnlocked(0);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Ignore storage failures and still reset the in-memory lesson state.
      }
    }
  }, [storageKey]);

  return {
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswers,
    maxUnlocked,
    setMaxUnlocked,
    hydrated,
    resetProgress,
  };
}

function clampIndex(value: unknown, lastIndex: number) {
  if (typeof value !== "number" || !Number.isInteger(value)) return 0;
  return Math.min(Math.max(value, 0), lastIndex);
}

function sanitizeAnswers(value: unknown, lastIndex: number) {
  if (!value || typeof value !== "object") return {};

  return Object.entries(value as Record<string, unknown>).reduce<Record<number, number>>(
    (result, [rawIndex, rawAnswer]) => {
      const index = Number(rawIndex);
      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index <= lastIndex &&
        typeof rawAnswer === "number" &&
        Number.isInteger(rawAnswer) &&
        rawAnswer >= 0
      ) {
        result[index] = rawAnswer;
      }
      return result;
    },
    {},
  );
}
