# 📂 Scripts Directory

This folder contains all maintenance and data management scripts for Antigua Barbers.

## 🗓️ Monthly Maintenance

- **`migrate-google-reviews.ts`** - Update Google Reviews in database (cost-optimized)
- **`fix-phone-numbers.ts`** - Normalize phone numbers with +1 country code

## 🔄 Data Management

- **`scrape-google-places.ts`** - Scrape barbershops from Google Places API
- **`scrape-reviews.ts`** - Legacy review scraping (backup method)
- **`enrich-booking-data.ts`** - Detect booking platforms (Booksy, Vagaro, etc.)
- **`classify-barbers.ts`** - AI-powered specialization tagging

## 🛠️ Development

- **`seed-mock-data.ts`** - Generate test data for development
- **`fix-markdown-links.ts`** - Fix blog post internal links

## 📄 Content & SEO

- **`generate-blog-data.js`** - Convert markdown to JSON (used in build process)
- **`update-sitemap.js`** - Generate sitemap.xml for SEO

## Usage

Most scripts are accessible via npm commands in package.json:

```bash
# Monthly maintenance
npm run monthly:update      # migrate-google-reviews.ts
npm run fix:phones         # fix-phone-numbers.ts

# Data management
npm run scrape             # scrape-google-places.ts
npm run scrape:reviews     # scrape-reviews.ts
npm run enrich             # enrich-booking-data.ts
npm run classify           # classify-barbers.ts
npm run seed               # seed-mock-data.ts
```

## Environment Variables Required

Most scripts require these environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
GOOGLE_PLACES_API_KEY="..."
OPENAI_API_KEY="..."  # For classify-barbers.ts
```

---

**For monthly maintenance, see [docs/MONTHLY-UPDATES.md](../docs/MONTHLY-UPDATES.md)**
