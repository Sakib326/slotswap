"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-danger-soft text-danger flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-danger mb-2">
        Application Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text mb-4">
        Something went wrong
      </h1>
      <p className="text-text-muted text-base max-w-md mb-8 leading-relaxed">
        An unexpected error occurred while loading this page. Our team has been notified.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-6 py-3 font-semibold text-sm transition shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white hover:bg-bg-muted text-text px-6 py-3 font-semibold text-sm transition"
        >
          <Home className="w-4 h-4" /> Return home
        </Link>
      </div>
    </main>
  );
}
