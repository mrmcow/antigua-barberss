-- ============================================
-- LA BARBER GUIDE - ANALYTICS & MONETIZATION
-- Track every click for revenue attribution
-- ============================================

-- Add Google Maps URL to barbershops
ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- ============================================
-- CLICK EVENTS TABLE
-- Track ALL user interactions for monetization
-- ============================================
CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
  
  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'phone_call',
    'website_click', 
    'booking_click',
    'directions_click',
    'google_reviews_click',
    'upvote',
    'downvote'
  )),
  
  -- User context (anonymous)
  user_fingerprint TEXT, -- browser fingerprint for deduplication
  user_agent TEXT,
  referrer TEXT,
  
  -- Location context
  user_lat FLOAT8,
  user_lng FLOAT8,
  distance_miles FLOAT8, -- calculated distance to barber
  
  -- Destination URL (what they clicked)
  destination_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Session tracking
  session_id TEXT -- group clicks from same browsing session
);

-- ============================================
-- ANALYTICS AGGREGATIONS (Updated Daily)
-- For fast dashboard queries
-- ============================================
CREATE TABLE IF NOT EXISTS barbershop_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  -- Click counts by type
  phone_calls INT DEFAULT 0,
  website_clicks INT DEFAULT 0,
  booking_clicks INT DEFAULT 0,
  directions_clicks INT DEFAULT 0,
  google_reviews_clicks INT DEFAULT 0,
  
  -- Engagement metrics
  total_clicks INT DEFAULT 0,
  unique_users INT DEFAULT 0, -- based on fingerprint
  
  -- Voting
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  
  -- Revenue potential (calculated)
  estimated_revenue_cents INT DEFAULT 0, -- based on click values
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(barbershop_id, date)
);

-- ============================================
-- PRICING TIERS TABLE
-- Define what barbers pay based on clicks
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier_name TEXT NOT NULL UNIQUE,
  
  -- Monthly limits
  max_phone_calls INT,
  max_website_clicks INT,
  max_booking_clicks INT,
  
  -- Pricing
  monthly_price_cents INT NOT NULL,
  price_per_phone_call_cents INT DEFAULT 0, -- overage pricing
  price_per_website_click_cents INT DEFAULT 0,
  price_per_booking_click_cents INT DEFAULT 0,
  
  -- Features
  featured_placement BOOLEAN DEFAULT false,
  priority_ranking BOOLEAN DEFAULT false,
  analytics_access BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BARBERSHOP SUBSCRIPTIONS
