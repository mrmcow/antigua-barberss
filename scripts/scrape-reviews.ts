import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

interface Review {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
}

async function getBarbershopsWithoutReviews() {
  const { data, error } = await supabase
    .from('barbershops')
    .select('id, google_place_id, name')
    .limit(100);

  if (error) {
    console.error('Error fetching barbershops:', error);
    return [];
  }

  return data || [];
}

async function getPlaceReviews(placeId: string) {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'reviews',
          key: GOOGLE_API_KEY,
        },
      }
    );

    return response.data.result?.reviews || [];
  } catch (error) {
    console.error(`Error getting reviews for ${placeId}:`, error);
    return [];
  }
}

async function saveReviews(barbershopId: string, reviews: Review[]) {
  for (const review of reviews) {
    try {
      const { error } = await supabase.from('reviews').insert({
        barbershop_id: barbershopId,
        reviewer_name: review.author_name,
        reviewer_photo: review.profile_photo_url || null,
        rating: review.rating,
        text: review.text,
        date: new Date(review.time * 1000).toISOString(),
        source: 'google',
        hair_types: [], // Will be classified later
        styles: [], // Will be classified later
        sentiment: null,
      });

      if (error && !error.message.includes('duplicate')) {
        console.error(`  ❌ Error saving review:`, error.message);
      }
    } catch (e) {
      // Skip duplicates silently
    }
  }
}

async function detectBookingPlatform(barbershop: any) {
  const website = barbershop.website?.toLowerCase() || '';
  const name = barbershop.name?.toLowerCase() || '';

  // Check common booking platforms
  if (website.includes('booksy') || name.includes('booksy')) {
    return { platform: 'booksy', url: barbershop.website };
  }
  if (website.includes('squareup') || website.includes('square.site')) {
    return { platform: 'square', url: barbershop.website };
  }
  if (website.includes('vagaro')) {
    return { platform: 'vagaro', url: barbershop.website };
  }
  if (website.includes('schedulicity')) {
    return { platform: 'schedulicity', url: barbershop.website };
  }
  if (website.includes('fresha') || website.includes('shedul')) {
    return { platform: 'fresha', url: barbershop.website };
  }

  return null;
}

async function scrapeReviewsAndDetails() {
  console.log('🔥 Enhanced Scraper - Pulling Reviews, Images & Booking Links\n');

  const barbershops = await getBarbershopsWithoutReviews();
  console.log(`📊 Processing ${barbershops.length} barbershops...\n`);

  let totalReviews = 0;
  let totalWithBooking = 0;

  for (const shop of barbershops) {
    console.log(`\n📍 ${shop.name}`);

    // Get reviews
    const reviews = await getPlaceReviews(shop.google_place_id);
    if (reviews.length > 0) {
      await saveReviews(shop.id, reviews);
      totalReviews += reviews.length;
      console.log(`  ✅ Saved ${reviews.length} reviews`);
      
      // Update review count
      await supabase
        .from('barbershops')
        .update({ review_count: reviews.length })
        .eq('id', shop.id);
    }

    // Detect booking platform
    const { data: shopData } = await supabase
      .from('barbershops')
      .select('website, name')
      .eq('id', shop.id)
      .single();

    if (shopData) {
      const booking = await detectBookingPlatform(shopData);
      if (booking) {
        console.log(`  🔗 Booking: ${booking.platform}`);
        totalWithBooking++;
      }
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log('\n✨ Enhanced scraping complete!');
  console.log(`📊 ${totalReviews} reviews saved`);
  console.log(`🔗 ${totalWithBooking} barbers with booking platforms`);
}

if (require.main === module) {
  if (!GOOGLE_API_KEY) {
    console.error('❌ Missing GOOGLE_PLACES_API_KEY');
    process.exit(1);
  }

  scrapeReviewsAndDetails()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { scrapeReviewsAndDetails };

