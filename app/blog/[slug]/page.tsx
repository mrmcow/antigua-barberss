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

// In production, this would read from your generated markdown files
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Simulate fetching from generated content
  // In reality, you'd read from content/blog/ directory
  
  // Mock data - replace with actual file reading
  const mockPosts: Record<string, BlogPost> = {
    "ez-the-barber-review-downtown-la-barber": {
      title: "EZ The Barber Review: Downtown LA's 4C Hair Specialist Worth the Hype?",
      slug: "ez-the-barber-review-downtown-la-barber",
      category: "barber-reviews",
      publishedAt: "2025-01-20T00:00:00.000Z",
      description: "Comprehensive review of EZ The Barber in Downtown LA based on 127 customer reviews. Is he really worth the premium price for 4C hair cuts?",
      keywords: "EZ The Barber review, Downtown LA barber, 4C hair specialist, fade barber",
      author: "LA Barber Guide",
      content: `# EZ The Barber Review: Downtown LA's 4C Hair Specialist Worth the Hype?

**Rating: 4.8/5 ⭐ (127 reviews)**
**Location:** Downtown LA | **Price:** $$$ | **Specialty:** 4C Hair, Fades

## The Verdict Up Front

After analyzing 127 real customer reviews and cross-referencing with our barbershop database, EZ The Barber earns our strong recommendation for 4C hair specialists in Downtown LA. Here's why he's worth the premium price.

## What Makes EZ Special

Based on comprehensive customer feedback analysis:

- **89% of reviewers** specifically mention "perfect fade execution"
- **76% explicitly praise** his 4C hair expertise and technique
- **Average wait time:** 15 minutes (well-managed scheduling)
- **Booking success rate:** 94% same-week availability
- **Repeat customer rate:** 82% (extremely high loyalty)

The data shows EZ consistently delivers what other barbers struggle with: precision fades on textured hair that grow out cleanly.

## Real Customer Experiences

Our review analysis reveals consistent themes:

> "Finally found someone in LA who truly understands 4C hair texture. The fade is immaculate and grows out perfectly." - Marcus T., 5 stars

> "Worth every penny of the $55. The attention to detail is incredible - he takes time to understand your hair pattern before cutting." - David R., 5 stars

> "Been going to EZ for 2 years. Never had a bad cut. Books up fast but worth the wait." - Anthony K., 5 stars

## Pricing & Value Analysis

**EZ's Pricing Structure:**
- Standard Cut + Fade: $55
- Beard Trim Addition: +$15  
- Hair Wash: Included
- Styling: Included

**Value Comparison:**
Compared to other Downtown LA premium barbers charging $45-65, EZ's pricing sits in the middle-premium range. However, customer satisfaction data shows:

- **92% say "worth the price"** vs 67% average for $50+ barbershops
- **Zero complaints** about pricing in recent reviews
- **High rebooking rate** indicates perceived value

## How EZ Compares to Competition

**vs Other Downtown LA Specialists:**

| Metric | EZ The Barber | Area Average |
|--------|---------------|--------------|
| Rating | 4.8/5 | 4.2/5 |
| 4C Expertise | 89% mention | 34% mention |
| Booking Difficulty | Moderate | Easy-Hard |
| Price Range | $$$ | $$-$$$ |

**Advantages:**
- Superior technical skill with textured hair
- Consistent quality (low variance in reviews)
- Professional shop environment
- Reliable scheduling

**Disadvantages:**  
- Higher price point than budget options
- Books up 1-2 weeks in advance
- Limited walk-in availability

## Who Should Go to EZ?

**Ideal Customers:**
- 4C hair texture seeking precision fades
- Professionals needing consistent, clean cuts
- Anyone willing to pay premium for expertise
- Clients who value reliability over convenience

**Maybe Look Elsewhere If:**
- Budget is primary concern (under $40)
- Need immediate/walk-in availability  
- Prefer basic cuts without fades
- Looking for experimental/avant-garde styles

## Booking & Location Details

**Address:** [Actual address would go here]
**Hours:** [Actual hours]
**Booking:** Online preferred, 1-2 week lead time
**Parking:** Street parking, some nearby lots

**Pro Tips:**
- Book 2 weeks ahead for weekend slots
- Mention specific fade style preferences when booking
- Bring reference photos for complex requests

## Bottom Line

EZ The Barber represents the gold standard for 4C hair specialists in Downtown LA. The premium pricing reflects genuine expertise - this isn't just marketing. 

**We recommend** if you have textured hair and want consistent, professional results. The 89% customer satisfaction rate for 4C hair specifically speaks volumes.

**Skip if** you're looking for budget cuts or need immediate availability. But for quality 4C fades, EZ is currently unmatched in downtown.

---

*Looking for more barber options? Check out our [complete Downtown LA barber guide](/blog/best-barbers-downtown-la-2025) or use our [smart matching system](/match) to find barbers perfect for your hair type.*`,
      readTime: "8 min read",
      featured: true
    }
  };
  
  return mockPosts[slug] || null;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | LA Barber Guide Blog"
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
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    }
  };
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
              <button className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors">
                <Share2 className="w-4 h-4" />
                Share Article
              </button>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {/* This would render the markdown content */}
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br/>').replace(/#{1,6}\s/g, '') 
                }}
              />
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
