"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level error boundary. Next.js renders this in place of the
 * segment that threw, for any error not already caught and handled
 * locally (e.g. by a React Query error state).
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Centralized place to hook up error reporting (Sentry, etc.) later.
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[60vh] w-full items-center justify-center p-4"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
        </div>

        <h1 className="text-lg font-semibold text-slate-100">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          An unexpected error occurred while loading this page. You can try
          again, and if the problem continues, let your administrator know.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-slate-600">
            Reference: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          autoFocus
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}