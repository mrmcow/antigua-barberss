# 🗄️ Database Setup - Complete Guide

## Prerequisites
- Supabase account (free tier works great)
- Google Places API key from Google Cloud Console

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `antigua-barbers`
4. Database Password: Save this somewhere safe
5. Region: Choose closest to your location
6. Click "Create new project"

---

## Step 2: Run Database Migrations

### Initial Schema
1. Go to **SQL Editor** (left sidebar in Supabase)
2. Click "New Query"  
3. Copy/paste the contents of `supabase/COMPLETE-SCHEMA.sql`
4. Click "Run"

### Google Reviews Optimization
1. Run the contents of `supabase/migration-google-reviews.sql`
2. This adds cost-optimized review storage

### What This Creates

**Tables:**
- `barbershops` - Core barber data with phone normalization
- `google_reviews` - Reviews stored locally (cost optimization)
- `community_comments` - User-generated content
- `api_usage` - Cost tracking for Google Places API
- `reviews` - Legacy review structure (for compatibility)
- `classifications` - AI-powered specialization tags

**Features:**
- Auto-updating timestamps
- Foreign key relationships  
- Fast location-based searches
- Cost tracking for API usage
- Phone number normalization support

---

## Step 3: Get Your Credentials

1. Go to **Settings** → **API** in Supabase
2. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

---

## Step 4: Google Places API Setup

### Enable the API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "Antigua Barbers"
3. Go to **APIs & Services** → **Library**
4. Search for "Places API" and click **Enable**

### Create API Key  
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the key
4. Click **Edit API key** to restrict it:
   - **Application restrictions:** HTTP referrers (optional)
   - **Website restrictions:** Add `localhost:3000` and your domain
   - **API restrictions:** Restrict to "Places API"
5. Save

---

## Step 5: Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Google Places API
GOOGLE_PLACES_API_KEY="AIza..."

# Analytics (optional)
GA4_MEASUREMENT_ID="G-..."

# OpenAI (optional - for AI classification)
OPENAI_API_KEY="sk-..."
```

---

## Step 6: Populate Database

### Scrape Barbershops
```bash
npm run scrape
```
This pulls barbershops from Google Places API for Antigua.

### Migrate Reviews to Database (Cost Optimization)
```bash
npm run monthly:update
```
This moves Google Reviews to database storage for faster access and lower costs.

### Fix Phone Numbers
```bash
npm run preview:phones  # See what would change
npm run fix:phones      # Apply +1 country code normalization
```

### Optional: AI Classification
If you have OpenAI API key:
```bash
npm run classify
```
AI analyzes reviews and tags barbers with specializations.

---

## Verify Setup

### Check Tables
1. Go to Supabase → **Table Editor**
2. You should see all tables: `barbershops`, `google_reviews`, `community_comments`, etc.
3. After scraping, barbershops should have data

### Test the Site
```bash
npm run dev
```
Open `http://localhost:3000/browse` - you should see real barbers!

---

## Database Optimization Features

### Cost-Optimized Reviews
- Google Reviews stored in database vs. API calls
- Reduces API costs from $20-50/month to $0.50-2/month
- Faster page loads (instant vs. 1-second API calls)

### Phone Number Normalization  
- All phone numbers include +1 country code
- Enables proper tel: and WhatsApp links
- Automatic formatting for Caribbean numbers

### API Usage Tracking
- Monitor Google Places API costs
- Set budgets and alerts
- Track usage patterns over time

---

## Troubleshooting

**"Missing API key"**
- Ensure `.env.local` exists with all keys
- Restart dev server after adding environment variables

**"No barbershops showing"**  
- Check Supabase tables have data
- Verify Supabase credentials are correct
- Run `npm run scrape` to populate data

**"API quota exceeded"**
- Google Places has rate limits on free tier
- Add billing to Google Cloud project for higher limits
- Or wait 24 hours for quota reset

**Reviews not updating**
- Check `last_reviews_update` timestamp in barbershops table
- Run `npm run monthly:force` to force update
- Verify Google Places API key has access

---

## Schema Files Reference

- `supabase/COMPLETE-SCHEMA.sql` - Initial database setup
- `supabase/migration-google-reviews.sql` - Cost optimization
- `supabase/migration-analytics.sql` - Analytics events
- `supabase/community-comments.sql` - User comments system

---

**Your database is now optimized for cost-effective operation!** 🚀

Next: Run the monthly update to populate reviews: `npm run monthly:update`
