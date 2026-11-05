import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("max-w-6xl mx-auto px-4 sm:px-6 w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}
