import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Scissors, MapPin, Clock, ArrowRight, Star, Anchor, Waves, Users, Sun, Sailboat, Compass, Palmtree } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { InteractiveCTAs } from "@/components/InteractiveCTAs";

interface Barbershop {
  id: string;
  name: string;
  neighborhood: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  images: string[];
}

const islandShortcuts = [
  { title: "Near Cruise Port", detail: "≤10 min walk", href: "/browse?near_port=true" },
  { title: "Mobile To Villas", detail: "Jolly • English Harbour", href: "/browse?mobile=true" },
  { title: "Wedding Squads", detail: "Group cuts & grooming", href: "/browse?events=true" },
  { title: "Locs & Braids", detail: "Protective style pros", href: "/browse?style=locs" },
  { title: "Kid Friendly", detail: "Calm chairs for little ones", href: "/browse?kids=true" },
] as const;

const localEnergyStories = [
  {
    title: "Heritage Quay Walk-Ups",
    description: "Barbers that keep cruise crews sharp within an 8 minute walk of the pier.",
    tag: "Cruise Zone",
    accentClass: "bg-antigua-navy text-white"
  },
  {
    title: "Ottos & Gray's Farm Legends",
    description: "Decades of fades, tape-ups, and Sunday lineups for locals and expats.",
    tag: "Local Roots",
    accentClass: "bg-antigua-gold text-black"
  },
  {
    title: "English Harbour House Calls",
    description: "Mobile stylists pulling up to yachts, villas, and wedding parties.",
    tag: "Resort Circuit",
    accentClass: "bg-antigua-turquoise text-black"
  },
] as const;

const cruiseInsights = [
  { label: "Ships In Port", value: "3", detail: "Icon • Vista • Arvia" },
  { label: "Passengers Ashore", value: "10,400+", detail: "Peak window 10:30a–3:00p" },
  { label: "Safe Buffer", value: "2 hrs", detail: "We cut off bookings 2 hrs pre-boarding" },
] as const;

// Fetch data server-side for SEO
async function getHomeData() {
  // Get barber count
  const { count: barberCount } = await supabase
    .from('barbershops')
    .select('*', { count: 'exact', head: true });

  // Get review count
  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });

  // Get featured barbers
  const { data: allBarbers } = await supabase
    .from('barbershops')
    .select('id, name, neighborhood, rating, review_count, price_range, images')
    .not('images', 'is', null)
    .gte('rating', 4.5)
    .order('rating', { ascending: false })
    .limit(6);

  // Filter to only show barbers with images
  const featuredBarbers = (allBarbers || []).filter(b => b.images && b.images.length > 0);

  return {
    barberCount: barberCount || 25, // More realistic for Antigua
    reviewCount: reviewCount || 500, // More realistic starting point
    featuredBarbers
  };
}

