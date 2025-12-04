export function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="animate-wave-drift" fill="white" d="M0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z" />
      </svg>
      <svg className="absolute w-full h-full opacity-[0.05] top-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="animate-wave-drift" style={{ animationDuration: '15s', animationDirection: 'reverse' }} fill="white" d="M0 50 Q 25 60 50 50 T 100 50 V 100 H 0 Z" />
      </svg>
      
      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float-slow"></div>
      <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-white/10 rounded-full animate-float-medium"></div>
      <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white/30 rounded-full animate-float-slow"></div>
    </div>
  );
}


