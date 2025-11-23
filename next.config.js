/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'],
    unoptimized: true
  }
}

module.exports = nextConfig
