# 🇦🇬 Antigua Barbers — The Island's Best Cuts

**The fastest, smartest way to find the right barber in Antigua.**

Perfect for cruise passengers, resort guests, and locals. Mobile service available. Cruise-safe guarantee.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works great)
- Google Places API key

### Installation

```bash
# Install dependencies
npm install

# Setup Supabase
# 1. Create project at https://supabase.com
# 2. Run docs/database-setup.md instructions
# 3. Copy your project URL and anon key

# Setup environment variables
cp .env.local.template .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗓️ Monthly Maintenance (5 minutes)

```bash
# Update all barber reviews (recommended monthly)
npm run monthly:update

# Fix phone numbers (if new barbershops added)
npm run preview:phones
npm run fix:phones  # if needed
```

**Expected monthly cost:** ~$0.50-2.00 (vs. $20-50 before optimization)

📖 **Full guide:** [docs/monthly-updates.md](docs/monthly-updates.md)

---

## 📁 Project Structure

```
/app
  /(pages)            → All route pages
  layout.tsx          → Root layout with fonts
  globals.css         → Global styles + Tailwind

/components
  /ui                 → UI components (Button, Card, etc.)
  BarberActions.tsx   → Call/WhatsApp buttons
  GoogleReviews.tsx   → Review display
  CommunityComments.tsx → User comments

/supabase
  /*.sql              → Database migrations

/lib
  supabase.ts         → Supabase client
  phone-utils.ts      → Phone number formatting
  analytics.ts        → GA4 tracking

/scripts              → Monthly maintenance scripts
  migrate-google-reviews.ts → Move reviews to DB
  fix-phone-numbers.ts      → Normalize phone format

/content/blog         → SEO blog posts (25+ articles)
/docs                → Project documentation
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Icons:** Lucide React
- **Analytics:** Google Analytics 4

---

## 📊 Database Schema

**Key Tables:**
- `barbershops` — Core barber data with phone normalization
- `google_reviews` — Reviews stored locally (cost optimization)
- `community_comments` — User-generated content
- `api_usage` — Cost tracking for Google Places API
- `classifications` — AI-powered barber specializations

📖 **Full schema:** [docs/database-setup.md](docs/database-setup.md)

---

## 🗺️ Current Status

### ✅ Completed Features
- [x] Brand identity + responsive design
- [x] Homepage with location matching
- [x] Browse directory with filtering
- [x] Individual barber profile pages
- [x] Google Places integration + review system
- [x] Phone number normalization (+1 country code)
- [x] Community comments system
- [x] SEO blog with 25+ articles
- [x] Google Analytics 4 tracking
- [x] API cost optimization (80-90% savings)
- [x] Monthly maintenance automation

### 🚀 Live Features
- **Smart Matching:** Hair type, style, urgency-based recommendations
- **Mobile Actions:** Direct call/WhatsApp integration
- **Cost-Optimized Reviews:** Database storage vs. API calls
- **Cruise-Friendly:** Port proximity, time-aware recommendations
- **Local Community:** User comments and ratings

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Monthly Maintenance
npm run monthly:update   # Update reviews (recommended monthly)
npm run monthly:force    # Force update all (emergency use)
npm run preview:phones   # Preview phone number changes
npm run fix:phones       # Apply phone number fixes

# Data Management
npm run scrape          # Scrape new barbershops
npm run enrich          # Enrich booking data
npm run classify        # Run AI classification

# Content
npm run generate:content # Generate blog posts
```

---

## 🔑 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Google Places API
GOOGLE_PLACES_API_KEY="..."

# Analytics
GA4_MEASUREMENT_ID="G-..."
```

---

## 📚 Documentation

**Quick Reference:**
- [Monthly Updates](docs/monthly-updates.md) - 5-minute maintenance guide
- [Database Setup](docs/database-setup.md) - Initial setup instructions
- [API Management](docs/api-management.md) - Cost optimization & troubleshooting

**Implementation Guides:**
- [Project Vision](docs/project-vision.md) - Product strategy & positioning
- [Blog System](docs/blog-implementation.md) - SEO content management
- [Review System](docs/review-system.md) - Google Reviews integration
- [Analytics](docs/analytics-monetization.md) - GA4 tracking & insights
- [Deployment](docs/deployment.md) - Vercel deployment guide

---

## 🎯 Key Metrics

**Cost Optimization Results:**
- Google Places API: $20-50/month → $0.50-2/month (80-90% savings)
- Page load speed: Instant reviews (database vs. API calls)
- User experience: Direct call/WhatsApp with proper country codes

**Content & SEO:**
- 25+ targeted blog articles for cruise passengers
- Neighborhood-specific landing pages
- Hair type and style specialization guides

---

## 📱 Mobile-First Design

Optimized for tourists on mobile devices:
- **Large touch targets** for easy cruise ship WiFi usage
- **Clear phone/WhatsApp actions** with proper +1 formatting
- **Location-aware recommendations** based on cruise port proximity
- **Time-sensitive features** for urgent haircut needs

---

## 📄 License

Private project. All rights reserved.

---

**Built for the beautiful island of Antigua & Barbuda.** 🌴✂️