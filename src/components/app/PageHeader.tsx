import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#16231F]/15 gap-4 text-left">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-[#16231F] tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-[#16231F]/70 mt-0.5 max-w-[70ch]">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
