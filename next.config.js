/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'],
    unoptimized: true
  },
  // Force Vercel to recognize all app directory routes
  trailingSlash: false,
  generateBuildId: async () => {
    // Force new build ID to trigger complete rebuild - including blog posts
    return 'rebuild-blog-links-' + Date.now()
  }
}

module.exports = nextConfig
