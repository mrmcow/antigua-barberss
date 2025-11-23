import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About LA Barber Guide — Find Your Perfect Barber in Los Angeles",
  description: "LA Barber Guide helps you find the right barber in Los Angeles based on your hair type, style preferences, and neighborhood. Real reviews, verified locations.",
  keywords: "about LA barber guide, Los Angeles barbershops, find barbers LA, hair styling LA",
};

export default function AboutPage() {
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
              <Link href="/about" className="text-white font-medium">
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl text-white mb-6">
            ABOUT
            <span className="block text-orange-500">LA BARBER GUIDE</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            The fastest, smartest way to find your perfect barber in Los Angeles. 
            No more bad cuts, no more wasted time.
          </p>
        </div>

        {/* Story */}
        <div className="space-y-12 text-lg text-zinc-300 leading-relaxed">
          <section>
            <h2 className="font-bebas text-3xl text-white mb-6">THE PROBLEM</h2>
            <p>
              Finding a good barber in LA is fucking hard. You've got thousands of shops, 
              but which one actually knows how to cut your hair type? Which one matches your vibe? 
              Most directories just list shops alphabetically with fake reviews.
            </p>
            <p className="mt-4">
              We built LA Barber Guide because we were tired of rolling the dice on haircuts.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-3xl text-white mb-6">THE SOLUTION</h2>
            <p>
              Smart matching based on what actually matters: your hair type, the style you want, 
              and the vibe you're going for. We analyze thousands of real Google reviews using AI 
              to understand what each barber actually specializes in.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="font-bebas text-xl text-orange-500 mb-3">HAIR TYPE MATCHING</h3>
                <p className="text-sm text-zinc-400">Curly, straight, thick, fine — we match you with barbers who know your hair.</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="font-bebas text-xl text-orange-500 mb-3">STYLE EXPERTISE</h3>
                <p className="text-sm text-zinc-400">Fades, beard work, classic cuts — find barbers who excel at what you want.</p>
              </div>
              <div className="bg-zinc-900 p-6 rounded-lg">
                <h3 className="font-bebas text-xl text-orange-500 mb-3">VIBE MATCHING</h3>
                <p className="text-sm text-zinc-400">Trendy, classic, no-BS — get matched with shops that fit your energy.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-3xl text-white mb-6">HOW IT WORKS</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <span className="bg-orange-500 text-black font-bebas text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <p><strong>Tell us about your hair</strong> — type, texture, what you're looking for.</p>
              </div>
              <div className="flex items-start space-x-4">
                <span className="bg-orange-500 text-black font-bebas text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <p><strong>Our AI analyzes thousands of reviews</strong> to find barbers who specialize in your needs.</p>
              </div>
              <div className="flex items-start space-x-4">
                <span className="bg-orange-500 text-black font-bebas text-lg w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <p><strong>Get ranked results</strong> with real photos, verified info, and direct booking links.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-3xl text-white mb-6">FOR LA, BY LA</h2>
            <p>
              We're not some generic directory. LA Barber Guide is built specifically for Los Angeles — 
              from Venice Beach to Downtown, WeHo to Silver Lake. We understand the city's diverse 
              neighborhoods and the barbers who serve them.
            </p>
            <p className="mt-4">
              Every barber in our database is verified, every review is real, and every match is 
              designed to save you time and get you the cut you actually want.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pt-16 border-t border-zinc-800">
          <Link 
            href="/"
            className="inline-block bg-orange-500 text-black font-bebas text-xl px-8 py-4 rounded-lg hover:bg-orange-400 transition-colors"
          >
            FIND YOUR BARBER
          </Link>
        </div>
      </main>
    </div>
  );
}
