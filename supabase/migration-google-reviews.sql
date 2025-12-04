-- Migration: Store Google Reviews in Database
-- This reduces API costs by moving reviews from on-demand to batch processing

-- Create google_reviews table
CREATE TABLE IF NOT EXISTS google_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  relative_time_description TEXT,
  time BIGINT, -- Unix timestamp from Google
  profile_photo_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS google_reviews_barbershop_id_idx ON google_reviews(barbershop_id);
CREATE INDEX IF NOT EXISTS google_reviews_rating_idx ON google_reviews(rating);
CREATE INDEX IF NOT EXISTS google_reviews_time_idx ON google_reviews(time);

-- Create API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_name TEXT NOT NULL, -- 'google_places_details', 'google_places_reviews'  
  endpoint TEXT NOT NULL,
  cost_per_call DECIMAL(10,4), -- e.g., 0.017 for Places API Details
  calls_made INT DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Prevent duplicate entries per day
  UNIQUE(api_name, endpoint, date)
);

-- Indexes for API usage tracking
CREATE INDEX IF NOT EXISTS api_usage_date_idx ON api_usage(date);
CREATE INDEX IF NOT EXISTS api_usage_api_name_idx ON api_usage(api_name);

-- Add last_reviews_update to barbershops table to track when reviews were last fetched
ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS last_reviews_update TIMESTAMPTZ;

-- Auto-update trigger for google_reviews
CREATE OR REPLACE FUNCTION update_google_reviews_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_google_reviews_updated_at ON google_reviews;
CREATE TRIGGER update_google_reviews_updated_at
  BEFORE UPDATE ON google_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_google_reviews_updated_at_column();
