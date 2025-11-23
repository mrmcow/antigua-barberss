#!/usr/bin/env node

/**
 * UPDATE SITEMAP WITH BLOG POSTS
 * Automatically adds all blog posts to sitemap.xml
 */

const fs = require('fs/promises');
const path = require('path');

async function updateSitemap() {
  console.log('🗺️ UPDATING SITEMAP WITH BLOG POSTS...\n');
  
  // Get all blog post files
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const blogFiles = await fs.readdir(blogDir);
  const markdownFiles = blogFiles.filter(file => file.endsWith('.md'));
  
  console.log(`📊 Found ${markdownFiles.length} blog posts to add to sitemap`);
  
  // Generate blog post sitemap entries
  const blogEntries = markdownFiles.map(file => {
    const slug = file.replace('.md', '');
    return `  <url>
    <loc>https://labarberguide.xyz/blog/${slug}</loc>
    <lastmod>2025-11-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');
  
  // Read current sitemap
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  let sitemap = await fs.readFile(sitemapPath, 'utf8');
  
  // Find where to insert blog entries (before closing </urlset>)
  const insertPosition = sitemap.lastIndexOf('</urlset>');
  
  // Insert blog entries
  const newSitemap = sitemap.slice(0, insertPosition) + 
    '\n  <!-- BLOG POSTS - AUTO GENERATED -->\n' +
    blogEntries + '\n\n' +
    sitemap.slice(insertPosition);
  
  // Write updated sitemap
  await fs.writeFile(sitemapPath, newSitemap, 'utf8');
  
  console.log(`✅ Updated sitemap with ${markdownFiles.length} blog posts`);
  console.log('📍 Blog posts now available at:');
  
  // Show sample URLs
  markdownFiles.slice(0, 5).forEach(file => {
    const slug = file.replace('.md', '');
    console.log(`   https://labarberguide.xyz/blog/${slug}`);
  });
  
  if (markdownFiles.length > 5) {
    console.log(`   ... and ${markdownFiles.length - 5} more posts`);
  }
  
  console.log('\n🚀 SITEMAP UPDATE COMPLETE!');
}

if (require.main === module) {
  updateSitemap().catch(console.error);
}

module.exports = { updateSitemap };
