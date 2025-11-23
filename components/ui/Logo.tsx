export function Logo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 md:h-7",
    md: "h-8 md:h-10",
    lg: "h-12 md:h-16"
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* LA Badge */}
      <div className={`${sizeClasses[size]} aspect-square bg-black text-white flex items-center justify-center border-2 border-black relative`}>
        <span className="font-bold text-[0.6em] leading-none">LA</span>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-la-orange"></div>
      </div>
      
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="font-bold uppercase tracking-tighter text-[1.1em]">BARBER</span>
        <span className="font-bold uppercase tracking-tighter text-[1.1em]">GUIDE</span>
      </div>
    </div>
  );
}

