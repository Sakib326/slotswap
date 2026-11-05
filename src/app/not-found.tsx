import Link from "next/link";
import { Container } from "@/components/public/Container";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col justify-center py-16 bg-[#F4F6F3] text-[#16231F] text-left">
      <Container>
        <div className="max-w-xl">
          {/* Routine slot badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#F2C4C4] border border-[#D9381E]/30 text-xs font-semibold text-[#16231F] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D9381E]" />
            <span>Unscheduled Slot · 404</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#16231F] leading-[1.05] tracking-tight mb-4">
            Section not found
          </h1>

          <p className="text-base sm:text-lg text-[#16231F]/80 leading-relaxed mb-8">
            The page you requested doesn&apos;t exist in the current routine or has been moved to another slot.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-[#F4F6F3] px-6 py-3 font-semibold text-sm transition shadow-sm"
            >
              Return to homepage
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-[8px] border border-[#16231F]/20 bg-[#F4F6F3] hover:bg-[#16231F]/5 text-[#16231F] px-5 py-3 font-semibold text-sm transition"
            >
              See how a swap works
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
