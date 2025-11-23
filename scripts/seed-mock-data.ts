import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockBarbers = [
  {
    name: 'Fade Kings LA',
    address: '1234 Abbot Kinney Blvd, Venice, CA 90291',
    neighborhood: 'Venice Beach',
    lat: 33.9850,
    lng: -118.4695,
    phone: '(310) 555-0100',
    website: 'https://fadekingsla.com',
    google_place_id: 'mock_fade_kings_la',
    rating: 4.9,
    review_count: 324,
    price_range: '$$',
    hours: {
      Monday: '9:00 AM – 7:00 PM',
      Tuesday: '9:00 AM – 7:00 PM',
      Wednesday: '9:00 AM – 7:00 PM',
      Thursday: '9:00 AM – 7:00 PM',
      Friday: '9:00 AM – 8:00 PM',
      Saturday: '9:00 AM – 8:00 PM',
      Sunday: '10:00 AM – 6:00 PM'
    },
    images: []
  },
  {
    name: 'Hollywood Cuts',
    address: '6801 Hollywood Blvd, Los Angeles, CA 90028',
    neighborhood: 'Hollywood',
    lat: 34.0928,
    lng: -118.3287,
    phone: '(323) 555-0200',
    website: null,
    google_place_id: 'mock_hollywood_cuts',
    rating: 4.7,
    review_count: 189,
    price_range: '$$$',
    hours: {
      Monday: '10:00 AM – 8:00 PM',
      Tuesday: '10:00 AM – 8:00 PM',
      Wednesday: '10:00 AM – 8:00 PM',
      Thursday: '10:00 AM – 8:00 PM',
      Friday: '10:00 AM – 9:00 PM',
      Saturday: '10:00 AM – 9:00 PM',
      Sunday: 'Closed'
    },
    images: []
  },
  {
    name: 'Downtown Barber Co',
    address: '550 S Spring St, Los Angeles, CA 90013',
    neighborhood: 'Downtown LA',
    lat: 34.0407,
    lng: -118.2468,
    phone: '(213) 555-0300',
    website: 'https://downtownbarberco.com',
    google_place_id: 'mock_downtown_barber',
    rating: 4.8,
    review_count: 256,
    price_range: '$$',
    hours: {
      Monday: '8:00 AM – 6:00 PM',
      Tuesday: '8:00 AM – 6:00 PM',
      Wednesday: '8:00 AM – 6:00 PM',
      Thursday: '8:00 AM – 6:00 PM',
      Friday: '8:00 AM – 7:00 PM',
      Saturday: '9:00 AM – 5:00 PM',
      Sunday: 'Closed'
    },
    images: []
  },
  {
    name: 'The Barber Shop LA',
    address: '234 S Beverly Dr, Beverly Hills, CA 90212',
    neighborhood: 'Beverly Hills',
    lat: 34.0633,
    lng: -118.4000,
    phone: '(310) 555-0400',
    website: null,
    google_place_id: 'mock_barber_shop_la',
    rating: 4.6,
    review_count: 142,
    price_range: '$$$',
    hours: {
      Monday: '9:00 AM – 7:00 PM',
      Tuesday: '9:00 AM – 7:00 PM',
      Wednesday: '9:00 AM – 7:00 PM',
      Thursday: '9:00 AM – 7:00 PM',
      Friday: '9:00 AM – 8:00 PM',
      Saturday: '10:00 AM – 6:00 PM',
      Sunday: 'Closed'
    },
    images: []
  },
  {
    name: 'Silver Lake Cuts',
    address: '2906 Sunset Blvd, Los Angeles, CA 90026',
    neighborhood: 'Silver Lake',
    lat: 34.0866,
    lng: -118.2705,
    phone: '(323) 555-0500',
    website: 'https://silverlakecuts.com',
    google_place_id: 'mock_silver_lake_cuts',
    rating: 4.9,
    review_count: 287,
    price_range: '$$',
    hours: {
      Monday: 'Closed',
      Tuesday: '10:00 AM – 8:00 PM',
      Wednesday: '10:00 AM – 8:00 PM',
      Thursday: '10:00 AM – 8:00 PM',
      Friday: '10:00 AM – 9:00 PM',
      Saturday: '9:00 AM – 7:00 PM',
      Sunday: '10:00 AM – 6:00 PM'
    },
    images: []
  }
];

async function seedMockData() {
  console.log('🌱 Seeding mock barber data...\n');

  for (const barber of mockBarbers) {
    const { error } = await supabase
      .from('barbershops')
      .insert(barber);

    if (error) {
      console.error(`❌ Error adding ${barber.name}:`, error.message);
    } else {
      console.log(`✅ Added: ${barber.name} - ${barber.neighborhood}`);
    }
  }

  console.log('\n✨ Mock data seeded!');
  console.log('🔗 Visit http://localhost:3000/browse to see the barbers');
}

seedMockData();

