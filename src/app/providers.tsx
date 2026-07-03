"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * App-wide client providers.
 *
 * The QueryClient is created inside useState (not at module scope) so
 * each component instance gets its own client — this avoids sharing
 * cached data across separate requests/users in server-rendered
 * environments, and avoids issues with React strict-mode double
 * invocation recreating a module-level singleton unexpectedly.
 */
export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0f172a",
            color: "#f1f5f9",
            border: "1px solid #1e293b",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: {
              primary: "#34d399",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#0f172a",
            },
          },
        }}
      />

      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}