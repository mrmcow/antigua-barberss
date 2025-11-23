#!/usr/bin/env node

/**
 * GENERATE BLOG DATA JSON - VERCEL COMPATIBLE
 * Converts markdown files to JSON for static import
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function generateBlogData() {
  console.log('📊 GENERATING BLOG DATA FOR VERCEL...');
  
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const files = fs.readdirSync(blogDir);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  console.log(`📝 Found ${markdownFiles.length} blog posts`);
  
  const blogPosts = markdownFiles.map(file => {
    const filePath = path.join(blogDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
      slug: data.slug || file.replace('.md', ''),
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      keywords: data.keywords,
      content: content,
      readTime: Math.ceil(content.split(' ').length / 200) + " min read",
      featured: ['neighborhood-guides', 'hair-type-guides'].includes(data.category)
    };
  });
  
  // Sort by date, most recent first
  blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Write to public/data directory (Vercel compatible)
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const outputPath = path.join(dataDir, 'blog-posts.json');
  fs.writeFileSync(outputPath, JSON.stringify(blogPosts, null, 2));
  
  console.log(`✅ Generated blog data: ${outputPath}`);
  console.log(`📊 Posts by category:`);
  
  const categoryStats = blogPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} posts`);
  });
  
  console.log('\n🚀 BLOG DATA READY FOR VERCEL DEPLOYMENT!');
}

if (require.main === module) {
  generateBlogData();
}

module.exports = { generateBlogData };
