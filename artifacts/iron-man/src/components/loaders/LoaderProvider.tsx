import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LOADER_CONFIG, type LoaderStatus } from "@/config/loader";

type LoaderContextValue = {
  isAppReady: boolean;
  isInitialBoot: boolean;
  isLoaderVisible: boolean;
  progress: number;
  status: LoaderStatus;
  startLoading: (reason?: string) => void;
  finishLoading: () => void;
  completeBootVideo: () => void;
  markLoadingReady: (source: string) => void;
  reportLoadingProgress: (source: string, progress: number) => void;
};

const LoaderContext = createContext<LoaderContextValue | null>(null);

function isHardRefresh() {
  try {
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    return navigation?.type === "reload";
  } catch {
    return false;
  }
}

function hasCompletedBoot() {
  try {
    return sessionStorage.getItem(LOADER_CONFIG.sessionStorageKey) === "1";
  } catch {
    return false;
  }
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isInitialBoot] = useState(
    () => isHardRefresh() || !hasCompletedBoot(),
  );
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoComplete, setVideoComplete] = useState(false);
  const [miniElapsed, setMiniElapsed] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [resourceProgress, setResourceProgress] = useState<Record<string, number>>(
    {},
  );
  const [readySources, setReadySources] = useState<Record<string, boolean>>({});
  const manualLoadingTimerRef = useRef<number | null>(null);

  const reportLoadingProgress = useCallback((source: string, progress: number) => {
    const nextProgress = Math.min(1, Math.max(0, progress));
    setResourceProgress((current) => {
      const previous = current[source];
      if (
        previous !== undefined &&
        nextProgress !== 0 &&
        nextProgress !== 1 &&
        Math.abs(previous - nextProgress) < 0.02
      ) {
        return current;
      }
      return { ...current, [source]: nextProgress };
    });
  }, []);

  const reportProgress = useCallback(
    (source: string, nextProgress: number) => {
      if (isInitialBoot && source === "boot-video") {
        setVideoProgress(nextProgress);
      }
      reportLoadingProgress(source, nextProgress);
    },
    [isInitialBoot, reportLoadingProgress],
  );

  const completeBoot = useCallback(() => {
    try {
      sessionStorage.setItem(LOADER_CONFIG.sessionStorageKey, "1");
    } catch {
      // The loader still completes when storage is unavailable.
    }
    setIsAppReady(true);
  }, []);

  const completeBootVideo = useCallback(() => {
    setVideoComplete(true);
    reportProgress("boot-video", 1);
  }, [reportProgress]);

  const markLoadingReady = useCallback((source: string) => {
    setReadySources((current) => {
      if (current[source]) return current;
      return { ...current, [source]: true };
    });
  }, []);

  const heroReady = Boolean(readySources["hero-frames"]);

  const resourceReady = LOADER_CONFIG.requiredResources.every(
    (source) => readySources[source],
  );

  useEffect(() => {
    if (isInitialBoot) return;
    const timer = window.setTimeout(
      () => setMiniElapsed(true),
      LOADER_CONFIG.miniDurationMs,
    );
    return () => window.clearTimeout(timer);
  }, [isInitialBoot]);

  useEffect(() => {
    if (isAppReady) return;
    const timer = window.setInterval(
      () => setStatusIndex((index) => (index + 1) % LOADER_CONFIG.statuses.length),
      LOADER_CONFIG.statusIntervalMs,
    );
    return () => window.clearInterval(timer);
  }, [isAppReady]);

  useEffect(() => {
    const canReveal = isInitialBoot
      ? videoComplete && heroReady
      : miniElapsed;
    if (canReveal) {
      const timer = window.setTimeout(
        completeBoot,
        isInitialBoot
          ? LOADER_CONFIG.revealDurationMs
          : LOADER_CONFIG.miniRevealDurationMs,
      );
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [
    completeBoot,
    heroReady,
    isInitialBoot,
    miniElapsed,
    videoComplete,
  ]);

  const startLoading = useCallback((reason?: string) => {
    void reason;
    if (manualLoadingTimerRef.current !== null) {
      window.clearTimeout(manualLoadingTimerRef.current);
    }
    manualLoadingTimerRef.current = window.setTimeout(
      () => setManualLoading(true),
      LOADER_CONFIG.delayedLoaderMs,
    );
  }, []);

  const finishLoading = useCallback(() => {
    if (manualLoadingTimerRef.current !== null) {
      window.clearTimeout(manualLoadingTimerRef.current);
      manualLoadingTimerRef.current = null;
    }
    setManualLoading(false);
  }, []);

  useEffect(
    () => () => {
      if (manualLoadingTimerRef.current !== null) {
        window.clearTimeout(manualLoadingTimerRef.current);
      }
    },
    [],
  );

  const progress = useMemo(() => {
    const values = Object.values(resourceProgress);
    const resources = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;
    return isInitialBoot
      ? Math.min(0.99, videoProgress * 0.72 + resources * 0.28)
      : Math.min(0.99, resources);
  }, [isInitialBoot, resourceProgress, videoProgress]);

  const value = useMemo<LoaderContextValue>(
    () => ({
      isAppReady,
      isInitialBoot,
      isLoaderVisible: !isAppReady || manualLoading,
      progress,
      status: LOADER_CONFIG.statuses[statusIndex],
      startLoading,
      finishLoading,
      completeBootVideo,
      markLoadingReady,
      reportLoadingProgress: reportProgress,
    }),
    [
      finishLoading,
      completeBootVideo,
      isAppReady,
      isInitialBoot,
      markLoadingReady,
      manualLoading,
      progress,
      reportProgress,
      startLoading,
      statusIndex,
    ],
  );

  return (
    <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used inside LoaderProvider");
  }
  return context;
}

export function useLoadingReporter(source: string) {
  const { reportLoadingProgress } = useLoader();
  return useCallback(
    (progress: number) => reportLoadingProgress(source, progress),
    [reportLoadingProgress, source],
  );
}

export function useLoadingReady(source: string) {
  const { markLoadingReady } = useLoader();
  return useCallback(() => markLoadingReady(source), [markLoadingReady, source]);
}

