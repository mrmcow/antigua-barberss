import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_PLACES_API_KEY not found in environment variables');
  process.exit(1);
}

interface GoogleReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url?: string;
}

async function trackAPIUsage(apiName: string, endpoint: string, calls: number, costPerCall: number) {
  const totalCost = calls * costPerCall;
  
  const { error } = await supabase
    .from('api_usage')
    .upsert({
      api_name: apiName,
      endpoint: endpoint,
      cost_per_call: costPerCall,
      calls_made: calls,
      total_cost: totalCost,
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    }, {
      onConflict: 'api_name,endpoint,date',
      ignoreDuplicates: false
    });

  if (error) {
    console.error('Error tracking API usage:', error);
  } else {
    console.log(`💰 Tracked API usage: ${calls} calls to ${apiName} (Cost: $${totalCost.toFixed(2)})`);
  }
}

async function fetchGoogleReviews(placeId: string): Promise<GoogleReview[]> {
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

    // Track the API call cost ($0.017 per call for Place Details)
    await trackAPIUsage('google_places_details', 'reviews', 1, 0.017);

    return response.data.result?.reviews || [];
  } catch (error) {
    console.error(`❌ Error fetching reviews for ${placeId}:`, error);
    return [];
  }
}

async function saveReviewsToDatabase(barbershopId: string, reviews: GoogleReview[]) {
  if (!reviews.length) return;

  // First, delete existing reviews for this barbershop to avoid duplicates
  const { error: deleteError } = await supabase
    .from('google_reviews')
    .delete()
    .eq('barbershop_id', barbershopId);

  if (deleteError) {
    console.error(`❌ Error deleting old reviews for ${barbershopId}:`, deleteError);
    return;
  }

  // Insert new reviews
  const reviewsToInsert = reviews.map(review => ({
    barbershop_id: barbershopId,
    author_name: review.author_name,
    rating: review.rating,
    relative_time_description: review.relative_time_description,
    text: review.text || '',
    time: review.time,
    profile_photo_url: review.profile_photo_url || null
  }));

  const { error } = await supabase
    .from('google_reviews')
    .insert(reviewsToInsert);

  if (error) {
    console.error(`❌ Error saving reviews for ${barbershopId}:`, error);
  } else {
    console.log(`💾 Saved ${reviews.length} reviews for barbershop`);
  }
}

async function getBarbershopsNeedingReviews() {
  const { data, error } = await supabase
    .from('barbershops')
    .select('id, name, google_place_id, last_reviews_update')
    .not('google_place_id', 'is', null);

  if (error) {
    console.error('❌ Error fetching barbershops:', error);
    return [];
  }

  return data || [];
}

async function updateReviewsTimestamp(barbershopId: string) {
  const { error } = await supabase
    .from('barbershops')
    .update({ last_reviews_update: new Date().toISOString() })
    .eq('id', barbershopId);

  if (error) {
    console.error(`❌ Error updating timestamp for ${barbershopId}:`, error);
  }
}

async function migrateGoogleReviews() {
  console.log('🔄 Starting Google Reviews migration to database...');

  const barbershops = await getBarbershopsNeedingReviews();
  console.log(`📊 Found ${barbershops.length} barbershops to process`);

  if (!barbershops.length) {
    console.log('✅ No barbershops need review updates');
    return;
  }

  let processed = 0;
  let apiCallsUsed = 0;
  let totalReviewsSaved = 0;

  for (const barber of barbershops) {
    console.log(`\n🏪 Processing: ${barber.name}`);
    
    if (!barber.google_place_id) {
      console.log('  ⏭️  No Google Place ID - skipping');
      continue;
    }

    // Check if reviews were updated recently (within 24 hours)
    const lastUpdate = barber.last_reviews_update ? new Date(barber.last_reviews_update) : null;
    const now = new Date();
    const hoursSinceUpdate = lastUpdate ? (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60) : 999;

    if (hoursSinceUpdate < 24) {
      console.log(`  ⏭️  Reviews updated ${hoursSinceUpdate.toFixed(1)}h ago - skipping`);
      continue;
    }

    try {
      const reviews = await fetchGoogleReviews(barber.google_place_id);
      apiCallsUsed++;
      
      if (reviews.length > 0) {
        await saveReviewsToDatabase(barber.id, reviews);
        totalReviewsSaved += reviews.length;
        console.log(`  ✅ Fetched and saved ${reviews.length} reviews`);
      } else {
        console.log('  📝 No reviews found');
      }

      await updateReviewsTimestamp(barber.id);
      processed++;

      // Rate limiting: pause between requests
      if (apiCallsUsed % 10 === 0) {
        console.log('  ⏳ Pausing for rate limiting...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`  ❌ Error processing ${barber.name}:`, error);
    }
  }

  console.log('\n✅ Google Reviews migration complete:');
  console.log(`   🏪 Barbershops processed: ${processed}`);
  console.log(`   📞 API calls used: ${apiCallsUsed}`);
  console.log(`   💬 Total reviews saved: ${totalReviewsSaved}`);
  console.log(`   💰 Estimated cost: $${(apiCallsUsed * 0.017).toFixed(2)}`);
}

async function main() {
  const mode = process.argv[2];
  
  if (mode === '--force') {
    console.log('🔴 FORCE MODE: Updating all barbershops regardless of timestamp');
    // Temporarily clear all timestamps to force updates
    await supabase
      .from('barbershops')
      .update({ last_reviews_update: null })
      .not('google_place_id', 'is', null);
  }

  await migrateGoogleReviews();
}

if (require.main === module) {
  main().catch(console.error);
}

export { migrateGoogleReviews };
