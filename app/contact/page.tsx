import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - Antigua Barbers",
  description: "Get in touch with the Antigua Barbers team. List your shop, report an issue, or just say hello.",
};

export default function ContactPage() {
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
                        Get In Touch
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left: Impact Text */}
                <div>
                    <h1 className="text-7xl sm:text-9xl font-black uppercase tracking-tighter text-white leading-[0.8] mb-10 mix-blend-screen">
                        Let's<br/>Talk.
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-400 max-w-md leading-relaxed font-medium tracking-wide">
                        Barber shop owner? Found an incorrect listing? Looking to partner? 
                        <span className="text-white block mt-2">We're here to help grow the culture.</span>
                    </p>
                </div>

                {/* Right: Action Cards */}
                <div className="space-y-6 pt-4">
                    {/* Primary Email Action */}
                    <a 
                        href="mailto:hello@antiguabarbers.com" 
                        className="group block bg-white text-black p-10 rounded-[2.5rem] hover:scale-[1.02] transition-all duration-500 shadow-2xl shadow-white/5"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <Mail className="w-8 h-8" />
                            <ArrowRight className="w-8 h-8 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Email Us</h2>
                        <p className="text-gray-500 font-medium text-lg mb-8">hello@antiguabarbers.com</p>
                        <span className="inline-block px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest group-hover:bg-[#CE1126] transition-colors">
                            Send Message
                        </span>
                    </a>

                    {/* Secondary Actions Grid */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <a 
                            href="https://wa.me/12680000000" 
                            target="_blank"
                            className="group block bg-[#1a1a1a] border border-white/10 p-8 rounded-[2rem] hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300"
                        >
                            <MessageCircle className="w-6 h-6 text-white mb-4" />
                            <h3 className="text-white text-lg font-black uppercase tracking-wide mb-1">WhatsApp</h3>
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest group-hover:text-white/90">Chat Now</span>
                        </a>

                        <div className="p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Based In</span>
                            <span className="text-white text-xl font-black uppercase tracking-wide">St. John's,<br/>Antigua</span>
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
