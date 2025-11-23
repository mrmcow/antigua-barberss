import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Google Places API
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

// LA neighborhoods to scrape
const LA_AREAS = [
  { name: 'Venice Beach, Los Angeles, CA', lat: 33.9850, lng: -118.4695 },
  { name: 'Santa Monica, Los Angeles, CA', lat: 34.0195, lng: -118.4912 },
  { name: 'Hollywood, Los Angeles, CA', lat: 34.0928, lng: -118.3287 },
  { name: 'Downtown Los Angeles, CA', lat: 34.0407, lng: -118.2468 },
  { name: 'Koreatown, Los Angeles, CA', lat: 34.0579, lng: -118.3009 },
  { name: 'Silver Lake, Los Angeles, CA', lat: 34.0866, lng: -118.2705 },
  { name: 'West Hollywood, CA', lat: 34.0900, lng: -118.3617 },
  { name: 'Culver City, CA', lat: 34.0211, lng: -118.3965 },
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

async function searchBarbers(location: string, lat: number, lng: number) {
  console.log(`\n🔍 Searching for barbers near ${location}...`);
  
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000, // 5km radius
          type: 'hair_care',
          keyword: 'barber',
          key: GOOGLE_API_KEY,
        },
      }
    );

    return response.data.results || [];
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
    
    // Make sure place_id is set
    if (result && !result.place_id) {
      result.place_id = placeId;
    }

    return result;
  } catch (error) {
    console.error(`❌ Error getting details for ${placeId}:`, error);
    return null;
  }
}

function extractNeighborhood(address: string): string {
  // Try to extract neighborhood from address
  const parts = address.split(',');
  if (parts.length >= 2) {
    return parts[1].trim();
  }
  return 'Los Angeles';
}

function getPriceRange(priceLevel?: number): string {
  if (!priceLevel) return '$$';
  if (priceLevel <= 1) return '$';
  if (priceLevel === 2) return '$$';
  return '$$$';
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

    // Insert into database
    const { error } = await supabase.from('barbershops').insert({
      name: place.name,
      address: place.formatted_address,
      neighborhood: extractNeighborhood(place.formatted_address),
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      phone: place.formatted_phone_number || null,
      website: place.website || null,
      google_place_id: place.place_id,
      google_maps_url: place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      rating: place.rating || null,
      review_count: place.user_ratings_total || 0,
      price_range: getPriceRange(place.price_level),
      hours: hours,
      images: images,
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
  console.log('🚀 Starting LA Barber Guide scraper...\n');
  console.log(`📍 Scraping ${LA_AREAS.length} areas in LA County\n`);

  let totalFound = 0;
  let totalSaved = 0;

  for (const area of LA_AREAS) {
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

