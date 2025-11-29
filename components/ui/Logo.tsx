import React from 'react';

export function Logo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const heightClass = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  }[size];

  const textSizeClass = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  }[size];

  const subTextSizeClass = {
    sm: "text-[0.5rem]",
    md: "text-[0.65rem]",
    lg: "text-xs"
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className} group select-none`}>
      {/* The Island Icon - Geometric Flag Abstraction */}
      <div className={`${heightClass} aspect-[1/1] relative bg-flag-red border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}>
        {/* The V-Shape Container */}
        <div 
          className="absolute inset-0 bg-transparent"
          style={{ 
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backgroundColor: "black"
          }}
        >
          {/* Top Black Section (Background for Sun) is implicit from container bg */}
          
          {/* Rising Sun - 7 Points */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[50%] h-[35%] bg-flag-gold"
               style={{ 
                 clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" 
               }}>
          </div>

          {/* Blue Band */}
          <div className="absolute top-[50%] left-0 w-full h-[25%] bg-flag-blue"></div>
          
          {/* White Band */}
          <div className="absolute top-[75%] left-0 w-full h-[25%] bg-white"></div>
        </div>
      </div>
      
      {/* Wordmark */}
      <div className="flex flex-col leading-[0.85] justify-center">
        <span className={`${textSizeClass} font-black text-black uppercase tracking-tighter`}>
          ANTIGUA
        </span>
        <span className={`${subTextSizeClass} font-bold text-flag-red uppercase tracking-[0.3em]`}>
          BARBERS
        </span>
      </div>
    </div>
  );
}