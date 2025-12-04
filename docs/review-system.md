# Reviews System

## Current State

**Reviews are NOT scraped by default** - they need to be pulled manually from Google Places API.

### Why?
- Google Places API has rate limits
- Reviews are expensive to scrape (API costs)
- We show a beautiful fallback linking to Google Reviews

---

## How It Works

### When Reviews Are Missing:
The barber profile page shows a **"View on Google"** CTA:
- Displays review count from Google
- Big orange star icon
- Clear CTA button linking to Google Maps
- Shows: "This barber has 242 reviews on Google"

### When Reviews Exist:
- Shows up to 10 most recent reviews
- Author name, rating, date, full text
- Clean, brutalist design

---

## Scraping Reviews

### Run the Review Scraper:

```bash
npm run scrape:reviews
```

This will:
1. Fetch all barbershops from Supabase
2. Pull reviews from Google Places API (up to 5 per place)
3. Save reviews to the `reviews` table
4. Detect booking platforms (Booksy, Square, etc.)
5. Update review counts

### What Gets Saved:
- Reviewer name
- Rating (1-5 stars)
- Review text
- Date
- Profile photo URL
- Source (Google)

### Rate Limiting:
- 300ms delay between requests
- Processes 100 barbershops at a time

---

## API Keys Needed

Make sure these are in `.env.local`:

```bash
GOOGLE_PLACES_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

---

## Future Enhancements

### AI Classification (Already Built):
Run `npm run classify` to analyze reviews and extract:
- Hair types (4C, curly, straight, etc.)
- Styles (fade, taper, buzz, etc.)
- Sentiment (positive/negative)

### Review Freshness:
Consider setting up a cron job to refresh reviews weekly:
```bash
# Add to Vercel cron or similar
0 0 * * 0 npm run scrape:reviews
```

---

## Cost Considerations

**Google Places API Pricing:**
- Place Details: $17 per 1000 requests
- Reviews are included in Place Details

**Estimated Cost:**
- 500 barbers × $0.017 = **$8.50** per full scrape
- Run monthly or as needed

---

## Manual Testing

To test the review system:

1. **With reviews in DB:**
   - Visit any barber with scraped reviews
   - See reviews displayed inline

2. **Without reviews (current state):**
   - Visit any barber page
   - Click on rating (e.g., "5.0 (242 reviews)")
   - Scrolls to reviews section
   - Shows "View on Google" CTA

3. **Scrape reviews:**
   ```bash
   npm run scrape:reviews
   ```
   - Watch console output
   - Check Supabase `reviews` table
   - Refresh barber page to see reviews

---

## Database Schema

Reviews table has:
- `id` (UUID)
- `barbershop_id` (FK to barbershops)
- `reviewer_name` (text)
- `reviewer_photo` (text, nullable)
- `rating` (integer, 1-5)
- `text` (text)
- `date` (timestamptz)
- `source` (text, 'google' or 'internal')
- `hair_types` (text array, for AI classification)
- `styles` (text array, for AI classification)
- `sentiment` (text, nullable)
- `created_at` (timestamptz)

Already created via `COMPLETE-SCHEMA.sql`.

