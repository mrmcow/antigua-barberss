# LA BARBER GUIDE — PRODUCT VISION & EXECUTION PLAN

## 🎯 **The Mission**

Build the **fastest, smartest, most beautiful way** to find the right barber in Los Angeles.

Not just another directory. A **decision engine** that matches people to barbers based on hair type, style, vibe, and urgency.

---

## 🔥 **Why This Wins**

### The Problem
- **Google Maps:** Generic, no hair-type specialization, can't filter meaningfully
- **Yelp:** Cluttered UI, not haircut-specific, outdated
- **Instagram:** Great visuals but zero discoverability

### Our Solution
A **visual-first, mobile-optimized, data-driven directory** that answers one question in under 30 seconds:

> **"Where should I get my hair cut right now?"**

---

## 🎨 **Core Product Principles**

1. **Speed First** — Find your barber in <30 seconds
2. **Visual First** — Show, don't tell (before/afters, work samples, shop photos)
3. **Mobile First** — Most searches happen on the move
4. **Trust First** — Specialization badges, real reviews, transparent data
5. **Simple First** — Clean, modern, uncluttered interface

---

## 🚀 **The User Experience**

### **Landing Page: The Smart Match Flow**

Instead of overwhelming with filters, guide users through an intelligent 3-question flow:

**Question 1: What's your hair type?**
```
Visual cards with diverse hair textures (not just text):
- 4C Coils
- 3B/3C Curls
- 2A/2B Waves
- Straight & Fine
- Thick & Coarse
- Thinning/Balding
```

**Question 2: What look are you going for?**
```
Image-first style cards:
- Clean Fade
- Textured Crop
- Long & Styled
- Beard Grooming
- Color/Highlights
- Just a Trim
```

**Question 3: What's your situation?**
```
- Quick & Affordable ($20-40)
- Quality Classic ($40-60)
- Premium Experience ($60+)
- I Need It TODAY (walk-ins, open now)
- Queer-Friendly Space
- Cultural Specialist (Black/Latino/Asian barbers)
```

**Result:** Instant top 5-10 personalized matches with clear reasoning.

---

### **Browse Experience: Visual-First Grid**

For users who want to explore:

- **Pinterest/Airbnb-style grid** of barber work (cuts, styles, shop photos)
- Hover/tap reveals: name, location, specialties, rating
- **Floating filter bar:** "Curly Hair · Venice · Open Now · Under $50"
- **Map view toggle** (like Zillow)
- **Sort options:** Distance, Rating, Specialization Match, Open Now

---

### **The "I Need a Cut TODAY" Mode**

Big, prominent button on homepage and nav.

Filters to:
- Walk-in friendly shops
- Currently open
- Low wait times (from Google Popular Times data)
- Sorted by distance from user
- Availability in next 2-4 hours

This is the **urgency mode** killer feature.

---

### **Barber Profile Pages**

Each barber gets a beautiful, trust-building profile:

#### **Hero Section**
- 3-5 best work photos (auto-selected by AI or IG)
- Name, neighborhood, rating
- Quick actions: Call · Directions · Book · Save

#### **Specialization Badges** (data-driven, not paid)
- "Curly Hair Expert" (50+ positive curly reviews)
- "Fade Master" (4.8+ rating on fades)
- "Walk-In Friendly"
- "Natural Hair Certified"
- "Beard Specialist"

#### **At a Glance**
- Price range: $$
- Wait time: Usually 15-30 min
- Vibe: Old-school, Upscale, Hip-hop, etc.
- Languages: English, Spanish, Korean
- Best for: First-time fades, Kids, Thick hair

#### **Recent Work**
- Instagram feed integration (if connected)
- Before/after photos from reviews
- Style gallery

#### **Reviews** (Smart Sorted)
- "Most helpful for YOUR hair type" at top
- Filter by: Hair type, Style, Rating
- Highlight key phrases: "Great with curly hair," "Perfect fade," "Long wait"

#### **Details**
- Hours (with live "Open Now" status)
- Popular times chart
- Address with embedded map
- Phone, website, social links

---

## 🏗️ **Technical Architecture**

### **Tech Stack**
- **Frontend:** Next.js 14 (App Router), TailwindCSS, shadcn/ui components
- **Backend:** Next.js API routes, Supabase (Postgres + Auth)
- **Data Pipeline:** Node.js scrapers, Playwright, OpenAI/Anthropic for classification
- **Deployment:** Vercel
- **Cron Jobs:** Vercel Cron + Supabase scheduled functions

---

### **Database Schema (MVP)**

