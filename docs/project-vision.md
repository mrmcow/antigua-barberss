You’re absolutely right to treat this as a *different* product, not just a copy-paste of LA Barber Guide. Antigua’s barbers live in a completely different demand ecosystem: cruise ships, resorts, weddings, expats, and locals.

I’ll break this into:

1. **Opportunity landscape (Antigua)**
2. **Target segments + use cases**
3. **Positioning + product concept**
4. **Data acquisition (Google Places + others, without breaking ToS)**
5. **UX + onboarding for barbers**
6. **Architecture notes for re-using LA codebase**

---

## 1. Opportunity landscape: why an Antigua barber guide works

### Macro picture

* Antigua & Barbuda has ~69k population; St John’s is ~23–24k and the main urban centre. ([World Population Review][1])
* St John’s is the economic hub and cruise port city; most of the island’s population/commerce lives on or near the All Saints Road corridor. ([Wikipedia][2])
* Tourism is *huge*: in 2024 Antigua & Barbuda welcomed **330k+ stay-over visitors** and **~824k cruise passengers**, a record year. ([Visit Antigua & Barbuda][3])
* On peak cruise days they’ve hit **15,808 passengers in a single day** across multiple ships. ([Richès Karayib][4])

This is absurd leverage for a niche guide: even capturing **0.5–1%** of cruise passengers on peak days is ~80–160 haircut-seekers walking distance from the port.

### Existing supply: barbers

There *are* barbers but they’re fragmented across:

* **Local directories**, e.g. *Dadli Directory* lists multiple barbers in and around St John’s (Fresh Cuts, Wags Barbershop, Antigua Clippers, Forever Young, Don’s, Million Dollar Mobile, etc.). ([Dadli Directory][5])
* Individual sites/FB pages (e.g. J-Times Barber Shop, The Fade Studio). ([Facebook][6])

Right now:

* Discovery is scattered (Google Maps + FB + random local directory).
* There’s no single **“Where do I get a sharp cut near the cruise port / resort?”** experience.

That gap is your wedge.

---

## 2. Target segments + use cases

Let’s explicitly list who you’re building for and what “job” they’re hiring the guide to do.

### A. Cruise day-trippers (high-value niche)

**Who:** Passengers docking in St John’s for 6–8 hours.

**Jobs:**

* “I need a *quick, trustworthy* cut/beard tidy before photos/dinner back on the ship.”
* “I want a local experience, not just shopping in the port mall.”

**Constraints:**

* Time-boxed (e.g. “ship leaves at 5pm, I’m off at 10am”).
* Nervous about distance from port, safety, and reliability.
* Needs **real-time availability + walking distance filters**.

**Features they care about:**

* “Within 10–15 min walk from cruise port.”
* Next available slot in the next 1–3 hours.
* Clear pricing in USD + EC.
* “Cruise-safe guarantee” type messaging (“We’ll get you back to port 2 hours before departure”).

---

### B. Resort / villa tourists (1–2 week stays)

**Who:** People staying in Jolly Harbour, English Harbour, Dickenson Bay, etc.

**Jobs:**

* “I want a fresh cut halfway through my vacation.”
* “I need a stylist/barber for date night / anniversary / family photos.”

**Constraints:**

* May not want to drive into St John’s.
* Might prefer **mobile barbers** to come to villa/hotel.

**Features:**

* Filter by *“mobile / will come to you”*.
* Map by area: Jolly Harbour, English Harbour, north coast, etc.
* Photos & reviews emphasising consistency and professionalism.

---

### C. Locals & expats

**Who:** Residents in St John’s and surrounding areas.

**Jobs:**

* Regular weekly/bi-weekly cuts, kids’ haircuts, fades, braids, etc.

**Constraints:**

* Price-sensitive.
* Already loyal to particular barbers, but may explore new ones.

**Features:**

* Loyalty / referral perks.
* Clear service listings (fade, braids, line-up, beard only).
* Opening hours, WhatsApp booking, and queue insights (“3 people waiting now”).