-- Track who's paying and their tier
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE UNIQUE NOT NULL,
  tier_id UUID REFERENCES pricing_tiers(id) NOT NULL,
  
  -- Status
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trial')),
  
  -- Billing
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  
  -- Usage tracking
  phone_calls_this_period INT DEFAULT 0,
  website_clicks_this_period INT DEFAULT 0,
  booking_clicks_this_period INT DEFAULT 0,
  
  -- Stripe integration
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_click_events_barbershop ON click_events(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_click_events_created ON click_events(created_at);
CREATE INDEX IF NOT EXISTS idx_click_events_type ON click_events(event_type);
CREATE INDEX IF NOT EXISTS idx_click_events_fingerprint ON click_events(user_fingerprint);

CREATE INDEX IF NOT EXISTS idx_analytics_barbershop_date ON barbershop_analytics(barbershop_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON barbershop_analytics(date);

-- ============================================
-- FUNCTION: Track Click Event
-- Call this from frontend when user clicks
-- ============================================
CREATE OR REPLACE FUNCTION track_click_event(
  p_barbershop_id UUID,
  p_event_type TEXT,
  p_user_fingerprint TEXT,
  p_destination_url TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO click_events (
    barbershop_id,
    event_type,
    user_fingerprint,
    destination_url,
    session_id
  ) VALUES (
    p_barbershop_id,
    p_event_type,
    p_user_fingerprint,
    p_destination_url,
    p_session_id
  ) RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DEFAULT PRICING TIERS
-- ============================================
INSERT INTO pricing_tiers (tier_name, monthly_price_cents, max_phone_calls, max_website_clicks, max_booking_clicks, featured_placement, priority_ranking, analytics_access)
VALUES 
  ('Free', 0, 10, 20, 10, false, false, false),
  ('Basic', 4900, 50, 100, 50, false, false, true),
  ('Pro', 9900, 200, 500, 200, true, true, true),
  ('Enterprise', 19900, NULL, NULL, NULL, true, true, true) -- unlimited
ON CONFLICT (tier_name) DO NOTHING;

-- ============================================
-- FUNCTION: Get Barbershop Analytics Summary
-- For dashboard display to barbers
-- ============================================
CREATE OR REPLACE FUNCTION get_barbershop_stats(
  p_barbershop_id UUID,
  p_days INT DEFAULT 30
) RETURNS TABLE (
  total_clicks BIGINT,
  phone_calls BIGINT,
  website_clicks BIGINT,
  booking_clicks BIGINT,
  unique_visitors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_clicks,
    COUNT(CASE WHEN event_type = 'phone_call' THEN 1 END)::BIGINT as phone_calls,
    COUNT(CASE WHEN event_type = 'website_click' THEN 1 END)::BIGINT as website_clicks,
    COUNT(CASE WHEN event_type = 'booking_click' THEN 1 END)::BIGINT as booking_clicks,
    COUNT(DISTINCT user_fingerprint)::BIGINT as unique_visitors
  FROM click_events
  WHERE barbershop_id = p_barbershop_id
    AND created_at >= NOW() - INTERVAL '1 day' * p_days;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEW: Top Performing Barbers (by revenue potential)
-- ============================================
CREATE OR REPLACE VIEW top_barbers_by_engagement AS
SELECT 
  b.id,
  b.name,
  b.neighborhood,
  COUNT(ce.id) as total_clicks,
  COUNT(DISTINCT ce.user_fingerprint) as unique_users,
  COUNT(CASE WHEN ce.event_type = 'phone_call' THEN 1 END) as phone_calls,
  COUNT(CASE WHEN ce.event_type = 'booking_click' THEN 1 END) as booking_clicks,
  -- Revenue potential calculation (phone = $3, booking = $2, website = $0.50)
  (
    COUNT(CASE WHEN ce.event_type = 'phone_call' THEN 1 END) * 300 +
    COUNT(CASE WHEN ce.event_type = 'booking_click' THEN 1 END) * 200 +
    COUNT(CASE WHEN ce.event_type = 'website_click' THEN 1 END) * 50
  ) as estimated_revenue_cents
FROM barbershops b
LEFT JOIN click_events ce ON b.id = ce.barbershop_id
  AND ce.created_at >= NOW() - INTERVAL '30 days'
GROUP BY b.id, b.name, b.neighborhood
ORDER BY estimated_revenue_cents DESC;

-- ============================================
-- NOTES FOR IMPLEMENTATION
-- ============================================
-- 
-- FRONTEND INTEGRATION:
-- 1. Wrap all links/buttons with click tracking
-- 2. Call track_click_event() before navigation
-- 3. Use getUserFingerprint() for anonymous tracking
-- 
-- EXAMPLE FRONTEND CODE:
-- ```typescript
-- async function trackAndNavigate(eventType, url) {
--   const fingerprint = getUserFingerprint();
--   await supabase.rpc('track_click_event', {
--     p_barbershop_id: barberId,
--     p_event_type: eventType,
--     p_user_fingerprint: fingerprint,
--     p_destination_url: url
--   });
--   window.open(url, '_blank');
-- }
-- ```
-- 
-- MONETIZATION STRATEGY:
-- 1. Free tier: Show basic analytics, limited clicks
-- 2. Basic ($49/mo): More clicks, basic analytics
-- 3. Pro ($99/mo): Featured placement, priority in search
-- 4. Enterprise ($199/mo): Unlimited, custom integrations
-- 
-- PITCH TO BARBERS:
-- "You got 47 phone calls last month from LA Barber Guide"
-- "Upgrade to Pro to get featured placement and 3x more traffic"

