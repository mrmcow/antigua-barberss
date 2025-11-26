# 🔥 LA BARBER GUIDE

**The fastest, smartest way to find the right barber in Los Angeles.**

Not just another directory. A decision engine that matches people to barbers based on hair type, style, vibe, and urgency.

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
# 1. Create a project at https://supabase.com
# 2. Run the SQL schema from supabase/schema.sql in the SQL editor
# 3. Copy your project URL and anon key

# Setup environment variables
cp .env.local.template .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
/app
  /fonts              → Font placeholder/readme
  layout.tsx          → Root layout with fonts
  page.tsx            → Homepage
  globals.css         → Global styles + Tailwind

/components
  /ui                 → UI components (Button, Card, Badge)

/supabase
  schema.sql          → Database schema (run in Supabase SQL editor)

/lib
  supabase.ts         → Supabase client + TypeScript types

/scripts              → Data scrapers and classification (to be added)
```

---

## 🎨 Brand Guidelines

### Visual Identity
- **Colors:** Black, White, Concrete Gray, LA Orange (#FF6B35)
- **Typography:** Bebas Neue (display), Inter (body)
- **Style:** Brutal, simple, high-contrast, editorial

### Design Principles
- ✅ Stark black on white
- ✅ Big, bold typography
- ✅ Hard edges, minimal shadows
- ✅ Real photos, not stock
- ❌ No rounded corners
- ❌ No gradients
- ❌ No generic SaaS vibes

**Reference:** See `VISION.md` for complete brand and product vision.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (recommended)
- **Icons:** Lucide React

---

## 📊 Database Schema

See `supabase/schema.sql` for complete schema.

**Key Tables:**
- `barbershops` — Core barber data
- `reviews` — Reviews with AI-extracted tags
- `classifications` — Aggregated specialization scores

---

## 🗺️ Roadmap

### MVP Phase (Current)
- [x] Project setup
- [x] Brand identity + design system
- [x] Homepage UI
- [ ] Smart Match flow
- [ ] Browse/grid view
- [ ] Barber profile pages
- [ ] Database seeding (Google Places scraper)
- [ ] Review classification pipeline

### Phase 2
- [ ] SEO-optimized category pages
- [ ] Map view
- [ ] "I Need a Cut Today" urgency mode
- [ ] Instagram integration

### Phase 3
- [ ] User accounts (save favorites)
- [ ] Barber claim/edit profiles
- [ ] Analytics dashboard

---

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

---

## 🔑 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Google Places API
GOOGLE_PLACES_API_KEY="..."

# OpenAI (for review classification)
OPENAI_API_KEY="..."
```

---

## 📄 License

Private project. All rights reserved.

---

**Let's build something people actually want to use.** 🚀

# Force Vercel deploy for blog infrastructure
# Force Vercel rebuild Tue Nov 25 23:43:40 PST 2025
