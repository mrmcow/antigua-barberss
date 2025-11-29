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
                <div className="space-y-6 pt-4">
                    {/* Primary WhatsApp Action */}
                    <a 
                        href="https://wa.me/12687797231?text=Hi%20Antigua%20Barbers,%20I%20want%20to%20list%20my%20shop" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-[#25D366] text-white p-10 rounded-[2.5rem] hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-[#25D366]/20"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <MessageCircle className="w-8 h-8" />
                            <ArrowRight className="w-8 h-8 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">WhatsApp Us</h2>
                        <p className="text-white/90 font-bold text-lg mb-8">Fastest way to get listed.</p>
                        <span className="inline-block px-4 py-2 bg-black/20 backdrop-blur text-white rounded-full text-xs font-bold uppercase tracking-widest group-hover:bg-black/40 transition-colors">
                            Start Chat
                        </span>
                    </a>

                    {/* Secondary Actions Grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <a 
                            href="mailto:antiguabarbers@gmail.com?subject=List%20My%20Shop"
                            className="group block bg-white text-black p-8 rounded-[2rem] hover:bg-gray-100 transition-all duration-300"
                        >
                            <Mail className="w-6 h-6 mb-4" />
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-1">Email</h3>
                            <p className="text-sm font-medium text-gray-500 mb-2">antiguabarbers@gmail.com</p>
                            <span className="text-black text-xs font-bold uppercase tracking-widest border-b-2 border-black">Send Details</span>
                        </a>

                        <div className="p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center bg-white/5">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Why Join?</span>
                            <span className="text-white text-lg font-black uppercase tracking-wide">
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
