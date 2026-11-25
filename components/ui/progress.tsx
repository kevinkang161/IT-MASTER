import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorColor?: string;
}

export function Progress({
  value,
  className,
  indicatorColor = "bg-blue-600 dark:bg-blue-500",
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)]",
        className
      )}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 rounded-full", indicatorColor)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
