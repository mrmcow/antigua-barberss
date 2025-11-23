import { ReactNode } from "react";
import { clsx } from "clsx";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

export function Card({ children, hover = true, className }: CardProps) {
  return (
    <div
      className={clsx(
        "border border-black bg-white overflow-hidden",
        {
          "transition-transform duration-150 hover:scale-[1.02]": hover,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

