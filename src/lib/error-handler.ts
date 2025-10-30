import { toast } from "sonner";
import { ZodError } from "zod";

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: unknown;
}

export function parseError(error: unknown): ApiError {
  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return {
      message: firstError.message,
      field: firstError.path.join("."),
      code: "VALIDATION_ERROR",
    };
  }

  if (error instanceof Response) {
    return {
      message: error.statusText || "An error occurred",
      code: `HTTP_${error.status}`,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  return {
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    details: error,
  };
}

export function showErrorToast(error: unknown, fallbackMessage?: string) {
  const parsedError = parseError(error);
  toast.error(fallbackMessage || parsedError.message);
  
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
  }
}

export function showSuccessToast(message: string) {
  toast.success(message);
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    
    throw new Error(error.message || error.error || "API request failed");
  }

  return response.json();
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
}