```prisma
model Barbershop {
  id              String   @id @default(cuid())
  name            String
  address         String
  neighborhood    String?
  lat             Float
  lng             Float
  phone           String?
  website         String?
  instagramHandle String?
  googlePlaceId   String   @unique
  rating          Float?
  reviewCount     Int      @default(0)
  priceRange      String?  // $, $$, $$$
  hours           Json?
  images          String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  reviews         Review[]
  classifications Classification?
}

model Review {
  id            String    @id @default(cuid())
  barbershopId  String
  barbershop    Barbershop @relation(fields: [barbershopId], references: [id])
  
  reviewerName  String?
  reviewerPhoto String?
  rating        Int       // 1-5
  text          String?
  date          DateTime?
  source        String?   // google, yelp, etc
  
  // AI-extracted tags
  hairTypes     String[]  // detected hair types mentioned
  styles        String[]  // fade, taper, etc
  sentiment     Float?    // -1 to 1
  
  createdAt     DateTime  @default(now())
}

model Classification {
  id            String   @id @default(cuid())
  barbershopId  String   @unique
  barbershop    Barbershop @relation(fields: [barbershopId], references: [id])
  
  // Aggregated from reviews
  hairTypes     Json     // { "4c": 0.8, "curly": 0.6, "straight": 0.3 }
  styles        Json     // { "fade": 0.9, "beard": 0.7, "color": 0.2 }
  vibes         String[] // upscale, old-school, queer-friendly, etc
  
  // Computed flags
  walkInFriendly Boolean @default(false)
  kidsWelcome    Boolean @default(false)
  
  lastUpdated   DateTime @updatedAt
}
```

---

## 📊 **Data Pipeline**

### **Phase 1: Ingest**
1. **Google Places API** — Pull all barbershops in LA County
2. **Scrape Details** — Use Playwright to scrape:
   - Full reviews
   - Photos
   - Popular times
   - Hours
   - Q&A sections

### **Phase 2: Classify**
For each review, use LLM (GPT-4/Claude) to extract:
- **Hair types mentioned:** 4c, curly, wavy, straight, thick, thin
- **Styles mentioned:** fade, taper, beard trim, color, braids
- **Vibe indicators:** upscale, affordable, queer-friendly, hip-hop, old-school
- **Urgency notes:** walk-in friendly, appointment only, long waits
- **Sentiment score:** -1 (negative) to 1 (positive)

### **Phase 3: Aggregate**
- Compute specialization scores (0-1) for each hair type and style
- Assign vibe tags based on frequency
- Flag special attributes (walk-in, kids, languages)

### **Phase 4: Refresh**
- Cron job runs weekly to update ratings, reviews, hours
- Incremental updates for new reviews

---

## 🎯 **MVP Feature Scope (4-6 Weeks)**

### **Week 1-2: Foundation**
- [ ] Next.js app setup with Tailwind
- [ ] Supabase project + database schema
- [ ] Basic scraper (Google Places → DB)
- [ ] LLM classification pipeline (initial)

### **Week 3-4: Core UI**
- [ ] Homepage with Smart Match flow
- [ ] Browse/grid view with filters
- [ ] Barber profile page template
- [ ] "I Need a Cut Today" urgency mode
- [ ] Mobile-responsive design

### **Week 5-6: Polish & Launch**
- [ ] SEO optimization (metadata, sitemap, robots.txt)
- [ ] Performance optimization (image lazy loading, caching)
- [ ] Social share cards
- [ ] Analytics setup (Vercel Analytics or Plausible)
- [ ] Domain + SSL
- [ ] Soft launch to friends/social

---

## 🗺️ **Page Structure**

```
/ 
  └─ Homepage (Smart Match flow + Featured barbers)

/browse
  └─ Grid view with filters

/barbers/[slug]
  └─ Individual barber profile

/neighborhoods/[slug]
  └─ "Best Barbers in Venice"

/styles/[slug]
  └─ "Best Fade Barbers in LA"

/hair-types/[slug]
  └─ "Best Barbers for Curly Hair in LA"

/about
  └─ Our story, methodology

/contact
  └─ For barbers to claim/update profiles
```

---

## 🎨 **Brand Identity: LA Cool As Fuck**

### **The Vibe**
We're not building a "tech platform." We're building a **cultural authority**.

Think: Streetwear brand meets editorial magazine meets your friend who always knows the spot.

**Inspiration:**
- Complex / Highsnobiety editorial aesthetic
- Supreme's brutalist simplicity
- LA street culture: skate, tattoo, hip-hop, fashion
- Monocle's confidence without the stuffiness
- Actual LA: gritty, diverse, unpretentious, real

**NOT:**
- ❌ Generic SaaS purple gradients
- ❌ Corporate blue trust badges
- ❌ Overly rounded "friendly" design
- ❌ Stock photos of smiling people
- ❌ Trying too hard to look "professional"

---

### **Visual Identity**

