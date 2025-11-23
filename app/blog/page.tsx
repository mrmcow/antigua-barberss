import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { Search, Calendar, ArrowRight, TrendingUp, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "LA Barber Blog — Reviews, Guides & Local Insights",
  description: "In-depth reviews and guides to Los Angeles' best barbershops. Data-driven insights from 10,000+ real customer reviews.",
  keywords: "LA barber reviews, Los Angeles barbershop guides, best barbers LA, barber blog",
};

// This would be populated from your generated blog posts
const FEATURED_POSTS = [
  {
    title: "EZ The Barber Review: Downtown LA's 4C Hair Specialist Worth the Hype?",
    slug: "ez-the-barber-review-downtown-la-barber",
    category: "barber-reviews", 
    excerpt: "After analyzing 127 real customer reviews, here's why EZ earns our recommendation for 4C hair specialists in Downtown LA...",
    publishedAt: "2025-01-20",
    readTime: "8 min read",
    featured: true
  },
  {
    title: "Best Barbers in Venice Beach: 15 Shops Locals Actually Use (2025)",
    slug: "best-barbers-venice-beach-2025",
    category: "neighborhood-guides",
    excerpt: "We analyzed 2,847 reviews of 23 Venice barbershops to find the real gems. Here's what the data reveals...",
    publishedAt: "2025-01-19", 
    readTime: "12 min read",
    featured: true
  },
  {
    title: "Best 4C Hair Barbers in LA: Expert Picks & Reviews",
    slug: "best-4c-barbers-los-angeles",
    category: "hair-type-guides",
    excerpt: "The definitive guide to 4C hair specialists in Los Angeles, based on analysis of 1,200+ customer reviews...",
    publishedAt: "2025-01-18",
    readTime: "10 min read", 
    featured: true
  }
];

const RECENT_POSTS = [
  {
    title: "Good Day Studio vs Venice Fade Factory: Which Venice Shop Wins?",
    slug: "good-day-studio-vs-venice-fade-factory-comparison",
    category: "comparisons",
    excerpt: "Head-to-head analysis of Venice's two most popular barbershops...",
    publishedAt: "2025-01-17",
    readTime: "6 min read"
  },
  {
    title: "Hollywood Barbershops: Where Actors Get Their Hair Cut", 
    slug: "best-barbers-hollywood-2025",
    category: "neighborhood-guides",
    excerpt: "Inside Hollywood's elite barbershop scene, from budget cuts to celebrity stylists...",
    publishedAt: "2025-01-16",
    readTime: "9 min read"
  },
  {
    title: "Fade Masters in LA: 20 Barbers with Perfect Reviews",
    slug: "fade-masters-los-angeles",
    category: "style-guides", 
    excerpt: "Data-driven analysis of LA's top fade specialists based on customer feedback...",
    publishedAt: "2025-01-15",
    readTime: "7 min read"
  }
];

const CATEGORIES = [
  { name: "Barber Reviews", slug: "barber-reviews", count: 247, color: "bg-la-orange" },
  { name: "Neighborhood Guides", slug: "neighborhood-guides", count: 23, color: "bg-black" },
  { name: "Hair Type Guides", slug: "hair-type-guides", count: 15, color: "bg-gray-800" },
  { name: "Style Guides", slug: "style-guides", count: 32, color: "bg-gray-600" },
  { name: "Comparisons", slug: "comparisons", count: 89, color: "bg-gray-500" }
];

