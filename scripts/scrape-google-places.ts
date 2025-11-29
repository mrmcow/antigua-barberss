import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Google Places API
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

// Antigua neighborhoods/areas to scrape
const ANTIGUA_AREAS = [
  { name: "St. John's Cruise Port (Heritage Quay)", lat: 17.1195, lng: -61.8504 }, // Core cruise zone
  { name: "St. John's City Centre", lat: 17.1203, lng: -61.8449 }, // Downtown barbers
  { name: "Jolly Harbour", lat: 17.0719, lng: -61.8889 }, // Tourist hub
  { name: "English Harbour / Falmouth", lat: 17.0077, lng: -61.7659 }, // Yachtie central
  { name: "All Saints", lat: 17.0675, lng: -61.7939 }, // Local residential heart
  { name: "Dickenson Bay", lat: 17.1486, lng: -61.8463 }, // Resort strip
  { name: "Old Road / Morris Bay", lat: 17.0210, lng: -61.8590 }, // South coast
  { name: "Cedar Grove / Crosbies", lat: 17.1560, lng: -61.8160 }, // North residential
];

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
  };
  photos?: Array<{ photo_reference: string }>;
}

// Google Places search
async function searchBarbers(location: string, lat: number, lng: number) {
  try {
    const params = {
      location: `${lat},${lng}`,
      radius: 7000,
      type: 'hair_care',
      keyword: 'barber shop',
      key: GOOGLE_API_KEY,
    };

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      { params }
    );

    if (response.data.status === 'OK') {
      return response.data.results || [];
    }

    console.warn(
      `⚠️ Nearby search for ${location} returned status ${response.data.status}: ${response.data.error_message || 'no error message'}`
    );

    // Fallback to text search across area name
    const fallback = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: `barber shop in ${location}`,
          key: GOOGLE_API_KEY,
        },
      }
    );

    if (fallback.data.status === 'OK') {
      return fallback.data.results || [];
    }

    console.warn(
      `⚠️ Text search for ${location} returned status ${fallback.data.status}: ${fallback.data.error_message || 'no error message'}`
    );

    return [];
  } catch (error) {
    console.error(`❌ Error searching ${location}:`, error);
    return [];
  }
}

async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'place_id,name,formatted_address,geometry,rating,user_ratings_total,price_level,formatted_phone_number,website,opening_hours,photos',
          key: GOOGLE_API_KEY,
        },
      }
    );

    const result = response.data.result;
    if (result && !result.place_id) {
      result.place_id = placeId;
    }
    return result;
  } catch (error) {
    console.error(`❌ Error getting details for ${placeId}:`, error);
    return null;
  }
}

function getPriceRange(priceLevel?: number): string {
  if (priceLevel === undefined || priceLevel === null) return '$$';
  if (priceLevel <= 1) return '$';
  if (priceLevel === 2) return '$$';
  if (priceLevel === 3) return '$$$';
  return '$$$$';
}

// Helper to determine "Area" from address or coords
function determineArea(address: string, lat: number, lng: number): string {
  if (address.includes("St John") || address.includes("Saint John")) return "St. John's";
  if (address.includes("Jolly Harbour")) return "Jolly Harbour";
  if (address.includes("English Harbour") || address.includes("Falmouth")) return "English Harbour";
  if (address.includes("All Saints")) return "All Saints";
  return "Antigua";
}

async function saveBarberToDatabase(place: PlaceResult) {
  try {
    // Check if already exists
    const { data: existing } = await supabase
      .from('barbershops')
      .select('id')
      .eq('google_place_id', place.place_id)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping ${place.name} (already in database)`);
      return;
    }

    // Format hours
    let hours = null;
    if (place.opening_hours?.weekday_text) {
      hours = place.opening_hours.weekday_text.reduce((acc, day) => {
        const [dayName, time] = day.split(': ');
        acc[dayName] = time;
        return acc;
      }, {} as Record<string, string>);
    }

    // Get up to 3 photo URLs
    const images = place.photos
      ?.slice(0, 3)
      .map(
        (photo) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
      ) || [];

    // Insert into database with Antigua-specific fields
    const { error } = await supabase.from('barbershops').insert({
      name: place.name,
      address: place.formatted_address,
      neighborhood: determineArea(place.formatted_address, place.geometry.location.lat, place.geometry.location.lng),
      area: determineArea(place.formatted_address, place.geometry.location.lat, place.geometry.location.lng),
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      phone: place.formatted_phone_number || null,
      website: place.website || null,
      google_place_id: place.place_id,
      google_maps_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      rating: place.rating || null,
      review_count: place.user_ratings_total || 0,
      price_range: getPriceRange(place.price_level),
      hours: hours,
      images: images,
      // Default Antigua defaults - will refine later
      cruise_friendly: place.geometry.location.lat > 17.11 && place.geometry.location.lat < 17.13 && place.geometry.location.lng < -61.84, // Approx cruise port zone
      mobile_service: false, // Default false, manually update
      accepts_usd: true, // Almost everyone takes USD
      accepts_ec_dollar: true,
    });

    if (error) {
      console.error(`❌ Error saving ${place.name}:`, error.message);
    } else {
      console.log(`✅ Saved: ${place.name} - ${place.formatted_address}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${place.name}:`, error);
  }
}

async function scrapeAllAreas() {
  console.log('🚀 Starting Antigua Barber Guide scraper...\n');
  console.log(`📍 Scraping ${ANTIGUA_AREAS.length} areas in Antigua\n`);

  let totalFound = 0;
  let totalSaved = 0;

  for (const area of ANTIGUA_AREAS) {
    // Search for barbers in this area
    const places = await searchBarbers(area.name, area.lat, area.lng);
    totalFound += places.length;

    console.log(`📊 Found ${places.length} barbers near ${area.name}`);

    // Get details and save each barber
    for (const place of places) {
      const details = await getPlaceDetails(place.place_id);
      if (details) {
        await saveBarberToDatabase(details);
        totalSaved++;
      }

      // Rate limiting - wait 200ms between requests
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Wait 1 second between areas
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('\n✨ Scraping complete!');
  console.log(`📊 Found ${totalFound} barbers total`);
  console.log(`💾 Saved ${totalSaved} to database`);
  console.log('\n🔗 Check your Supabase dashboard to see the data');
}

// Run the scraper
if (require.main === module) {
  if (!GOOGLE_API_KEY) {
    console.error('❌ Missing GOOGLE_PLACES_API_KEY in .env.local');
    process.exit(1);
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  scrapeAllAreas()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

export { scrapeAllAreas };

