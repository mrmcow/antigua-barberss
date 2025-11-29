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

  return (
    <main className="selection:bg-[#FCD116]">
      
      {/* HERO */}
      <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 max-w-[1600px] mx-auto">
         <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="order-1 lg:order-1 px-2 sm:px-6 text-center lg:text-left w-full">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-8 sm:mb-10 group cursor-default">
                    <div className="flex items-end gap-1.5 h-6 sm:h-8">
                        <div className="w-1.5 h-full bg-black rounded-full group-hover:h-[120%] transition-all duration-300 ease-out"></div>
                        <div className="w-1.5 h-[75%] bg-[#CE1126] rounded-full group-hover:h-[100%] transition-all duration-300 delay-75 ease-out"></div>
                        <div className="w-1.5 h-[50%] bg-[#FCD116] rounded-full group-hover:h-[75%] transition-all duration-300 delay-150 ease-out"></div>
                        <div className="w-1.5 h-[25%] bg-[#0072C6] rounded-full group-hover:h-[50%] transition-all duration-300 delay-200 ease-out"></div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-gray-900 group-hover:tracking-[0.35em] transition-all duration-500">
                        The Official Island Directory
                    </span>
                </div>
                <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black uppercase leading-[0.9] tracking-tight mb-6 sm:mb-8 text-[#1a1a1a]">
                    Respect <br/>The Chair.
                </h1>
                <p className="text-base sm:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed font-medium">
                    The definitive guide to barbering in Antigua & Barbuda. 
                    From St. John's to English Harbour, find the sharpest cuts on the island.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <Link href="/browse" className="flex items-center justify-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 sm:py-5 rounded-full text-sm font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-xl shadow-black/20 w-full sm:w-auto">
                        Browse Directory
                    </Link>
                </div>

                <div className="mt-8 sm:mt-12 flex items-center justify-center lg:justify-start gap-8 sm:gap-10">
                    <div>
                        <span className="block text-2xl sm:text-3xl font-black text-[#1a1a1a]">{barberCount}+</span>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Verified Shops</span>
                    </div>
                    <div className="w-px h-8 sm:h-10 bg-gray-200"></div>
                    <div>
                        <span className="block text-2xl sm:text-3xl font-black text-[#1a1a1a]">4.8</span>
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Avg Rating</span>
                    </div>
              </div>
              </div>

            {/* Hero Image / Visual */}
            <div className="order-2 lg:order-2 relative w-full aspect-[16/9] sm:aspect-[4/5] lg:aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-xl sm:shadow-2xl shadow-black/5 group mx-auto max-w-2xl lg:max-w-none mt-4 lg:mt-0 bg-neutral-900">
                 <img 
                    src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2070&auto=format&fit=crop" 
                    alt="Antiguan Barber Shop Culture" 
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
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