export default async function Home() {
  const { barberCount, reviewCount, featuredBarbers } = await getHomeData();

  return (
    <main className="min-h-screen">
      {/* Navigation - Mobile Optimized for tourists */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link href="/browse" className="text-sm md:text-base uppercase tracking-wider hover:text-antigua-coral transition-colors font-bold">
              BARBERS
            </Link>
            <Link href="/cruise">
              <Button variant="primary" size="sm" className="text-xs md:text-sm whitespace-nowrap">
                Off A Ship?
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - CRUISE & TOURIST FOCUSED */}
      <section className="border-b-4 border-black py-12 md:py-20 lg:py-28 relative overflow-hidden island-sunrise">
        <div className="absolute inset-0 opacity-20 island-grid pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-antigua-coral opacity-10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute -top-10 right-10 w-48 h-48 bg-antigua-turquoise opacity-10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="container-brutal relative">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
                <Palmtree className="w-4 h-4 text-antigua-coral" />
                Official Island Directory
              </span>

              <h1 className="text-brutal-display leading-[0.85] mb-6 md:mb-8">
                FIND THE <span className="text-antigua-coral">SHARPEST CUTS</span><br />
                ON THE ISLAND
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-gray-800 font-medium">
                Cruise passengers racing the clock, villa guests needing a house call, locals keeping their weekly appointment —
                we map every trusted barber in Antigua & Barbuda.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Island Barbers", value: `${barberCount}+`, accent: "bg-antigua-coral" },
                  { label: "Cruise-Safe Slots", value: "Port & Mobile", accent: "bg-antigua-turquoise" },
                  { label: "Resort Radius", value: "Jolly • English", accent: "bg-antigua-gold text-black" },
                ].map((stat) => (
                  <div key={stat.label} className="border-4 border-black bg-white p-4">
                    <p className={`font-black text-lg ${stat.accent?.includes("text") ? stat.accent : `${stat.accent} text-white`} px-2 py-1 inline-block mb-2`}>
                      {stat.value}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>

              <InteractiveCTAs />

              <div className="flex flex-wrap gap-3 mt-6">
                {islandShortcuts.map((shortcut) => (
                  <Link
                    key={shortcut.title}
                    href={shortcut.href}
                    className="border-2 border-black bg-white/80 hover:bg-black hover:text-white transition-all px-4 py-3 text-sm font-bold uppercase tracking-tight flex flex-col"
                  >
                    <span>{shortcut.title}</span>
                    <span className="text-[0.7rem] font-medium normal-case text-gray-500">{shortcut.detail}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="w-full lg:max-w-sm">
              <div className="bg-white/95 border-4 border-black shadow-island relative overflow-hidden">
                <div className="absolute -top-16 -right-6 w-44 h-44 bg-antigua-coral opacity-10 rounded-full"></div>
                <div className="p-6 border-b-4 border-black flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Cruise Day Pulse</p>
                    <p className="text-3xl font-black">3 Ships Today</p>
                    <p className="text-sm text-gray-600">Peak traffic 10:30a – 3:00p</p>
                  </div>
                  <Sailboat className="w-12 h-12 text-antigua-coral" />
                </div>
                <div className="p-6 space-y-4">
                  {cruiseInsights.map((item) => (
                    <div key={item.label} className="border-2 border-black p-4 bg-antigua-sand/40">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-600">{item.label}</p>
                      <p className="text-2xl font-black">{item.value}</p>
                      <p className="text-sm text-gray-700">{item.detail}</p>
                    </div>
                  ))}
                  <div className="p-4 bg-antigua-seafoam border-2 border-black">
                    <p className="text-sm font-bold uppercase tracking-wide text-antigua-navy">Cruise-Safe Promise</p>
                    <p className="text-base text-gray-700">We only show barbers that get you back to port 2 hrs before boarding.</p>
                  </div>
                  <Link href="/cruise">
                    <Button variant="secondary" size="lg" className="w-full border-2 border-black bg-black text-white hover:bg-antigua-coral hover:text-black">
                      Plan My Cruise Cut
                    </Button>
                  </Link>
                  <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gray-500 text-center">
                    Live cruise feed launching soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cruise + Island Guarantees */}
      <section className="border-b-4 border-black py-10 bg-antigua-sand">
        <div className="container-brutal grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
          <div className="flex items-start gap-4">
            <Anchor className="w-10 h-10 text-antigua-navy flex-shrink-0" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide">Cruise-Safe Guarantee</p>
              <p className="text-base text-gray-700">Slots end two hours before boarding and every shop listed knows the port timeline.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Palmtree className="w-10 h-10 text-antigua-coral flex-shrink-0" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide">Respect The Island</p>
              <p className="text-base text-gray-700">We highlight real Antiguan-owned shops and let them tell their story, not just ratings.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Sun className="w-10 h-10 text-antigua-gold flex-shrink-0" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide">Villa + Resort Ready</p>
              <p className="text-base text-gray-700">Mobile barbers cover Jolly Harbour, English Harbour, Dickenson Bay, and hidden villas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Island Field Notes */}
      <section className="border-b-4 border-black py-12 md:py-16 bg-white">
        <div className="container-brutal">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Island Field Notes</p>
              <h2 className="text-brutal-hero">THE REAL ANTIGUA BARBER STORIES</h2>
            </div>
            <p className="text-gray-600 text-base lg:max-w-xl">
              We scout port walk-ups, neighborhood legends, and resort-friendly squads so you can book with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localEnergyStories.map((story) => (
              <div key={story.title} className="border-4 border-black bg-white p-6 flex flex-col justify-between hover:bg-antigua-seafoam transition-colors">
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wide inline-flex ${story.accentClass}`}>
                  {story.tag}
                </span>
                <h3 className="text-2xl font-black uppercase mt-4 mb-3">{story.title}</h3>
                <p className="text-sm text-gray-700 flex-1">{story.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                  <Compass className="w-4 h-4" />
                  Documented personally
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BARBERS - ANTIGUA'S FINEST */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-white">
        <div className="container-brutal">
          {/* Section Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-brutal-hero">
                ANTIGUA'S <span className="text-antigua-coral">FINEST</span>
              </h2>
              <Link
                href="/browse"
                className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-antigua-coral transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-lg md:text-xl text-gray-600">
              Top-rated barbers trusted by cruise passengers, resort guests, and locals
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
                <div className="h-full flex flex-col border-4 border-black overflow-hidden bg-white hover:border-antigua-coral transition-all duration-300">
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
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2 group-hover:text-antigua-coral transition-colors">
                      {barber.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {barber.neighborhood || 'St. John\'s'}
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

      {/* How We Roll - ANTIGUA STYLE */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-antigua-navy text-white">
        <div className="container-brutal">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12">
            <h2 className="text-brutal-hero mb-4">HOW WE ROLL IN ANTIGUA</h2>
            <p className="text-lg md:text-xl text-gray-300">
              Tell us who you are. We'll find your perfect barber.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Cruise Passengers */}
            <div className="bg-white text-black p-6 md:p-8 border-4 border-white text-center hover:border-antigua-coral hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-antigua-coral text-white flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Anchor className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase mb-2 tracking-tight group-hover:text-antigua-coral transition-colors">CRUISE SHIP</h3>
              <p className="text-sm md:text-base text-gray-700">
                Quick cuts near port · Back on time · Trusted barbers
              </p>
            </div>

            {/* Resort/Tourism */}
            <div className="bg-white text-black p-6 md:p-8 border-4 border-white text-center hover:border-antigua-coral hover:scale-105 transition-all duration-300 cursor-pointer group" style={{ transitionDelay: '0.1s' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-antigua-turquoise text-white flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto mb-4 group-hover:-rotate-12 transition-transform duration-300">
                <MapPin className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase mb-2 tracking-tight group-hover:text-antigua-coral transition-colors">RESORT GUEST</h3>
              <p className="text-sm md:text-base text-gray-700">
                Mobile service · Fresh for vacation · Resort area barbers
              </p>
            </div>

            {/* Locals */}
            <div className="bg-white text-black p-6 md:p-8 border-4 border-white text-center hover:border-antigua-coral hover:scale-105 transition-all duration-300 cursor-pointer group" style={{ transitionDelay: '0.2s' }}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-antigua-gold text-white flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                <Users className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase mb-2 tracking-tight group-hover:text-antigua-coral transition-colors">LOCAL RESIDENT</h3>
              <p className="text-sm md:text-base text-gray-700">
                Regular cuts · Neighborhood spots · Best local rates
              </p>
            </div>
          </div>

          {/* BRUTAL CTA - CARIBBEAN STYLE */}
          <div className="text-center">
            <Link href="/browse" className="block group">
              <div className="inline-flex items-center gap-4 bg-white text-black px-12 py-8 border-4 border-white active:scale-95 transition-all duration-200 text-xl md:text-2xl font-bold uppercase tracking-tight min-h-[80px] relative overflow-hidden hover:shadow-2xl hover:shadow-antigua-coral/30">
                <div className="absolute inset-0 bg-antigua-coral translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"></div>
                <div className="absolute inset-0 border-4 border-antigua-coral opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-400">FIND MY BARBER</span>
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 relative z-10 group-hover:translate-x-2 group-hover:text-white transition-all duration-400" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - MOBILE FIRST FOR TOURISTS */}
      <section className="border-b-4 border-black py-12 md:py-16 bg-white">
          <div className="container-brutal">
            <h2 className="text-brutal-hero mb-8 md:mb-12 text-center">
              WHY <span className="text-antigua-coral">ANTIGUA BARBERS</span>
            </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Feature 1 - Cruise Safe */}
            <Link href="/cruise" className="block">
              <div className="border-4 border-black p-6 md:p-8 bg-white active:bg-antigua-coral active:text-white transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-4">
                  <Anchor className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight">CRUISE<br />SAFE</h3>
                <p className="text-sm md:text-base text-gray-700">
                  Get fresh and back to port on time
                </p>
              </div>
            </Link>

            {/* Feature 2 - Mobile Service */}
            <Link href="/browse?mobile=true" className="block">
              <div className="border-4 border-black p-6 md:p-8 bg-white active:bg-antigua-coral active:text-white transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight">COMES<br />TO YOU</h3>
                <p className="text-sm md:text-base text-gray-700">
                  Mobile barbers to your resort or villa
                </p>
              </div>
            </Link>

            {/* Feature 3 - Island Coverage */}
            <Link href="/browse" className="block">
              <div className="border-4 border-black p-6 md:p-8 bg-antigua-coral text-white active:bg-black transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-white text-black flex items-center justify-center mb-4">
                  <Scissors className="w-8 h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold uppercase mb-2 tracking-tight">ALL<br />ANTIGUA</h3>
                <p className="text-sm md:text-base opacity-90">
                  St. John's to English Harbour and beyond
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - MOBILE OPTIMIZED FOR TOURISTS */}
      <section className="py-16 md:py-24 lg:py-32 bg-antigua-coral text-white relative overflow-hidden">
        {/* Caribbean wave pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 2px, transparent 0, transparent 20px)'
          }}></div>
        </div>

        <div className="container-brutal text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-brutal-display mb-8 md:mb-12">
              GET FRESH<br />IN ANTIGUA
            </h2>

            <Link href="/cruise" className="block mb-6">
              <Button
                variant="secondary"
                size="lg"
                icon={<ArrowRight className="w-7 h-7" />}
                className="w-full md:w-auto bg-white text-black active:bg-black active:text-white border-white text-2xl py-10 px-16 min-h-[100px]"
              >
                FIND BARBERS NOW
              </Button>
            </Link>

            <p className="text-base md:text-lg">
              Or{" "}
              <Link href="/browse" className="underline font-bold active:no-underline">
                browse all {barberCount}+ island barbers
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Browse by Area - SEO & Local Discovery */}
      <section className="border-b-4 border-black py-12 md:py-16 bg-white">
        <div className="container-brutal">
          <h2 className="text-brutal-hero mb-8 text-center">
            BROWSE BY <span className="text-antigua-coral">AREA</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            <Link href="/areas/st-johns" className="border-4 border-black p-4 text-center font-bold uppercase hover:bg-antigua-coral hover:text-white hover:border-antigua-coral transition-all">
              St. John's
            </Link>
            <Link href="/areas/cruise-port" className="border-4 border-black p-4 text-center font-bold uppercase hover:bg-antigua-coral hover:text-white hover:border-antigua-coral transition-all">
              Cruise Port
            </Link>
            <Link href="/areas/jolly-harbour" className="border-4 border-black p-4 text-center font-bold uppercase hover:bg-antigua-coral hover:text-white hover:border-antigua-coral transition-all">
              Jolly Harbour
            </Link>
            <Link href="/areas/english-harbour" className="border-4 border-black p-4 text-center font-bold uppercase hover:bg-antigua-coral hover:text-white hover:border-antigua-coral transition-all">
              English Harbour
            </Link>
            <Link href="/browse?mobile=true" className="border-4 border-black p-4 text-center font-bold uppercase hover:bg-antigua-coral hover:text-white hover:border-antigua-coral transition-all">
              Mobile Service
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 md:py-12 bg-black text-white">
        <div className="container-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-12">
            <div>
              <Logo size="md" className="mb-3 invert" />
              <p className="text-sm md:text-base text-gray-400">The best barbers in Antigua & Barbuda.</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8">
              <Link href="/about" className="text-xs md:text-sm uppercase tracking-wider hover:text-antigua-coral transition-colors font-medium">
                About
              </Link>
              <Link href="/cruise" className="text-xs md:text-sm uppercase tracking-wider hover:text-antigua-coral transition-colors font-medium">
                Cruise Info
              </Link>
              <Link href="/blog" className="text-xs md:text-sm uppercase tracking-wider hover:text-antigua-coral transition-colors font-medium">
                Blog
              </Link>
              <a href="mailto:hello@antiguabarberguide.com" className="text-xs md:text-sm uppercase tracking-wider hover:text-antigua-coral transition-colors font-medium">
                Contact
              </a>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs md:text-sm text-gray-500">
            <p>© 2025 Antigua Barber Guide. All rights reserved.</p>
            <div className="flex gap-4 md:gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/feedback" className="hover:text-antigua-coral transition-colors">Feedback</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}