---

### D. Special-occasion visitors (weddings, yacht week, events)

**Who:** Couples getting married, yacht crew during major regattas, influencers.

**Jobs:**

* “I need everyone polished for the wedding/photoshoot tonight.”
* “We need a barber who can handle 5–10 haircuts back-to-back on location.”

**Features:**

* Group booking requests.
* “Wedding & Events Specialists” category.
* On-location pricing and travel radius.

---

## 3. Positioning + concept for “Antigua Barber Guide”

Rather than just “the Antigua version of LA Barber Guide”, you can sharpen the concept:

> “The **Antigua Barber Guide** – the fastest way for visitors and locals to find a trusted barber or mobile stylist on the island.”

Core positioning pillars:

1. **Port-first UX**:

   * Entry experience: “Are you off a cruise ship today?”
   * Enter *ship departure time* → we only show barbers you can safely visit and return.

2. **Geo-aware**:

   * Quick shortcuts: “Near Cruise Port • Near Jolly Harbour • Near English Harbour • Mobile to your Villa”.

3. **Barber-centric**:

   * Easy sign-up and claiming.
   * Free listing + upsell for richer profile, ranking boosts, “featured by the port” type placements.

4. **Local flavour**:

   * Feature profiles and stories (e.g. highlight places like Wags Barbershop as “hidden backyard barbershop paradise”). ([HairCut Harry][7])

---

## 4. Data acquisition & scraping strategy (without breaking ToS)

We need two tracks:

* **Bootstrapping supply data** (you pre-populate the directory).
* **Ongoing, barber-submitted growth.**

Important constraint: scraping Google Maps in a way that bypasses their API / ToS is not something I should help with. Instead, I’ll lean on **official APIs and open or semi-open sources**, then let your own judgment handle any grey-area tactics.

### 4.1. Primary structured source: Google Places API (official)

Google’s **Places API** supports place type `barber_shop` (and related types) and lets you pull: name, location, rating, opening hours, photos, etc. ([Google for Developers][8])

Typical bootstrap flow:

1. **Seed search areas**

   Use **Nearby Search / Text Search** around:

   * St John’s (cruise port coordinates).
   * Jolly Harbour.
   * English Harbour/Falmouth.
   * Other populated areas from city data (All Saints, Piggotts, Liberta, etc.). ([GeoNames][9])

2. **Place types / keywords**

   * `type=barber_shop`
   * Plus keyword expansions: “barbershop”, “men’s hair”, “haircut men”, “fade studio”.

3. **Store basic fields in your DB:**

   * `place_id`
   * Name
   * Address
   * Lat/lng
   * Rating, number_of_reviews
   * Price level (if available)
   * Opening hours
   * Website / phone
   * Photos (store references, not raw photos, to respect usage terms)

4. **Enrich on demand with Place Details**

   For a claimed listing or when rendering a profile, call **Place Details** to fetch richer data (reviews snippet, opening hours, more links). ([Google for Developers][10])

5. **Respect quotas & TOS**

   * Use a server-side key and proper billing.
   * Cache responses in your DB (e.g. nightly refresh of ratings/hours) so you’re not hammering the API.

### 4.2. Complementary sources

To avoid relying exclusively on Google and to get more *authentically local* content:

1. **Local directories & business listings**

   * Dadli Directory’s barbers section already has a decent list (names, phones, sometimes images). ([Dadli Directory][5])
   * You can:

     * Manually curate initial seed data.
     * Reach out and invite them to *claim* their listing on your site.

2. **Facebook / Instagram presence**

   Many Antigua barbers lean on FB/IG as primary presence (Fade Studio, mobile barbers). ([Facebook][6])

   Strategy:

   * Manual curation at first (you don’t need thousands of shops; 20–40 strong profiles is plenty to launch).
   * For each, add:

     * Social handles
     * Best photo
     * Service tags (fades, braids, kids, beard, female cuts, etc.)

