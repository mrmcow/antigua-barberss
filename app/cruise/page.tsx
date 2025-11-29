import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Anchor, Clock, MapPin, ArrowRight, Ship, AlertTriangle } from "lucide-react";

export default function CruisePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link href="/browse" className="text-sm md:text-base uppercase tracking-wider hover:text-antigua-coral transition-colors font-bold">
              ALL BARBERS
            </Link>
            <Link href="/browse?mobile=true">
              <Button variant="primary" size="sm" className="text-xs md:text-sm whitespace-nowrap">
                Mobile Service
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Cruise Focused */}
      <section className="border-b-4 border-black py-12 md:py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-antigua-navy opacity-5 -skew-x-12 transform translate-x-1/4"></div>
        
        <div className="container-brutal relative">
          <div className="max-w-5xl">
            <h1 className="text-brutal-display mb-6 md:mb-8 leading-none">
              CRUISE SHIP<br />
              <span className="text-antigua-coral">PASSENGERS</span><br />
              WELCOME
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-700 font-medium max-w-3xl">
              Get a fresh cut and get back to your ship on time. 
              We know exactly how long everything takes.
            </p>

            {/* Time Input */}
            <div className="bg-antigua-navy text-white p-6 md:p-8 border-4 border-black mb-8 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Ship className="w-6 h-6 text-antigua-coral" />
                <h3 className="text-xl font-bold uppercase tracking-tight">WHAT TIME DOES YOUR SHIP LEAVE?</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">DEPARTURE TIME</label>
                  <select className="w-full p-3 bg-white text-black border-2 border-black font-bold">
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">SHIP NAME (OPTIONAL)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Royal Caribbean"
                    className="w-full p-3 bg-white text-black border-2 border-black"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button variant="secondary" size="lg" className="w-full">
                  <Clock className="w-5 h-5 mr-2" />
                  FIND CRUISE-SAFE BARBERS
                </Button>
              </div>
            </div>

            {/* Safety Promise */}
            <div className="flex items-start gap-4 p-6 bg-antigua-coral text-white border-4 border-black max-w-2xl">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2">OUR CRUISE-SAFE GUARANTEE</h4>
                <p className="text-sm leading-relaxed">
                  We'll get you back to port <strong>2 hours before departure</strong>. 
                  All our recommended barbers know the cruise schedule and timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Walking Distance From Port */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-antigua-turquoise text-black">
        <div className="container-brutal">
          <h2 className="text-brutal-hero mb-8 text-center">
            BARBERS <span className="text-white">NEAR THE PORT</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Walking Distance */}
            <div className="bg-white p-6 border-4 border-black text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl">5</span>
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">MINUTE WALK</h3>
              <p className="text-gray-700">
                Closest barbers to Heritage Quay cruise port
              </p>
              <div className="mt-4">
                <Link href="/browse?walk_time=5">
                  <Button variant="outline" size="sm">VIEW BARBERS</Button>
                </Link>
              </div>
            </div>

            {/* Short Taxi */}
            <div className="bg-white p-6 border-4 border-black text-center">
              <div className="w-16 h-16 bg-antigua-coral text-white flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl">10</span>
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">MINUTE TAXI</h3>
              <p className="text-gray-700">
                Best barbers in St. John's downtown area
              </p>
              <div className="mt-4">
                <Link href="/browse?walk_time=15">
                  <Button variant="outline" size="sm">VIEW BARBERS</Button>
                </Link>
              </div>
            </div>

            {/* Mobile Service */}
            <div className="bg-white p-6 border-4 border-black text-center">
              <div className="w-16 h-16 bg-antigua-gold text-white flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-2">MEETS YOU</h3>
              <p className="text-gray-700">
                Mobile barbers come to you at the port area
              </p>
              <div className="mt-4">
                <Link href="/browse?mobile=true">
                  <Button variant="outline" size="sm">VIEW MOBILE</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Cruise Passengers */}
      <section className="border-b-4 border-black py-12 md:py-20 bg-white">
        <div className="container-brutal">
          <h2 className="text-brutal-hero mb-12 text-center">
            HOW IT <span className="text-antigua-coral">WORKS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-antigua-navy text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-black">
                1
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">TELL US YOUR DEPARTURE TIME</h3>
              <p className="text-gray-600 text-sm">
                We filter barbers who can safely get you back in time
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-antigua-coral text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-black">
                2
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">CHOOSE YOUR DISTANCE</h3>
              <p className="text-gray-600 text-sm">
                Walking distance, short taxi, or mobile service to port
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-antigua-turquoise text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-black">
                3
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">GET YOUR CUT</h3>
              <p className="text-gray-600 text-sm">
                Professional barbers who know cruise passenger needs
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-antigua-gold text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-4 border-black">
                4
              </div>
              <h3 className="text-lg font-bold uppercase mb-2">BACK TO SHIP</h3>
              <p className="text-gray-600 text-sm">
                Plenty of time to get back, grab lunch, and board
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-antigua-coral text-white">
        <div className="container-brutal text-center">
          <h2 className="text-brutal-display mb-8">
            READY FOR A<br />FRESH CUT?
          </h2>
          
          <Link href="/browse?cruise=true">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-black hover:bg-black hover:text-white border-white text-2xl py-8 px-12"
              icon={<ArrowRight className="w-6 h-6" />}
            >
              FIND CRUISE-SAFE BARBERS
            </Button>
          </Link>
          
          <p className="mt-6 text-lg">
            Or <Link href="tel:+1268000000" className="underline font-bold">call us at +1 (268) 000-0000</Link> for help
          </p>
        </div>
      </section>
    </main>
  );
}
