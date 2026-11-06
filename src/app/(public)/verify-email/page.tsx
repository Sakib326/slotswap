"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/public/Container";
import { CheckCircle2, AlertCircle, Clock, ArrowRight, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "success";

  if (status === "success") {
    return (
      <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-8 sm:p-10 shadow-sm text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#C2E4CE] border border-[#1D5B4A]/30 text-xs font-semibold text-[#1D5B4A]">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Email verified</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F] tracking-tight">
            Account verified successfully
          </h1>
          <p className="text-sm text-[#16231F]/70 leading-relaxed">
            Your university email address has been confirmed. Your account is now fully active and ready for section swapping.
          </p>
        </div>

        <div className="p-4 rounded-[8px] bg-[#F4F6F3] border border-[#16231F]/10 space-y-1.5">
          <p className="text-xs font-bold text-[#16231F]">What happens next?</p>
          <ul className="text-xs text-[#16231F]/70 space-y-1 list-disc list-inside">
            <li>Log in with your university credentials.</li>
            <li>Review your current enrolled weekly routine.</li>
            <li>Create section swap requests or accept matching multi-way chains.</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
          >
            <span>Proceed to sign in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-[8px] border border-[#16231F]/15 bg-white hover:bg-[#16231F]/5 text-[#16231F] text-xs font-semibold transition"
          >
            How swapping works
          </Link>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-8 sm:p-10 shadow-sm text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#F5E39B] border border-[#16231F]/20 text-xs font-semibold text-[#16231F]">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Link expired</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F] tracking-tight">
            Verification link has expired
          </h1>
          <p className="text-sm text-[#16231F]/70 leading-relaxed">
            Verification security links are valid for 24 hours. Because this link has expired, you can request a fresh verification link to activate your account.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
          >
            <span>Go to login</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-[8px] border border-[#16231F]/15 bg-white hover:bg-[#16231F]/5 text-[#16231F] text-xs font-semibold transition"
          >
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  // Default: invalid or malformed token
  return (
    <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-8 sm:p-10 shadow-sm text-left space-y-6">
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[#F2C4C4] border border-[#D9381E]/30 text-xs font-semibold text-[#D9381E]">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Invalid token</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#16231F] tracking-tight">
          Invalid verification link
        </h1>
        <p className="text-sm text-[#16231F]/70 leading-relaxed">
          The verification link you followed is invalid, has already been used, or was malformed.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#1D5B4A] hover:bg-[#164639] text-white text-xs font-semibold transition"
        >
          <span>Return to login</span>
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-[8px] border border-[#16231F]/15 bg-white hover:bg-[#16231F]/5 text-[#16231F] text-xs font-semibold transition"
        >
          Register new account
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-[80vh] flex flex-col justify-center py-12 md:py-20 bg-[#F4F6F3] text-[#16231F]">
      <Container>
        <div className="max-w-lg mx-auto">
          <Suspense
            fallback={
              <div className="bg-white border border-[#16231F]/15 rounded-[12px] p-8 text-center text-xs text-[#16231F]/60">
                Verifying your email...
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
