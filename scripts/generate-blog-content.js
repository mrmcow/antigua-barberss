#!/usr/bin/env node

/**
 * CONTENT MINING SCRIPT
 * Generates 500+ blog posts from barbershop review data
 * 
 * Usage: node scripts/generate-blog-content.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs/promises');
const path = require('path');
const OpenAI = require('openai');

// Initialize clients
const supabase = createClient(
  'https://hntjqndjdfmuzcxbqbva.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudGpxbmRqZGZtdXpjeGJxYnZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg4MTcxMSwiZXhwIjoyMDc5NDU3NzExfQ.oWGU2aNWAQCuqFbLH__p9POM1MKIwD42Ktvh3n7LKkU'
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Set this in your environment
});

// Content templates
const CONTENT_TEMPLATES = {
  individual_review: {
    title: (barber) => `${barber.name} Review: ${getMainSpecialty(barber)} Barber in ${barber.neighborhood}?`,
    slug: (barber) => `${slugify(barber.name)}-review-${slugify(barber.neighborhood)}-barber`,
    category: 'barber-reviews',
    prompt: (barber, reviews) => `
Write a comprehensive review of ${barber.name}, a barbershop in ${barber.neighborhood}, Los Angeles.

BARBERSHOP DATA:
- Name: ${barber.name}
- Location: ${barber.neighborhood}, LA
- Rating: ${barber.rating}/5 (${barber.review_count} reviews)
- Price Range: ${barber.price_range}
- Specialties: ${getSpecialties(barber).join(', ')}
- Address: ${barber.address}

TOP CUSTOMER REVIEWS:
${reviews.slice(0, 5).map(r => `"${r.text}" - ${r.reviewer_name}, ${r.rating} stars`).join('\n')}

Write 1000+ words covering:
1. **The Verdict Up Front** - Clear recommendation
2. **What Makes ${barber.name} Special** - Based on review analysis
3. **Real Customer Experiences** - Quote actual reviews
4. **Pricing & Value** - Is it worth the cost?  
5. **How They Compare** - vs other ${barber.neighborhood} barbers
6. **Bottom Line** - Who should go here?

Use an engaging, LA-local tone. Include specific data points from reviews.
Include a call-to-action to find them on LA Barber Guide.
`
  },
  
  neighborhood_guide: {
    title: (neighborhood) => `Best Barbers in ${neighborhood}: Complete 2025 Guide`,
    slug: (neighborhood) => `best-barbers-${slugify(neighborhood)}-2025`,
    category: 'neighborhood-guides',
    prompt: (neighborhood, barbers) => `
Write a comprehensive guide to the best barbershops in ${neighborhood}, Los Angeles.

BARBERS TO COVER (top ${barbers.length} by rating):
${barbers.map((b, i) => `${i+1}. ${b.name} (${b.rating}/5, ${b.review_count} reviews) - ${b.price_range}`).join('\n')}

Write 1500+ words covering:
1. **${neighborhood} Overview** - What makes this neighborhood's barber scene unique
2. **Top 5 Barbers** (detailed analysis of each)
3. **Best for Different Needs** - 4C hair, budget, premium, walk-ins
4. **Neighborhood Comparison** - How ${neighborhood} compares to other LA areas
5. **Local Tips** - Parking, best times to go, local culture
6. **Conclusion** - Overall neighborhood recommendation

Include specific review quotes and data. Write in an insider, LA-local tone.
`
  },

  hair_type_guide: {
    title: (hairType) => `Best ${hairType} Hair Barbers in LA: Expert Picks & Reviews`,
    slug: (hairType) => `best-${slugify(hairType)}-barbers-los-angeles`,  
    category: 'hair-type-guides',
    prompt: (hairType, barbers) => `
Write the definitive guide to ${hairType} hair specialists in Los Angeles.

TOP ${hairType.toUpperCase()} SPECIALISTS (by review analysis):
${barbers.map((b, i) => `${i+1}. ${b.name} - ${b.neighborhood} (${b.rating}/5, ${getHairTypeScore(b, hairType)} specialization score)`).join('\n')}

Write 1200+ words covering:
1. **Why ${hairType} Hair Needs Specialists** - The unique challenges
2. **Top 10 ${hairType} Specialists** - Detailed profiles with review quotes
3. **What to Look For** - How to identify a good ${hairType} specialist
4. **Price Expectations** - What ${hairType} cuts cost in LA
5. **Neighborhood Breakdown** - Which areas have the best options
6. **Red Flags** - How to avoid bad experiences

Use review data to support all claims. Include real customer quotes.
`
  },

  comparison_post: {
    title: (barber1, barber2) => `${barber1.name} vs ${barber2.name}: Which ${barber1.neighborhood} Shop Wins?`,
    slug: (barber1, barber2) => `${slugify(barber1.name)}-vs-${slugify(barber2.name)}-comparison`,
    category: 'comparisons', 
    prompt: (barber1, barber2, reviews1, reviews2) => `
Write a detailed comparison between ${barber1.name} and ${barber2.name}, both located in ${barber1.neighborhood}, LA.

${barber1.name.toUpperCase()}:
- Rating: ${barber1.rating}/5 (${barber1.review_count} reviews)
- Price: ${barber1.price_range}
- Specialties: ${getSpecialties(barber1).join(', ')}
- Reviews: ${reviews1.slice(0, 3).map(r => `"${r.text}" - ${r.rating} stars`).join('\n')}

${barber2.name.toUpperCase()}:  
- Rating: ${barber2.rating}/5 (${barber2.review_count} reviews)
- Price: ${barber2.price_range}
- Specialties: ${getSpecialties(barber2).join(', ')}
- Reviews: ${reviews2.slice(0, 3).map(r => `"${r.text}" - ${r.rating} stars`).join('\n')}

Write 1000+ words with:
1. **Head-to-Head Comparison** - Side by side analysis
2. **Pricing Battle** - Value for money comparison
3. **Specialty Showdown** - Who's better at what
4. **Customer Experience** - Based on review analysis  
5. **The Verdict** - Clear winner recommendation

Include specific data and review quotes. Be objective but engaging.
`
  }
};

// Utility functions
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getMainSpecialty(barber) {
  // Analyze reviews/classifications to determine main specialty
  if (barber.classifications?.hair_types) {
    const hairTypes = Object.entries(barber.classifications.hair_types);
    const topHairType = hairTypes.reduce((a, b) => a[1] > b[1] ? a : b);
    if (topHairType[1] > 0.7) {
      return `${topHairType[0]} Hair`;
    }
  }
  
  if (barber.classifications?.styles) {
    const styles = Object.entries(barber.classifications.styles);
    const topStyle = styles.reduce((a, b) => a[1] > b[1] ? a : b);  
    if (topStyle[1] > 0.7) {
      return `${topStyle[0]} Specialist`;
    }
  }
  
  return 'Premium';
}

function getSpecialties(barber) {
  const specialties = [];
  
  if (barber.classifications?.hair_types) {
    Object.entries(barber.classifications.hair_types).forEach(([type, score]) => {
      if (score > 0.6) specialties.push(`${type} hair`);
    });
  }
  
  if (barber.classifications?.styles) {
    Object.entries(barber.classifications.styles).forEach(([style, score]) => {
      if (score > 0.6) specialties.push(style);
    });
  }
  
  if (barber.classifications?.vibes) {
    specialties.push(...barber.classifications.vibes);
  }
  
  return specialties.length ? specialties : ['General barbering'];
}

function getHairTypeScore(barber, hairType) {
  if (!barber.classifications?.hair_types) return 0;
  return barber.classifications.hair_types[hairType.toLowerCase()] || 0;
}

// Main data fetching
async function fetchBarbershopData() {
  console.log('🔍 Fetching barbershop data...');
  
  const { data, error } = await supabase
    .from('barbershops')
    .select(`
      *,
      reviews(*),
      classifications(*)
    `)
    .not('reviews', 'is', null)
    .gte('review_count', 5)
    .order('rating', { ascending: false });
    
  if (error) {
    console.error('❌ Error fetching data:', error);
    process.exit(1);
  }
  
  console.log(`✅ Loaded ${data.length} barbershops with reviews`);
  return data;
}

// Content generation functions
async function generateBlogPost(template, data, prompt) {
  console.log(`📝 Generating: ${template.title(data)}`);
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: "You are an expert LA barber reviewer with deep local knowledge. Write engaging, data-driven content that helps people find the right barber. Use a confident, LA-local tone with specific details from reviews."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });
    
    const content = response.choices[0].message.content;
    const slug = template.slug(data);
    const title = template.title(data);
    
    // Create blog post markdown
    const blogPost = `---
title: "${title}"
slug: "${slug}"
category: "${template.category}"
publishedAt: "${new Date().toISOString()}"
description: "${generateMetaDescription(title, content)}"
keywords: "${generateKeywords(data, title)}"
author: "LA Barber Guide"
featured: false
---

${content}

---

*Find ${data.name ? data.name : 'these barbers'} and more on [LA Barber Guide](https://labarberguide.xyz) - your source for LA's best barbershops.*

**Looking for a specific type of barber?** Use our [smart matching system](https://labarberguide.xyz/match) to find your perfect cut in 30 seconds.
`;

    return { slug, title, content: blogPost, category: template.category };
    
  } catch (error) {
    console.error(`❌ Error generating content for ${template.title(data)}:`, error.message);
    return null;
  }
}

function generateMetaDescription(title, content) {
  // Extract first 150 chars of content as meta description
  const clean = content.replace(/[#*]/g, '').substring(0, 150);
  return clean + '...';
}

function generateKeywords(data, title) {
  const keywords = ['LA barbers', 'Los Angeles barbershops'];
  
  if (data.name) keywords.push(`${data.name} review`);
  if (data.neighborhood) keywords.push(`${data.neighborhood} barbers`);
  
  return keywords.join(', ');
}

// File writing
async function saveBlogPost(post) {
  const dir = path.join(process.cwd(), 'content', 'blog', post.category);
  const filename = path.join(dir, `${post.slug}.md`);
  
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filename, post.content, 'utf8');
  
  console.log(`✅ Saved: ${filename}`);
}

// Main content generation
async function generateContent(options = { limit: 100, test: false, full: false }) {
  console.log('🚀 Starting content generation...\n');
  
  const barbershops = await fetchBarbershopData();
  const posts = [];
  let generatedCount = 0;
  
  console.log(`🎯 TARGET: ${options.limit} posts | Mode: ${options.test ? 'TEST' : options.full ? 'FULL' : 'STANDARD'}`);
  
  // 1. Individual barber reviews (500+ posts)
  console.log('\n📝 Generating individual barber reviews...');
  for (const barber of barbershops) {
    if (generatedCount >= options.limit) break;
    
    if (barber.reviews && barber.reviews.length >= 3) {
      console.log(`📝 [${generatedCount + 1}/${options.limit}] Generating: ${barber.name}`);
      
      const post = await generateBlogPost(
        CONTENT_TEMPLATES.individual_review,
        barber,
        CONTENT_TEMPLATES.individual_review.prompt(barber, barber.reviews)
      );
      if (post) {
        posts.push(post);
        await saveBlogPost(post);
        generatedCount++;
      }
      
      // Rate limiting - don't hit OpenAI too hard
      await new Promise(resolve => setTimeout(resolve, options.test ? 500 : 1000));
    }
  }
  
  // 2. Neighborhood guides
  if (generatedCount < options.limit) {
    console.log(`\n📍 Generating neighborhood guides... (${generatedCount}/${options.limit})`);
    const neighborhoods = [...new Set(barbershops.map(b => b.neighborhood).filter(Boolean))];
    
    for (const neighborhood of neighborhoods) {
      if (generatedCount >= options.limit) break;
      
      const neighborhoodBarbers = barbershops
        .filter(b => b.neighborhood === neighborhood)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);
        
      if (neighborhoodBarbers.length >= 5) {
        console.log(`📍 [${generatedCount + 1}/${options.limit}] Generating: ${neighborhood} Guide`);
        
        const post = await generateBlogPost(
          CONTENT_TEMPLATES.neighborhood_guide,
          neighborhood,
          CONTENT_TEMPLATES.neighborhood_guide.prompt(neighborhood, neighborhoodBarbers)
        );
        if (post) {
          posts.push(post);
          await saveBlogPost(post);
          generatedCount++;
        }
        
        await new Promise(resolve => setTimeout(resolve, options.test ? 500 : 1000));
      }
    }
  }
  
  // 3. Hair type guides  
  if (generatedCount < options.limit) {
    console.log(`\n💇 Generating hair type guides... (${generatedCount}/${options.limit})`);
    const hairTypes = ['4c', 'curly', 'wavy', 'straight'];
  
    for (const hairType of hairTypes) {
      if (generatedCount >= options.limit) break;
      
      const specialists = barbershops
        .filter(b => getHairTypeScore(b, hairType) > 0.5)
        .sort((a, b) => getHairTypeScore(b, hairType) - getHairTypeScore(a, hairType))
        .slice(0, 15);
        
      if (specialists.length >= 5) {
        console.log(`💇 [${generatedCount + 1}/${options.limit}] Generating: ${hairType} Hair Guide`);
        
        const post = await generateBlogPost(
          CONTENT_TEMPLATES.hair_type_guide,
          hairType,
          CONTENT_TEMPLATES.hair_type_guide.prompt(hairType, specialists)
        );
        if (post) {
          posts.push(post);
          await saveBlogPost(post);
          generatedCount++;
        }
        
        await new Promise(resolve => setTimeout(resolve, options.test ? 500 : 1000));
      }
    }
  }
  
  // 4. Comparison posts (select top pairs)
  if (generatedCount < options.limit) {
    console.log(`\n⚔️ Generating comparison posts... (${generatedCount}/${options.limit})`);
    const topBarbers = barbershops
      .filter(b => b.rating >= 4.5 && b.review_count >= 20)
      .slice(0, 20);
      
    // Generate comparisons between barbers in same neighborhood
    const neighborhoods2 = [...new Set(topBarbers.map(b => b.neighborhood))];
    
    for (const neighborhood of neighborhoods2) {
      if (generatedCount >= options.limit) break;
      
      const areaBarbers = topBarbers.filter(b => b.neighborhood === neighborhood);
      
      for (let i = 0; i < areaBarbers.length - 1 && generatedCount < options.limit; i++) {
        for (let j = i + 1; j < Math.min(i + 3, areaBarbers.length) && generatedCount < options.limit; j++) {
          const barber1 = areaBarbers[i];
          const barber2 = areaBarbers[j];
          
          console.log(`⚔️ [${generatedCount + 1}/${options.limit}] Generating: ${barber1.name} vs ${barber2.name}`);
          
          const post = await generateBlogPost(
            CONTENT_TEMPLATES.comparison_post,
            [barber1, barber2],
            CONTENT_TEMPLATES.comparison_post.prompt(
              barber1, 
              barber2, 
              barber1.reviews, 
              barber2.reviews
            )
          );
          
          if (post) {
            posts.push(post);
            await saveBlogPost(post);
            generatedCount++;
          }
          
          await new Promise(resolve => setTimeout(resolve, options.test ? 500 : 1000));
        }
      }
    }
  }
  
  console.log(`\n🎉 Generated ${posts.length} blog posts!`);
  console.log(`📁 Content saved to: content/blog/`);
  
  // Generate summary report
  const report = `
# Content Generation Report

Generated: ${new Date().toISOString()}
Total Posts: ${posts.length}

## Breakdown:
- Individual Reviews: ${posts.filter(p => p.category === 'barber-reviews').length}
- Neighborhood Guides: ${posts.filter(p => p.category === 'neighborhood-guides').length}  
- Hair Type Guides: ${posts.filter(p => p.category === 'hair-type-guides').length}
- Comparisons: ${posts.filter(p => p.category === 'comparisons').length}

## Categories:
${posts.reduce((acc, post) => {
  acc[post.category] = (acc[post.category] || 0) + 1;
  return acc;
}, {})}

Ready for SEO domination! 🚀
`;

  await fs.writeFile('content-generation-report.md', report, 'utf8');
  console.log('📊 Report saved: content-generation-report.md');
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    test: false,
    full: false,
    limit: 100
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--test') {
      options.test = true;
      options.limit = 10;
    } else if (args[i] === '--full') {
      options.full = true;
      options.limit = 750;
    } else if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1]);
      i++;
    }
  }
  
  return options;
}

// Run it
if (require.main === module) {
  const options = parseArgs();
  console.log(`🚀 LAUNCHING CONTENT GENERATION`);
  console.log(`Mode: ${options.test ? 'TEST' : options.full ? 'FULL PRODUCTION' : 'STANDARD'}`);
  console.log(`Target Posts: ${options.limit}`);
  
  generateContent(options).catch(console.error);
}

module.exports = { generateContent };
