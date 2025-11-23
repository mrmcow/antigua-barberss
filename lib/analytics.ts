// Analytics & Click Tracking Utilities

import { supabase } from './supabase';

// Get or create user fingerprint for anonymous tracking
export function getUserFingerprint(): string {
  let fingerprint = localStorage.getItem('user_fingerprint');
  if (!fingerprint) {
    fingerprint = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('user_fingerprint', fingerprint);
  }
  return fingerprint;
}

// Get or create session ID (resets after 30 min of inactivity)
export function getSessionId(): string {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const now = Date.now();
  
  const storedSession = localStorage.getItem('session_data');
  if (storedSession) {
    const { sessionId, timestamp } = JSON.parse(storedSession);
    if (now - timestamp < SESSION_TIMEOUT) {
      // Update timestamp
      localStorage.setItem('session_data', JSON.stringify({ sessionId, timestamp: now }));
      return sessionId;
    }
  }
  
  // Create new session
  const newSessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  localStorage.setItem('session_data', JSON.stringify({ sessionId: newSessionId, timestamp: now }));
  return newSessionId;
}

// Track click event
export async function trackClickEvent(
  barbershopId: string,
  eventType: 'phone_call' | 'website_click' | 'booking_click' | 'website_booking_click' | 'directions_click' | 'google_reviews_click',
  destinationUrl?: string
): Promise<void> {
  try {
    const fingerprint = getUserFingerprint();
    const sessionId = getSessionId();
    
    // Call Supabase RPC function
    await supabase.rpc('track_click_event', {
      p_barbershop_id: barbershopId,
      p_event_type: eventType,
      p_user_fingerprint: fingerprint,
      p_destination_url: destinationUrl || null,
      p_session_id: sessionId
    });
    
    // Log for debugging (remove in production)
    console.log(`📊 Tracked: ${eventType} for ${barbershopId}`);
  } catch (error) {
    // Fail silently - don't block user action if analytics fails
    console.error('Analytics error:', error);
  }
}

// Track and navigate - use this for external links
export async function trackAndNavigate(
  barbershopId: string,
  eventType: 'phone_call' | 'website_click' | 'booking_click' | 'website_booking_click' | 'directions_click' | 'google_reviews_click',
  url: string
): Promise<void> {
  // Track the event (don't await - let it fire in background)
  trackClickEvent(barbershopId, eventType, url);
  
  // Navigate immediately (don't wait for analytics)
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Get barbershop stats (for dashboard)
export async function getBarbershopStats(barbershopId: string, days: number = 30) {
  try {
    const { data, error } = await supabase.rpc('get_barbershop_stats', {
      p_barbershop_id: barbershopId,
      p_days: days
    });
    
    if (error) throw error;
    return data[0]; // Returns { total_clicks, phone_calls, website_clicks, booking_clicks, unique_visitors }
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

