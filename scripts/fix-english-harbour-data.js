require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixEnglishHarbourData() {
  console.log('Fixing English Harbour data...');

  // 1. Find Bundin's and update it
  const { data: bundins } = await supabase
    .from('barbershops')
    .select('*')
    .ilike('name', '%Bundin%')
    .single();

  if (bundins) {
    console.log(`Found Bundin's: ${bundins.name} (${bundins.neighborhood})`);
    const { error } = await supabase
      .from('barbershops')
      .update({ neighborhood: 'English Harbour' })
      .eq('id', bundins.id);
    
    if (error) console.error('Error updating Bundins:', error);
    else console.log('✅ Updated Bundins to English Harbour');
  }

  // 2. Update anything with "Cobbs Cross" in address to English Harbour
  const { data: cobbs } = await supabase
    .from('barbershops')
    .select('*')
    .ilike('address', '%Cobbs Cross%');

  if (cobbs && cobbs.length > 0) {
    console.log(`Found ${cobbs.length} shops in Cobbs Cross`);
    for (const shop of cobbs) {
      const { error } = await supabase
        .from('barbershops')
        .update({ neighborhood: 'English Harbour' })
        .eq('id', shop.id);
      if (!error) console.log(`✅ Updated ${shop.name} to English Harbour`);
    }
  }

  // 3. Update anything with "Falmouth" in address to English Harbour
  const { data: falmouth } = await supabase
    .from('barbershops')
    .select('*')
    .ilike('address', '%Falmouth%');

  if (falmouth && falmouth.length > 0) {
    console.log(`Found ${falmouth.length} shops in Falmouth`);
    for (const shop of falmouth) {
      const { error } = await supabase
        .from('barbershops')
        .update({ neighborhood: 'English Harbour' })
        .eq('id', shop.id);
      if (!error) console.log(`✅ Updated ${shop.name} to English Harbour`);
    }
  }
  
  // 4. Add a few known missing spots if they don't exist (Manual Seed)
  // 'The Powder Room' is a spa in English Harbour but they do men's grooming.
  // 'Aveda Concept Spa' same.
  // Let's add "The Barbershop at the Yacht Club" (fictional/generic name if real one not found? No, user wants real data.)
  // I will just stick to fixing existing data for now unless I find specific real ones.
  // "VIP Barber Shop" is another one often in that area.
}

fixEnglishHarbourData();

