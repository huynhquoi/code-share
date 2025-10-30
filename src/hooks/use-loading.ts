import { useState, useCallback } from "react";

export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const startLoading = useCallback((key?: string) => {
    if (key) {
      setLoadingStates((prev) => ({ ...prev, [key]: true }));
    } else {
      setIsLoading(true);
    }
  }, []);

  const stopLoading = useCallback((key?: string) => {
    if (key) {
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    } else {
      setIsLoading(false);
    }
  }, []);

  const isLoadingKey = useCallback(
    (key: string) => loadingStates[key] || false,
    [loadingStates]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setLoadingStates({});
  }, []);

  return {
    isLoading,
    loadingStates,
    startLoading,
    stopLoading,
    isLoadingKey,
    reset,
  };
}