3. **Open data / maps**

   * OpenStreetMap sometimes has “barber” points of interest. You can import those safely, respecting their license.
   * Cross-check coordinates with Google Places or manual confirmation.

4. **In-person scouting**

   Because Antigua is small, you have a realistic shot at **physically scouting** St John’s and key resort zones, capturing:

   * Exterior shots.
   * Real service offerings and vibe.
   * Walk time from port.

This gives you an “unfair authenticity” advantage over generic map search.

---

### 4.3. Barbers sign-up + claim flow

Once you have a seed dataset, let barbers own their presence.

**Flow:**

1. **Search & claim**

   * “Search for your barbershop” (we look up by name/phone/Place ID).
   * If found → verify via:

     * SMS/WhatsApp to the phone number on file, or
     * Admin manual approval (upload license / shop photo / IG handle).

2. **Create-new listing**

   * For non-mapped barbers (house setups, mobile only), they can create a new entry:

     * Name, area, approximate location (can be “mobile only”), WhatsApp, services, starting price, Instagram.

3. **Profile completion**

   * Photo gallery.
   * Services & price bands.
   * Languages spoken.
   * “Cruise-friendly yes/no” (willing to handle day-trippers).
   * “Mobile to villas/hotels yes/no and radius / extra fee”.

4. **Monetisation layer (later)**

   * Free basic listing.
   * Paid tiers: “Featured under Cruise Port today”, “Top of Jolly Harbour list”, or “Verified Mobile Barber” badge.

---

## 5. UX specifics tailored to Antigua

You can re-use the LA Barber Guide components but tweak flows:

### 5.1. Landing page logic

First screen: choose who you are.

* **“I’m on a cruise ship today”**

  * Ask: *Ship name* (optional), *time you must be back on board*.
  * Let them pick: “I want something **walkable** from port” vs “I’m happy to take a short taxi”.

* **“I’m staying on the island”**

  * Ask: where? (dropdown of major areas or auto-locate).
  * Ask: “Do you prefer a **barbershop** or a **barber who comes to you**?”

* **“I live here”**

  * Standard geo search, filters for price, style, and vibe.

### 5.2. Core filters

* Distance:

  * “<10 min walk from port”
  * “Near my hotel”
* Services:

  * Fades
  * Braids / loc maintenance
  * Beard only
  * Kids cuts
  * Women’s cuts
* Experience tags:

  * “Cruise-friendly”
  * “Mobile”
  * “Wedding & Events”
* Price band:

  * $
  * $$

### 5.3. Show cruise load context

Leverage cruise data:

* Use port schedules (CruiseMapper or Antigua Cruise Port public info) to display:

  * “Today: 3 ships, ~10,000 passengers in port” with an indicator.
* On busy days, highlight:

  * “Book early – high traffic day at the port.”

([Richès Karayib][4])

---

## 6. Architecture & code reuse from LA Barber Guide

Given you already have LA Barber Guide live, you can treat Antigua as another “city” or “tenant” in the same app.

### 6.1. Multi-region data model

Extend your schema:

* `Region` / `Market` table:

  * `id`: `la`, `antigua`, etc.
  * `name`
  * `country_code`
  * `default_lat`, `default_lng`
  * `port_lat`, `port_lng` (for cruise distance calculations)
  * `slug` for URLs (`/la`, `/antigua`)

* `Barbershop`:

  * `id`
  * `region_id`
  * `place_id` (nullable for non-Google entries)
  * `name`
  * `lat`, `lng`
  * `address`
  * `phone`
  * `website`
  * `whatsapp`
  * `is_mobile`
  * `cruise_friendly`
  * `ranking_score` (derived from ratings, recency, completions)

* `BarbershopProfile`:

  * `bio`, `services`, `price_band`, `photos`, etc.

### 6.2. Frontend reuse

* Reuse:

  * Listing cards.
  * Map view.
  * Filters.
  * Auth & dashboard for barbers.

