require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBarbers() {
  // 1. Check for any barbers with 'English Harbour' in neighborhood
  const { data: labeled, error: labelError } = await supabase
    .from('barbershops')
    .select('id, name, address, neighborhood, lat, lng')
    .ilike('neighborhood', '%English Harbour%');

  console.log('--- Barbers labeled as English Harbour ---');
  if (labeled && labeled.length > 0) {
    labeled.forEach(b => console.log(`${b.name} (${b.neighborhood})`));
  } else {
    console.log('No barbers found with neighborhood "English Harbour"');
  }

  // 2. Check for barbers near English Harbour coordinates (Lat: 17.0077, Lng: -61.7659)
  // We'll just look for anything within roughly 0.02 degrees (~2km)
  const { data: nearby, error: geoError } = await supabase
    .from('barbershops')
    .select('id, name, address, neighborhood, lat, lng')
    .gte('lat', 16.98)
    .lte('lat', 17.03)
    .gte('lng', -61.79)
    .lte('lng', -61.74);

  console.log('\n--- Barbers geographically near English Harbour ---');
  if (nearby && nearby.length > 0) {
    nearby.forEach(b => console.log(`${b.name} - Address: ${b.address} (Currently: ${b.neighborhood})`));
  } else {
    console.log('No barbers found near English Harbour coordinates');
  }

  // 3. Check for barbers with "Falmouth" or "English Harbour" in address but not neighborhood
  const { data: addressMatch, error: addressError } = await supabase
    .from('barbershops')
    .select('id, name, address, neighborhood')
    .or('address.ilike.%English Harbour%,address.ilike.%Falmouth%');

  console.log('\n--- Barbers with English Harbour/Falmouth in address ---');
  if (addressMatch && addressMatch.length > 0) {
    addressMatch.forEach(b => console.log(`${b.name} - Address: ${b.address} (Currently: ${b.neighborhood})`));
  } else {
    console.log('No barbers found with matching address text');
  }
}

checkBarbers();

