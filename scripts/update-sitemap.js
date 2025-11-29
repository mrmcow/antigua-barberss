#!/usr/bin/env node

/**
 * GENERATE SITEMAP
 * Creates a complete, static sitemap.xml including:
 * - Static pages
 * - Blog posts
 * - Barber profile pages (from Supabase)
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const BASE_URL = 'https://antiguabarbers.com';

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('🗺️ GENERATING SITEMAP.XML...\n');

  const today = new Date().toISOString().split('T')[0];

  // 1. Define Static Pages
  const staticPages = [
    { url: '/', priority: '1.0', freq: 'daily' },
    { url: '/browse', priority: '0.9', freq: 'daily' },
    { url: '/cruise', priority: '0.9', freq: 'weekly' },
    { url: '/blog', priority: '0.9', freq: 'daily' },
    { url: '/about', priority: '0.7', freq: 'monthly' },
    { url: '/contact', priority: '0.7', freq: 'monthly' },
    { url: '/join', priority: '0.8', freq: 'monthly' },
    { url: '/privacy', priority: '0.3', freq: 'yearly' },
    // Important Categories
    { url: '/browse?neighborhood=st-johns', priority: '0.8', freq: 'weekly' },
    { url: '/browse?neighborhood=english-harbour', priority: '0.8', freq: 'weekly' },
    { url: '/browse?neighborhood=jolly-harbour', priority: '0.8', freq: 'weekly' },
  ];

  // 2. Get Blog Posts
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  let blogFiles = [];
  try {
    const files = fs.readdirSync(blogDir);
    blogFiles = files.filter(file => file.endsWith('.md'));
  } catch (e) {
    console.warn('⚠️ No blog directory found.');
  }

  console.log(`📝 Found ${blogFiles.length} blog posts`);

  // 3. Get Barbers from Supabase
  console.log('💈 Fetching barbers from database...');
  const { data: barbers, error } = await supabase
    .from('barbershops')
    .select('id, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching barbers:', error);
    return;
  }

  console.log(`💈 Found ${barbers.length} barber profiles`);

  // 4. Build XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add Static Pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add Blog Posts
  blogFiles.forEach(file => {
    const slug = file.replace('.md', '');
    sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add Barber Profiles
  barbers.forEach(barber => {
    // Use updated_at if available, otherwise today
    const lastMod = barber.updated_at ? barber.updated_at.split('T')[0] : today;
    sitemap += `
  <url>
    <loc>${BASE_URL}/barbers/${barber.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  // 5. Write to public/sitemap.xml
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);

  console.log(`\n✅ Generated sitemap with:`);
  console.log(`   - ${staticPages.length} static pages`);
  console.log(`   - ${blogFiles.length} blog posts`);
  console.log(`   - ${barbers.length} barber profiles`);
  console.log(`\n🚀 Saved to public/sitemap.xml`);
}

generateSitemap().catch(console.error);
