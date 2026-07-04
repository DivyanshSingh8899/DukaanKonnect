import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useState } from "react";

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Dialog defaultOpen>
          <DialogContent className="bg-red-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Something went wrong</DialogTitle>
            </DialogHeader>
            An unexpected error occurred. Please reload the page.
            <DialogFooter>
              <Button onClick={() => window.location.reload()}>
                Reload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    return this.props.children;
  }
}

export function InstrumentationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error(event);
      setError(event.message);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error(event);
      setError(event.reason?.message ?? "Unhandled promise rejection");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return (
    <>
      <ErrorBoundary>{children}</ErrorBoundary>
      {error && (
        <Dialog defaultOpen onOpenChange={() => setError(null)}>
          <DialogContent className="bg-red-700 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle>Runtime Error</DialogTitle>
            </DialogHeader>
            {error}
            <DialogFooter>
              <Button onClick={() => setError(null)}>Dismiss</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
