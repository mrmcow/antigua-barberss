# 🗄️ Database Setup - Complete Guide

## One Command Setup

### 1. Go to Supabase SQL Editor
https://supabase.com/dashboard/project/hntjqndjdfmuzcxbqbva/sql

### 2. Copy & Paste This File:
`supabase/COMPLETE-SCHEMA.sql`

### 3. Click "RUN"

That's it! Your entire database is set up.

---

## What This Creates

### Tables:
1. **barbershops** - All barber data (location, rating, images, booking)
2. **reviews** - Customer reviews from Google
3. **classifications** - AI-powered tags (hair types, styles, vibes)

### Indexes:
- Fast location searches
- Fast rating sorts
- Fast booking platform filters

### Features:
- Auto-updating timestamps
- Foreign key relationships
- Data validation constraints

---

## After Running SQL

### Step 1: Scrape Barbershops
```bash
npm run scrape
```
Pulls 100+ LA barbers from Google Places API

### Step 2: Scrape Reviews
```bash
npm run scrape:reviews
```
Pulls Google reviews for each barber

### Step 3: Enrich Booking Data
```bash
npm run enrich
```
Detects booking platforms (Booksy, Vagaro, etc.)

### Step 4: AI Classification (Optional)
Add OpenAI key to `.env.local`:
```
OPENAI_API_KEY="sk-..."
```

Then run:
```bash
npm run classify
```
AI analyzes reviews and tags barbers with specializations

---

## Quality Filter 🔥

**We ONLY show barbers with images!**

- No placeholder images
- No "coming soon" listings
- If they want to be featured → they sign up

This keeps the site looking professional and drives barbers to request listings.

---

## Environment Variables Needed

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://hntjqndjdfmuzcxbqbva.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."

# Google Maps & Places
GOOGLE_PLACES_API_KEY="AIzaSyA6M01TSINp50_43yiTQePcO-HT-FsBY0g"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyA6M01TSINp50_43yiTQePcO-HT-FsBY0g"

# OpenAI (Optional - for classification)
OPENAI_API_KEY="sk-..."
```

---

## Verify Setup

After running the SQL, check:
1. Go to Supabase → Table Editor
2. You should see 3 tables: `barbershops`, `reviews`, `classifications`
3. Run `npm run scrape` to populate

---

**Everything is in ONE file: `supabase/COMPLETE-SCHEMA.sql`** ✅

