# API Management & Monthly Updates Guide

## Overview

This guide documents our API optimization strategy and provides instructions for monthly maintenance tasks. Our approach significantly reduces Google Places API costs while maintaining data freshness.

## 🎯 Cost Optimization Results

**Before Optimization:**
- Google Reviews fetched on every barber page visit
- ~$20-50/month in API costs
- 1-hour caching provided some relief but still expensive

**After Optimization:**
- Reviews stored in database, served instantly
- Monthly batch updates only
- ~$2-5/month in API costs (80-90% reduction)
- Faster page loads, better user experience

---

## 📊 Database Schema

### Tables Added:
- `google_reviews` - Stores Google Reviews locally
- `api_usage` - Tracks API call costs and usage
- `barbershops.last_reviews_update` - Timestamp for review freshness

### Benefits:
- ⚡ **Instant page loads** - No API calls during user visits
- 💰 **Cost control** - Predictable monthly API budget
- 📈 **Usage tracking** - Monitor costs and optimize further
- 🔄 **Batch processing** - Efficient API usage patterns

---

## 🗓️ Monthly Maintenance Tasks

### 1. Update Barber Directory & Reviews

Run this command monthly to refresh all barber data:

```bash
# Update reviews (recommended: monthly)
npx tsx scripts/migrate-google-reviews.ts

# Force update all reviews (if needed)
npx tsx scripts/migrate-google-reviews.ts --force
```

**Expected Output:**
```
✅ Google Reviews migration complete:
   🏪 Barbershops processed: 38
   📞 API calls used: 38
   💬 Total reviews saved: 136
   💰 Estimated cost: $0.65
```

### 2. Check API Usage & Costs

Monitor monthly API spending:

```sql
-- Run in Supabase SQL Editor
SELECT 
  api_name,
  endpoint,
  SUM(calls_made) as total_calls,
  SUM(total_cost) as total_cost,
  DATE_TRUNC('month', date::timestamp) as month
FROM api_usage 
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY api_name, endpoint, DATE_TRUNC('month', date::timestamp)
ORDER BY month DESC, total_cost DESC;
```

### 3. Update Phone Numbers (as needed)

If you add new barbershops, normalize phone numbers:

```bash
# Preview changes first
npx tsx scripts/fix-phone-numbers.ts --preview

# Apply fixes
npx tsx scripts/fix-phone-numbers.ts --fix
```

### 4. Health Check Commands

```bash
# Check barbershops without recent review updates
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('barbershops').select('name, last_reviews_update').is('last_reviews_update', null).then(({data}) => console.log('Missing updates:', data?.length || 0));
"

# Check total reviews in database
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('google_reviews').select('*', { count: 'exact' }).then(({count}) => console.log('Total reviews stored:', count));
"
```

---

## 🔧 Troubleshooting

### Reviews Not Updating

**Problem**: Barbershop reviews seem outdated

**Solution**:
```bash
# Force update specific barbershop (replace with actual ID)
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('barbershops').update({last_reviews_update: null}).eq('name', 'Barber Name Here').then(() => console.log('Reset timestamp'));
"

# Then run normal update
npx tsx scripts/migrate-google-reviews.ts
```

### High API Costs

**Problem**: Unexpected API charges

**Solution**:
1. Check `api_usage` table for unusual activity
2. Verify no on-demand API calls in production code
3. Adjust review update frequency if needed

```sql
-- Find expensive API calls
SELECT * FROM api_usage 
WHERE total_cost > 5.00 
ORDER BY date DESC;
```

### Missing Phone Numbers

**Problem**: New barbershops added without proper phone formatting

**Solution**:
```bash
# Always run preview first
npx tsx scripts/fix-phone-numbers.ts --preview
npx tsx scripts/fix-phone-numbers.ts --fix
```

---

## 🚀 Future Improvements

### Potential Optimizations:
1. **Incremental Updates** - Only update reviews changed since last fetch
2. **Smart Scheduling** - Update popular barbershops more frequently
3. **Review Sentiment Analysis** - Add AI insights to stored reviews
4. **Webhook Integration** - Get notified of Google Business profile changes

### Cost Monitoring:
- Set up alerts when monthly API costs exceed $10
- Track review freshness vs. cost tradeoffs
- Monitor page load performance improvements

---

## 📝 Script Documentation

### migrate-google-reviews.ts
- **Purpose**: Batch update Google Reviews to database
- **Frequency**: Monthly recommended
- **Cost**: ~$0.50-2.00 per run (depending on barbershop count)
- **Rate Limiting**: Built-in delays every 10 requests

### fix-phone-numbers.ts
- **Purpose**: Normalize phone numbers with +1 country code
- **Frequency**: As needed (when adding new barbershops)
- **Cost**: Free (database operations only)
- **Safety**: Always preview changes first

---

## 🔐 Environment Variables Required

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_PLACES_API_KEY=your_google_api_key
```

---

## 📊 Monthly Checklist

- [ ] Run `npx tsx scripts/migrate-google-reviews.ts`
- [ ] Check API usage costs in Supabase
- [ ] Verify reviews are displaying correctly on live site
- [ ] Fix any phone number formatting issues
- [ ] Update this document if any issues found

**Last Updated**: December 2024  
**Next Review**: January 2025
