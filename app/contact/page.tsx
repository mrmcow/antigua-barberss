import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - Antigua Barbers",
  description: "Get in touch with the Antigua Barbers team. List your shop, report an issue, or just say hello.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="pt-32 pb-24 px-4 sm:px-6 max-w-[1000px] mx-auto">
        
        <div className="text-center mb-16">
            <span className="text-[#CE1126] font-bold text-xs uppercase tracking-[0.25em] block mb-6">Get In Touch</span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-[#1a1a1a] mb-8">
                Let's <span className="text-[#FCD116] drop-shadow-sm text-shadow-black">Talk.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                Barber shop owner? Found an incorrect listing? Looking to partner? 
                We're here to help grow the community.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Barbers */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/5 border border-black/5 flex flex-col">
                <div className="mb-6">
                    <span className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        For Shop Owners
                    </span>
                </div>
                <h2 className="text-2xl font-black uppercase mb-4">Claim Your Shop</h2>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                    Want to update your photos, hours, or prices? We manage listings for free to help you get more clients.
                </p>
                <div className="mt-auto">
                    <a 
                        href="mailto:antiguabarbers@gmail.com?subject=Claiming My Shop" 
                        className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] text-white py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-xl"
                    >
                        <Mail className="w-4 h-4" /> Email Us
                    </a>
                </div>
            </div>

            {/* General Contact */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/5 border border-black/5 flex flex-col">
                <div className="mb-6">
                    <span className="bg-[#CE1126] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        General Inquiries
                    </span>
                </div>
                <h2 className="text-2xl font-black uppercase mb-4">Everything Else</h2>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                    Found a bug? Have a suggestion? Just want to say big up? We respond to every message.
                </p>
                <div className="mt-auto">
                    <a 
                        href="mailto:antiguabarbers@gmail.com?subject=General Inquiry" 
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-black/5 text-black py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-gray-50 transition-colors"
                    >
                        <Mail className="w-4 h-4" /> Send a Message
                    </a>
                </div>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
