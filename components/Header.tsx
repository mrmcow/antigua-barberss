"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu, X, Globe } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          router.push(`/browse?lat=${latitude}&lng=${longitude}&sort=distance`);
          setIsOpen(false);
        }, 
        (error) => {
          console.warn("Geolocation denied/error:", error.message);
          // Fallback to St. John's if denied/error
          if (error.code === 1) {
             alert("Location access blocked. Defaulting to St. John's (Heritage Quay). To use your real location, please reset browser permissions.");
          } else {
             alert("Location unavailable. Defaulting to St. John's (Heritage Quay).");
          }
          // Default to Heritage Quay coordinates
          router.push(`/browse?lat=17.1225&lng=-61.8445&sort=distance`);
          setIsOpen(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Showing barbers near St. John's.");
      router.push(`/browse?lat=17.1225&lng=-61.8445&sort=distance`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] px-2 sm:px-4 pt-2 sm:pt-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-2xl border border-black/5 shadow-[0_4px_20px_rgb(0,0,0,0.08)] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-full max-w-[1600px] mx-auto transition-all duration-300 pointer-events-auto">
            <Link href="/" className="flex-shrink-0 relative z-[100] pl-1">
            <Logo size="sm" />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
            <Link 
                href="/cruise" 
                className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-widest border border-black/5 bg-gray-50/50 px-5 py-2.5 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            >
                Cruise Info
            </Link>
            
            <button
                onClick={handleNearMe}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-50/50 border border-black/5 text-black font-bold uppercase tracking-widest text-[10px] hover:bg-[#0072C6] hover:text-white hover:border-[#0072C6] transition-all duration-300"
                title="Find Barbers Near Me"
            >
                <Globe className="w-3.5 h-3.5" />
                <span>Near Me</span>
            </button>

            <Link 
                href="/browse" 
                className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#CE1126] hover:scale-105 transition-all duration-300 shadow-lg shadow-black/10"
            >
                Find A Barber
            </Link>
            
            {/* Mobile Menu Trigger */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="sm:hidden p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all active:scale-95 relative z-[102] cursor-pointer touch-manipulation"
                aria-label="Toggle menu"
                type="button"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] bg-white flex flex-col justify-center px-6 transition-all duration-300 ease-in-out sm:hidden ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="space-y-2">
            <button 
                onClick={handleNearMe}
                className="w-full py-3 bg-gray-100 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest hover:bg-[#0072C6] hover:text-white transition-all mb-6"
            >
                <Globe className="w-4 h-4" /> Find Near Me
            </button>

            <nav className="space-y-1">
                <Link href="/browse" className="block py-3 text-2xl font-black uppercase tracking-tight hover:text-[#CE1126] transition-colors border-b border-gray-100">
                    Find A Barber
                </Link>
                <Link href="/cruise" className="block py-3 text-2xl font-black uppercase tracking-tight hover:text-[#0072C6] transition-colors border-b border-gray-100">
                    Cruise Info
                </Link>
                <Link href="/blog" className="block py-3 text-2xl font-black uppercase tracking-tight hover:text-[#CE1126] transition-colors border-b border-gray-100">
                    Blog
                </Link>
                <Link href="/about" className="block py-3 text-2xl font-black uppercase tracking-tight hover:text-[#FCD116] transition-colors border-b border-gray-100">
                    About
                </Link>
            </nav>
            
            <div className="pt-6 flex flex-col gap-3">
                <Link href="/join" className="flex items-center justify-between w-full py-3 px-4 border border-black/10 rounded-xl text-xs font-bold uppercase tracking-widest group">
                    <span>For Barbers</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="mailto:hello@antiguabarbers.com" className="block text-center text-xs text-gray-400 font-medium pt-2">
                    hello@antiguabarbers.com
                </a>
            </div>
        </div>
      </div>
    </>
  );
}