import { ReactNode } from "react";
import { clsx } from "clsx";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 text-xs uppercase tracking-wider font-medium",
        {
          "bg-black text-white": variant === "default",
          "bg-la-orange text-white": variant === "accent",
          "bg-white text-black border border-black": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

