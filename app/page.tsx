"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { Scissors, MapPin, Clock, Search, ArrowRight, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Barbershop {
  id: string;
  name: string;
  neighborhood: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  images: string[];
}

export default function Home() {
  const [barberCount, setBarberCount] = useState<number>(500);
  const [reviewCount, setReviewCount] = useState<number>(100000);
  const [featuredBarbers, setFeaturedBarbers] = useState<Barbershop[]>([]);

  useEffect(() => {
    async function fetchCounts() {
      // Get barber count
      const { count: barbers } = await supabase
        .from('barbershops')
        .select('*', { count: 'exact', head: true });

      // Get review count
      const { count: reviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      if (barbers) setBarberCount(barbers);
      if (reviews) setReviewCount(reviews);
    }

    async function fetchFeaturedBarbers() {
      const { data } = await supabase
        .from('barbershops')
        .select('id, name, neighborhood, rating, review_count, price_range, images')
        .not('images', 'is', null)
        .gte('rating', 4.5)
        .order('rating', { ascending: false })
        .limit(6);

      if (data) {
        // Filter to only show barbers with images
        const withImages = data.filter(b => b.images && b.images.length > 0);
        setFeaturedBarbers(withImages);
      }
    }

    fetchCounts();
    fetchFeaturedBarbers();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Navigation - Mobile Optimized */}
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
              <Button variant="primary" size="sm" className="text-xs md:text-sm whitespace-nowrap">
                Need Cut Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - MOBILE ACTION FIRST */}
      <section className="border-b-4 border-black py-12 md:py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-la-orange opacity-5 -skew-x-12 transform translate-x-1/4"></div>

        <div className="container-brutal relative">
          <div className="max-w-5xl">
            {/* Massive headline */}
            <h1 className="text-brutal-display mb-6 md:mb-8 leading-none">
              FIND YOUR<br />
              <span className="text-la-orange">BARBER</span><br />
              IN 30 SEC
            </h1>


            {/* BRUTAL CTA BUTTONS - DESKTOP OPTIMIZED HOVERS */}
            <div className="space-y-4 mb-8">
              <Link href="/match" className="block group">
                <div className="border-4 border-black bg-black text-white p-6 md:p-8 active:scale-[0.98] transition-all duration-200 min-h-[100px] flex items-center justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-la-orange/20">
                  <div className="absolute inset-0 bg-la-orange translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></div>
                  <div className="absolute inset-0 border-4 border-la-orange opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  <div className="flex-1 relative z-10">
                    <div className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 group-hover:text-black transition-colors duration-400">FIND MY BARBER</div>
                    <div className="text-sm md:text-base opacity-90 group-hover:text-black/80 transition-colors duration-400">3 questions · Smart matching · LA's best</div>
                  </div>
                  <ArrowRight className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ml-4 relative z-10 group-hover:translate-x-2 group-hover:text-black transition-all duration-400" />
                </div>
              </Link>

              <Link href="/browse?urgency=now" className="block group">
                <div className="border-4 border-la-orange bg-la-orange text-white p-6 md:p-8 active:scale-[0.98] transition-all duration-200 min-h-[100px] flex items-center justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-black/20">
                  <div className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></div>
                  <div className="absolute inset-0 border-4 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  <div className="flex-1 relative z-10">
                    <div className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 group-hover:text-white transition-colors duration-400">CUT TODAY</div>
                    <div className="text-sm md:text-base opacity-90 group-hover:text-white/90 transition-colors duration-400">Open right now · Walk-ins welcome · Drive time</div>
                  </div>
                  <Clock className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ml-4 relative z-10 group-hover:rotate-12 group-hover:text-white transition-all duration-400" />
                </div>
              </Link>
            </div>

            {/* LA PROOF - NUMBERS DON'T LIE */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-bold text-black">
              <div className="flex items-center gap-2 hover:text-la-orange transition-colors cursor-default">
                <div className="w-3 h-3 bg-la-orange rotate-45 animate-pulse"></div>
                <span>{barberCount.toLocaleString()}+ BARBERS</span>
              </div>
              <div className="flex items-center gap-2 hover:text-la-orange transition-colors cursor-default">
                <div className="w-3 h-3 bg-la-orange rotate-45 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>{reviewCount.toLocaleString()}+ REVIEWS</span>
              </div>
              <div className="flex items-center gap-2 hover:text-la-orange transition-colors cursor-default">
                <div className="w-3 h-3 bg-la-orange rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>ALL HAIR TYPES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BARBERS - LA'S FINEST */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-white">
        <div className="container-brutal">
          {/* Section Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-brutal-hero">
                LA'S <span className="text-la-orange">FINEST</span>
              </h2>
              <Link
                href="/browse"
                className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-lg md:text-xl text-gray-600">
              Top-rated barbers trusted by LA
            </p>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {featuredBarbers.map((barber) => (
              <Link
                key={barber.id}
                href={`/barbers/${barber.id}`}
                className="group h-full"
              >
                <div className="h-full flex flex-col border-4 border-black overflow-hidden bg-white hover:border-la-orange transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                    {barber.images?.[0] && (
                      <img
                        src={barber.images[0]}
                        alt={barber.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {/* Rating Badge */}
                    {barber.rating && (
                      <div className="absolute top-4 right-4 bg-black text-white px-3 py-2 flex items-center gap-1 font-bold">
                        <Star className="w-4 h-4 fill-white" />
                        {barber.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 md:p-6 bg-white">
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2 group-hover:text-la-orange transition-colors">
                      {barber.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {barber.neighborhood || 'LA'}
                      </div>
                      {barber.price_range && (
                        <span className="font-bold text-black">{barber.price_range}</span>
                      )}
                    </div>
                    {barber.review_count > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {barber.review_count} reviews
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="text-center md:hidden">
            <Link href="/browse">
              <Button variant="secondary" size="lg" className="w-full">
                View All Barbers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Match Preview - MOBILE OPTIMIZED */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-black text-white">
        <div className="container-brutal">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
            <h2 className="text-brutal-hero mb-4">HOW WE ROLL</h2>
            <p className="text-lg md:text-xl text-gray-300">
              Three questions. Perfect match. LA's way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Step 1 - Interactive */}
            <div className="bg-white text-black p-6 md:p-8 border-4 border-white text-center hover:border-la-orange hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-la-orange text-white flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase mb-2 tracking-tight group-hover:text-la-orange transition-colors">YOUR HAIR</h3>
              <p className="text-sm md:text-base text-gray-700">
                4C · Curly · Wavy · Straight · Whatever
              </p>
            </div>

            {/* Step 2 - Interactive */}
            <div className="bg-white text-black p-6 md:p-8 border-4 border-white text-center hover:border-la-orange hover:scale-105 transition-all duration-300 cursor-pointer group" style={{ transitionDelay: '0.1s' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-la-orange text-white flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto mb-4 group-hover:-rotate-12 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase mb-2 tracking-tight group-hover:text-la-orange transition-colors">YOUR STYLE</h3>
              <p className="text-sm md:text-base text-gray-700">
                Fade · Lineup · Beard · Fresh Cut
              </p>
            </div>

            {/* Step 3 - Interactive */}
            <div className="bg-white text-black p-6 md:p-8 border-4 border-white text-center hover:border-la-orange hover:scale-105 transition-all duration-300 cursor-pointer group" style={{ transitionDelay: '0.2s' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-la-orange text-white flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase mb-2 tracking-tight group-hover:text-la-orange transition-colors">YOUR VIBE</h3>
              <p className="text-sm md:text-base text-gray-700">
                Budget · Premium · Walk-In · LA Cool
              </p>
            </div>
          </div>

          {/* BRUTAL CTA - DESKTOP OPTIMIZED */}
          <div className="text-center">
            <Link href="/match" className="block group">
              <div className="inline-flex items-center gap-4 bg-white text-black px-12 py-8 border-4 border-white active:scale-95 transition-all duration-200 text-xl md:text-2xl font-bold uppercase tracking-tight min-h-[80px] relative overflow-hidden hover:shadow-2xl hover:shadow-la-orange/30">
                <div className="absolute inset-0 bg-la-orange translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"></div>
                <div className="absolute inset-0 border-4 border-la-orange opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-400">FIND MY BARBER</span>
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 relative z-10 group-hover:translate-x-2 group-hover:text-white transition-all duration-400" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - MOBILE FIRST, NO HOVERS */}
      <section className="border-b-4 border-black py-12 md:py-16 bg-white">
        <div className="container-brutal">
          <h2 className="text-brutal-hero mb-8 md:mb-12 text-center">
            WHY <span className="text-la-orange">LA BARBER GUIDE</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Feature 1 - Hair Type Match */}
            <Link href="/match" className="block">
              <div className="border-4 border-black p-6 md:p-8 bg-white active:bg-la-orange active:text-white transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-4">
                  <Scissors className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight">HAIR TYPE<br />MATCH</h3>
                <p className="text-sm md:text-base text-gray-700">
                  Find barbers who know YOUR hair type
                </p>
              </div>
            </Link>

            {/* Feature 2 - All Hoods */}
            <Link href="/browse" className="block">
              <div className="border-4 border-black p-6 md:p-8 bg-white active:bg-la-orange active:text-white transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight">ALL LA<br />HOODS</h3>
                <p className="text-sm md:text-base text-gray-700">
                  Venice to Valley. Every neighborhood
                </p>
              </div>
            </Link>

            {/* Feature 3 - Open Now */}
            <Link href="/need-cut-now" className="block">
              <div className="border-4 border-black p-6 md:p-8 bg-la-orange text-white active:bg-black transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-white text-black flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight">OPEN<br />RIGHT NOW</h3>
                <p className="text-sm md:text-base opacity-90">
                  Real-time data. Walk-ins. Instant info
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - MOBILE OPTIMIZED */}
      <section className="py-16 md:py-24 lg:py-32 bg-la-orange text-white relative overflow-hidden">
        {/* Diagonal stripes background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, black 0, black 2px, transparent 0, transparent 20px)'
          }}></div>
        </div>

        <div className="container-brutal text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brutal-display mb-8 md:mb-12">
              FIND YOUR<br />BARBER NOW
            </h2>

            <Link href="/match" className="block mb-6">
              <Button
                variant="secondary"
                size="lg"
                icon={<ArrowRight className="w-7 h-7" />}
                className="w-full md:w-auto bg-white text-black active:bg-black active:text-white border-white text-2xl py-10 px-16 min-h-[100px]"
              >
                START MATCHING
              </Button>
            </Link>

            <p className="text-base md:text-lg">
              Or{" "}
              <Link href="/browse" className="underline font-bold active:no-underline">
                browse all 500+ barbers
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 md:py-12 bg-black text-white">
        <div className="container-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-12">
            <div>
              <Logo size="md" className="mb-3 invert" />
              <p className="text-sm md:text-base text-gray-400">The best barbers in LA. Period.</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8">
              <Link href="/about" className="text-xs md:text-sm uppercase tracking-wider hover:text-la-orange transition-colors font-medium">
                About
              </Link>
              <Link href="/blog" className="text-xs md:text-sm uppercase tracking-wider hover:text-la-orange transition-colors font-medium">
                Blog
              </Link>
              <a href="mailto:support@pagestash.app?subject=LA Barber Guide - Contact" className="text-xs md:text-sm uppercase tracking-wider hover:text-la-orange transition-colors font-medium">
                Contact
              </a>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs md:text-sm text-gray-500">
            <p>© 2025 LA Barber Guide. All rights reserved.</p>
            <div className="flex gap-4 md:gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/feedback" className="hover:text-la-orange transition-colors">Feedback</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

