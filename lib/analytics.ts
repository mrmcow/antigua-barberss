// Analytics & Click Tracking Utilities

import { sendGAEvent } from '@next/third-parties/google';

// Track click event
export async function trackClickEvent(
  barbershopId: string,
  eventType: 'phone_call' | 'website_click' | 'booking_click' | 'website_booking_click' | 'directions_click' | 'google_reviews_click' | 'google_view_click' | 'whatsapp_click',
  destinationUrl?: string,
  barberName?: string,
  location?: string
): Promise<void> {
  try {
    // Standardize event names for GA4
    // We map our internal events to standard GA4 events where it makes sense
    let gaEventName = 'select_content';
    let gaParams: any = {
      content_type: 'barber_listing',
      item_id: barbershopId,
      item_name: barberName || 'unknown',
      location_id: location || 'unknown',
      event_category: 'engagement',
      destination_url: destinationUrl || 'undefined'
    };

    // Map specific actions to more meaningful GA4 events
    if (eventType === 'phone_call') {
      gaEventName = 'contact';
      gaParams.method = 'phone';
    } else if (eventType === 'whatsapp_click') {
      gaEventName = 'contact';
      gaParams.method = 'whatsapp';
    } else if (eventType === 'booking_click' || eventType === 'website_booking_click') {
      gaEventName = 'begin_checkout'; // Intent to purchase
    } else if (eventType === 'directions_click') {
      gaEventName = 'view_location';
    }

    // Send standard GA4 event
    sendGAEvent('event', gaEventName, gaParams);

    // Send custom event for backward compatibility and granular tracking
    // This ensures we see "whatsapp_click" explicitly in reports
    sendGAEvent('event', eventType, {
      barbershop_id: barbershopId,
      barber_name: barberName,
      barber_location: location,
      destination_url: destinationUrl || 'undefined'
    });

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Tracked: ${eventType} (${gaEventName}) for ${barbershopId}`);
    }
  } catch (error) {
    // Fail silently - don't block user action if analytics fails
    console.error('Analytics error:', error);
  }
}

// Track and navigate - use this for external links
export async function trackAndNavigate(
  barbershopId: string,
  eventType: 'phone_call' | 'website_click' | 'booking_click' | 'website_booking_click' | 'directions_click' | 'google_reviews_click' | 'google_view_click' | 'whatsapp_click',
  url: string,
  barberName?: string,
  location?: string
): Promise<void> {
  // Track the event (don't await - let it fire in background)
  trackClickEvent(barbershopId, eventType, url, barberName, location);

  // Navigate immediately (don't wait for analytics)
  window.open(url, '_blank', 'noopener,noreferrer');
}
