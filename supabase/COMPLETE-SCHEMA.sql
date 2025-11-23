-- ============================================
-- LA BARBER GUIDE - COMPLETE DATABASE SCHEMA
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BARBERSHOPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS barbershops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT,
  lat FLOAT8 NOT NULL,
  lng FLOAT8 NOT NULL,
  phone TEXT,
  website TEXT,
  instagram_handle TEXT,
  google_place_id TEXT UNIQUE NOT NULL,
  rating FLOAT8,
  review_count INT DEFAULT 0,
  price_range TEXT, -- $, $$, $$$
  hours JSONB, -- opening hours + open_now flag
  images TEXT[], -- photo URLs from Google Places
  
  -- Booking & Availability
  booking_platform TEXT, -- booksy, vagaro, square, etc
  booking_url TEXT, -- direct link to booking page
  accepts_walk_ins BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
  reviewer_name TEXT,
  reviewer_photo TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  date TIMESTAMPTZ,
  source TEXT, -- google, yelp, etc
  
  -- AI-extracted tags
  hair_types TEXT[], -- detected hair types mentioned
  styles TEXT[], -- fade, taper, etc
  sentiment FLOAT8, -- -1 to 1
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLASSIFICATIONS TABLE (AI-powered)
-- ============================================
CREATE TABLE IF NOT EXISTS classifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Aggregated scores stored as JSON
  hair_types JSONB, -- { "4c": 0.8, "curly": 0.6, "straight": 0.3 }
  styles JSONB, -- { "fade": 0.9, "beard": 0.7, "color": 0.2 }
  vibes TEXT[], -- upscale, old-school, queer-friendly, etc
  
  -- Computed flags
  walk_in_friendly BOOLEAN DEFAULT false,
  kids_welcome BOOLEAN DEFAULT false,
  
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS barbershops_neighborhood_idx ON barbershops(neighborhood);
CREATE INDEX IF NOT EXISTS barbershops_rating_idx ON barbershops(rating);
CREATE INDEX IF NOT EXISTS barbershops_location_idx ON barbershops(lat, lng);
CREATE INDEX IF NOT EXISTS barbershops_booking_platform_idx ON barbershops(booking_platform);
CREATE INDEX IF NOT EXISTS reviews_barbershop_id_idx ON reviews(barbershop_id);
CREATE INDEX IF NOT EXISTS reviews_rating_idx ON reviews(rating);

-- ============================================
-- AUTO-UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if they exist, then recreate
DROP TRIGGER IF EXISTS update_barbershops_updated_at ON barbershops;
CREATE TRIGGER update_barbershops_updated_at
  BEFORE UPDATE ON barbershops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_classifications_updated_at ON classifications;
CREATE TRIGGER update_classifications_updated_at
  BEFORE UPDATE ON classifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (Public Read Access)
-- ============================================
-- Disabled for now - enable when adding auth
-- ALTER TABLE barbershops ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow public read access" ON barbershops FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON reviews FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON classifications FOR SELECT USING (true);

-- ============================================
-- DONE! 
-- ============================================
-- Next steps:
-- 1. Run: npm run scrape          (populate barbershops)
-- 2. Run: npm run scrape:reviews  (populate reviews)
-- 3. Run: npm run enrich          (add booking data)
-- 4. Run: npm run classify        (AI classification)