**Colors**
- **Primary:** Stark black on white (high contrast, editorial)
- **Accent:** LA sunset orange or electric yellow (energy, can't miss it)
- **Neutrals:** True black (#000), pure white (#FFF), concrete gray (#E5E5E5)
- **Pops:** Hot pink or lime green for urgency/highlights (think skate graphics)
- **Photography:** High contrast, street photography feel, real cuts not stock images

**Typography**
- **Display:** Something bold with character
  - Bebas Neue (caps only, tight spacing) OR
  - Druk Wide (if budget allows) OR
  - Archivo Black (free, punchy)
- **Body:** Brutal clarity
  - Inter or Helvetica Now
  - High contrast sizing (huge headlines, readable body)
- **Accent:** Mono for data/details (JetBrains Mono, IBM Plex Mono)

**Layout Principles**
- Lots of white space (confidence)
- Big, brutal typography
- Grid-based but break it when it makes impact
- Images bleed to edges
- No decorative bullshit

---

### **Voice & Copy**

**How We Talk:**
- Direct, confident, zero fluff
- "Find your barber" not "Discover your perfect haircare professional"
- "Open now" not "Currently accepting walk-ins"
- Real LA references: neighborhoods, culture, slang
- Occasional swearing is fine (we're authentic)
- Never condescending, always helpful

**Examples:**
```
❌ "Our curated marketplace connects you with premium grooming professionals"
✅ "The best barbers in LA. Period."

❌ "Discover your personalized hair care journey"
✅ "Find your cut in 30 seconds"

❌ "Currently experiencing high volume"
✅ "Busy as hell right now"
```

---

### **UI Components**

**Buttons**
- Hard edges, not rounded
- Black fill with white text OR brutal outline
- Hover: invert or shift accent color
- No shadows, no gradients

**Cards**
- Minimal borders (1px solid)
- Large images, minimal text
- Hover: scale image slightly, shift whole card
- No drop shadows unless very subtle

**Badges/Tags**
- Pills with hard edges
- Black text on white, or reverse
- Accent color for urgent/featured tags
- Small caps or all caps typography

**Filters**
- Toggle switches (binary, decisive)
- Checkbox groups (clear multi-select)
- Dropdowns only when necessary
- Active states in accent color

**Images**
- Always high quality
- Black & white treatment option for consistency
- Polaroid-style borders for user content
- Full bleed hero images

---

### **Photography Style**

**Barber Work Shots:**
- Raw, authentic, in-shop lighting
- Show the chair, the environment, the culture
- Before/afters in tight crops
- Process shots (clippers, fades in progress)

**Shop Exteriors:**
- Street photography aesthetic
- Wide angle, contextual (show the neighborhood)
- Natural light, high contrast

**NOT:**
- Overly edited/filtered Instagram aesthetics
- Stock photo vibes
- Boring headshots

---

### **Micro-Interactions**

- **Hover states:** Quick, snappy (100-150ms)
- **Page transitions:** Instant or very fast fades
- **Loading states:** Simple, not gimmicky
- **Sounds:** None (we're visual, not annoying)

---

### **Mobile Experience**

- Bottom nav bar: solid, iconic
- Swipe gestures feel natural
- One-tap actions are HUGE targets
- Map view is full-screen when active
- Pull-to-refresh on lists

---

### **Reference Sites for Vibe Check**

✅ **Yes:**
- [ssense.com](https://ssense.com) — brutal simplicity, fashion-forward
- [poolsuite.net](https://poolsuite.net) — fun, bold, unapologetic
- [juneshine.com](https://juneshine.com) — LA cool without trying hard
- Early Supreme web drops — no bullshit
- Any good streetwear lookbook site

❌ **No:**
- Generic SaaS landing pages
- Yelp/Google Maps (we're better than this)
- Overly corporate directories
- Anything that looks like a template

---

## 📈 **Success Metrics (MVP Phase)**

### **Product**
- Time to find barber < 30 seconds (user testing)
- 80%+ of barbers have complete profiles
- 100K+ reviews processed and classified

### **Growth**
- 500+ daily organic visitors (end of Month 2)
- 5K Instagram followers
- Page 1 Google rankings for 10+ long-tail keywords

### **Engagement**
- 40%+ click-through to barber contact (call, book, directions)
- 3+ pages per session
- <30% bounce rate on homepage

---

## 🚫 **What We're NOT Doing Yet**

- ❌ Monetization / subscriptions
- ❌ In-platform booking (link out to existing systems)
- ❌ User accounts (for MVP — optional for "save favorites")
- ❌ Barber dashboard (comes later)
- ❌ Expansion beyond LA

**Focus:** Build something so good barbers WANT to be on it and users LOVE using it.

Traffic first. Monetization second.

---

## 💡 **Future Ideas (Post-MVP)**

*These are great, but not for Version 1:*

- **Haircut Pass:** $99/mo unlimited cuts at network shops
- **AR Try-On:** Upload selfie, preview styles
- **Barber Marketplace:** Book multi-service appointments
- **Premium Listings:** Featured placement, analytics, lead tracking
- **Community Features:** Style inspo posts, Q&A, user journeys
- **City Expansion:** SF, NYC, Chicago, Miami

---

## 🎬 **Next Immediate Steps**

1. **Setup repo structure:**
   ```
   /apps
     /web          (Next.js frontend)
   /packages
     /database     (Prisma schema)
     /scrapers     (Data pipeline)
     /llm          (Classification logic)
   /docs
   ```

2. **Generate first code:**
   - Next.js app skeleton
   - Homepage MVP UI
   - Database schema
   - Google Places scraper

3. **Get domain:**
   - `labarberguide.com` (ideal)
   - `labarberguide.xyz` (alternative)

---

## ✅ **The Vision in One Sentence**

**We're building the fastest, most beautiful way to find the right barber for your hair in LA — so good that Google Maps becomes irrelevant for haircuts.**

Let's fucking build it. 🚀

