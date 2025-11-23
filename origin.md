Below is your **LA Barber Guide — Execution Plan v1.0**
A full **developer-ready, Markdown-formatted master plan** designed to get this live **fast**, with clear positioning, roadmap, tech, growth steps, and success metrics.

Copy/paste this directly into your repo, Notion, Cursor, or planning tool.

---

# #️⃣ **LA BARBER GUIDE — MASTER EXECUTION PLAN (v1.0)**

## 🤝 **Mission**

**Become the *default place* people go when they need a haircut in Los Angeles.**
Hyper-local, data-driven, beautiful, and urgent.

---

# ## 🔥 Positioning Statement

> **LA Barber Guide is the definitive LA haircut authority — curated by hair type, style, neighborhood, and urgency.
> We help people find the right barber *right now* in Los Angeles.**

---

# ## 🎯 Core Objectives (Q1–Q2)

1. **Launch a best-in-class LA barber directory MVP in 4–6 weeks.**
2. **Ingest and structure all barbershop data across LA County.**
3. **Dominate SEO for “best barbers in LA” long-tail search categories.**
4. **Build a commercial engine barbers *want* to be part of.**
5. **Create a social brand regarded as “the LA haircut bible.”**

---

# #️⃣ **PHASE 1 — MVP BUILD (Weeks 1–4)**

## ### 🏗️ Deliverable: Functioning Directory + Working Data Pipeline

### **1. Setup & Infra**

* Domain: `labarberguide.xyz` (or free .ml prototype)
* Tech stack:

  * Next.js 14 (App Router)
  * Supabase (Postgres + Auth)
  * Prisma schema for models
  * TailwindCSS for styling
  * Cron jobs via Vercel + Supabase Scheduler

---

### **2. Database Schema (initial)**

```sql
Barbershop {
  id              String @id
  name            String
  address         String
  neighborhood    String?
  lat             Float
  lng             Float
  phone           String?
  website         String?
  googlePlaceId   String
  rating          Float?
  reviewCount     Int?
  priceRange      String?
  hours           Json?
  images          Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

Review {
  id            String @id
  barberId      String
  reviewerName  String?
  rating        Int
  text          String?
  date          DateTime?
  tags          Json? // hair type, style, vibe
  sentiment     Float?
}

Classification {
  id            String @id
  barberId      String
  hairTypes     String[]
  styles        String[]
  vibe          String[]
  urgency       String[] // open-now, walk-in-friendly
  lastUpdated   DateTime
}
```

---

### **3. Data Pipeline**

#### **Step 1 — Google Places ingestion**

* Query Google Places API:

  * “barber”
  * “barbershop”
  * Radius mode for all LA neighborhoods
* Store basic metadata in DB.

#### **Step 2 — Detailed scraper**

* Use Playwright to load:

  * Google Maps place pages
  * Reviews
  * Busy Hours
  * Opening Hours
  * Photos

#### **Step 3 — LLM classification**

* For each review:

  * Detect **hair type** (4c, wavy, curly, straight, thick)
  * Detect **style** (fade, taper, scissor, beard, braids, color)
  * Detect **vibe** (upscale, old-school, queer-friendly, hip-hop, kid-friendly)
  * Detect **sentiment**
  * Detect **urgency notes** (walk-in friendly, appointment only, long wait times)

#### **Step 4 — Aggregate scoring**

* Compute:

  * Style specialization score
  * Hair type proficiency
  * Vibe classification
  * Urgency profile
  * Popularity weighting

---

### **4. MVP Frontend UI**

#### **Pages**

* `/` — Home
* `/neighborhoods/[slug]`
* `/styles/[slug]`
* `/hair-types/[slug]`
* `/barbers/[id]`

#### **Filters**

* Hair type
* Style
* Neighborhood
* Urgency
* Price
* Vibe

#### **Cards**

* Name + neighborhood
* 1–3 AI-selected photos
* Rating
* Tags (fade specialist, curly hair expert, walk-in friendly, open late)
* CTA: “Book Now” (links out)

---

### **5. MVP Launch Checklist**

