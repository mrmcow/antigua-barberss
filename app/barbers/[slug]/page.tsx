"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { MapPin, Star, Phone, Globe, Instagram, Clock, Navigation, ArrowLeft, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { trackAndNavigate, trackClickEvent } from "@/lib/analytics";

interface Barbershop {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  instagram_handle: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  hours: any;
  images: string[];
  booking_platform: string | null;
  booking_url: string | null;
  upvotes: number;
  downvotes: number;
  vote_score: number;
  google_place_id: string | null;
  google_maps_url: string | null;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  text: string;
  date: string;
}

export default function BarberProfile({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [barber, setBarber] = useState<Barbershop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBarberIds, setAllBarberIds] = useState<string[]>([]);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  // Get user fingerprint (simple browser-based)
  const getUserFingerprint = () => {
    let fingerprint = localStorage.getItem('user_fingerprint');
    if (!fingerprint) {
      fingerprint = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('user_fingerprint', fingerprint);
    }
    return fingerprint;
  };

  async function handleVote(voteType: 'up' | 'down') {
    if (!barber) return;

    const fingerprint = getUserFingerprint();
    const previousVote = userVote;
    const previousUpvotes = barber.upvotes || 0;
    const previousDownvotes = barber.downvotes || 0;

    // OPTIMISTIC UPDATE - Update UI immediately
    let newUpvotes = previousUpvotes;
    let newDownvotes = previousDownvotes;

    // Calculate new vote counts optimistically
    if (userVote === voteType) {
      // Removing existing vote
      if (voteType === 'up') newUpvotes--;
      else newDownvotes--;
      setUserVote(null);
    } else {
      // Adding new vote or changing vote
      if (previousVote === 'up') newUpvotes--;
      if (previousVote === 'down') newDownvotes--;
      
      if (voteType === 'up') newUpvotes++;
      else newDownvotes++;
      setUserVote(voteType);
    }

    // Update UI immediately (optimistic)
    setBarber({
      ...barber,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      vote_score: newUpvotes + newDownvotes > 0 
        ? (newUpvotes - newDownvotes) / (newUpvotes + newDownvotes)
        : 0
    });

    try {
      // Sync with database (in background)
      if (userVote === voteType) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('barbershop_id', barber.id)
          .eq('voter_fingerprint', fingerprint);
      } else {
        // Add/update vote
        await supabase
          .from('votes')
          .upsert({
            barbershop_id: barber.id,
            vote_type: voteType,
            voter_fingerprint: fingerprint
          }, {
            onConflict: 'barbershop_id,voter_fingerprint'
          });
      }
    } catch (error) {
      console.error('Error voting:', error);
      
      // REVERT optimistic update on error
      setUserVote(previousVote);
      setBarber({
        ...barber,
        upvotes: previousUpvotes,
        downvotes: previousDownvotes
      });
    }
  }

  async function checkUserVote() {
    if (!barber) return;

    try {
      const fingerprint = getUserFingerprint();
      const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('barbershop_id', barber.id)
        .eq('voter_fingerprint', fingerprint)
        .maybeSingle(); // Use maybeSingle instead of single

      if (!error && data) {
        setUserVote(data.vote_type as 'up' | 'down');
      }
    } catch (error) {
      // Silently fail if votes table doesn't exist yet
      console.log('Votes not available yet');
    }
  }

  async function fetchAllBarberIds() {
    const { data } = await supabase
      .from('barbershops')
      .select('id')
      .not('images', 'is', null);
    
    if (data) {
      setAllBarberIds(data.map(b => b.id));
    }
  }

  const goToNextBarber = useCallback(() => {
    if (allBarberIds.length === 0) return;
    
    const currentIndex = allBarberIds.indexOf(params.slug);
    const nextIndex = (currentIndex + 1) % allBarberIds.length;
    const nextId = allBarberIds[nextIndex];
    
    // Use Next.js router for smooth client-side navigation
    router.push(`/barbers/${nextId}`);
  }, [allBarberIds, params.slug, router]);

  async function fetchBarber() {
    setLoading(true);

    // Fetch barber
    const { data: barberData, error: barberError } = await supabase
      .from('barbershops')
      .select('*')
      .eq('id', params.slug)
      .single();

    if (barberError) {
      console.error('Error fetching barber:', barberError);
      setLoading(false);
      return;
    }
    
    setBarber(barberData);

    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('barbershop_id', params.slug)
      .order('date', { ascending: false })
      .limit(10);

    setReviews(reviewsData || []);
    setLoading(false);
  }

  // Fetch barber when slug changes
  useEffect(() => {
    fetchBarber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  // Fetch all barber IDs once on mount
  useEffect(() => {
    fetchAllBarberIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'n') {
        goToNextBarber();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextBarber]);

  // Check vote ONCE after barber loads
  useEffect(() => {
    if (barber) {
      checkUserVote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barber?.id]);

  // Preload images to prevent flicker
  useEffect(() => {
    if (barber?.images?.[0]) {
      const mainImg = new Image();
      mainImg.src = barber.images[0];
      
      // Preload side images
      barber.images.slice(1, 3).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [barber?.id, barber?.images]);

  if (loading || !barber) {
    return (
      <main className="min-h-screen bg-white">
        {/* Keep navigation visible during load */}
        <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
          <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </Link>
            <div className="flex gap-2 md:gap-4 items-center">
              <Link href="/browse" className="hidden md:block text-sm uppercase tracking-wider hover:text-la-orange transition-colors font-medium">
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
        
        {/* Minimal loading state */}
        <div className="container-brutal py-20">
          <div className="h-96 border-2 border-gray-200 animate-pulse"></div>
        </div>
      </main>
    );
  }

  const isOpen = barber.hours?.open_now;
  const mainImage = barber.images?.[0];
  const sideImages = barber.images?.slice(1, 3) || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link href="/browse" className="text-sm md:text-base uppercase tracking-wider hover:text-la-orange transition-colors font-bold">
              BARBERS
            </Link>
            <Link href="/need-cut-now">
              <Button variant="primary" size="sm">
                Need Cut Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="border-b-2 border-black bg-concrete/10">
        <div className="container-brutal py-3">
          <div className="flex items-center justify-between gap-4">
            <Link 
              href="/browse"
              className="inline-flex items-center gap-2 font-bold uppercase text-sm hover:text-la-orange transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Barbers
            </Link>
            
            {/* Next Barber - Desktop Only */}
            <button
              onClick={goToNextBarber}
              className="hidden md:inline-flex items-center gap-2 font-bold uppercase text-sm bg-la-orange text-white px-4 py-2 hover:bg-black transition-colors"
            >
              Next Barber
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Vote Bar - Mobile Sticky */}
      <div className="sticky top-16 md:top-20 bg-white border-b-2 border-black z-40 md:hidden">
        <div className="container-brutal py-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote('up')}
                className={`flex items-center gap-2 px-4 py-2 border-2 font-bold uppercase text-sm transition-colors ${
                  userVote === 'up' 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-black hover:bg-green-500 hover:border-green-500 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {barber?.upvotes || 0}
              </button>
              <button
                onClick={() => handleVote('down')}
                className={`flex items-center gap-2 px-4 py-2 border-2 font-bold uppercase text-sm transition-colors ${
                  userVote === 'down' 
                    ? 'bg-red-500 border-red-500 text-white' 
                    : 'border-black hover:bg-red-500 hover:border-red-500 hover:text-white'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                {barber?.downvotes || 0}
              </button>
            </div>
            <button
              onClick={goToNextBarber}
              className="px-4 py-2 bg-la-orange text-white font-bold uppercase text-sm"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Hero Gallery */}
      {mainImage ? (
        <section className="border-b-4 border-black">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:h-[500px]">
            {/* Main image */}
            <div className="md:col-span-2 aspect-[16/9] md:aspect-auto h-full relative border-b-2 md:border-b-0 md:border-r-2 border-black overflow-hidden bg-black">
              {mainImage && (
                <img 
                  key={barber.id}
                  src={mainImage} 
                  alt={barber.name}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  fetchPriority="high"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              )}
              {barber.rating && barber.rating >= 4.5 && (
                <div className="absolute top-4 left-4 bg-la-orange text-white px-4 py-2 font-bold uppercase text-sm">
                  ⭐ Featured Barber
                </div>
              )}
            </div>

            {/* Side images */}
            {sideImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-1 gap-0 h-full">
                {sideImages.map((img, idx) => (
                  <div key={`${barber.id}-${idx}`} className={`aspect-square md:aspect-auto md:h-[250px] ${idx === 0 ? 'border-r-2 md:border-r-0 md:border-b-2' : ''} border-black overflow-hidden bg-black`}>
                    <img 
                      src={img} 
                      alt={`${barber.name} work sample ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Main Content */}
      <section className="py-6 md:py-8">
        <div className="container-brutal">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
            {/* Left: Main Info */}
            <div className="xl:col-span-3 max-w-4xl xl:max-w-none">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-brutal-h1 mb-2">
                  {barber.name.toUpperCase()}
                </h1>
                <p className="text-base md:text-lg text-gray-600 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {barber.neighborhood || 'Los Angeles'}
                </p>
              </div>

              {/* Rating & Status */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {barber.rating && (
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        const reviewsSection = document.getElementById('reviews-section');
                        if (reviewsSection) {
                          reviewsSection.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }, 100);
                    }}
                    className="flex items-center gap-2 hover:text-la-orange transition-colors cursor-pointer group active:scale-95"
                  >
                    <Star className="w-6 h-6 fill-black group-hover:fill-la-orange transition-colors" />
                    <span className="text-2xl font-bold">{barber.rating.toFixed(1)}</span>
                    <span className="text-gray-600 underline decoration-dotted decoration-2">({barber.review_count} reviews)</span>
                  </button>
                )}
                {isOpen && (
                  <Badge variant="accent" className="text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    OPEN NOW
                  </Badge>
                )}
                {barber.price_range && (
                  <span className="text-lg font-bold">{barber.price_range}</span>
                )}
              </div>

              {/* Specialization Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="default" className="text-sm">🔥 Fade Master</Badge>
                <Badge variant="outline" className="text-sm">Walk-In Friendly</Badge>
                <Badge variant="outline" className="text-sm">4C Hair Expert</Badge>
                {(barber.booking_url || barber.website) && (
                  <Badge variant="outline" className="text-sm">
                    📅 Online Booking
                  </Badge>
                )}
                {barber.website && (
                  <Badge variant="outline" className="text-sm">
                    🌐 Website
                  </Badge>
                )}
              </div>

              {/* Vote Buttons - Desktop (Smooth & Instant) */}
              <div className="hidden md:flex items-center gap-3 mb-6">
                <button
                  onClick={() => handleVote('up')}
                  className={`flex items-center gap-2 px-6 py-3 border-2 font-bold uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                    userVote === 'up' 
                      ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25' 
                      : 'border-black hover:bg-green-500 hover:border-green-500 hover:text-white hover:shadow-md'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 transition-transform duration-200 ${
                    userVote === 'up' ? 'scale-110' : ''
                  }`} />
                  <span className="transition-all duration-200">
                    Upvote ({barber.upvotes || 0})
                  </span>
                </button>
                <button
                  onClick={() => handleVote('down')}
                  className={`flex items-center gap-2 px-6 py-3 border-2 font-bold uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                    userVote === 'down' 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25' 
                      : 'border-black hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-md'
                  }`}
                >
                  <ThumbsDown className={`w-5 h-5 transition-transform duration-200 ${
                    userVote === 'down' ? 'scale-110' : ''
                  }`} />
                  <span className="transition-all duration-200">
                    Downvote ({barber.downvotes || 0})
                  </span>
                </button>
                
                {(barber.upvotes || 0) + (barber.downvotes || 0) > 0 && (
                  <div className="text-sm text-gray-600 transition-opacity duration-300">
                    {barber.vote_score > 0 ? '🔥' : barber.vote_score < 0 ? '⚠️' : '🤷'} 
                    {' '}
                    {Math.abs((barber.vote_score || 0) * 100).toFixed(0)}% 
                    {barber.vote_score > 0 ? ' recommended' : barber.vote_score < 0 ? ' not recommended' : ' mixed'}
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {barber.phone ? (
                  <a
                    href={`tel:${barber.phone}`}
                    onClick={() => trackClickEvent(barber.id, 'phone_call', `tel:${barber.phone}`)}
                    className="border-4 border-black bg-black text-white p-4 md:p-5 text-center font-bold uppercase text-base md:text-lg flex items-center justify-center gap-2 active:bg-la-orange active:border-la-orange transition-colors"
                  >
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    Call Now
                  </a>
                ) : (
                  <div className="border-4 border-gray-300 bg-gray-100 text-gray-400 p-4 md:p-5 text-center font-bold uppercase text-base md:text-lg flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    No Phone
                  </div>
                )}
                
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`;
                    trackAndNavigate(barber.id, 'directions_click', url);
                  }}
                  className="border-4 border-black bg-white text-black p-4 md:p-5 text-center font-bold uppercase text-base md:text-lg flex items-center justify-center gap-2 active:bg-black active:text-white transition-colors"
                >
                  <Navigation className="w-5 h-5 md:w-6 md:h-6" />
                  Directions
                </button>
                
{barber.booking_url || barber.website ? (
                  <button
                    onClick={() => trackAndNavigate(
                      barber.id, 
                      barber.booking_url ? 'booking_click' : 'website_booking_click', 
                      barber.booking_url || barber.website!
                    )}
                    className="border-4 border-la-orange bg-la-orange text-white p-4 md:p-5 text-center font-bold uppercase text-base md:text-lg flex items-center justify-center gap-2 active:bg-black active:border-black transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
                    Book Now
                  </button>
                ) : (
                  <div className="border-4 border-gray-300 bg-gray-100 text-gray-400 p-4 md:p-5 text-center font-bold uppercase text-base md:text-lg flex items-center justify-center gap-2">
                    <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
                    Call to Book
                  </div>
                )}
              </div>

              {/* Reviews */}
                <div id="reviews-section" className="mb-12 scroll-mt-32 md:scroll-mt-24">
                  {reviews.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
                          Reviews
                        </h2>
                        {barber.review_count > reviews.length && (
                          <span className="text-sm text-gray-600">
                            Showing {reviews.length} of {barber.review_count}
                          </span>
                        )}
                      </div>

                      <div className="space-y-4 mb-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-2 border-black p-4 md:p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-bold text-lg mb-1">{review.reviewer_name || 'Anonymous'}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-black' : 'fill-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* View All Reviews on Google */}
                      {barber.review_count > reviews.length && (
                        <div className="border-2 border-black p-6 md:p-8 text-center bg-concrete/5">
                          <p className="text-gray-600 mb-4">
                            Want to see all {barber.review_count} reviews?
                          </p>
                          <button
                            onClick={() => {
                              const url = barber.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(barber.name)}&query_place_id=${barber.google_place_id || ''}`;
                              trackAndNavigate(barber.id, 'google_reviews_click', url);
                            }}
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase text-sm hover:bg-la-orange transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                            View All {barber.review_count} Reviews on Google
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
                        Reviews
                      </h2>
                      <div className="border-4 border-black p-8 md:p-12 text-center bg-concrete/5">
                        <Star className="w-16 h-16 mx-auto mb-4 fill-la-orange" />
                        <h3 className="text-xl md:text-2xl font-bold uppercase mb-3">
                          {barber.review_count} Google Reviews
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          This barber has {barber.review_count} reviews on Google. Check them out to see what people are saying!
                        </p>
                        <button
                          onClick={() => {
                            const url = barber.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(barber.name)}&query_place_id=${barber.google_place_id || ''}`;
                            trackAndNavigate(barber.id, 'google_reviews_click', url);
                          }}
                          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-bold uppercase text-sm md:text-base hover:bg-la-orange transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                          View All {barber.review_count} Reviews on Google
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

            {/* Right: Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Hours */}
                {barber.hours?.weekday_text && (
                  <div className="border-2 border-black p-6">
                    <h3 className="text-xl font-bold uppercase mb-4 tracking-tight flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Hours
                    </h3>
                    <div className="space-y-2 text-sm">
                      {barber.hours.weekday_text.map((day: string, idx: number) => {
                        const [dayName, hours] = day.split(': ');
                        return (
                          <div key={idx} className="flex justify-between">
                            <span>{dayName}</span>
                            <span className="font-bold">{hours}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="border-2 border-black p-6">
                  <h3 className="text-xl font-bold uppercase mb-4 tracking-tight">
                    Contact
                  </h3>
                  <div className="space-y-3">
                    {barber.phone && (
                      <a href={`tel:${barber.phone}`} className="flex items-center gap-3 hover:text-la-orange transition-colors">
                        <Phone className="w-5 h-5" />
                        <span className="font-medium">{barber.phone}</span>
                      </a>
                    )}
                    {barber.website && (
                      <a href={barber.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-la-orange transition-colors">
                        <Globe className="w-5 h-5" />
                        <span className="font-medium">Visit Website</span>
                      </a>
                    )}
                    {barber.instagram_handle && (
                      <a href={`https://instagram.com/${barber.instagram_handle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-la-orange transition-colors">
                        <Instagram className="w-5 h-5" />
                        <span className="font-medium">@{barber.instagram_handle}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="border-2 border-black p-6">
                  <h3 className="text-xl font-bold uppercase mb-4 tracking-tight flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <p className="text-sm mb-4">{barber.address}</p>
                  <div className="aspect-video mb-4 border-2 border-black overflow-hidden">
                    <MapEmbed lat={barber.lat} lng={barber.lng} height="100%" />
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      Get Directions
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 md:py-12 bg-black text-white">
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
              <Link href="/browse" className="text-sm uppercase tracking-wider hover:text-la-orange transition-colors">
                Browse
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
