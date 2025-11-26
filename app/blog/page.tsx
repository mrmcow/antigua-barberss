import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { Search, Calendar, ArrowRight, TrendingUp, MapPin } from "lucide-react";
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: "LA Barber Blog — Reviews, Guides & Local Insights",
  description: "In-depth reviews and guides to Los Angeles' best barbershops. Data-driven insights from 10,000+ real customer reviews.",
  keywords: "LA barber reviews, Los Angeles barbershop guides, best barbers LA, barber blog",
};

// Get blog posts from JSON file in public directory (Vercel compatible)
async function getBlogPosts() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const blogPostsData = JSON.parse(jsonData);

    return blogPostsData.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      publishedAt: post.date,
      readTime: post.readTime,
      featured: post.featured
    }));
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const featuredPosts = allPosts.filter((post: any) => post.featured).slice(0, 6);
  const recentPosts = allPosts.slice(0, 12);
  const categoryStats = allPosts.reduce((acc: any, post: any) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b-2 border-black">
        <div className="container-brutal py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/browse"
              className="text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors"
            >
              Browse Barbers
            </Link>
            <Link
              href="/match"
              className="bg-black text-white px-4 py-2 border-2 border-black hover:bg-la-orange hover:border-la-orange transition-colors text-sm uppercase tracking-wider font-bold"
            >
              Find Match
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-20 border-b-4 border-black bg-gray-50">
        <div className="container-brutal">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-none mb-6">
              LA BARBER <span className="text-la-orange">INTEL</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Real reviews, data-driven insights, and brutal honesty about LA's barber scene.
              <strong className="text-black"> {allPosts.length} posts</strong> covering every neighborhood, hair type, and style.
            </p>

            <div className="flex flex-wrap gap-6">
              <Link href="/blog?category=barber-reviews" className="bg-black text-white px-6 py-3 border-2 border-black hover:bg-la-orange hover:text-black transition-colors cursor-pointer">
                <div className="text-2xl font-bold">{categoryStats['barber-reviews'] || 0}</div>
                <div className="text-sm uppercase">Barber Reviews</div>
              </Link>
              <Link href="/blog?category=neighborhood-guides" className="bg-la-orange text-black px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
                <div className="text-2xl font-bold">{categoryStats['neighborhood-guides'] || 0}</div>
                <div className="text-sm uppercase">Neighborhood Guides</div>
              </Link>
              <Link href="/blog?category=hair-type-guides" className="border-2 border-black px-6 py-3 hover:bg-la-orange hover:text-black transition-colors cursor-pointer">
                <div className="text-2xl font-bold">{categoryStats['hair-type-guides'] || 0}</div>
                <div className="text-sm uppercase">Hair Type Guides</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container-brutal">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">
                FEATURED <span className="text-la-orange">GUIDES</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post: any) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block border-2 border-black bg-white hover:bg-gray-50 transition-colors"
                >
                  <article className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="default" className="uppercase text-xs">
                        {post.category.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 group-hover:text-la-orange transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                      <ArrowRight className="w-4 h-4 text-la-orange group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-brutal">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              LATEST <span className="text-la-orange">POSTS</span>
            </h2>
          </div>

          <div className="grid gap-4">
            {recentPosts.map((post: any) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block border-2 border-black bg-white hover:bg-gray-50 transition-colors"
              >
                <article className="p-4 md:p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge variant="outline" className="uppercase text-xs">
                        {post.category.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-la-orange transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.description}
                    </p>
                  </div>

                  <ArrowRight className="w-5 h-5 text-la-orange group-hover:translate-x-1 transition-transform ml-4 flex-shrink-0" />
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-black text-white">
        <div className="container-brutal">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            BROWSE BY <span className="text-la-orange">CATEGORY</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/blog?category=barber-reviews"
              className="group border-2 border-white hover:border-la-orange hover:bg-la-orange hover:text-black transition-colors p-6 text-center"
            >
              <div className="text-2xl font-bold mb-2">{categoryStats['barber-reviews'] || 0}</div>
              <div className="text-sm uppercase tracking-wider">Barber Reviews</div>
            </Link>

            <Link
              href="/blog?category=neighborhood-guides"
              className="group border-2 border-white hover:border-la-orange hover:bg-la-orange hover:text-black transition-colors p-6 text-center"
            >
              <div className="text-2xl font-bold mb-2">{categoryStats['neighborhood-guides'] || 0}</div>
              <div className="text-sm uppercase tracking-wider">Neighborhood Guides</div>
            </Link>

            <Link
              href="/blog?category=hair-type-guides"
              className="group border-2 border-white hover:border-la-orange hover:bg-la-orange hover:text-black transition-colors p-6 text-center"
            >
              <div className="text-2xl font-bold mb-2">{categoryStats['hair-type-guides'] || 0}</div>
              <div className="text-sm uppercase tracking-wider">Hair Type Guides</div>
            </Link>

            <Link
              href="/blog?category=comparisons"
              className="group border-2 border-white hover:border-la-orange hover:bg-la-orange hover:text-black transition-colors p-6 text-center"
            >
              <div className="text-2xl font-bold mb-2">{categoryStats['comparisons'] || 0}</div>
              <div className="text-sm uppercase tracking-wider">Comparisons</div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-white border-t-4 border-black">
        <div className="container-brutal text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            FIND YOUR <span className="text-la-orange">PERFECT BARBER</span>
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Skip the research. Get matched with LA barbers perfect for your hair type and style.
          </p>

          <Link
            href="/match"
            className="inline-block bg-black text-white px-8 py-4 border-2 border-black hover:bg-la-orange hover:border-la-orange hover:text-black transition-colors text-lg uppercase tracking-wider font-bold"
          >
            Find My Barber
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-black py-8 bg-white">
        <div className="container-brutal text-center">
          <Logo size="sm" className="mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            © 2025 LA Barber Guide.
          </p>
        </div>
      </footer>
    </main>
  );
}