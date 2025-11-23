import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Star, Phone, Calendar, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Best Barbers in Hollywood, Los Angeles - Walk-ins & Tourist Friendly",
  description: "Find the perfect barber in Hollywood, LA. Near Hollywood Walk of Fame, tourist hotels, and attractions. Same-day appointments available for visitors.",
  keywords: "Hollywood barbers, barber near Hollywood Walk of Fame, tourist barber Hollywood, Hollywood Boulevard barber, best barber Hollywood LA, celebrity barber Hollywood",
};

export default function HollywoodBarbersPage() {
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
              BEST BARBERS IN <span className="text-la-orange">HOLLYWOOD</span>
            </h1>
            
            <div className="mb-8 text-lg text-gray-700 leading-relaxed">
              Getting a fresh cut while exploring Hollywood? We've got you covered with the best barbers near 
              <strong> Hollywood Walk of Fame</strong>, <strong>TCL Chinese Theatre</strong>, and <strong>Hollywood Boulevard</strong>. 
              All shops welcome tourists with same-day appointments and walk-ins.
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/browse?location=hollywood">
                <Button variant="primary">
                  View All Hollywood Barbers
                </Button>
              </Link>
              <Link href="/need-cut-now?location=hollywood">
                <Button variant="secondary">
                  Need Cut Now in Hollywood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tourist-Focused Features */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-brutal">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            WHY TOURISTS <span className="text-la-orange">CHOOSE US</span> IN HOLLYWOOD
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border-2 border-black">
              <MapPin className="w-12 h-12 text-la-orange mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">TOURIST HOTSPOTS</h3>
              <p className="text-gray-600">
                Barbers within walking distance of Hollywood Walk of Fame, Universal Studios, and major hotels
              </p>
            </Card>
            
            <Card className="p-6 text-center border-2 border-black">
              <Calendar className="w-12 h-12 text-la-orange mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">SAME-DAY BOOKING</h3>
              <p className="text-gray-600">
                No advance planning needed. Most shops accept walk-ins or same-day online appointments
              </p>
            </Card>
            
            <Card className="p-6 text-center border-2 border-black">
              <Star className="w-12 h-12 text-la-orange mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">TOURIST-TESTED</h3>
              <p className="text-gray-600">
                Verified reviews from visitors. English-speaking barbers who understand tourist needs
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Location-Specific Info */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-brutal">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                HOLLYWOOD <span className="text-la-orange">BARBER DISTRICTS</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">🎬 Hollywood Boulevard (Tourist Central)</h3>
                  <p className="text-gray-700">
                    The main strip with Walk of Fame. Barbers here are used to tourists and offer quick, 
                    quality cuts between sightseeing. Expect higher prices but tourist-friendly service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">🌟 West Hollywood (Trendy & Upscale)</h3>
                  <p className="text-gray-700">
                    Celebrity-favorite barbers and high-end shops. Perfect if you're staying in WeHo hotels 
                    or want that LA celebrity treatment experience.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">🏠 Hollywood Hills (Local Gems)</h3>
                  <p className="text-gray-700">
                    Neighborhood spots with better prices and less tourist crowds. Great if you have a rental car 
                    and want authentic LA barber experience.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                TOURIST <span className="text-la-orange">QUICK TIPS</span>
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-la-orange text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">1</div>
                  <div>
                    <strong>Best Times:</strong> Weekday mornings (9-11am) for shorter waits and tourist-friendly attention
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-la-orange text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">2</div>
                  <div>
                    <strong>Pricing:</strong> Hollywood Boulevard: $40-80 | West Hollywood: $50-100 | Neighborhood: $25-50
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-la-orange text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">3</div>
                  <div>
                    <strong>Parking:</strong> Most shops validate parking or have nearby lots. Street parking limited on weekends.
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-la-orange text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">4</div>
                  <div>
                    <strong>Language:</strong> All our featured barbers speak English fluently and welcome international visitors
                  </div>
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
            READY FOR YOUR <span className="text-la-orange">HOLLYWOOD CUT?</span>
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Find the perfect barber for your Hollywood adventure in 30 seconds
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/match?location=hollywood">
              <Button variant="primary" className="bg-la-orange hover:bg-orange-600">
                Find My Hollywood Barber
              </Button>
            </Link>
            <Link href="/browse?location=hollywood">
              <Button variant="secondary" className="border-white text-white hover:bg-white hover:text-black">
                Browse All Hollywood Shops
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
            © 2025 LA Barber Guide. The authentic guide to LA's best barbers.
          </p>
        </div>
      </footer>
    </main>
  );
}
