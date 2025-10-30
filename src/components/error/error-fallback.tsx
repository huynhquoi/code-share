// src/components/error/error-fallback.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorFallbackProps {
  error: Error | null;
  reset?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  message,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>{message || error?.message || "An unexpected error occurred"}</p>

          {process.env.NODE_ENV === "development" && error?.stack && (
            <pre className="mt-2 text-xs overflow-auto max-h-32 rounded bg-destructive/10 p-2">
              {error.stack}
            </pre>
          )}

          <div className="flex gap-2">
            {reset && (
              <Button onClick={reset} variant="outline" size="sm">
                Try again
              </Button>
            )}
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              Reload page
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function InlineError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
