import { cn } from "@/lib/utils";

interface StepCardProps {
  number: number | string;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({
  number,
  title,
  description,
  className,
}: StepCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col relative text-left",
        className
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent font-bold font-heading text-lg flex items-center justify-center mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold font-heading text-text mb-2">
        {title}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