export default function BlogPage() {
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
              Barbers
            </Link>
            <Link href="/blog" className="text-sm md:text-base uppercase tracking-wider text-la-orange font-bold">
              Blog
            </Link>
            <Link href="/need-cut-now">
              <button className="inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white hover:bg-la-orange px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                Need Cut Now
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b-4 border-black py-8 md:py-12 bg-white">
        <div className="container-brutal">
          <div className="max-w-4xl">
            <h1 className="text-brutal-display mb-6">
              LA BARBER <span className="text-la-orange">BLOG</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              In-depth reviews, neighborhood guides, and data-driven insights from 10,000+ real customer reviews. 
              Your source for LA's best barbershop intel.
            </p>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews, guides, neighborhoods..."
                className="w-full pl-12 pr-4 py-4 border-4 border-black focus:border-la-orange outline-none text-base font-medium uppercase tracking-wide placeholder:normal-case placeholder:text-gray-400"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-bold text-black">
              <div className="flex items-center gap-2 hover:text-la-orange transition-colors cursor-default">
                <TrendingUp className="w-4 h-4 text-la-orange" />
                <span>500+ REVIEWS</span>
              </div>
              <div className="flex items-center gap-2 hover:text-la-orange transition-colors cursor-default">
                <MapPin className="w-4 h-4 text-la-orange" />
                <span>25+ NEIGHBORHOODS</span>
              </div>
              <div className="flex items-center gap-2 hover:text-la-orange transition-colors cursor-default">
                <Calendar className="w-4 h-4 text-la-orange" />
                <span>UPDATED DAILY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b-2 border-black py-6 bg-gray-50">
        <div className="container-brutal">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(category => (
              <Link 
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="flex-shrink-0"
              >
                <div className={`${category.color} text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap`}>
                  {category.name} ({category.count})
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="border-b-4 border-black py-12 md:py-16 bg-white">
        <div className="container-brutal">
          <h2 className="text-brutal-hero mb-8 md:mb-12">
            FEATURED <span className="text-la-orange">GUIDES</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Main Featured Post */}
            <Link href={`/blog/${FEATURED_POSTS[0].slug}`} className="lg:row-span-2 group">
              <article className="border-4 border-black h-full bg-white hover:border-la-orange transition-colors">
                <div className="aspect-[4/3] bg-gray-100 border-b-4 border-black relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge variant="accent" className="mb-3">
                      {FEATURED_POSTS[0].category.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-la-orange transition-colors">
                      {FEATURED_POSTS[0].title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {FEATURED_POSTS[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{FEATURED_POSTS[0].publishedAt}</span>
                    <span>{FEATURED_POSTS[0].readTime}</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Secondary Featured Posts */}
            <div className="space-y-6">
              {FEATURED_POSTS.slice(1).map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <article className="border-4 border-black bg-white hover:border-la-orange transition-colors">
                    <div className="p-6">
                      <Badge variant="outline" className="mb-3">
                        {post.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-la-orange transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{post.publishedAt}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-brutal">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h2 className="text-brutal-hero">
              LATEST <span className="text-la-orange">POSTS</span>
            </h2>
            <Link href="/blog/all" className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors">
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {RECENT_POSTS.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="border-4 border-black bg-white hover:border-la-orange transition-colors h-full">
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3">
                      {post.category.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-la-orange transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.publishedAt}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="text-center mt-8 md:hidden">
            <Link href="/blog/all">
              <button className="inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black border-2 border-black hover:bg-black hover:text-white px-8 py-4 text-base w-full">
                View All Posts
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t-4 border-black py-12 md:py-16 bg-black text-white">
        <div className="container-brutal text-center">
          <h2 className="text-brutal-hero mb-6">
            FIND YOUR <span className="text-la-orange">PERFECT</span> BARBER
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Done reading? Use our smart matching system to find your ideal barber in 30 seconds.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/match">
              <button className="inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-la-orange text-white hover:bg-white hover:text-la-orange border-2 border-la-orange px-8 py-4 text-base w-full md:w-auto">
                FIND MY BARBER
              </button>
            </Link>
            <Link href="/browse">
              <button className="inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black border-2 border-white hover:bg-black hover:text-white px-8 py-4 text-base w-full md:w-auto">
                BROWSE ALL BARBERS
              </button>
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
              <p className="text-sm md:text-base text-gray-400">The best barbers in LA. Period.</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8">
              <Link href="/about" className="text-xs md:text-sm uppercase tracking-wider hover:text-la-orange transition-colors font-medium">
                About
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
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
