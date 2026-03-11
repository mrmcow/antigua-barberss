/**
 * refresh-photos.ts
 *
 * Re-fetches Google Places photo references for all barbershops and updates
 * the database with fresh, working image URLs.
 *
 * Usage: npm run refresh:photos
 *
 * Why this is needed: Google Places photo references expire over time.
 * The Places API Details endpoint returns fresh references that work for
 * several months. Add this to monthly maintenance.
 */

import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

if (!supabaseUrl || !supabaseKey || !GOOGLE_API_KEY) {
  console.error('❌ Missing credentials. Check .env.local has SUPABASE and GOOGLE_PLACES_API_KEY set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PHOTO_BASE_URL = 'https://maps.googleapis.com/maps/api/place/photo';
const DETAILS_BASE_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

// Build a working photo URL from a fresh photo_reference
function buildPhotoUrl(photoReference: string, maxWidth = 800): string {
  return `${PHOTO_BASE_URL}?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

// Fetch fresh photo references from Google Places Details API
async function fetchFreshPhotos(placeId: string): Promise<string[]> {
  try {
    const response = await axios.get(DETAILS_BASE_URL, {
      params: {
        place_id: placeId,
        fields: 'photos',
        key: GOOGLE_API_KEY,
      },
    });

    const photos = response.data?.result?.photos;
    if (!photos || photos.length === 0) return [];

    // Build working URLs from fresh references (max 5 photos)
    return photos
      .slice(0, 5)
      .map((p: { photo_reference: string }) => buildPhotoUrl(p.photo_reference));
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 403) throw new Error('API_KEY_INVALID');
    return [];
  }
}

// Small delay to avoid hitting rate limits
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🔄 Antigua Barbers — Photo URL Refresh\n');

  // Get all barbershops that have a google_place_id
  const { data: shops, error } = await supabase
    .from('barbershops')
    .select('id, name, google_place_id, images')
    .not('google_place_id', 'is', null)
    .order('name');

  if (error || !shops) {
    console.error('❌ Failed to fetch barbershops:', error?.message);
    process.exit(1);
  }

  console.log(`📋 Found ${shops.length} barbershops with place IDs\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < shops.length; i++) {
    const shop = shops[i];
    const progress = `[${i + 1}/${shops.length}]`;

    process.stdout.write(`${progress} ${shop.name}... `);

    try {
      const freshUrls = await fetchFreshPhotos(shop.google_place_id);

      if (freshUrls.length === 0) {
        console.log('⚪ No photos found');
        skipped++;
      } else {
        const { error: updateError } = await supabase
          .from('barbershops')
          .update({ images: freshUrls })
          .eq('id', shop.id);

        if (updateError) {
          console.log(`❌ DB update failed: ${updateError.message}`);
          failed++;
        } else {
          console.log(`✅ ${freshUrls.length} photo(s) refreshed`);
          updated++;
        }
      }
    } catch (err: any) {
      if (err.message === 'API_KEY_INVALID') {
        console.error('\n❌ API key is invalid or restricted. Check GOOGLE_PLACES_API_KEY in .env.local');
        process.exit(1);
      }
      console.log(`⚠️  Error: ${err.message}`);
      failed++;
    }

    // 200ms delay between requests to stay within rate limits
    if (i < shops.length - 1) await sleep(200);
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Updated:  ${updated} shops`);
  console.log(`⚪ Skipped:  ${skipped} shops (no photos in Google)`);
  console.log(`❌ Failed:   ${failed} shops`);
  console.log(`\n💡 Add this to your monthly maintenance: npm run refresh:photos`);
}

main();
