// Analytics & Click Tracking Utilities

import { sendGAEvent } from '@next/third-parties/google';

// Track click event
// Track click event
export async function trackClickEvent(
  barbershopId: string,
  eventType: 'phone_call' | 'website_click' | 'booking_click' | 'website_booking_click' | 'directions_click' | 'google_reviews_click',
  destinationUrl?: string,
  barberName?: string,
  location?: string
): Promise<void> {
  try {
    // Standardize event names for GA4 where possible
    let gaEventName = 'select_content';
    let gaParams: any = {
      content_type: 'barber_listing',
      item_id: barbershopId,
      item_name: barberName || 'unknown',
      item_location_id: location || 'unknown',
      event_category: 'engagement'
    };

    if (eventType === 'booking_click' || eventType === 'website_booking_click') {
      gaEventName = 'generate_lead';
      gaParams = {
        ...gaParams,
        currency: 'USD',
        value: 0 // We don't know the value yet
      };
    }

    // Send standard GA4 event
    sendGAEvent('event', gaEventName, gaParams);

    // Send custom event for backward compatibility and specific tracking
    sendGAEvent('event', eventType, {
      barbershop_id: barbershopId,
      barber_name: barberName,
      barber_location: location,
      destination_url: destinationUrl || 'undefined'
    });

    // Log for debugging (remove in production)
    console.log(`📊 Tracked: ${eventType} for ${barbershopId} (${barberName})`);
  } catch (error) {
    // Fail silently - don't block user action if analytics fails
    console.error('Analytics error:', error);
  }
}

// Track and navigate - use this for external links
export async function trackAndNavigate(
  barbershopId: string,
  eventType: 'phone_call' | 'website_click' | 'booking_click' | 'website_booking_click' | 'directions_click' | 'google_reviews_click',
  url: string,
  barberName?: string,
  location?: string
): Promise<void> {
  // Track the event (don't await - let it fire in background)
  trackClickEvent(barbershopId, eventType, url, barberName, location);

  // Navigate immediately (don't wait for analytics)
  window.open(url, '_blank', 'noopener,noreferrer');
}
