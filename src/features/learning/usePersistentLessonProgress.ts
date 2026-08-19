import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

type PersistedLessonProgress = {
  version: 2;
  currentIndex: number;
  maxUnlocked: number;
  answers: Record<number, number>;
  updatedAt: string;
};

type ProgressState = Pick<
  PersistedLessonProgress,
  "currentIndex" | "maxUnlocked" | "answers"
>;

const STORAGE_PREFIX = "hubgene:learning-progress:v2";
const LEGACY_STORAGE_PREFIX = "hubgene:learning-progress:v1";
const CLOUD_RESEARCH_LINE = "rna-seq-learning";
const CLOUD_WRITE_DELAY_MS = 500;

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
  const [syncInitialized, setSyncInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const stateRef = useRef<ProgressState>({
    currentIndex: 0,
    maxUnlocked: 0,
    answers: {},
  });
  const localUpdatedAtRef = useRef<string | null>(null);
  const syncGenerationRef = useRef(0);

  const storageKey = useMemo(
    () => `${STORAGE_PREFIX}:${storageId}`,
    [storageId],
  );
  const legacyStorageKey = useMemo(
    () => `${LEGACY_STORAGE_PREFIX}:${storageId}`,
    [storageId],
  );

  useEffect(() => {
    stateRef.current = { currentIndex, maxUnlocked, answers };
  }, [answers, currentIndex, maxUnlocked]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw =
        window.localStorage.getItem(storageKey) ??
        window.localStorage.getItem(legacyStorageKey);

      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<PersistedLessonProgress>;
      const restored = sanitizeProgressState(parsed, itemCount);

      setCurrentIndex(restored.currentIndex);
      setMaxUnlocked(restored.maxUnlocked);
      setAnswers(restored.answers);
      localUpdatedAtRef.current =
        typeof parsed.updatedAt === "string" ? parsed.updatedAt : null;
    } catch {
      // Corrupt or unavailable browser storage should never block a lesson.
    } finally {
      setHydrated(true);
    }
  }, [itemCount, legacyStorageKey, storageKey]);

  useEffect(() => {
    if (!hydrated) return;

    let mounted = true;
    const generation = ++syncGenerationRef.current;

    async function initializeForUser(nextUserId: string | null) {
      if (!mounted || generation !== syncGenerationRef.current) return;

      setSyncInitialized(false);
      setUserId(nextUserId);

      if (!nextUserId) {
        setSyncing(false);
        setSyncInitialized(true);
        return;
      }

      setSyncing(true);

      try {
        const table = (supabase as any).from("learning_progress");
        const { data, error } = await table
          .select("progress_state, updated_at")
          .eq("user_id", nextUserId)
          .eq("research_line", CLOUD_RESEARCH_LINE)
          .eq("node_id", storageId)
          .maybeSingle();

        if (!mounted || generation !== syncGenerationRef.current) return;

        if (error) throw error;

        const localUpdatedAt = parseTimestamp(localUpdatedAtRef.current);
        const cloudUpdatedAt = parseTimestamp(data?.updated_at);

        if (data?.progress_state && cloudUpdatedAt >= localUpdatedAt) {
          const restored = sanitizeProgressState(data.progress_state, itemCount);
          setCurrentIndex(restored.currentIndex);
          setMaxUnlocked(restored.maxUnlocked);
          setAnswers(restored.answers);
          localUpdatedAtRef.current =
            typeof data.updated_at === "string"
              ? data.updated_at
              : new Date().toISOString();
        } else if (!data || localUpdatedAt > cloudUpdatedAt) {
          await upsertCloudProgress(
            nextUserId,
            storageId,
            stateRef.current,
          );
        }
      } catch (error) {
        console.warn("[Learning progress] Cloud sync initialization failed", error);
      } finally {
        if (mounted && generation === syncGenerationRef.current) {
          setSyncing(false);
          setSyncInitialized(true);
        }
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      void initializeForUser(data.session?.user.id ?? null);
    });

    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        syncGenerationRef.current += 1;
        void initializeForUser(session?.user.id ?? null);
      },
    );

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, [hydrated, itemCount, storageId]);

  useEffect(() => {
    if (!hydrated || !syncInitialized || typeof window === "undefined") return;

    const updatedAt = new Date().toISOString();
    const payload: PersistedLessonProgress = {
      version: 2,
      currentIndex,
      maxUnlocked,
      answers,
      updatedAt,
    };

    localUpdatedAtRef.current = updatedAt;

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
      window.localStorage.removeItem(legacyStorageKey);
    } catch {
      // Browsers can disable or limit localStorage; keep the lesson usable.
    }
  }, [
    answers,
    currentIndex,
    hydrated,
    legacyStorageKey,
    maxUnlocked,
    storageKey,
    syncInitialized,
  ]);

  useEffect(() => {
    if (!hydrated || !syncInitialized || !userId) return;

    const timeout = window.setTimeout(() => {
      setSyncing(true);
      void upsertCloudProgress(userId, storageId, {
        currentIndex,
        maxUnlocked,
        answers,
      })
        .catch((error) => {
          console.warn("[Learning progress] Cloud save failed", error);
        })
        .finally(() => setSyncing(false));
    }, CLOUD_WRITE_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [
    answers,
    currentIndex,
    hydrated,
    maxUnlocked,
    storageId,
    syncInitialized,
    userId,
  ]);

  const resetProgress = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setMaxUnlocked(0);
    localUpdatedAtRef.current = null;

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(storageKey);
        window.localStorage.removeItem(legacyStorageKey);
      } catch {
        // Ignore storage failures and still reset the in-memory lesson state.
      }
    }

    if (userId) {
      const table = (supabase as any).from("learning_progress");
      void table
        .delete()
        .eq("user_id", userId)
        .eq("research_line", CLOUD_RESEARCH_LINE)
        .eq("node_id", storageId)
        .then(({ error }: { error: unknown }) => {
          if (error) {
            console.warn("[Learning progress] Cloud reset failed", error);
          }
        });
    }
  }, [legacyStorageKey, storageId, storageKey, userId]);

  return {
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswers,
    maxUnlocked,
    setMaxUnlocked,
    hydrated,
    resetProgress,
    syncMode: userId ? ("account" as const) : ("device" as const),
    syncing,
  };
}

async function upsertCloudProgress(
  userId: string,
  storageId: string,
  state: ProgressState,
) {
  const table = (supabase as any).from("learning_progress");
  const { error } = await table.upsert(
    {
      user_id: userId,
      research_line: CLOUD_RESEARCH_LINE,
      node_id: storageId,
      status: "in_progress",
      progress_state: {
        version: 2,
        currentIndex: state.currentIndex,
        maxUnlocked: state.maxUnlocked,
        answers: state.answers,
      },
    },
    { onConflict: "user_id,research_line,node_id" },
  );

  if (error) throw error;
}

function sanitizeProgressState(value: unknown, itemCount: number): ProgressState {
  const record =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const lastIndex = Math.max(0, itemCount - 1);
  const restoredCurrent = clampIndex(record.currentIndex, lastIndex);
  const restoredUnlocked = Math.max(
    restoredCurrent,
    clampIndex(record.maxUnlocked, lastIndex),
  );

  return {
    currentIndex: restoredCurrent,
    maxUnlocked: restoredUnlocked,
    answers: sanitizeAnswers(record.answers, lastIndex),
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

function parseTimestamp(value: unknown) {
  if (typeof value !== "string") return 0;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}
