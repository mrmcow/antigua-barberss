import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles - brutal and simple
        "inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        
        // Variants
        {
          // Primary - black fill
          "bg-black text-white hover:bg-la-orange": variant === "primary",
          
          // Secondary - white fill with border
          "bg-white text-black border-2 border-black hover:bg-black hover:text-white": variant === "secondary",
          
          // Outline - transparent with border
          "bg-transparent text-black border-2 border-black hover:bg-black hover:text-white": variant === "outline",
          
          // Ghost - no border, just text
          "bg-transparent text-black hover:text-la-orange": variant === "ghost",
        },
        
        // Sizes
        {
          "px-4 py-2 text-xs": size === "sm",
          "px-6 py-3 text-sm": size === "md",
          "px-8 py-4 text-base": size === "lg",
        },
        
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}

