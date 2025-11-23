"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  MapPin, 
  Star, 
  Phone, 
  Navigation,
  ArrowLeft,
  Sparkles
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
  booking_url: string | null;
}

interface Classification {
  barbershop_id: string;
  hair_types: any;
  styles: any;
  vibes: string[];
  walk_in_friendly: boolean;
}

interface ScoredBarber extends Barbershop {
  matchScore: number;
  matchReasons: string[];
  distance?: number;
  driveTime?: number;
}

export default function MatchResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<ScoredBarber[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const hairType = searchParams.get('hair');
  const style = searchParams.get('style');
  const vibe = searchParams.get('vibe');

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (userLat && userLng) {
      findMatches();
    }
  }, [hairType, style, vibe, userLat, userLng]);

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
    const avgSpeed = 18; // LA city speed with traffic
    return Math.round((distanceMiles / avgSpeed) * 60);
  }

  async function requestLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        (error) => {
          console.error("Location error:", error);
          // Default to Downtown LA
          setUserLat(34.0522);
          setUserLng(-118.2437);
        }
      );
    } else {
      // Default to Downtown LA
      setUserLat(34.0522);
      setUserLng(-118.2437);
    }
  }

  async function findMatches() {
    setLoading(true);

    // Fetch all barbershops with images
    const { data: barbershops, error: barbershopsError } = await supabase
      .from('barbershops')
      .select('*')
      .not('images', 'is', null);

    if (barbershopsError || !barbershops) {
      console.error('Error fetching barbershops:', barbershopsError);
      setLoading(false);
      return;
    }

    // Filter barbers with images
    const validBarbers = barbershops.filter(b => b.images && b.images.length > 0);

    // Fetch classifications
    const { data: classifications } = await supabase
      .from('classifications')
      .select('*');

    // Score each barber
    const scoredBarbers: ScoredBarber[] = validBarbers.map(barber => {
      const classification = classifications?.find(c => c.barbershop_id === barber.id);
      
      let score = 0;
      const reasons: string[] = [];

      if (classification) {
        // Score hair type match (40% weight)
        if (hairType && classification.hair_types && classification.hair_types[hairType]) {
          const hairScore = classification.hair_types[hairType];
          score += hairScore * 40;
          if (hairScore > 0.5) {
            reasons.push(`${(hairScore * 100).toFixed(0)}% ${hairType} specialist`);
          }
        }

        // Score style match (40% weight)
        if (style && classification.styles && classification.styles[style]) {
          const styleScore = classification.styles[style];
          score += styleScore * 40;
          if (styleScore > 0.5) {
            reasons.push(`${(styleScore * 100).toFixed(0)}% ${style} expertise`);
          }
        }

        // Score vibe match (20% weight)
        if (vibe) {
          if (vibe === 'walkin' && classification.walk_in_friendly) {
            score += 20;
            reasons.push('Walk-ins welcome');
          }
          if (vibe === 'queer' && classification.vibes?.includes('queer-friendly')) {
            score += 20;
            reasons.push('Queer-friendly');
          }
          if (vibe === 'cultural' && classification.vibes?.includes('cultural-specialist')) {
            score += 20;
            reasons.push('Cultural specialist');
          }
          if (vibe === 'premium' && classification.vibes?.includes('upscale')) {
            score += 15;
            reasons.push('Premium service');
          }
          if (vibe === 'budget' && barber.price_range === '$') {
            score += 15;
            reasons.push('Affordable pricing');
          }
        }
      }

      // Bonus for high rating (10% weight)
      if (barber.rating && barber.rating >= 4.5) {
        score += 10;
        reasons.push(`${barber.rating.toFixed(1)}★ rated`);
      }

      // Penalty if no classification data
      if (!classification) {
        score = barber.rating ? barber.rating * 10 : 0;
        reasons.push('Needs more reviews');
      }

      return {
        ...barber,
        matchScore: score,
        matchReasons: reasons,
        distance: userLat && userLng ? getDistance(userLat, userLng, barber.lat, barber.lng) : undefined,
        driveTime: userLat && userLng ? getDriveTime(getDistance(userLat, userLng, barber.lat, barber.lng)) : undefined
      };
    });

    // Sort by match score
    const sortedResults = scoredBarbers
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Top 20 matches

    setResults(sortedResults);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <Link href="/match">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Match
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b-4 border-black py-6 md:py-8 bg-gradient-to-r from-la-orange to-orange-600 text-white">
        <div className="container-brutal">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-2">
            YOUR MATCHES
          </h1>
          <p className="text-lg md:text-xl">
            Ranked by hair type, style & vibe preferences
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="py-6 md:py-8">
        <div className="container-brutal">
          {loading ? (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse text-la-orange" />
              <div className="text-2xl font-bold uppercase mb-2">Finding Your Perfect Match...</div>
              <p className="text-gray-600">Analyzing {hairType}, {style}, {vibe}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-2xl font-bold uppercase mb-2">No Matches Found</div>
              <p className="text-gray-600 mb-6">Try different preferences</p>
              <Link href="/match">
                <Button variant="primary">Try Again</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Found {results.length} barbers matching your preferences
              </div>

              <div className="space-y-4">
                {results.map((barber, index) => (
                  <div
                    key={barber.id}
                    className={`border-2 bg-white ${
                      index === 0 
                        ? 'border-la-orange border-4' 
                        : 'border-black'
                    }`}
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      {barber.images?.[0] && (
                        <img 
                          src={barber.images[0]} 
                          alt={barber.name}
                          className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 object-cover border-2 border-black"
                        />
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <Link href={`/barbers/${barber.id}`}>
                              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight hover:text-la-orange transition-colors">
                                {barber.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                              <MapPin className="w-4 h-4" />
                              {barber.neighborhood || 'LA'}
                              {barber.driveTime && (
                                <span className="ml-2 font-bold text-la-orange">
                                  · {barber.driveTime}min drive
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Match Score */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl md:text-3xl font-bold text-la-orange">
                              {barber.matchScore.toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-600">MATCH</div>
                            {barber.distance && (
                              <div className="text-xs text-gray-600 mt-1">
                                {barber.distance.toFixed(1)}mi
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        {barber.rating && (
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 fill-black" />
                            <span className="font-bold">{barber.rating.toFixed(1)}</span>
                            <span className="text-sm text-gray-600">({barber.review_count})</span>
                            <span className="text-sm font-bold">{barber.price_range || '$$'}</span>
                          </div>
                        )}

                        {/* Match Reasons */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {barber.matchReasons.map((reason, idx) => (
                            <Badge key={idx} variant="default" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-3 gap-2">
                          {barber.phone && (
                            <a 
                              href={`tel:${barber.phone}`}
                              className="border-2 border-black p-2 text-center font-bold uppercase text-xs flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                            >
                              <Phone className="w-4 h-4" />
                              Call
                            </a>
                          )}
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-black p-2 text-center font-bold uppercase text-xs flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                          >
                            <Navigation className="w-4 h-4" />
                            {barber.driveTime ? `${barber.driveTime}min` : 'Go'}
                          </a>
                          <Link
                            href={`/barbers/${barber.id}`}
                            className="border-2 border-la-orange bg-la-orange text-white p-2 text-center font-bold uppercase text-xs flex flex-col items-center justify-center gap-1 active:bg-black active:border-black transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Top Match Badge */}
                    {index === 0 && (
                      <div className="bg-la-orange text-white text-center py-2 font-bold uppercase text-xs tracking-wider">
                        🔥 Best Match For You
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

