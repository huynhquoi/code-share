import { Spinner } from "@/components/custom-ui/spinner";

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" className="mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function SectionLoader({ message }: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-2" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
