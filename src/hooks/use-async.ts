import { useState, useCallback } from "react";
import { showErrorToast, showSuccessToast } from "@/lib/error-handler";

interface UseAsyncOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useAsync<T = unknown>(options: UseAsyncOptions = {}) {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showSuccessToast: showSuccess = false,
    showErrorToast: showError = true,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (asyncFunction: () => Promise<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFunction();
        setData(result);

        if (showSuccess && successMessage) {
          showSuccessToast(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        if (showError) {
          showErrorToast(error, errorMessage);
        }

        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError, successMessage, errorMessage, showSuccess, showError]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}
