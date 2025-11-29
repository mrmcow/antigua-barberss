import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Logo } from "@/components/ui/Logo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
      title: "Blog Post Not Found | Antigua Barbers",
      description: "This blog post could not be found. Explore our other Antigua barber guides and reviews.",
    };
  }

  return {
    title: `${post.title} | Antigua Barbers`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      url: `https://antiguabarbers.com/blog/${post.slug}`,
      siteName: "Antigua Barbers",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://antiguabarbers.com/blog/${post.slug}`,
    },
  };
}

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
      author: "Antigua Barbers",
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
      "name": "Antigua Barbers"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Antigua Barbers",
      "logo": {
        "@type": "ImageObject",
        "url": "https://antiguabarbers.com/icon.svg"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "description": post.description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://antiguabarbers.com/blog/${post.slug}`
    },
    "about": {
      "@type": "LocalBusiness",
      "@businessType": "Barbershop",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "St. John's",
        "addressCountry": "AG"
      }
    },
    "keywords": post.keywords
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header />

      {/* Back to Blog */}
      <section className="border-b border-black/5 py-4 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold hover:text-[#CE1126] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to Island Standard
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <article className="py-12 md:py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Badge variant="default" className="uppercase bg-[#FCD116] text-black hover:bg-[#e5c004]">
                {post.category.replace('-', ' ')}
              </Badge>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none mb-8 text-[#1a1a1a]">
              {post.title}
            </h1>

            {/* Author & Share */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-8 border-b border-black/10">
              <div className="text-sm text-gray-600 font-medium">
                By <span className="font-bold text-black">{post.author}</span>
              </div>
              <ShareButton title={post.title} description={post.description} />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#0072C6] prose-a:no-underline hover:prose-a:underline prose-img:rounded-[2rem] prose-strong:text-black">
              <LinkedBlogContent content={post.content} barberMap={barberMap} />
            </div>

            {/* CTA Section */}
            <div className="bg-[#1a1a1a] text-white p-8 md:p-12 rounded-[2.5rem] mt-16 shadow-xl text-center">
              <h3 className="text-3xl font-black uppercase mb-4">
                Need a Cut in Antigua?
              </h3>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                Find the nearest barber to your location now. Verified shops, real reviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/browse">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 uppercase tracking-wider font-bold bg-[#CE1126] text-white hover:bg-red-700 transition-all px-8 py-4 rounded-full shadow-lg hover:shadow-red-900/30">
                    Find A Barber
                  </button>
                </Link>
                <Link href="/browse?sort=distance">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 uppercase tracking-wider font-bold bg-white text-black hover:bg-gray-100 transition-all px-8 py-4 rounded-full">
                    <MapPin className="w-4 h-4" /> Near Me
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
