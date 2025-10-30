// src/components/ui/loading-button.tsx
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

// Kế thừa props của Button đúng chuẩn
export type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    { children, isLoading, loadingText, disabled, className, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
