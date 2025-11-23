"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { 
  MapPin, 
  Star, 
  Phone, 
  Navigation, 
  ArrowLeft,
  Locate,
  Search,
  Clock,
  DollarSign
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Barbershop {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  images: string[];
  hours: any;
  booking_platform: string | null;
  booking_url: string | null;
  accepts_walk_ins: boolean;
  distance?: number; // in miles
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getDriveTime(distanceMiles: number): number {
  // Assume average LA city driving speed: 18 mph (accounting for traffic)
  const avgSpeed = 18;
  return Math.round((distanceMiles / avgSpeed) * 60); // Convert to minutes
}

// Common LA area zip codes with approximate coordinates
const LA_ZIP_CODES: Record<string, { lat: number; lng: number; area: string }> = {
  '90210': { lat: 34.0901, lng: -118.4065, area: 'Beverly Hills' },
  '90401': { lat: 34.0195, lng: -118.4912, area: 'Santa Monica' },
  '90404': { lat: 34.0276, lng: -118.4965, area: 'Santa Monica' },
  '90405': { lat: 34.0195, lng: -118.4912, area: 'Santa Monica' },
  '90028': { lat: 34.1016, lng: -118.3432, area: 'Hollywood' },
  '90027': { lat: 34.1067, lng: -118.2870, area: 'Los Feliz/Silver Lake' },
  '90026': { lat: 34.0780, lng: -118.2608, area: 'Echo Park' },
  '90013': { lat: 34.0407, lng: -118.2468, area: 'Downtown LA' },
  '90014': { lat: 34.0407, lng: -118.2468, area: 'Downtown LA' },
  '90015': { lat: 34.0407, lng: -118.2468, area: 'Downtown LA' },
  '90291': { lat: 33.9425, lng: -118.4329, area: 'Venice' },
  '90292': { lat: 33.9930, lng: -118.4673, area: 'Marina del Rey' },
  '90025': { lat: 34.0522, lng: -118.4437, area: 'West LA' },
  '90024': { lat: 34.0631, lng: -118.4454, area: 'Westwood' },
  '90069': { lat: 34.0901, lng: -118.3850, area: 'West Hollywood' },
  '90046': { lat: 34.1030, lng: -118.3521, area: 'West Hollywood' },
  '90048': { lat: 34.0730, lng: -118.3618, area: 'West Hollywood' },
  '90036': { lat: 34.0757, lng: -118.3531, area: 'Mid-City' },
  '90004': { lat: 34.0827, lng: -118.3089, area: 'Koreatown' },
  '90005': { lat: 34.0589, lng: -118.3147, area: 'Koreatown' },
  '90006': { lat: 34.0489, lng: -118.3075, area: 'Koreatown' },
  '91604': { lat: 34.1478, lng: -118.3897, area: 'Studio City' },
  '91602': { lat: 34.1392, lng: -118.3870, area: 'Studio City' },
  '90065': { lat: 34.1081, lng: -118.2137, area: 'Glassell Park' },
  '90039': { lat: 34.1161, lng: -118.2358, area: 'Atwater Village' },
  '90029': { lat: 34.0889, lng: -118.2912, area: 'Los Feliz' },
  '90068': { lat: 34.1349, lng: -118.3267, area: 'Hollywood Hills' },
};

function getLocationFromZip(zipCode: string): { lat: number; lng: number; area: string } | null {
  // Remove any spaces and ensure 5 digits
  const cleanZip = zipCode.replace(/\s/g, '').slice(0, 5);
  return LA_ZIP_CODES[cleanZip] || null;
}

export default function NeedCutNowPage() {
  const [barbers, setBarbers] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [useZipMode, setUseZipMode] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  async function requestLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
          fetchNearbyBarbers(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Location error:", error);
          setLocationError(true);
          // Default to Downtown LA
          const defaultLat = 34.0522;
          const defaultLng = -118.2437;
          setUserLat(defaultLat);
          setUserLng(defaultLng);
          fetchNearbyBarbers(defaultLat, defaultLng);
        }
      );
    } else {
      setLocationError(true);
      // Default to Downtown LA
      const defaultLat = 34.0522;
      const defaultLng = -118.2437;
      setUserLat(defaultLat);
      setUserLng(defaultLng);
      fetchNearbyBarbers(defaultLat, defaultLng);
    }
  }

  async function fetchNearbyBarbers(lat: number, lng: number) {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('barbershops')
      .select('*')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .not('images', 'is', null); // MUST have images

    if (error) {
      console.error('Error fetching barbers:', error);
    } else if (data) {
      // Filter out empty image arrays and calculate distances
      const validBarbers = data.filter(b => b.images && b.images.length > 0);
      
      const barbersWithDistance = validBarbers
        .map(barber => ({
          ...barber,
          distance: getDistance(lat, lng, barber.lat, barber.lng)
        }))
        .sort((a, b) => {
          // Primary sort: distance
          // Secondary sort: rating
          if (Math.abs(a.distance! - b.distance!) < 0.5) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.distance! - b.distance!;
        })
        .slice(0, 20); // Top 20 closest

      setBarbers(barbersWithDistance);
    }
    
    setLoading(false);
  }

  async function handleZipSearch() {
    if (!zipInput.trim()) return;
    
    const location = getLocationFromZip(zipInput.trim());
    if (location) {
      setUserLat(location.lat);
      setUserLng(location.lng);
      setLocationError(false);
      setUseZipMode(true);
      await fetchNearbyBarbers(location.lat, location.lng);
    } else {
      // Invalid zip code
      alert('Please enter a valid LA area zip code (e.g., 90210, 90401, 90028)');
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center gap-1 font-bold uppercase text-xs hover:text-la-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b-4 border-black py-6 bg-la-orange text-white">
        <div className="container-brutal">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
            NEED CUT NOW
          </h1>
          <p className="text-lg md:text-xl font-medium">
            {userLat && userLng ? (
              useZipMode ? (
                <>Top barbers near {LA_ZIP_CODES[zipInput]?.area || zipInput}, sorted by distance</>
              ) : (
                <>Top barbers near you, sorted by distance</>
              )
            ) : (
              <>Finding barbers in LA...</>
            )}
          </p>
        </div>
      </section>

      {/* Location Status & Zip Code Input */}
      <div className="border-b-2 border-black bg-gray-50 py-4">
        <div className="container-brutal">
          {locationError && (
            <div className="bg-yellow-100 border-2 border-yellow-400 p-3 mb-4 rounded">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ LOCATION ACCESS DENIED. SHOWING RESULTS FOR DOWNTOWN LA.
              </p>
              <p className="text-xs text-yellow-700">
                Enter your zip code below for more accurate results.
              </p>
            </div>
          )}

          {/* Zip Code Input */}
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label htmlFor="zip" className="block text-sm font-bold uppercase mb-1">
                Enter ZIP Code for Better Results:
              </label>
              <input
                id="zip"
                type="text"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder="90210, 90401, 90028..."
                className="w-full border-2 border-black p-2 text-lg font-bold uppercase tracking-wide focus:border-la-orange focus:outline-none"
                maxLength={5}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleZipSearch();
                  }
                }}
              />
            </div>
            <button
              onClick={handleZipSearch}
              disabled={!zipInput.trim() || loading}
              className="bg-black text-white px-4 py-3 border-2 border-black hover:bg-la-orange hover:border-la-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase text-sm mt-6"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-2">
            💡 TIP: Works with all LA area zip codes (90210, 90401, 91604, etc.)
          </p>
        </div>
      </div>

      {/* Results */}
      <section className="py-4 md:py-6">
        <div className="container-brutal">
          {loading ? (
            <div className="text-center py-20">
              <Locate className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <div className="text-2xl font-bold uppercase mb-2">Finding Barbers...</div>
              <p className="text-gray-600">Calculating distances</p>
            </div>
          ) : barbers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-2xl font-bold uppercase mb-2">No Barbers Found</div>
              <p className="text-gray-600">Try a different location</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  Showing {barbers.length} barbers near {useZipMode ? (LA_ZIP_CODES[zipInput]?.area || zipInput) : 'you'}
                </span>
              </div>

              {/* Barber Cards - URGENT LAYOUT */}
              <div className="space-y-3">
                {barbers.map((barber, index) => (
                  <div
                    key={barber.id}
                    className={`border-2 bg-white ${
                      index === 0 
                        ? 'border-la-orange border-4' 
                        : 'border-black'
                    }`}
                  >
                    <div className="p-3 md:p-4">
                      {/* Top Row: Name & Drive Time */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <Link href={`/barbers/${barber.id}`} className="flex-1 min-w-0">
                          <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight hover:text-la-orange transition-colors truncate">
                            {barber.name}
                          </h3>
                        </Link>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-2xl md:text-3xl font-bold text-la-orange">
                            {barber.distance ? getDriveTime(barber.distance) : '--'}min
                          </div>
                          <div className="text-xs text-gray-600">
                            {barber.distance?.toFixed(1)}mi
                          </div>
                        </div>
                      </div>

                      {/* Work Preview - LA COOL & CLICKABLE */}
                      {barber.images && barber.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {barber.images.slice(0, 3).map((image, imgIndex) => (
                            <Link 
                              key={imgIndex}
                              href={`/barbers/${barber.id}`}
                              className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-sm overflow-hidden border border-black/20 hover:border-la-orange transition-colors cursor-pointer group"
                            >
                              <img
                                src={image}
                                alt={`${barber.name} work ${imgIndex + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                loading="lazy"
                              />
                            </Link>
                          ))}
                          <Link 
                            href={`/barbers/${barber.id}`}
                            className="flex items-center text-xs text-gray-500 hover:text-la-orange transition-colors ml-2 cursor-pointer"
                          >
                            📸 {barber.name}
                          </Link>
                        </div>
                      )}

                      {/* Second Row: Rating, Price, Location */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 text-sm">
                        {barber.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-black" />
                            <span className="font-bold">{barber.rating.toFixed(1)}</span>
                            <span className="text-gray-600">({barber.review_count})</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 font-bold">
                          <DollarSign className="w-4 h-4" />
                          {barber.price_range || '$$'}
                        </div>

                        <div className="text-gray-600 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{barber.neighborhood || 'LA'}</span>
                        </div>
                      </div>

                      {/* Availability & Specialization */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {barber.hours?.open_now && (
                          <Badge variant="accent" className="text-xs">
                            <Clock className="w-3 h-3 inline mr-1" />
                            OPEN NOW
                          </Badge>
                        )}
                        {barber.accepts_walk_ins && (
                          <Badge variant="default" className="text-xs">WALK-IN OK</Badge>
                        )}
                        {barber.booking_platform && (
                          <Badge variant="outline" className="text-xs">
                            {barber.booking_platform === 'booksy' ? 'BOOKSY' : 
                             barber.booking_platform === 'vagaro' ? 'VAGARO' : 
                             'BOOK ONLINE'}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">FADE</Badge>
                        <Badge variant="outline" className="text-xs">4C HAIR</Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {barber.phone ? (
                          <a 
                            href={`tel:${barber.phone}`}
                            className="border-2 border-black p-2 text-center font-bold uppercase text-xs flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            Call
                          </a>
                        ) : (
                          <div className="border-2 border-gray-300 p-2 text-center text-gray-400 uppercase text-xs flex flex-col items-center justify-center gap-1">
                            <Phone className="w-4 h-4" />
                            N/A
                          </div>
                        )}
                        
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-black p-2 text-center font-bold uppercase text-xs flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                        >
                          <Navigation className="w-4 h-4" />
                          {barber.distance ? `${getDriveTime(barber.distance)}min` : 'Go'}
                        </a>
                        
                        {barber.booking_url ? (
                          <a
                            href={barber.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-la-orange bg-la-orange text-white p-2 text-center font-bold uppercase text-xs flex flex-col items-center justify-center gap-1 active:bg-black active:border-black transition-colors"
                          >
                            BOOK
                          </a>
                        ) : (
                          <Link
                            href={`/barbers/${barber.id}`}
                            className="border-2 border-la-orange bg-la-orange text-white p-2 text-center font-bold uppercase text-xs flex flex-col items-center justify-center gap-1 active:bg-black active:border-black transition-colors"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Top Result Badge */}
                    {index === 0 && (
                      <div className="bg-la-orange text-white text-center py-2 font-bold uppercase text-xs tracking-wider">
                        CLOSEST TO YOU
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

