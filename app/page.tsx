import Link from "next/link";
import { ArrowRight, MapPin, Star, Phone, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/Footer";

// Types
interface Barbershop {
  id: string;
  name: string;
  neighborhood: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  images: string[];
  google_maps_url: string | null;
}

// Data Fetching
async function getHomeData() {
  const { count } = await supabase
    .from("barbershops")
    .select("*", { count: "exact", head: true });

  // Fetch Top Rated Barbers
  const { data: featuredBarbers } = await supabase
    .from("barbershops")
    .select("id, name, neighborhood, rating, review_count, price_range, images, google_maps_url")
    .not("images", "is", null)
    .gte("rating", 4.7) // High quality threshold
    .order("review_count", { ascending: false })
    .limit(8);

  return {
    barberCount: count || 120,
    featuredBarbers: featuredBarbers || [],
  };
}

export default async function Home() {
  const { barberCount, featuredBarbers } = await getHomeData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Antigua Barbers",
    "url": "https://antiguabarbers.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://antiguabarbers.com/browse?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="selection:bg-[#FCD116]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-black overflow-hidden">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop" 
                alt="Antiguan Barber Shop Culture" 
                className="w-full h-full object-cover opacity-70 scale-105 animate-slow-zoom"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
         </div>

         <div className="relative z-10 max-w-[1600px] mx-auto w-full text-center">
             {/* Badge */}
             <div className="inline-flex items-center gap-3 mb-8 border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full animate-fade-in-up">
                <div className="flex gap-1">
                    <div className="w-1 h-4 bg-black"></div>
                    <div className="w-1 h-4 bg-[#CE1126]"></div>
                    <div className="w-1 h-4 bg-[#FCD116]"></div>
                    <div className="w-1 h-4 bg-[#0072C6]"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    Official Island Directory
                </span>
             </div>

            {/* Headline */}
            <h1 className="text-6xl sm:text-8xl xl:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter mb-8 text-white animate-fade-in-up delay-100">
                Your Chair<br/>Awaits.
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium tracking-wide animate-fade-in-up delay-200">
                Antigua's official guide to professional grooming. 
                <span className="hidden sm:inline"> Find trusted barbers, check cruise schedules, and book your next cut.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
                <Link href="/browse" className="bg-[#CE1126] text-white px-10 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-600/20 flex items-center gap-3">
                    Find A Barber <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-wider px-6">
                    <span className="text-white">{barberCount}+</span> Verified Shops
                </div>
            </div>
         </div>
      </section>

      {/* ISLAND FAVORITES GRID */}
      <section className="py-24 px-4 sm:px-8 bg-white rounded-t-[4rem] -mt-12 relative z-10 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1600px] mx-auto">
            <div className="flex items-end justify-between mb-16 px-2">
                <div>
                    <span className="text-[#CE1126] font-bold text-xs uppercase tracking-[0.25em] block mb-4">Curated Selection</span>
                    <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#1a1a1a]">Island Favorites</h2>
                </div>
                <Link href="/browse" className="hidden sm:flex items-center gap-3 text-xs font-bold uppercase tracking-widest bg-gray-100 px-6 py-3 rounded-full hover:bg-[#CE1126] hover:text-white transition-all">
                    View All Shops <ArrowRight className="w-3 h-3" />
              </Link>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBarbers.map((barber) => (
                    <Link key={barber.id} href={`/barbers/${barber.id}`} className="group block">
                        {/* Image Card */}
                        <div className="relative aspect-[4/5] bg-gray-100 mb-6 overflow-hidden rounded-[2rem] shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                             {barber.images?.[0] ? (
                                <img src={barber.images[0]} alt={barber.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                    <span className="font-black text-4xl opacity-20">AB</span>
                                </div>
                             )}
                             
                    {/* Rating Badge */}
                    {barber.rating && (
                                 <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5">
                                     <Star className="w-3.5 h-3.5 fill-[#FCD116] text-[#FCD116]" />
                                     <span className="text-xs font-bold text-black">{barber.rating.toFixed(1)}</span>
                      </div>
                    )}

                             {/* Neighborhood Tag */}
                             <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                {barber.neighborhood || "St. John's"}
                             </div>
                  </div>

                        {/* Text Info */}
                        <div className="px-2">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-black uppercase leading-none group-hover:text-[#CE1126] transition-colors">{barber.name}</h3>
                                <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                    {barber.price_range || "$$"}
                                </span>
                      </div>
                            <p className="text-sm text-gray-500 font-medium">{barber.review_count} verified reviews</p>
                </div>
              </Link>
            ))}
          </div>

            <div className="mt-16 text-center sm:hidden">
                 <Link href="/browse" className="inline-block bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider w-full shadow-xl">
                    Browse All Shops
            </Link>
          </div>
        </div>
      </section>

      {/* NEIGHBORHOODS - Pill Layout */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-white rounded-t-[4rem] -mt-12 relative z-0">
         <div className="max-w-4xl mx-auto text-center">
            <span className="text-[#FCD116] font-bold text-xs uppercase tracking-[0.3em] block mb-8">Explore By Area</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase mb-16 leading-tight">Where are you staying?</h2>
            
            <div className="flex flex-wrap justify-center gap-4">
                {["St. John's", "English Harbour", "Jolly Harbour", "All Saints", "Dickenson Bay", "Liberta", "Old Road", "Crosbies"].map((hood) => (
                    <Link key={hood} href={`/browse?q=${hood}`} className="px-8 py-4 border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:border-white hover:scale-105 transition-all text-sm font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                        {hood}
                    </Link>
                ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}