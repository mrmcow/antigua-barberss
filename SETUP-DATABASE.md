# 🚀 SETUP GUIDE - GET REAL DATA

## Step 1: Setup Supabase (5 minutes)

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `la-barber-guide`
4. Database Password: Save this somewhere safe
5. Region: `West US (Oregon)` - closest to LA
6. Click "Create new project"

### Run the Schema

1. Once created, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy/paste the contents of `supabase/schema.sql`
4. Click "Run"
5. You should see "Success. No rows returned"

### Get Your Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

### Add to Environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Google Places API (get from Google Cloud Console)
GOOGLE_PLACES_API_KEY="your-google-api-key"
```

---

## Step 2: Get Google Places API Key (5 minutes)

### Enable the API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "LA Barber Guide"
3. Go to **APIs & Services** → **Library**
4. Search for "Places API"
5. Click **Enable**

### Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the key
4. Click **Edit API key** (restrict it):
   - **Application restrictions:** HTTP referrers
   - **Website restrictions:** Add `localhost:3000` and your production domain
   - **API restrictions:** Restrict key to "Places API"
5. Save

### Add to .env.local

```bash
GOOGLE_PLACES_API_KEY="AIza..."
```

---

## Step 3: Install & Run the Scraper

The scraper is ready in `scripts/scrape-google-places.ts`

### Install dependencies:

```bash
npm install
```

### Run the scraper:

```bash
# This will pull 100+ LA barbershops from Google Places
npm run scrape

# Or with a specific area
npm run scrape -- --area="Venice Beach, LA"
```

### What it does:

1. Searches Google Places for "barber" in LA
2. Gets detailed info for each place
3. Saves to Supabase:
   - Name, address, coordinates
   - Phone, website, hours
   - Rating, review count
   - Photos
4. Fetches reviews
5. Runs LLM classification on reviews (hair types, styles, vibes)

### Monitor progress:

Check your Supabase Dashboard:
- Go to **Table Editor**
- Click `barbershops` table
- You should see barbers appearing

---

## Step 4: Test the Site

```bash
npm run dev
```

Open `http://localhost:3000/browse`

You should see REAL barbers from your database!

---

## Next Steps

1. **Run classification:** Process reviews to extract specialties
2. **Add more areas:** Run scraper for Hollywood, Downtown, etc.
3. **Update images:** Download and optimize barber photos
4. **Test matching:** Use real data in the match flow

---

## Troubleshooting

**"Missing API key"**
- Make sure `.env.local` exists and has all keys
- Restart the dev server after adding env vars

**"No barbers showing"**
- Check Supabase table has data
- Check browser console for errors
- Verify Supabase credentials are correct

**"API quota exceeded"**
- Google Places has rate limits
- Add billing to your Google Cloud project
- Or wait 24 hours for quota reset

---

Ready to scrape? Let's get 500+ LA barbers in the database! 🔥

