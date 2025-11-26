import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  ExternalLink,
  MapPin,
  Star
} from "lucide-react";
import { LinkedBlogContent } from "@/components/LinkedBlogContent";
import { ShareButton } from "@/components/ShareButton";
import { supabase } from "@/lib/supabase";
import fs from 'fs';
import path from 'path';

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const blogPostsData = JSON.parse(jsonData);

    return blogPostsData.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Blog Post Not Found | LA Barber Guide",
      description: "This blog post could not be found. Explore our other LA barber guides and reviews.",
    };
  }

  return {
    title: `${post.title} | LA Barber Guide`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `https://labarberguide.xyz/blog/${post.slug}`,
      siteName: "LA Barber Guide",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://labarberguide.xyz/blog/${post.slug}`,
    },
  };
}

// This would come from your generated content
interface BlogPost {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  description: string;
  keywords: string;
  author: string;
  content: string;
  readTime: string;
  featured: boolean;
}

// Get blog post from JSON file in public directory (Vercel compatible)
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const blogPostsData = JSON.parse(jsonData);

    const post = blogPostsData.find((p: any) => p.slug === slug);

    if (!post) {
      return null;
    }

    return {
      title: post.title,
      slug: post.slug,
      category: post.category,
      publishedAt: new Date(post.date).toISOString(),
      description: post.description,
      keywords: post.keywords,
      author: "LA Barber Guide",
      content: post.content,
      readTime: post.readTime,
      featured: post.featured
    };
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}


export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Fetch barbershop data for linking
  const { data: barbershops } = await supabase
    .from('barbershops')
    .select('id, name');

  const barberMap: Record<string, string> = {};
  if (barbershops) {
    barbershops.forEach((barber: any) => {
      barberMap[barber.name] = barber.id;
    });
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "author": {
      "@type": "Organization",
      "name": "LA Barber Guide"
    },
    "publisher": {
      "@type": "Organization",
      "name": "LA Barber Guide",
      "logo": {
        "@type": "ImageObject",
        "url": "https://labarberguide.xyz/logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "description": post.description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://labarberguide.xyz/blog/${post.slug}`
    },
    "about": {
      "@type": "LocalBusiness",
      "@businessType": "Barbershop",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Los Angeles",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    "keywords": post.keywords
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
            <Link href="/need-cut-now">
              <button className="inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-black text-white hover:bg-la-orange px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                Need Cut Now
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Back to Blog */}
      <section className="border-b-2 border-black py-4 bg-gray-50">
        <div className="container-brutal">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <article className="py-8 md:py-12">
        <div className="container-brutal">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge variant="default" className="uppercase">
                {post.category.replace('-', ' ')}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {post.title}
            </h1>

            {/* Author & Share */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b-2 border-gray-200">
              <div className="text-sm text-gray-600">
                By <span className="font-bold text-black">{post.author}</span>
              </div>
              <ShareButton title={post.title} description={post.description} />
            </div>

            {/* Content - LA Brutal Style */}
            <div className="blog-brutal prose prose-lg max-w-none">
              <div className="article-content space-y-6">
                <LinkedBlogContent content={post.content} barberMap={barberMap} />
              </div>
            </div>

            {/* CTA Section */}
            <div className="border-4 border-black p-6 md:p-8 bg-la-orange text-white mt-12">
              <h3 className="text-2xl font-bold uppercase mb-4">
                Find Your Perfect LA Barber
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Ready to book? Use our smart matching system to find barbers perfect for your hair type and style.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/match">
                  <button className="inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-black hover:text-white border-2 border-white px-6 py-3 text-sm w-full sm:w-auto">
                    Smart Match
                  </button>
                </Link>
                <Link href="/browse">
                  <button className="inline-flex items-center justify-center gap-2 uppercase tracking-wider font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-white border-2 border-white hover:bg-white hover:text-la-orange px-6 py-3 text-sm w-full sm:w-auto">
                    Browse All
                  </button>
                </Link>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-16 pt-8 border-t-2 border-gray-200">
              <h3 className="text-2xl font-bold uppercase mb-8">
                Related <span className="text-la-orange">Guides</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/blog/best-barbers-downtown-la-2025" className="group">
                  <article className="border-2 border-black hover:border-la-orange transition-colors p-6">
                    <Badge variant="outline" className="mb-3">
                      NEIGHBORHOOD GUIDES
                    </Badge>
                    <h4 className="text-lg font-bold mb-2 group-hover:text-la-orange transition-colors">
                      Best Barbers in Downtown LA: Complete 2025 Guide
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Comprehensive guide to Downtown LA's top barbershops based on customer data...
                    </p>
                  </article>
                </Link>

                <Link href="/blog/best-4c-barbers-los-angeles" className="group">
                  <article className="border-2 border-black hover:border-la-orange transition-colors p-6">
                    <Badge variant="outline" className="mb-3">
                      HAIR TYPE GUIDES
                    </Badge>
                    <h4 className="text-lg font-bold mb-2 group-hover:text-la-orange transition-colors">
                      Best 4C Hair Barbers in LA: Expert Picks & Reviews
                    </h4>
                    <p className="text-gray-600 text-sm">
                      The definitive guide to 4C hair specialists based on 1,200+ reviews...
                    </p>
                  </article>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

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
