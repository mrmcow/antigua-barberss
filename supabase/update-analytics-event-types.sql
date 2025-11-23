-- Update the click_events table to support new event types
-- Add 'website_booking_click' to allowed event types

ALTER TABLE click_events 
DROP CONSTRAINT IF EXISTS click_events_event_type_check;

ALTER TABLE click_events 
ADD CONSTRAINT click_events_event_type_check 
CHECK (event_type IN (
  'phone_call',
  'website_click', 
  'booking_click',
  'website_booking_click',
  'directions_click',
  'google_reviews_click'
));

-- Drop existing function first
DROP FUNCTION IF EXISTS track_click_event(uuid,text,text,text,text);

-- Recreate the RPC function with updated event types
CREATE OR REPLACE FUNCTION track_click_event(
  p_barbershop_id UUID,
  p_event_type TEXT,
  p_user_fingerprint TEXT,
  p_destination_url TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert click event
  INSERT INTO click_events (
    barbershop_id,
    event_type,
    user_fingerprint,
    destination_url,
    session_id,
    created_at
  ) VALUES (
    p_barbershop_id,
    p_event_type,
    p_user_fingerprint,
    p_destination_url,
    p_session_id,
    NOW()
  );
  
  -- Update analytics summary (upsert)
  INSERT INTO barbershop_analytics (
    barbershop_id,
    date,
    total_clicks,
    phone_calls,
    website_clicks,
    booking_clicks,
    directions_clicks,
    google_reviews_clicks,
    unique_visitors
  ) VALUES (
    p_barbershop_id,
    CURRENT_DATE,
    1,
    CASE WHEN p_event_type = 'phone_call' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type IN ('website_click', 'website_booking_click') THEN 1 ELSE 0 END,
    CASE WHEN p_event_type IN ('booking_click', 'website_booking_click') THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'directions_click' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'google_reviews_click' THEN 1 ELSE 0 END,
    1
  )
  ON CONFLICT (barbershop_id, date)
  DO UPDATE SET
    total_clicks = barbershop_analytics.total_clicks + 1,
    phone_calls = barbershop_analytics.phone_calls + CASE WHEN p_event_type = 'phone_call' THEN 1 ELSE 0 END,
    website_clicks = barbershop_analytics.website_clicks + CASE WHEN p_event_type IN ('website_click', 'website_booking_click') THEN 1 ELSE 0 END,
    booking_clicks = barbershop_analytics.booking_clicks + CASE WHEN p_event_type IN ('booking_click', 'website_booking_click') THEN 1 ELSE 0 END,
    directions_clicks = barbershop_analytics.directions_clicks + CASE WHEN p_event_type = 'directions_click' THEN 1 ELSE 0 END,
    google_reviews_clicks = barbershop_analytics.google_reviews_clicks + CASE WHEN p_event_type = 'google_reviews_click' THEN 1 ELSE 0 END,
    updated_at = NOW();
END;
$$;