* Antigua-specific customisations:

  * Hero copy, imagery (cruise port, beaches).
  * Different default filters (more emphasis on “mobile” and “cruise-friendly” than in LA).

### 6.3. Scraper / importer service

Create a small **Import service** (cron job or manual trigger):

* Input:

  * `region_id = antigua`
  * Geo polygon / bounding boxes.
* Steps:

  * Hit Places API for `barber_shop` in that region.
  * Normalize and upsert into `Barbershop` table.
  * Flag those records as `source = google_places`.
* Manual QA:

  * Admin interface to review, merge duplicates, and mark “invite to claim”.

---

## 7. Evaluation: is this worth doing?

**Pros:**

* Clear, under-served niche; no strong, island-specific barber directory that integrates cruise realities.
* Highly focused geography → you can get to “good coverage” fast (maybe 20–40 barbers + a dozen mobile).
* Strong story for barbers: more tourist business, especially high-spend cruise and wedding segments.
* You already have the core tech (LA Barber Guide) so marginal development cost is mostly:

  * Multi-region support.
  * Import pipeline.
  * A few extra flows for cruise users.

**Risks / challenges:**

* Total market size is smaller than LA, so this is a **high-value but niche** play.
* You’ll need to hustle on initial barber outreach so profiles aren’t empty.
* Cruise passengers might default to “ship shore excursions” and not think about haircuts unless you intercept them via:

  * WiFi captive pages (if you can partner).
  * Local advertising near port.
  * SEO for queries like “barber near Antigua cruise port”.

**Mitigation:**

* Treat Antigua as:

  * A **playground** to refine the “tourism + grooming” pattern.
  * A case study to sell later into other islands (St Maarten, Barbados, etc.).
* Focus launch metrics on:

  * Number of barbers onboarded.
  * Number of tourist bookings per week in peak season.
  * Conversion to any paid/featured listing.

---

If you like, next step I can:

* Draft a **lean PRD** for “Antigua Barber Guide” as a second tenant of your existing app, including data model diffs and UI tweaks.
* Or design the **import script contract** (API fields, DB schema, and a rough Node/TS pseudo-implementation for the Google Places bootstrap).

[1]: https://worldpopulationreview.com/cities/antigua-and-barbuda?utm_source=chatgpt.com "Antigua and Barbuda Cities by Population 2025"
[2]: https://en.wikipedia.org/wiki/St._John%27s%2C_Antigua_and_Barbuda?utm_source=chatgpt.com "St. John's, Antigua and Barbuda"
[3]: https://www.visitantiguabarbuda.com/public_relations/antigua-and-barbuda-celebrates-record-breaking-visitor-arrivals-in-2024-and-announces-new-initiatives-for-2025/?utm_source=chatgpt.com "ANTIGUA AND BARBUDA CELEBRATES RECORD ..."
[4]: https://richeskarayib.com/antigua-cruise-port-a-record-year-for-cruises/?utm_source=chatgpt.com "Antigua Cruise Port: a record year for cruises"
[5]: https://dadlidirectory.com/find-everything/barbers/?utm_source=chatgpt.com "Barbers"
[6]: https://www.facebook.com/419202117947014?utm_source=chatgpt.com "The Fade Studio | Saint John"
[7]: https://haircutharry.com/secret-caribbean-paradise-wags-barbershop/?utm_source=chatgpt.com "Secret Caribbean Paradise - Wag's Barbershop"
[8]: https://developers.google.com/maps/documentation/places/web-service/place-types?utm_source=chatgpt.com "Place Types (New) | Places API"
[9]: https://www.geonames.org/AG/largest-cities-in-antigua-and-barbuda.html?utm_source=chatgpt.com "Antigua and Barbuda - 10 Largest Cities"
[10]: https://developers.google.com/maps/documentation/places/web-service/place-details?utm_source=chatgpt.com "Place Details (New) | Places API"
