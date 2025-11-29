import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Calendar, ArrowRight, MapPin, Ship, Anchor } from "lucide-react";
import fs from 'fs';
import path from 'path';
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Antigua Barber Blog — Local Insights & Guides",
  description: "Guides to Antigua's best barbershops, cruise port tips, and local grooming insights.",
  keywords: "Antigua barber blog, St. John's barber guide, cruise ship haircut Antigua",
};

// Get blog posts from JSON file
async function getBlogPosts() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
    if (!fs.existsSync(jsonPath)) return [];
    
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const blogPostsData = JSON.parse(jsonData);

    return blogPostsData.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      publishedAt: post.date,
      readTime: post.readTime,
      featured: post.featured,
      image: post.image
    }));
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

// Image mapping for blog categories/slugs
const BLOG_IMAGES: Record<string, string> = {
  // Defaults & Categories (Verified Antigua Unsplash IDs)
  'default': 'https://images.unsplash.com/photo-1582300857444-5ddd87c86797?q=80&w=2070&auto=format&fit=crop',
  'neighborhood-guides': 'https://images.unsplash.com/photo-1583860168269-5d0b9e9131b2?q=80&w=2070&auto=format&fit=crop',
  'cruise-guides': 'https://images.unsplash.com/photo-1590083948604-c8bea3ea6cac?q=80&w=2070&auto=format&fit=crop',
  'travel-tips': 'https://images.unsplash.com/photo-1603980758007-bf37d13488dc?q=80&w=2070&auto=format&fit=crop',
  'culture': 'https://images.unsplash.com/photo-1612825149329-eac215c29255?q=80&w=2070&auto=format&fit=crop',
  'how-to': 'https://images.unsplash.com/photo-1629032510831-d21e19f827f8?q=80&w=2070&auto=format&fit=crop',
  
  // Major Hubs & Neighborhoods (Authentic Antigua Scenes)
  'barbers-english-harbour-falmouth': 'https://images.unsplash.com/photo-1629032776942-1329341b2865?q=80&w=2070&auto=format&fit=crop',
  'barbers-jolly-harbour-antigua': 'https://images.unsplash.com/photo-1648238867206-f704f11627a8?q=80&w=2070&auto=format&fit=crop',
  'best-barbers-st-johns-antigua': 'https://images.unsplash.com/photo-1652800194510-6b5ee91bf5f4?q=80&w=2070&auto=format&fit=crop',
  'how-to-find-barber-near-antigua-cruise-port': 'https://images.unsplash.com/photo-1652800326931-3ce2618d6e15?q=80&w=2070&auto=format&fit=crop',
  
  // Village Guides (Assigned distinct verified Antigua shots)
  'best-barbers-cassada-gardens-antigua': 'https://images.unsplash.com/photo-1654043621928-c29594c13336?q=80&w=2070&auto=format&fit=crop',
  'best-barbers-cobbs-cross-antigua': 'https://images.unsplash.com/photo-1670689708295-286ff649e3ee?q=80&w=2070&auto=format&fit=crop',
  'best-barbers-liberta-antigua': 'https://images.unsplash.com/photo-1678131188332-693a503680ae?q=80&w=2070&auto=format&fit=crop',
  'best-barbers-piggotts-antigua': 'https://images.unsplash.com/photo-1678600772847-85312c317371?q=80&w=2070&auto=format&fit=crop',
  'best-barbers-winthorpes-antigua': 'https://images.unsplash.com/photo-1680815065140-0adb64cadeb5?q=80&w=2070&auto=format&fit=crop',
  'barbers-all-saints-road-antigua': 'https://images.unsplash.com/photo-1696554036063-dadd3bc8a15c?q=80&w=2070&auto=format&fit=crop',
  'barbers-near-vc-bird-airport': 'https://images.unsplash.com/photo-1700795485621-9cc663d7b3ed?q=80&w=2070&auto=format&fit=crop',

  // Specific Topics (Keeping high-quality specific ones or using Antigua vibes)
  'tipping-barbers-antigua-guide': 'https://images.unsplash.com/photo-1706105551132-b78c2483c267?q=80&w=2070&auto=format&fit=crop',
  'antigua-barber-prices-2025': 'https://images.unsplash.com/photo-1722918769368-2dad953e7c0f?q=80&w=2070&auto=format&fit=crop',
  'mobile-barbers-antigua-resort': 'https://images.unsplash.com/photo-1732834277960-d0142bfe3fc7?q=80&w=2070&auto=format&fit=crop',
  'kids-haircuts-antigua-barbers': 'https://images.unsplash.com/photo-1599351431202-1e0f0137d9c8?q=80&w=2074&auto=format&fit=crop', // Keep kids haircut
  'antigua-wedding-barber-packages': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop', // Keep wedding
  'black-hair-barbers-antigua-tourist-guide': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop', // Keep barber
  'barber-vocabulary-antigua-terms': 'https://images.unsplash.com/photo-1503951914290-9a61b84c9c35?q=80&w=2070&auto=format&fit=crop', // Keep tools
  'best-beard-trims-antigua': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop', // Keep barber
  'getting-haircut-sandals-antigua': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2074&auto=format&fit=crop', // Keep resort
  'haircut-before-wedding-antigua': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop', // Keep wedding
  'sunday-barbers-antigua': 'https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=2070&auto=format&fit=crop', // Keep shop
};

export default async function BlogPage({ searchParams }: { searchParams: { category?: string } }) {
  const allPosts = await getBlogPosts();
  const selectedCategory = searchParams?.category;

  // Filter posts by category if specified
  const filteredPosts = selectedCategory
    ? allPosts.filter((post: any) => post.category === selectedCategory)
    : allPosts;

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section - Compact */}
      <section className="pt-4 pb-8 px-6 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div>
              <div className="inline-block bg-[#CE1126] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                Culture & Craft
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1a1a1a] leading-none">
                Island <span className="text-[#0072C6]">Standard</span>
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md md:pb-2 md:ml-auto text-right">
              Showcasing the masters of the craft. From the bustling energy of St. John's to the laid-back west coast, discover the brilliance of Antiguan barbering.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters - Compact */}
      <section className="px-6 bg-white sticky top-[68px] z-20 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex overflow-x-auto py-3 gap-2 no-scrollbar">
          <Link 
            href="/blog" 
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${!selectedCategory ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
          >
            All Posts
          </Link>
          <Link 
            href="/blog?category=neighborhood-guides" 
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${selectedCategory === 'neighborhood-guides' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
          >
            Neighborhoods
          </Link>
          <Link 
            href="/blog?category=cruise-guides" 
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${selectedCategory === 'cruise-guides' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
          >
            Cruise Guide
          </Link>
        </div>
      </section>

      {/* Posts Grid - Compact */}
      <section className="py-8 px-6">
        <div className="max-w-[1200px] mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: any) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 h-full"
                >
                  <div className="aspect-[2/1] bg-gray-100 relative overflow-hidden">
                    {/* Blog Image */}
                    <img 
                      src={BLOG_IMAGES[post.slug] || BLOG_IMAGES[post.category] || BLOG_IMAGES['default']} 
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                    
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      {post.category ? post.category.replace('-', ' ') : 'Guide'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wider">
                      <span>{new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-[#0072C6] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
                      {post.description}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#CE1126] mt-auto group-hover:gap-2 transition-all">
                      Read
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-400">
              <p>No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}