* [ ] Home page with hero search + CTA
* [ ] Neighborhood directory
* [ ] Category pages from scraped data
* [ ] Barber profile template
* [ ] Basic IG brand presence
* [ ] SEO metadata for every page
* [ ] Social share cards
* [ ] Google indexing & sitemap
* [ ] SSL + canonical domain
* [ ] Clean Tailwind UI

---

# #️⃣ **PHASE 2 — MARKET ENTRY (Weeks 4–8)**

## ### 🚀 Deliverable: Become known in LA barber culture

### **1. SEO Launch**

Create high-quality category pages:

* Best Fade Barbers in LA
* Best Curly Hair Barbers in LA
* Best Black Barbers in LA
* Best Walk-in Barbers in LA
* Best Cheap Haircuts in LA
* Best Barbers in West Hollywood
* Best Barbers in Koreatown
* Best Barbers in Venice
* Best Barbers in Hollywood

Each page:

* Top 10 list
* Photo grid
* AI-generated summaries
* Real review excerpts
* Map view

---

### **2. Instagram/TikTok Marketing**

Posts:

* “Top 10 Fades in LA — 2025 Edition”
* “Best Curly Hair Specialists in LA”
* “Venice’s 5 Most Underrated Barbershops”
* “Best Barbers for Walk-ins Tonight”
* “Best Bald Fade Artists in Hollywood”

Barbers WILL repost these.
Exposure explodes.

---

### **3. Barber Outreach**

DM script for IG:

> “Hey! We’re LA Barber Guide.
> We ranked your shop based on 10k+ reviews and LA-specific data.
> You’re featured as a top barber for *[specialty]* in *[area]*.
> Want your full profile or photos added?”

This converts 20–40% into:

* free profile claims
* email captures
* future monetization targets

---

### **4. Local Partnerships (Optional)**

* LA fashion creators
* Grooming brands
* Men’s lifestyle influencers
* LA Travel bloggers
* Event photographers

---

# #️⃣ **PHASE 3 — COMMERCIALIZATION (Weeks 8–12)**

## ### 💰 Deliverable: Revenue Engine Turned On

### **1. Barber Subscriptions**

**$29/mo**

* Enhanced profile
* Unlimited photos
* Instagram sync

**$59/mo**

* Featured placement
* Category badges
* Placement in:

  * “Top Fades”
  * “Top Curly Hair”
  * “Walk-in Friendly”

**$99/mo**

* Lead tracking
* Analytics
* Competitor ranking
* AI insights from reviews

---

### **2. Lead Packs for Barbers**

* Click to book: $5
* Click to call: $4
* Click to IG DM: $3
* High-intent traffic only
* Works like Google Ads but cheaper

---

### **3. Sponsored Guides**

* “Koreatown Barbers — Sponsored by Fadehouse LA”
  $250–500 per sponsored section.

---

# #️⃣ **PHASE 4 — SCALE (Q2–Q3)**

## ### 🌎 Deliverable: Expand beyond LA

### After LA dominance:

* SF
* NYC
* Chicago
* Miami
* Atlanta
* Toronto
* London

But you expand ONLY once LA is bulletproof.

---

# #️⃣ **KEY SUCCESS METRICS**

### **Product**

* Time-to-haircut search < 20 seconds
* 80% of barbers fully profiled
* 100K reviews processed in 90 days

### **Growth**

* 1,000 daily organic visitors
* 10K Instagram followers
* 1K newsletter signups

### **Commercial**

* 100 paying barbers
* $5K–$15K MRR in LA alone

### **Brand**

* Known on IG/TikTok as *the* LA haircut guide
* Mentioned by LA creators, barbers, and shop owners

---

# #️⃣ **NEXT STEPS (Today → Tomorrow)**

### **1. Pick your MVP domain**

* `labarberguide.xyz`
* `labarberguide.site`

### **2. Create GitHub repo**

* `/frontend-next`
* `/backend-scrapers`
* `/supabase-schema`
* `/llm-classifiers`

### **3. I generate the code scaffolding**

Tell me which you want **RIGHT NOW**:

1. **Next.js app skeleton**
2. **Homepage MVP UI (Tailwind)**
3. **Supabase schema (Prisma)**
4. **Scraper architecture**
5. **LLM classification prompts**
6. **SEO template pages**

Pick a number — I’ll generate the entire module.
