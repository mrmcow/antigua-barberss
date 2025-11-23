import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — LA Barber Guide",
  description: "Terms of service for LA Barber Guide. Straight talk, no legal bullshit.",
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size={32} />
              <span className="font-bebas text-xl text-white">BARBER GUIDE</span>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/browse" className="text-zinc-400 hover:text-white transition-colors">
                BARBERS
              </Link>
              <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                ABOUT
              </Link>
              <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                CONTACT
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-bebas text-6xl sm:text-7xl text-white mb-6">
            TERMS OF
            <span className="block text-orange-500">SERVICE</span>
          </h1>
          <p className="text-xl text-zinc-400">
            The rules for using LA Barber Guide. No legal bullshit.
          </p>
        </div>

        <div className="space-y-12 text-zinc-300">
          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">THE BASICS</h2>
            <p className="mb-4">
              LA Barber Guide helps you find barbers in Los Angeles. Use it responsibly, don't be a dick, 
              and we'll all get along fine. Here are the actual rules:
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">WHAT YOU CAN DO</h2>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Search for and find barbers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Read reviews and view photos</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Contact barbers through their provided info</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Share the site with friends</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">WHAT YOU CAN'T DO</h2>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Scrape our data for competing services</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Post fake reviews or manipulate rankings</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Spam barbers or harass anyone</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Try to hack or break the site</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Use bots or automated tools to abuse the service</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">ABOUT THE BARBER INFO</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Data Sources:</h3>
                <p className="text-zinc-400">
                  All barber information comes from Google Places and other public sources. 
                  We do our best to keep it accurate, but things change.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Reviews:</h3>
                <p className="text-zinc-400">
                  Reviews are pulled from Google and other platforms. We don't write fake reviews, 
                  but we also don't control what people write.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Hours & Availability:</h3>
                <p className="text-zinc-400">
                  Hours and availability can change. Always call or check the barbershop's website 
                  before showing up.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">NOT OUR RESPONSIBILITY</h2>
            <div className="space-y-4">
              <p className="text-zinc-400">
                We're a directory, not your barber. Here's what we're <strong>not</strong> responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-zinc-400">
                <li>Bad haircuts (that's between you and your barber)</li>
                <li>Incorrect info (we source from public data that changes)</li>
                <li>Barber shop policies, prices, or availability</li>
                <li>Disputes between you and barber shops</li>
                <li>Your hair looking weird after a cut</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">FOR BARBER SHOP OWNERS</h2>
            <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
              <p className="text-zinc-300">
                <strong>Want your info updated?</strong> Contact us and we'll fix it.
              </p>
              <p className="text-zinc-300">
                <strong>Don't want to be listed?</strong> Let us know and we'll remove you.
              </p>
              <p className="text-zinc-300">
                <strong>Found incorrect information?</strong> We'll correct it ASAP.
              </p>
              <p className="text-zinc-300">
                Email us at{" "}
                <a href="mailto:hello@labarberguide.xyz" className="text-orange-500 hover:text-orange-400">
                  hello@labarberguide.xyz
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">INTELLECTUAL PROPERTY</h2>
            <p className="text-zinc-400">
              The LA Barber Guide website, design, and our matching algorithm are ours. 
              The barber information comes from public sources. Don't steal our stuff, 
              and we won't steal yours.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">CHANGES TO THESE TERMS</h2>
            <p className="text-zinc-400">
              We might update these terms occasionally. If we make big changes, 
              we'll let you know. Keep using the site after changes means you're cool with them.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">GOVERNING LAW</h2>
            <p className="text-zinc-400">
              These terms are governed by California law because that's where we are. 
              If we have a legal dispute, we'll handle it in Los Angeles courts.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">CONTACT</h2>
            <p className="text-zinc-400">
              Questions about these terms? Email us at{" "}
              <a href="mailto:hello@labarberguide.xyz" className="text-orange-500 hover:text-orange-400">
                hello@labarberguide.xyz
              </a>
            </p>
            <p className="text-zinc-500 text-sm mt-4">
              Last updated: November 23, 2025
            </p>
          </section>
        </div>

        <div className="text-center mt-16 pt-16 border-t border-zinc-800">
          <Link 
            href="/"
            className="inline-block bg-orange-500 text-black font-bebas text-xl px-8 py-4 rounded-lg hover:bg-orange-400 transition-colors"
          >
            BACK TO FINDING BARBERS
          </Link>
        </div>
      </main>
    </div>
  );
}
