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

export default function NeedCutNowPage() {
  const [barbers, setBarbers] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [zipInput, setZipInput] = useState("");

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
              <>Top barbers near you, sorted by distance</>
            ) : (
              <>Finding barbers in LA...</>
            )}
          </p>
        </div>
      </section>

      {/* Location Status */}
      {locationError && (
        <div className="border-b-2 border-black bg-yellow-100 py-3">
          <div className="container-brutal">
            <p className="text-sm font-medium">
              📍 Location access denied. Showing results for Downtown LA.
            </p>
          </div>
        </div>
      )}

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
                <span>Showing {barbers.length} barbers near you</span>
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

                      {/* Work Preview - LA COOL */}
                      {barber.images && barber.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {barber.images.slice(0, 3).map((image, imgIndex) => (
                            <div 
                              key={imgIndex}
                              className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-sm overflow-hidden border border-black/20"
                            >
                              <img
                                src={image}
                                alt={`${barber.name} work ${imgIndex + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                loading="lazy"
                              />
                            </div>
                          ))}
                          <div className="flex items-center text-xs text-gray-500 ml-2">
                            📸 {barber.name}
                          </div>
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
                            Open Now
                          </Badge>
                        )}
                        {barber.accepts_walk_ins && (
                          <Badge variant="default" className="text-xs">Walk-In OK</Badge>
                        )}
                        {barber.booking_platform && (
                          <Badge variant="outline" className="text-xs">
                            📅 {barber.booking_platform === 'booksy' ? 'Booksy' : 
                                 barber.booking_platform === 'vagaro' ? 'Vagaro' : 
                                 'Book Online'}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">Fade</Badge>
                        <Badge variant="outline" className="text-xs">4C Hair</Badge>
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
                            📅 Book
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
                        🔥 Closest to You
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

