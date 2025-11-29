import Link from "next/link";
import { Check, MessageCircle, Mail, ArrowRight, Ship, Search, BadgeCheck } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-black selection:bg-[#CE1126] selection:text-white">
      {/* Full Screen Hero with Grain */}
      <main className="relative pt-32 pb-24 px-4 sm:px-6 min-h-screen flex flex-col justify-center">
        
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

        <div className="max-w-[1200px] mx-auto w-full relative z-10">
            
            {/* Header Badge */}
            <div className="mb-12 flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full">
                    <div className="flex gap-1">
                        <div className="w-1 h-4 bg-[#CE1126]"></div>
                        <div className="w-1 h-4 bg-[#FCD116]"></div>
                        <div className="w-1 h-4 bg-[#0072C6]"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
                        For Barbers & Shops
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left: Impact Text */}
                <div>
                    <h1 className="text-7xl sm:text-9xl font-black uppercase tracking-tighter text-white leading-[0.8] mb-10 mix-blend-screen">
                        Get<br/>Listed.
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-400 max-w-md leading-relaxed font-medium tracking-wide">
                        Join Antigua's official barber directory. 
                        <span className="text-white block mt-2">Connect with cruise passengers, tourists, and locals looking for their next cut.</span>
                    </p>
                </div>

                {/* Right: Action Cards */}
                <div className="space-y-4 pt-4">
                    {/* Primary WhatsApp Action - Compact */}
                    <a 
                        href="https://wa.me/12687797231?text=Hi%20Antigua%20Barbers,%20I%20want%20to%20list%20my%20shop" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between bg-[#25D366] text-white px-8 py-6 rounded-[2rem] hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-[#25D366]/20"
                    >
                        <div className="flex items-center gap-4">
                            <MessageCircle className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight leading-none">WhatsApp Us</h2>
                                <p className="text-white/80 font-medium text-xs uppercase tracking-wider">Instant Response</p>
                            </div>
                        </div>
                        <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </a>

                    {/* Secondary Actions Grid - Compact */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="group flex flex-col bg-white text-black p-6 rounded-[2rem] hover:bg-gray-100 transition-all duration-300 h-full cursor-not-allowed opacity-70">
                            <div className="flex justify-between items-start mb-2">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-1">Email</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Coming Soon</p>
                        </div>

                        <div className="p-6 rounded-[2rem] border border-white/10 flex flex-col justify-center bg-white/5">
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Why Join?</span>
                            <span className="text-white text-sm font-bold uppercase tracking-wide leading-relaxed">
                                Cruise Traffic<br/>
                                Google SEO<br/>
                                Verified Badge
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
