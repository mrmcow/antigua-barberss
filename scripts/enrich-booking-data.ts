import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

interface BookingInfo {
  platform: string | null;
  booking_url: string | null;
  deep_link?: string;
}

interface PopularTimes {
  current_popularity?: number; // 0-100
  usual_popularity_by_hour?: any;
}

function detectBookingPlatform(website: string, name: string): BookingInfo {
  const url = website.toLowerCase();
  const shopName = name.toLowerCase();

  // Booksy
  if (url.includes('booksy.com')) {
    return {
      platform: 'booksy',
      booking_url: website,
      deep_link: website
    };
  }

  // Vagaro
  if (url.includes('vagaro.com')) {
    return {
      platform: 'vagaro',
      booking_url: website,
      deep_link: website
    };
  }

  // Square
  if (url.includes('square.site') || url.includes('squareup.com')) {
    return {
      platform: 'square',
      booking_url: website,
      deep_link: website
    };
  }

  // Schedulicity
  if (url.includes('schedulicity.com')) {
    return {
      platform: 'schedulicity',
      booking_url: website,
      deep_link: website
    };
  }

  // Fresha (formerly Shedul)
  if (url.includes('fresha.com') || url.includes('shedul.com')) {
    return {
      platform: 'fresha',
      booking_url: website,
      deep_link: website
    };
  }

  // Genbook
  if (url.includes('genbook.com')) {
    return {
      platform: 'genbook',
      booking_url: website,
      deep_link: website
    };
  }

  // StyleSeat
  if (url.includes('styleseat.com')) {
    return {
      platform: 'styleseat',
      booking_url: website,
      deep_link: website
    };
  }

  return {
    platform: null,
    booking_url: website,
  };
}

async function getPlaceDetails(placeId: string) {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'opening_hours,current_opening_hours,website,url',
          key: GOOGLE_API_KEY,
        },
      }
    );

    return response.data.result || null;
  } catch (error) {
    console.error(`Error getting place details:`, error);
    return null;
  }
}

async function enrichBarbershops() {
  console.log('🔗 Enriching Barbershops with Booking & Availability Data\n');

  const { data: barbershops, error } = await supabase
    .from('barbershops')
    .select('id, name, google_place_id, website')
    .not('google_place_id', 'is', null)
    .limit(100);

  if (error) {
    console.error('Error fetching barbershops:', error);
    return;
  }

  let enriched = 0;

  for (const shop of barbershops || []) {
    console.log(`\n🔍 ${shop.name}`);

    // Get detailed info from Google
    const details = await getPlaceDetails(shop.google_place_id);
    
    if (details) {
      // Check if open now
      const isOpenNow = details.opening_hours?.open_now || false;
      
      console.log(`  ⏰ Open Now: ${isOpenNow ? '✅ YES' : '❌ NO'}`);

      // Update opening hours
      if (details.opening_hours?.weekday_text) {
        await supabase
          .from('barbershops')
          .update({
            hours: {
              weekday_text: details.opening_hours.weekday_text,
              open_now: isOpenNow
            }
          })
          .eq('id', shop.id);
      }
    }

    // Detect booking platform
    if (shop.website) {
      const bookingInfo = detectBookingPlatform(shop.website, shop.name);
      
      if (bookingInfo.platform) {
        console.log(`  🔗 Booking Platform: ${bookingInfo.platform}`);
        console.log(`  🌐 Booking URL: ${bookingInfo.booking_url}`);

        // Save booking info to database
        await supabase
          .from('barbershops')
          .update({
            booking_platform: bookingInfo.platform,
            booking_url: bookingInfo.booking_url
          })
          .eq('id', shop.id);

        enriched++;
      }
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n\n✨ Enrichment Complete!`);
  console.log(`📊 ${enriched} barbershops have online booking`);
}

if (require.main === module) {
  if (!GOOGLE_API_KEY) {
    console.error('❌ Missing GOOGLE_PLACES_API_KEY');
    process.exit(1);
  }

  enrichBarbershops()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { enrichBarbershops, detectBookingPlatform };

