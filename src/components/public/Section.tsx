import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "white" | "muted" | "indigo";
}

export function Section({
  children,
  className,
  variant = "white",
  ...props
}: SectionProps) {
  const bgStyles = {
    white: "bg-bg text-text",
    muted: "bg-bg-muted text-text",
    indigo: "bg-primary text-white",
  };

  return (
    <section
      className={cn("py-16 md:py-24", bgStyles[variant], className)}
      {...props}
    >
      {children}
    </section>
  );
}
