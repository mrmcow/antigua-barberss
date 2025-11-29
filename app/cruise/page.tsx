import Link from "next/link";
import { MapPin, Ship, Clock, Star } from "lucide-react";
import { WaveBackground } from "@/components/WaveBackground";

export default function CruisePage() {
  return (
    <main className="min-h-screen bg-[#0ea5e9]">
      {/* Hero Section - Compact Mobile Design */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center gap-8 pt-20 pb-24 px-6 overflow-hidden supports-[min-height:100dvh]:min-h-[100dvh]">
        {/* Clean Caribbean Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0284c7] to-[#0ea5e9]"></div>
        
        {/* Animated Waves */}
        <WaveBackground />
        
        {/* Subtle Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 border-[3px] border-white/20 rounded-full"></div>
          <div className="absolute top-40 -left-10 w-32 h-32 border-[2px] border-white/10 rounded-full"></div>
        </div>

        {/* Top: Location Badge */}
        <div className="relative z-10 pt-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full flex items-center gap-2 shadow-xl">
            <div className="w-2 h-2 bg-[#FCD116] rounded-full animate-pulse"></div>
            <span className="text-white font-black uppercase tracking-widest text-[10px]">
              St. John's • Heritage Quay
            </span>
          </div>
        </div>

        {/* Center: Main Content */}
        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-[5.5rem] leading-[0.85] font-black uppercase tracking-tighter text-white drop-shadow-xl">
            Island<br />
            <span className="text-[#FCD116]">Fresh</span>
          </h1>
          
          <p className="text-white/90 font-medium text-lg max-w-[280px] mx-auto leading-snug">
            Professional cuts. Cruise schedule verified.
            <br/>
            <span className="text-white/60 text-sm mt-2 block font-normal">We embrace Island Time, but we keep it real with your schedule.</span>
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-4 pt-2">
            <div className="flex flex-col items-center px-3 py-2 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <Clock className="w-5 h-5 text-[#FCD116] mb-1" />
              <span className="text-[10px] font-bold text-white uppercase">2hr Buffer</span>
            </div>
            <div className="flex flex-col items-center px-3 py-2 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <MapPin className="w-5 h-5 text-[#FCD116] mb-1" />
              <span className="text-[10px] font-bold text-white uppercase">Near Port</span>
            </div>
            <div className="flex flex-col items-center px-3 py-2 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <Star className="w-5 h-5 text-[#FCD116] mb-1" />
              <span className="text-[10px] font-bold text-white uppercase">Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom: CTA */}
        <div className="relative z-10 w-full max-w-xs pb-8">
          <Link 
            href="/browse?cruise=true" 
            className="group relative block w-full"
          >
            <div className="absolute inset-0 bg-[#FCD116] rounded-full translate-y-1 transition-transform group-active:translate-y-0"></div>
            <div className="relative bg-white border-2 border-[#FCD116] text-black py-4 rounded-full font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 active:translate-y-1 transition-transform shadow-lg">
              <MapPin className="w-4 h-4" />
              Find Your Barber
            </div>
          </Link>
        </div>
      </section>

      {/* Distance-Based Options */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black uppercase text-[#1e3a8a] mb-6 tracking-tight">
              How Far From Port?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your adventure level based on time and distance from Heritage Quay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Walking Distance */}
            <div className="group relative bg-white p-12 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#25D366] to-[#1ebc57] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-black text-3xl">5-15</span>
                </div>
                <h3 className="text-3xl font-black uppercase mb-6 text-[#1e3a8a] group-hover:text-[#25D366] transition-colors">
                  Minute Walk
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Easy stroll from Heritage Quay. Perfect for a quick trim before exploring downtown St. John's.
                </p>
                <Link 
                  href="/browse?distance=walking" 
                  className="inline-block w-full py-5 bg-[#1e3a8a] text-white rounded-full font-bold uppercase tracking-wider hover:bg-[#25D366] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View Walking Distance
                </Link>
              </div>
            </div>

            {/* Short Taxi */}
            <div className="group relative bg-white p-12 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FCD116]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#FCD116] to-[#f59e0b] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-12 h-12 text-[#1e3a8a]" />
                </div>
                <h3 className="text-3xl font-black uppercase mb-6 text-[#1e3a8a] group-hover:text-[#f59e0b] transition-colors">
                  Quick Ride
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Short taxi to downtown St. John's. More shop options, same cruise-safe timing guarantee.
                </p>
                <Link 
                  href="/browse?distance=taxi" 
                  className="inline-block w-full py-5 bg-[#1e3a8a] text-white rounded-full font-bold uppercase tracking-wider hover:bg-[#FCD116] hover:text-[#1e3a8a] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View Downtown Shops
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cruise Guarantee */}
      <section className="py-32 px-6 bg-[#1e3a8a] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block p-12 bg-white/10 backdrop-blur border border-white/20 rounded-[3rem] mb-12">
            <Ship className="w-16 h-16 text-[#FCD116] mx-auto mb-8" />
            <h3 className="text-4xl font-black uppercase mb-8 text-white">
              Island Time Reality
            </h3>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Our barbers know cruise schedules and will do their best to get you back to Heritage Quay on time. 
              <strong className="text-[#FCD116]">Island time is real</strong> — plan accordingly!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="p-6">
              <Clock className="w-8 h-8 text-[#FCD116] mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">2-Hour Buffer</h4>
              <p className="text-white/70 text-sm">Recommended minimum time between cut and departure</p>
            </div>
            <div className="p-6">
              <MapPin className="w-8 h-8 text-[#FCD116] mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">Port Proximity</h4>
              <p className="text-white/70 text-sm">All locations verified for cruise passenger convenience</p>
            </div>
            <div className="p-6">
              <Star className="w-8 h-8 text-[#FCD116] mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">Ship Schedule Aware</h4>
              <p className="text-white/70 text-sm">Barbers trained on cruise timing and logistics</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}