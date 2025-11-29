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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-b-[1.5rem] sm:rounded-b-[2rem] shadow-sm transition-all">
        <Link href="/" className="flex-shrink-0 relative z-50">
          <Logo size="sm" />
        </Link>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/cruise" 
            className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest border border-black/10 px-5 py-2.5 rounded-full hover:bg-black hover:text-white transition-all hover:shadow-md"
          >
            Cruise Info
          </Link>
          
          <button
            onClick={handleNearMe}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-black font-bold uppercase tracking-widest text-xs hover:bg-[#0072C6] hover:text-white transition-all shadow-sm hover:shadow-md"
            title="Find Barbers Near Me"
          >
            <Globe className="w-4 h-4" />
            <span>Near Me</span>
          </button>

          <Link 
            href="/browse" 
            className="hidden sm:flex items-center gap-2 bg-[#CE1126] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-md hover:shadow-red-500/30"
          >
            Find A Barber <ArrowRight className="w-3 h-3" />
          </Link>
          
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden p-2 text-black/80 hover:bg-gray-100 rounded-full transition-colors relative z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-white flex flex-col justify-center px-8 transition-all duration-300 ease-in-out sm:hidden ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="space-y-6 text-center">
            <button 
                onClick={handleNearMe}
                className="w-full py-4 bg-gray-100 rounded-2xl flex items-center justify-center gap-2 text-lg font-black uppercase tracking-tight hover:bg-[#0072C6] hover:text-white transition-all"
            >
                <Globe className="w-5 h-5" /> Find Near Me
            </button>

            <Link href="/browse" className="block text-3xl font-black uppercase tracking-tight hover:text-[#CE1126] transition-colors">
                Find A Barber
            </Link>
            <Link href="/cruise" className="block text-3xl font-black uppercase tracking-tight hover:text-[#0072C6] transition-colors">
                Cruise Info
            </Link>
            <Link href="/about" className="block text-3xl font-black uppercase tracking-tight hover:text-[#FCD116] transition-colors">
                About
            </Link>
            
            <div className="pt-8 flex flex-col gap-4">
                <Link href="/join" className="block w-full py-4 border border-black/10 rounded-full text-sm font-bold uppercase tracking-widest">
                    For Barbers
                </Link>
                <a href="mailto:hello@antiguabarbers.com" className="block text-sm text-gray-500 font-medium">
                    hello@antiguabarbers.com
                </a>
            </div>
        </div>
      </div>
    </>
  );
}