import type { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Antigua Barbers — The Island's Official Directory",
  description: "Connecting locals and visitors with the best barbers in Antigua. From St. John's to English Harbour, we verify every shop.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="pt-32 pb-24 px-4 sm:px-6 max-w-[1000px] mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <span className="text-[#CE1126] font-bold text-xs uppercase tracking-[0.25em] block mb-6">Our Mission</span>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-[#1a1a1a] mb-8">
            Respect The <br className="hidden sm:block" /> <span className="text-[#0072C6]">Craft.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            We built Antigua Barbers to solve a simple problem: finding a reliable cut on the island shouldn't be a gamble. 
            Whether you're a local, an expat, or just off the cruise ship, we connect you with the masters of the trade.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
            <div className="w-12 h-12 bg-[#FCD116]/20 rounded-full flex items-center justify-center mb-6 text-2xl">🇦🇬</div>
            <h3 className="text-xl font-black uppercase mb-3">100% Antiguan</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Built in St. John's, for the island. We know the difference between a tourist trap and a proper local shop.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
            <div className="w-12 h-12 bg-[#0072C6]/10 rounded-full flex items-center justify-center mb-6 text-2xl">✨</div>
            <h3 className="text-xl font-black uppercase mb-3">Verified Quality</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              We don't just list anyone. We verify shops, check reviews, and ensure they meet the standard.
            </p>
              </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
            <div className="w-12 h-12 bg-[#CE1126]/10 rounded-full flex items-center justify-center mb-6 text-2xl">🚢</div>
            <h3 className="text-xl font-black uppercase mb-3">Visitor Friendly</h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Clear pricing, map locations, and transport info helps visitors navigate the local scene with confidence.
            </p>
            </div>
        </div>

        {/* Story Section */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8">The Story</h2>
          <p className="text-gray-600 font-medium leading-loose mb-8">
            Antigua has a rich culture of grooming and style. The barbershop isn't just a place for a haircut; it's a community hub, a debating society, and a cornerstone of island life. But for years, finding these gems online was nearly impossible. outdated Facebook pages, broken numbers, and zero pricing info.
          </p>
          <p className="text-gray-600 font-medium leading-loose">
            We changed that. We mapped the island, verified the shops, and built a platform that respects the culture while bringing it into the digital age.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
