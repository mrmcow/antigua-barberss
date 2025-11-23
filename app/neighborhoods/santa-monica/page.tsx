import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Star, Phone, Calendar, ArrowLeft, Diamond } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Barbers in Santa Monica - Beach & Pier Area Tourist Friendly",
  description: "Top-rated barbers near Santa Monica Pier, beach, and Third Street Promenade. Perfect for tourists staying at beachfront hotels or visiting the pier.",
  keywords: "Santa Monica barbers, barber near Santa Monica Pier, beach barber Santa Monica, Third Street Promenade barber, tourist barber Santa Monica beach",
};

export default function SantaMonicaBarbersPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b-2 border-black">
        <div className="container-brutal py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-white">
        <div className="container-brutal">
          <div className="max-w-4xl">
            <h1 className="text-brutal-hero mb-6 leading-none">
              BEST BARBERS<br />
              <span className="text-la-orange">SANTA MONICA</span>
            </h1>
            
            <div className="mb-8 text-lg text-gray-700 leading-relaxed">
              Fresh cuts by the beach! Top-rated barbers near <strong>Santa Monica Pier</strong>, 
              <strong>Third Street Promenade</strong>, and beachfront hotels. Perfect for tourists 
              wanting a quality cut between beach activities and pier attractions.
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/browse?location=santa-monica">
                <Button variant="primary">
                  View Santa Monica Barbers
                </Button>
              </Link>
              <Link href="/need-cut-now?location=santa-monica">
                <Button variant="secondary">
                  Need Cut Now - Beach Area
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Features */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-brutal">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            THE <span className="text-la-orange">BEVERLY HILLS</span> EXPERIENCE
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border-2 border-black">
              <Diamond className="w-12 h-12 text-la-orange mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">CELEBRITY STYLISTS</h3>
              <p className="text-gray-600">
                Barbers who work with A-list celebrities, influencers, and Hollywood executives. Red-carpet ready cuts.
              </p>
            </Card>
            
            <Card className="p-6 text-center border-2 border-black">
              <Star className="w-12 h-12 text-la-orange mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">PREMIUM TREATMENTS</h3>
              <p className="text-gray-600">
                Hot towel services, scalp massages, premium product lines, and luxury salon experiences.
              </p>
            </Card>
            
            <Card className="p-6 text-center border-2 border-black">
              <MapPin className="w-12 h-12 text-la-orange mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">PRIME LOCATIONS</h3>
              <p className="text-gray-600">
                Walking distance from Rodeo Drive, luxury hotels, and Beverly Hills' most exclusive shopping.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing & Service Tiers */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-brutal">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                SERVICE <span className="text-la-orange">TIERS</span>
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-la-orange pl-6">
                  <h3 className="font-bold text-lg mb-2 text-la-orange">💎 CELEBRITY TIER ($150-300)</h3>
                  <p className="text-gray-700 mb-2">
                    A-list celebrity stylists. Featured in magazines, work with movie stars. 
                    Full luxury experience with private rooms and premium products.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Perfect for:</strong> Special occasions, business executives, luxury hotel guests
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-400 pl-6">
                  <h3 className="font-bold text-lg mb-2">⭐ PREMIUM TIER ($80-150)</h3>
                  <p className="text-gray-700 mb-2">
                    High-end stylists with celebrity clientele. Professional service, 
                    luxury amenities, and Instagram-worthy results.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Perfect for:</strong> Tourists wanting luxury experience, special events
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-300 pl-6">
                  <h3 className="font-bold text-lg mb-2">✨ BOUTIQUE TIER ($50-80)</h3>
                  <p className="text-gray-700 mb-2">
                    Upscale neighborhood shops in Beverly Hills. Quality cuts with 
                    some luxury touches at more accessible prices.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Perfect for:</strong> Quality-focused tourists, local Beverly Hills residents
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                LUXURY <span className="text-la-orange">AMENITIES</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">
                  <div className="w-3 h-3 bg-la-orange rounded-full"></div>
                  <span className="font-medium">Valet parking & concierge service</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">
                  <div className="w-3 h-3 bg-la-orange rounded-full"></div>
                  <span className="font-medium">Premium liquor & champagne service</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">
                  <div className="w-3 h-3 bg-la-orange rounded-full"></div>
                  <span className="font-medium">Private suites & executive treatment rooms</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">
                  <div className="w-3 h-3 bg-la-orange rounded-full"></div>
                  <span className="font-medium">Hot towel service & scalp massage</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">
                  <div className="w-3 h-3 bg-la-orange rounded-full"></div>
                  <span className="font-medium">High-end product lines (Tom Ford, Kiehl's)</span>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200">
                  <div className="w-3 h-3 bg-la-orange rounded-full"></div>
                  <span className="font-medium">Same-day appointments for hotel guests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-12 md:py-16 bg-black text-white">
        <div className="container-brutal text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            EXPERIENCE <span className="text-la-orange">BEVERLY HILLS LUXURY</span>
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Get the celebrity treatment you deserve. Premium barbers, luxury service, world-class results.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/match?location=beverly-hills&tier=luxury">
              <Button variant="primary" className="bg-la-orange hover:bg-orange-600">
                Book Celebrity Barber
              </Button>
            </Link>
            <Link href="/browse?location=beverly-hills">
              <Button variant="secondary" className="border-white text-white hover:bg-white hover:text-black">
                Browse All Beverly Hills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black py-8 bg-white">
        <div className="container-brutal text-center">
          <Logo size="sm" className="mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            © 2025 LA Barber Guide. Your gateway to Beverly Hills' finest barbers.
          </p>
        </div>
      </footer>
    </main>
  );
}
