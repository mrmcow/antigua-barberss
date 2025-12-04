import React from 'react';

export function Logo({
  className = "",
  size = "md",
  theme = "light",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
}) {
  const heightClass = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  }[size];

  const textSize = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }[size];

  const textColor = theme === "dark" ? "text-white" : "text-black";
  const subTextColor = theme === "dark" ? "text-white/60" : "text-black/60";
  
  return (
    <div className={`flex items-center gap-3 ${className} select-none`}>
      {/* Official Flag Graphic */}
      <div className={`${heightClass} aspect-[3/2] relative shadow-sm`}>
        <div className="absolute inset-0 bg-white">
           <svg viewBox="0 0 30 20" className="w-full h-full">
             <rect width="30" height="20" fill="#CE1126"/>
             <path d="M0 0 L15 20 L30 0 Z" fill="#000000"/>
             <path d="M6 8 L15 20 L24 8 Z" fill="#0072C6"/>
             <path d="M9 12 L15 20 L21 12 Z" fill="#FFFFFF"/>
             {/* Sun */}
             <path d="M10.5 8 L12 5 L13.5 8 L15 4 L16.5 8 L18 5 L19.5 8 Z" fill="#FCD116"/>
           </svg>
        </div>
      </div>
      
      <div className="flex flex-col justify-center leading-none">
        <h1 className={`${textSize} font-black uppercase tracking-tighter ${textColor}`}>
          Antigua<span className="text-[#CE1126]">Barbers</span>
        </h1>
        <span className="text-[0.6em] font-bold uppercase tracking-[0.35em] ${subTextColor}">
          Official Directory
        </span>
      </div>
    </div>
  );
}
