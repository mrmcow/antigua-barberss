import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Normalize phone numbers to include +1 country code
 */
function normalizePhoneNumber(phone: string | null): string | null {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If it's already 11 digits and starts with 1, format properly
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    const areaCode = digitsOnly.slice(1, 4);
    const exchange = digitsOnly.slice(4, 7);
    const number = digitsOnly.slice(7);
    return `+1 (${areaCode}) ${exchange}-${number}`;
  }
  
  // If it's 10 digits, add country code +1
  if (digitsOnly.length === 10) {
    const areaCode = digitsOnly.slice(0, 3);
    const exchange = digitsOnly.slice(3, 6);
    const number = digitsOnly.slice(6);
    return `+1 (${areaCode}) ${exchange}-${number}`;
  }
  
  // If it's 7 digits, assume it's missing area code (268 for Antigua)
  if (digitsOnly.length === 7) {
    const exchange = digitsOnly.slice(0, 3);
    const number = digitsOnly.slice(3);
    return `+1 (268) ${exchange}-${number}`;
  }
  
  // Return original if we can't normalize it
  console.warn(`⚠️  Could not normalize phone number: ${phone}`);
  return phone;
}

async function fixPhoneNumbers() {
  console.log('🔧 Starting phone number normalization...');

  // Get all barbershops with phone numbers
  const { data: barbershops, error } = await supabase
    .from('barbershops')
    .select('id, name, phone')
    .not('phone', 'is', null);

  if (error) {
    console.error('❌ Error fetching barbershops:', error);
    return;
  }

  if (!barbershops?.length) {
    console.log('✅ No barbershops with phone numbers found');
    return;
  }

  console.log(`📞 Processing ${barbershops.length} barbershops...`);

  let updated = 0;
  let skipped = 0;

  for (const barber of barbershops) {
    const normalizedPhone = normalizePhoneNumber(barber.phone);
    
    // Only update if the phone number changed
    if (normalizedPhone && normalizedPhone !== barber.phone) {
      console.log(`📱 ${barber.name}: ${barber.phone} → ${normalizedPhone}`);
      
      const { error: updateError } = await supabase
        .from('barbershops')
        .update({ phone: normalizedPhone })
        .eq('id', barber.id);

      if (updateError) {
        console.error(`❌ Error updating ${barber.name}:`, updateError);
      } else {
        updated++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`✅ Phone number normalization complete:`);
  console.log(`   📝 Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
}

// Test function to show what changes would be made (dry run)
async function previewPhoneChanges() {
  console.log('👀 Preview of phone number changes...');

  const { data: barbershops, error } = await supabase
    .from('barbershops')
    .select('id, name, phone')
    .not('phone', 'is', null);

  if (error || !barbershops?.length) {
    console.log('No data found');
    return;
  }

  console.log('\\nChanges that would be made:');
  console.log('========================================');

  barbershops.forEach(barber => {
    const normalizedPhone = normalizePhoneNumber(barber.phone);
    if (normalizedPhone && normalizedPhone !== barber.phone) {
      console.log(`${barber.name}:`);
      console.log(`  Before: ${barber.phone}`);
      console.log(`  After:  ${normalizedPhone}`);
      console.log('');
    }
  });
}

// Run preview first, then ask for confirmation
async function main() {
  const mode = process.argv[2];
  
  if (mode === '--preview') {
    await previewPhoneChanges();
  } else if (mode === '--fix') {
    await fixPhoneNumbers();
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/fix-phone-numbers.ts --preview');
    console.log('  npx tsx scripts/fix-phone-numbers.ts --fix');
  }
}

main().catch(console.error);
