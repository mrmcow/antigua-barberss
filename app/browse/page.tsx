"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Navigation,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { trackClickEvent } from "@/lib/analytics";

interface Barbershop {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  images: string[];
}

export default function BrowsePage() {
  const [barbers, setBarbers] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBarbers();
  }, []);

  async function fetchBarbers() {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('barbershops')
      .select('*')
      .not('images', 'is', null) // MUST have images
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(100);

    if (error) {
      console.error('Error fetching barbers:', error);
    } else {
      // Filter out empty image arrays on client side
      const validBarbers = (data || []).filter(b => b.images && b.images.length > 0);
      setBarbers(validBarbers);
    }
    
    setLoading(false);
  }

  // Only feature barbers with images AND high ratings
  const featuredBarbers = barbers
    .filter(b => 
      b.rating && 
      b.rating >= 4.5 && 
      b.images && 
      b.images.length > 0 &&
      b.review_count >= 10
    )
    .slice(0, 2);
  
  const regularBarbers = barbers.filter(b => !featuredBarbers.includes(b));

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link href="/browse" className="text-sm uppercase tracking-wider text-la-orange font-medium">
              Browse
            </Link>
            <Link href="/need-cut-now">
              <Button variant="primary" size="sm">
                Need Cut Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b-4 border-black py-6 md:py-8 bg-white">
        <div className="container-brutal">
          <h1 className="text-brutal-h1 mb-4">
            LA <span className="text-la-orange">BARBERS</span>
          </h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search barbers..."
              className="w-full pl-12 pr-4 py-4 border-4 border-black focus:border-la-orange outline-none text-base font-medium uppercase tracking-wide placeholder:normal-case placeholder:text-gray-400"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <Badge variant="default" className="cursor-pointer whitespace-nowrap flex-shrink-0">
              <Clock className="w-3 h-3 inline mr-1" />
              Open Now
            </Badge>
            <Badge variant="outline" className="cursor-pointer whitespace-nowrap flex-shrink-0">
              Fade Specialists
            </Badge>
            <Badge variant="outline" className="cursor-pointer whitespace-nowrap flex-shrink-0">
              Curly Hair
            </Badge>
            <Badge variant="outline" className="cursor-pointer whitespace-nowrap flex-shrink-0">
              Walk-In
            </Badge>
            <Badge variant="outline" className="cursor-pointer whitespace-nowrap flex-shrink-0">
              Under $40
            </Badge>
            <Badge variant="outline" className="cursor-pointer whitespace-nowrap flex-shrink-0">
              Venice
            </Badge>
            <Badge variant="outline" className="cursor-pointer whitespace-nowrap flex-shrink-0">
              Hollywood
            </Badge>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-6 md:py-8">
        <div className="container-brutal">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-2xl font-bold uppercase mb-2">Loading...</div>
              <p className="text-gray-600">Fetching LA's best barbers</p>
            </div>
          ) : barbers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-2xl font-bold uppercase mb-2">No Barbers Found</div>
              <p className="text-gray-600">Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center text-sm md:text-base">
                <p className="font-medium">
                  <span className="font-bold text-lg">{barbers.length}</span> barbers found
                </p>
                <select className="border-2 border-black px-3 py-2 font-medium uppercase text-xs cursor-pointer">
                  <option>Top Rated</option>
                  <option>Nearest</option>
                  <option>Price: Low</option>
                </select>
              </div>

              {/* Barber List */}
              <div className="space-y-4">
                {/* Featured Barbers */}
                {featuredBarbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="border-4 border-la-orange bg-white"
                  >
                    <div className="relative">
                      <div className="absolute top-0 left-0 bg-la-orange text-white px-3 py-1 text-xs font-bold uppercase z-10">
                        ⭐ Featured
                      </div>
                      
                      {barber.images && barber.images.length > 0 ? (
                        <img 
                          src={barber.images[0]} 
                          alt={barber.name}
                          className="aspect-[3/1] md:aspect-[4/1] w-full object-cover"
                        />
                      ) : (
                        <div className="aspect-[3/1] md:aspect-[4/1] bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold">
                          {barber.name}
                        </div>
                      )}
                    </div>

                    <div className="p-4 md:p-6">
                      <Link href={`/barbers/${barber.id}`} className="block mb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 hover:text-la-orange transition-colors">
                              {barber.name}
                            </h2>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                              <MapPin className="w-4 h-4" />
                              {barber.neighborhood || 'Los Angeles'}
                            </p>
                          </div>
                          <Badge variant="accent" className="flex-shrink-0">
                            <Clock className="w-3 h-3 inline mr-1" />
                            OPEN
                          </Badge>
                        </div>

                        {barber.rating && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 fill-black" />
                              <span className="font-bold text-lg">{barber.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-gray-600">({barber.review_count} reviews)</span>
                            <span className="text-sm font-bold">{barber.price_range || '$$'}</span>
                          </div>
                        )}
                      </Link>

                      <div className="grid grid-cols-3 gap-2">
                        {barber.phone && (
                          <a 
                            href={`tel:${barber.phone}`}
                            onClick={() => trackClickEvent(barber.id, 'phone_call', `tel:${barber.phone}`)}
                            className="border-2 border-black p-3 text-center font-bold uppercase text-xs md:text-sm flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`}
                          onClick={() => trackClickEvent(barber.id, 'directions_click', `https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-black p-3 text-center font-bold uppercase text-xs md:text-sm flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                        >
                          <Navigation className="w-4 h-4" />
                          Go
                        </a>
                        <Link
                          href={`/barbers/${barber.id}`}
                          className="border-2 border-la-orange bg-la-orange text-white p-3 text-center font-bold uppercase text-xs md:text-sm flex flex-col items-center justify-center gap-1 active:bg-black transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Regular Barbers */}
                {regularBarbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="border-2 border-black bg-white"
                  >
                    <div className="flex gap-3 md:gap-4 p-3 md:p-4">
                      {barber.images && barber.images.length > 0 ? (
                        <img 
                          src={barber.images[0]} 
                          alt={barber.name}
                          className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 object-cover border-2 border-black"
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold border-2 border-black">
                          {barber.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <Link href={`/barbers/${barber.id}`}>
                          <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-1 hover:text-la-orange transition-colors">
                            {barber.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1 mb-2">
                            <MapPin className="w-3 h-3" />
                            {barber.neighborhood || 'LA'}
                          </p>

                          {barber.rating && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-black" />
                                <span className="font-bold">{barber.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-xs text-gray-600">({barber.review_count})</span>
                              <span className="text-xs font-bold">{barber.price_range || '$$'}</span>
                            </div>
                          )}
                        </Link>

                        <div className="flex gap-2">
                          {barber.phone && (
                            <a 
                              href={`tel:${barber.phone}`}
                              onClick={() => trackClickEvent(barber.id, 'phone_call', `tel:${barber.phone}`)}
                              className="flex-1 border-2 border-black py-2 text-center font-bold uppercase text-xs active:bg-black active:text-white transition-colors"
                            >
                              Call
                            </a>
                          )}
                          <Link
                            href={`/barbers/${barber.id}`}
                            className="flex-1 border-2 border-la-orange bg-la-orange text-white py-2 text-center font-bold uppercase text-xs active:bg-black active:border-black transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 bg-black text-white">
        <div className="container-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Logo size="md" className="mb-3 invert" />
              <p className="text-sm text-gray-400">The best barbers in LA. Period.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-sm uppercase tracking-wider hover:text-la-orange transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm uppercase tracking-wider hover:text-la-orange transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
