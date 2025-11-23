# Analytics & Monetization System

## 🎯 Core Strategy

**Track EVERY user interaction to build monetization data for barbers.**

Every click = potential revenue:
- 📞 **Phone Call**: $3.00 value (highest intent)
- 📅 **Booking Click**: $2.00 value (conversion)
- 🌐 **Website Click**: $0.50 value (exploration)
- 🗺️ **Directions Click**: $0.75 value (visit intent)
- ⭐ **Google Reviews**: $0.25 value (research)

---

## 📊 What Gets Tracked

### Click Events:
1. **Phone Calls** (`phone_call`) - `tel:` links
2. **Website Clicks** (`website_click`) - barber's website
3. **Booking Clicks** (`booking_click`) - Booksy, Square, etc.
4. **Directions** (`directions_click`) - Google Maps navigation
5. **Google Reviews** (`google_reviews_click`) - review page visits

### User Data (Anonymous):
- Browser fingerprint (persistent ID)
- Session ID (30-minute sessions)
- User agent & referrer
- Location (lat/lng) for distance tracking
- Destination URLs

---

## 🗄️ Database Schema

### Tables Created:
1. **`click_events`** - Every click, timestamped
2. **`barbershop_analytics`** - Daily aggregations
3. **`pricing_tiers`** - Free, Basic, Pro, Enterprise
4. **`subscriptions`** - Who's paying what

### Setup:
```sql
-- Run this in Supabase SQL Editor:
\i supabase/migration-analytics.sql
```

Also adds `google_maps_url` column to `barbershops` table.

---

## 💻 Frontend Integration

### 1. Track & Navigate Pattern:
```typescript
import { trackAndNavigate } from '@/lib/analytics';

// For external links (opens new tab + tracks)
<button onClick={() => trackAndNavigate(
  barberId, 
  'booking_click', 
  'https://booksy.com/...'
)}>
  Book Now
</button>
```

### 2. Track Only Pattern:
```typescript
import { trackClickEvent } from '@/lib/analytics';

// For tel: links or same-page actions
<a 
  href={`tel:${phone}`}
  onClick={() => trackClickEvent(barberId, 'phone_call', `tel:${phone}`)}
>
  Call Now
</a>
```

---

## 📈 Analytics Dashboard (Future)

### For Barbers:
```typescript
import { getBarbershopStats } from '@/lib/analytics';

const stats = await getBarbershopStats(barberId, 30); // last 30 days
// Returns: { total_clicks, phone_calls, website_clicks, booking_clicks, unique_visitors }
```

### Example Dashboard:
```
┌──────────────────────────────────────┐
│  Your Performance (Last 30 Days)     │
├──────────────────────────────────────┤
│  📞 Phone Calls:        47 ($141)    │
│  🌐 Website Clicks:     123 ($61.50) │
│  📅 Booking Clicks:     89 ($178)    │
│  🗺️  Directions:         34 ($25.50) │
│  ⭐ Google Reviews:     12 ($3)      │
├──────────────────────────────────────┤
│  💰 Total Value:        $409         │
│  👥 Unique Visitors:    203          │
└──────────────────────────────────────┘

Upgrade to Pro for 3x more traffic! →
```

---

## 💰 Monetization Tiers

### Free Tier ($0/month):
- ✅ 10 phone calls
- ✅ 20 website clicks
- ✅ 10 booking clicks
- ❌ No featured placement
- ❌ No analytics dashboard

### Basic ($49/month):
- ✅ 50 phone calls
- ✅ 100 website clicks  
- ✅ 50 booking clicks
- ✅ Basic analytics
- ❌ No featured placement

### Pro ($99/month):
- ✅ 200 phone calls
- ✅ 500 website clicks
- ✅ 200 booking clicks
- ✅ **Featured placement** (top of search)
- ✅ **Priority ranking**
- ✅ Full analytics dashboard

### Enterprise ($199/month):
- ✅ **Unlimited clicks**
- ✅ Featured placement
- ✅ Priority ranking
- ✅ Advanced analytics
- ✅ API access
- ✅ Custom integrations

---

## 🚀 Implementation Status

### ✅ Completed:
- [x] Analytics database schema
- [x] Click tracking utilities
- [x] Barber profile page integration
- [x] Phone call tracking
- [x] Website click tracking
- [x] Booking click tracking
- [x] Directions tracking
- [x] Google Reviews tracking
- [x] Anonymous user fingerprinting
- [x] Session tracking
- [x] Database aggregation functions

### 🔄 Next Steps:
- [ ] Run analytics migration in Supabase
- [ ] Test click tracking in browser
- [ ] Build analytics dashboard for barbers
- [ ] Implement pricing tiers UI
- [ ] Stripe integration for payments
- [ ] Email notifications ("You got 47 calls!")
- [ ] Admin dashboard for monitoring

---

## 🧪 Testing

### Local Testing:
```bash
# 1. Run migration
# Copy supabase/migration-analytics.sql into Supabase SQL Editor

# 2. Visit a barber page
http://localhost:3000/barbers/[id]

# 3. Click buttons (phone, website, booking, etc.)

# 4. Check click_events table in Supabase
SELECT * FROM click_events ORDER BY created_at DESC LIMIT 10;

# 5. Check aggregated stats
SELECT * FROM get_barbershop_stats('[barber-id]', 7); -- last 7 days
```

### Console Logging:
All tracking calls log to console:
```
📊 Tracked: phone_call for abc-123-def
📊 Tracked: booking_click for abc-123-def
```

---

## 📱 Mobile Considerations

- **No delays**: Tracking fires in background
- **Fail silently**: Analytics errors don't block user
- **Offline support**: Could queue events locally (future)
- **Privacy-first**: No PII collected, just fingerprints

---

## 💡 Sales Pitch to Barbers

### Email After 30 Days (Free Tier):
```
Subject: You got 47 phone calls last month! 📞

Hey [Barber Name],

Great news! LA Barber Guide sent you:
• 47 phone calls
• 123 website visits
• 89 booking clicks

That's $409 in estimated value!

You're currently on our Free tier (10 calls/month limit).
Upgrade to Pro for $99/month and get:
✨ Featured placement at top of search
✨ 200 calls/month (20x more!)
✨ Full analytics dashboard

[Upgrade to Pro →]
```

---

## 🔒 Privacy & GDPR

- ✅ No personally identifiable information stored
- ✅ Browser fingerprints are anonymous
- ✅ No emails or names tracked
- ✅ Users can opt out (future)
- ✅ Data retention: 90 days

---

## 📊 SQL Queries for Analysis

### Top performing barbers:
```sql
SELECT * FROM top_barbers_by_engagement
LIMIT 10;
```

### Today's clicks by type:
```sql
SELECT 
  event_type,
  COUNT(*) as count
FROM click_events
WHERE created_at >= CURRENT_DATE
GROUP BY event_type
ORDER BY count DESC;
```

### Barber performance over time:
```sql
SELECT 
  date,
  total_clicks,
  phone_calls,
  booking_clicks
FROM barbershop_analytics
WHERE barbershop_id = '[id]'
ORDER BY date DESC
LIMIT 30;
```

---

## 🎯 Success Metrics

### Platform Health:
- Total clicks per day
- Conversion rate (clicks → calls)
- Revenue per barber
- Upgrade rate (Free → Paid)

### Barber Success:
- Clicks per listing
- Click-through rate
- Geographic reach
- Peak traffic times

---

**Ready to monetize!** 💰 Run the migration and start tracking every click.

