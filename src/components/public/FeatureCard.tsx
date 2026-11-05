import React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col gap-4 text-left",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold font-heading text-text mb-2">
          {title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
