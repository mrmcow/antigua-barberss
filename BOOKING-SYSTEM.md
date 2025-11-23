# 🔗 Booking & Availability System

## What This Does

Detects booking platforms and shows real-time availability info to help users book immediately.

---

## Supported Booking Platforms

We detect these platforms automatically from barbershop websites:

### 1. **Booksy** 🔥
- Most popular in LA
- Has public API (we can integrate later!)
- Direct deep links to booking pages

### 2. **Vagaro**
- Common for upscale shops
- Public booking pages
- Can show availability

### 3. **Square Appointments**
- Used by many independent barbers
- Public booking flow

### 4. **Schedulicity**
- Appointment-based shops
- Direct booking links

### 5. **Fresha** (formerly Shedul)
- Growing platform
- Public booking widgets

### 6. **StyleSeat**
- Individual barbers
- Direct booking

---

## Features

### ✅ Currently Working:

1. **Open Now Indicator**
   - Pulled from Google Places API
   - Shows green badge if open right now

2. **Booking Platform Detection**
   - Automatically detects which platform they use
   - Shows badge: "📅 Booksy" or "📅 Book Online"

3. **Direct Booking Links**
   - "📅 Book" button goes straight to their booking page
   - Opens in new tab, pre-filled with shop info

4. **Walk-In Friendly Tags**
   - Detected from reviews (AI classification)
   - Shows "Walk-In OK" badge

5. **Distance-Based ETA**
   - If < 2 miles away, shows "15min" instead of "Go"
   - Calculates driving time estimate

---

## How To Use

### 1. Run the enrichment script:

```bash
npm run enrich
```

This will:
- Pull opening hours from Google Places
- Detect booking platforms from websites
- Mark shops as "open now" or "closed"
- Save booking URLs for direct links

### 2. Run the migration:

Go to **Supabase SQL Editor** and run:

```sql
-- File: supabase/migration-booking.sql

ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS booking_platform text,
ADD COLUMN IF NOT EXISTS booking_url text,
ADD COLUMN IF NOT EXISTS accepts_walk_ins boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS barbershops_booking_platform_idx ON barbershops(booking_platform);
```

---

## Future: Real-Time Availability

### Booksy API Integration (Coming Soon!)

Booksy has a public API that lets us:
- Check real availability slots
- Show "Next Available: 2:30 PM"
- Pre-fill booking forms

**Cost**: Free tier available!

**Example**:
```
🔥 Closest to You
Fade Kings LA - 1.2mi
⭐ 4.9 (324) · $$ · Venice

✅ OPEN NOW
🟢 Next Available: 2:30 PM (in 45 min)

[📅 BOOK 2:30 PM]  [☎️ CALL]  [→ GO]
```

---

## Benefits

1. **Reduce friction** - Users can book in 1 tap
2. **Drive traffic** - Direct links to barber booking pages
3. **Show urgency** - "Open Now" + distance = immediate action
4. **Better UX** - No guessing if they accept walk-ins

---

## What Users See

On "Need Cut Now" page:

```
FADE KINGS LA                     1.2mi
⭐ 4.9 (324) · $$ · Venice

✅ Open Now  🚶 Walk-In OK  📅 Booksy

[☎️ Call]  [→ 15min]  [📅 Book]
```

If they tap "📅 Book":
→ Opens Booksy/Vagaro/Square directly
→ Shop is pre-selected
→ User just picks time slot

---

## Next Steps

1. ✅ Detect booking platforms
2. ✅ Show "Open Now"
3. ✅ Direct booking links
4. 🔄 Integrate Booksy API for real-time slots
5. 🔄 Show "Busy" indicator from Google Popular Times
6. 🔄 Add "Next Available" time estimates

---

**This makes booking DEAD SIMPLE on mobile!** 📱

