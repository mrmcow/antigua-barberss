# Monthly Update Quick Reference

## 🗓️ Monthly Maintenance (5 minutes)

```bash
# 1. Update all reviews (recommended monthly)
npm run monthly:update

# 2. Check for phone number issues (if new barbershops added)
npm run preview:phones
npm run fix:phones  # if needed
```

## ⚡ Quick Commands

```bash
# Reviews
npm run monthly:update      # Normal monthly update
npm run monthly:force       # Force all updates (use sparingly)

# Phone Numbers  
npm run preview:phones      # See what would change
npm run fix:phones         # Apply phone number fixes

# Legacy Commands (still work)
npx tsx scripts/migrate-google-reviews.ts
npx tsx scripts/fix-phone-numbers.ts --preview
```

## 📊 Expected Results

**Monthly Update Output:**
```
✅ Google Reviews migration complete:
   🏪 Barbershops processed: 38
   📞 API calls used: 38  
   💬 Total reviews saved: 136
   💰 Estimated cost: $0.65
```

**Monthly API Budget:** ~$0.50 - $2.00 (vs. $20-50 before optimization)

## 🚨 Quick Health Check

```sql
-- Check review freshness (run in Supabase)
SELECT 
  COUNT(*) as total_barbershops,
  COUNT(last_reviews_update) as updated_barbershops
FROM barbershops;

-- Check API costs this month  
SELECT SUM(total_cost) as monthly_cost 
FROM api_usage 
WHERE date >= date_trunc('month', CURRENT_DATE);
```

For full documentation, see [API-MANAGEMENT.md](./API-MANAGEMENT.md)
