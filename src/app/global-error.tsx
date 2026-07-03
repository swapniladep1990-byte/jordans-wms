"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import "./globals.css";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Top-level error boundary for errors thrown in the root layout itself
 * (where the regular error.tsx boundary can't catch, since it renders
 * inside the layout). Next.js requires this file to render its own
 * complete <html> and <body> since the root layout is unavailable.
 */
export default function GlobalError({ error, reset }: GlobalErrorPageProps) {
  useEffect(() => {
    // Centralized place to hook up error reporting (Sentry, etc.) later.
    console.error("[global error boundary]", error);
  }, [error]);

  function handleReload() {
    reset();
    window.location.reload();
  }

  return (
    <html lang="en">
      <body>
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            background: "#020617",
            color: "white",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "28rem",
              borderRadius: "0.75rem",
              border: "1px solid #1e293b",
              backgroundColor: "#0f172a",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                margin: "0 auto 1rem",
                display: "flex",
                height: "3rem",
                width: "3rem",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              }}
            >
              <AlertTriangle
                aria-hidden="true"
                color="#f87171"
                width={24}
                height={24}
              />
            </div>

            <h1 style={{ fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>
              The application failed to load
            </h1>

            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "#94a3b8",
              }}
            >
              A critical error occurred and Jordans WMS could not start.
              Reloading the application usually resolves this. If it keeps
              happening, please contact your administrator.
            </p>

            {error.digest && (
              <p
                style={{
                  marginTop: "0.75rem",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#475569",
                }}
              >
                Reference: {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={handleReload}
              autoFocus
              style={{
                marginTop: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "#6366f1",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "0.5rem 1rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <RotateCw aria-hidden="true" width={16} height={16} />
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}