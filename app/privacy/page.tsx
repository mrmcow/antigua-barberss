import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — LA Barber Guide",
  description: "How LA Barber Guide handles your data. Simple, transparent, no bullshit.",
  robots: "index, follow",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="md" />
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
            PRIVACY
            <span className="block text-orange-500">POLICY</span>
          </h1>
          <p className="text-xl text-zinc-400">
            How we handle your data. Simple and transparent.
          </p>
        </div>

        <div className="space-y-12 text-zinc-300">
          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">THE REAL TALK</h2>
            <p className="mb-4">
              We're not here to sell your data or spam you. LA Barber Guide exists to help you find good barbers, period. 
              Here's exactly what we do with your information:
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">WHAT WE COLLECT</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">When You Use Our Site:</h3>
                <ul className="list-disc list-inside space-y-2 text-zinc-400">
                  <li>Your hair type, style preferences, and location (only what you tell us)</li>
                  <li>Which barbers you click on (to improve our matching)</li>
                  <li>Basic web stuff: IP address, browser type, pages visited</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">When You Contact Us:</h3>
                <ul className="list-disc list-inside space-y-2 text-zinc-400">
                  <li>Your name and email (obviously)</li>
                  <li>Whatever you write in your message</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">WHAT WE DON'T DO</h2>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Sell your data to third parties</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Send you marketing emails (unless you specifically ask)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Track you across other websites</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>Store your personal info longer than needed</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">HOW WE USE YOUR INFO</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Matching You With Barbers:</h3>
                <p className="text-zinc-400">
                  Your hair type and style preferences help us show you relevant barber shops. 
                  This data stays on our servers and isn't shared with anyone.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Improving The Site:</h3>
                <p className="text-zinc-400">
                  We look at which barbers get clicked most to understand what people are looking for. 
                  This is all anonymous data - we don't tie it back to you personally.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Analytics:</h3>
                <p className="text-zinc-400">
                  We use basic analytics to see how many people visit the site and which pages are popular. 
                  Nothing creepy, just standard website metrics.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">THIRD PARTY STUFF</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Google Maps:</h3>
                <p className="text-zinc-400">
                  We show maps and directions using Google Maps. Google has their own privacy policy for that.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">Barbershop Data:</h3>
                <p className="text-zinc-400">
                  All barber information comes from Google Places and public sources. 
                  We don't create fake reviews or manipulate ratings.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">YOUR RIGHTS</h2>
            <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
              <p className="text-zinc-300">
                <strong>Want your data deleted?</strong> Email us at hello@labarberguide.xyz and we'll remove it.
              </p>
              <p className="text-zinc-300">
                <strong>Want to know what we have?</strong> Same email - we'll tell you everything.
              </p>
              <p className="text-zinc-300">
                <strong>Found an error?</strong> Let us know and we'll fix it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">CHANGES TO THIS POLICY</h2>
            <p className="text-zinc-400">
              If we change this policy, we'll update this page. We're not going to email you about every tiny change 
              unless it's something major that affects how we handle your data.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-2xl text-white mb-4">CONTACT US</h2>
            <p className="text-zinc-400">
              Questions about privacy? Email us at{" "}
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
