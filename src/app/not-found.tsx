import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
        404 Error
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-text mb-4">
        Page Not Found
      </h1>
      <p className="text-text-muted text-base max-w-md mb-8 leading-relaxed">
        Sorry, the page you are looking for doesn&apos;t exist, has been removed, or was moved to another section.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-6 py-3 font-semibold text-sm transition shadow-sm"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </Link>
        <Link
          href="/how-it-works"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white hover:bg-bg-muted text-text px-6 py-3 font-semibold text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> How It Works
        </Link>
      </div>
    </main>
  );
}
