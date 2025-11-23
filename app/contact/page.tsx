import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact LA Barber Guide — Get Listed, Report Issues, Partnership",
  description: "Contact LA Barber Guide to get your barbershop listed, report issues, or discuss partnerships. We're always looking to improve LA's barber directory.",
  keywords: "contact LA barber guide, list barbershop, barber partnership, report issue",
};

export default function ContactPage() {
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
              <Link href="/contact" className="text-white font-medium">
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
            GET IN
            <span className="block text-orange-500">TOUCH</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Barber shop owner? Found an issue? Want to partner up? 
            Let's talk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Options */}
          <div className="space-y-8">
            <div className="bg-zinc-900 p-8 rounded-lg">
              <h2 className="font-bebas text-2xl text-orange-500 mb-4">FOR BARBER SHOPS</h2>
              <p className="text-zinc-300 mb-6">
                Own a shop in LA? Want to get listed or update your info? 
                We pull data from Google but we're always happy to help optimize your listing.
              </p>
              <div className="space-y-3 text-sm text-zinc-400">
                <p>• <strong>Claim your listing</strong> — Ensure your info is accurate</p>
                <p>• <strong>Add booking links</strong> — Make it easy for customers to book</p>
                <p>• <strong>Update specialties</strong> — Highlight what you do best</p>
                <p>• <strong>Fix errors</strong> — Report incorrect information</p>
              </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-lg">
              <h2 className="font-bebas text-2xl text-orange-500 mb-4">REPORT AN ISSUE</h2>
              <p className="text-zinc-300 mb-6">
                Found incorrect info? Broken link? Shop that's closed? 
                Help us keep LA Barber Guide accurate.
              </p>
              <div className="space-y-3 text-sm text-zinc-400">
                <p>• Wrong address or hours</p>
                <p>• Closed permanently</p>
                <p>• Incorrect phone number</p>
                <p>• Broken booking links</p>
              </div>
            </div>

            <div className="bg-zinc-900 p-8 rounded-lg">
              <h2 className="font-bebas text-2xl text-orange-500 mb-4">PARTNERSHIPS</h2>
              <p className="text-zinc-300 mb-4">
                Booking platform? Hair product brand? Local business? 
                Let's explore ways to work together.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-900 p-8 rounded-lg">
            <h2 className="font-bebas text-2xl text-white mb-6">SEND US A MESSAGE</h2>
            <form className="space-y-6" action="mailto:hello@labarberguide.com" method="post" encType="text/plain">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  placeholder="john@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="list-shop">List My Barbershop</option>
                  <option value="update-info">Update Shop Information</option>
                  <option value="report-issue">Report an Issue</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none resize-none"
                  placeholder="Tell us what's up..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-black font-bebas text-lg py-4 rounded-lg hover:bg-orange-400 transition-colors"
              >
                SEND MESSAGE
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
              <p className="text-zinc-400 text-sm">
                Or email us directly at{" "}
                <a href="mailto:hello@labarberguide.com" className="text-orange-500 hover:text-orange-400">
                  hello@labarberguide.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-16 pt-16 border-t border-zinc-800 text-center">
          <h2 className="font-bebas text-3xl text-white mb-8">QUICK ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/"
              className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors group"
            >
              <h3 className="font-bebas text-lg text-orange-500 mb-2">FIND A BARBER</h3>
              <p className="text-zinc-400 text-sm">Get matched with the perfect barber for your needs</p>
            </Link>
            <Link 
              href="/browse"
              className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors group"
            >
              <h3 className="font-bebas text-lg text-orange-500 mb-2">BROWSE ALL</h3>
              <p className="text-zinc-400 text-sm">Explore all barbershops in Los Angeles</p>
            </Link>
            <Link 
              href="/about"
              className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors group"
            >
              <h3 className="font-bebas text-lg text-orange-500 mb-2">LEARN MORE</h3>
              <p className="text-zinc-400 text-sm">Discover how LA Barber Guide works</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
