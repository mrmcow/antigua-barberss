import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ClassificationResult {
  hair_types: { [key: string]: number }; // { "4c": 0.8, "curly": 0.6 }
  styles: { [key: string]: number }; // { "fade": 0.9, "beard": 0.7 }
  vibes: string[];
  walk_in_friendly: boolean;
  kids_welcome: boolean;
}

const CLASSIFICATION_PROMPT = `You are analyzing barbershop reviews to classify the barber's specializations and vibe.

Analyze the reviews and extract:

1. HAIR TYPES mentioned (with confidence 0-1):
   - 4c (tight kinky coils, African hair)
   - curly (3a/3b/3c curls)
   - wavy (2a/2b waves)
   - straight (fine or thick straight hair)
   - thinning (balding, receding hairline)

2. STYLES they're good at (with confidence 0-1):
   - fade (skin fade, high fade, low fade)
   - taper (gradual taper cut)
   - beard (beard trim, lineup, grooming)
   - color (hair dye, highlights)
   - long (long hair cuts, scissor work)
   - crop (textured crop, modern short cuts)

3. VIBE tags (select all that apply):
   - upscale (luxury, high-end, premium service)
   - old-school (traditional, classic barber)
   - modern (trendy, contemporary)
   - hip-hop (street culture, urban)
   - queer-friendly (LGBTQ+ inclusive, mentioned in reviews)
   - cultural-specialist (specializes in Black/Latino/Asian hair, mentioned cultural competency)

4. FLAGS:
   - walk_in_friendly: true if reviews mention walk-ins are welcome
   - kids_welcome: true if reviews mention good with kids

Return ONLY valid JSON in this exact format:
{
  "hair_types": { "4c": 0.0, "curly": 0.0, "wavy": 0.0, "straight": 0.0, "thinning": 0.0 },
  "styles": { "fade": 0.0, "taper": 0.0, "beard": 0.0, "color": 0.0, "long": 0.0, "crop": 0.0 },
  "vibes": [],
  "walk_in_friendly": false,
  "kids_welcome": false
}

Important:
- Scores from 0.0 to 1.0 (0 = not mentioned, 1.0 = primary specialty)
- Only include vibes with strong evidence
- Be conservative with high scores (0.8+)`;

async function getBarbershopsToClassify() {
  // Get barbers that don't have classifications yet
  const { data, error } = await supabase
    .from('barbershops')
    .select(`
      id,
      name,
      review_count
    `)
    .gt('review_count', 0)
    .limit(20);

  if (error) {
    console.error('Error fetching barbershops:', error);
    return [];
  }

  // Filter out ones that already have classifications
  const barbershopsWithoutClass = [];
  for (const shop of data || []) {
    const { data: existing } = await supabase
      .from('classifications')
      .select('id')
      .eq('barbershop_id', shop.id)
      .single();

    if (!existing) {
      barbershopsWithoutClass.push(shop);
    }
  }

  return barbershopsWithoutClass;
}

async function getReviewsForBarber(barbershopId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('text, rating')
    .eq('barbershop_id', barbershopId)
    .not('text', 'is', null)
    .limit(50);

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

async function classifyWithAI(reviews: any[]): Promise<ClassificationResult | null> {
  if (reviews.length === 0) {
    return null;
  }

  // Combine reviews into a single text
  const reviewText = reviews
    .map(r => `[${r.rating}★] ${r.text}`)
    .join('\n\n');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CLASSIFICATION_PROMPT },
        { role: 'user', content: `Reviews to analyze:\n\n${reviewText}` },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as ClassificationResult;
  } catch (error) {
    console.error('Error classifying with AI:', error);
    return null;
  }
}

async function saveClassification(barbershopId: string, classification: ClassificationResult) {
  const { error } = await supabase.from('classifications').insert({
    barbershop_id: barbershopId,
    hair_types: classification.hair_types,
    styles: classification.styles,
    vibes: classification.vibes,
    walk_in_friendly: classification.walk_in_friendly,
    kids_welcome: classification.kids_welcome,
  });

  if (error) {
    console.error('Error saving classification:', error);
  }
}

async function classifyAllBarbers() {
  console.log('🤖 AI Classification System - Analyzing Barbers\n');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Missing OPENAI_API_KEY in .env.local');
    console.log('\nGet your API key from: https://platform.openai.com/api-keys');
    process.exit(1);
  }

  const barbershops = await getBarbershopsToClassify();
  console.log(`📊 Found ${barbershops.length} barbers to classify\n`);

  let classified = 0;

  for (const shop of barbershops) {
    console.log(`\n🔍 Analyzing: ${shop.name} (${shop.review_count} reviews)`);

    // Get reviews
    const reviews = await getReviewsForBarber(shop.id);
    if (reviews.length === 0) {
      console.log('  ⏭️  No reviews to analyze');
      continue;
    }

    console.log(`  📝 Processing ${reviews.length} reviews...`);

    // Classify with AI
    const classification = await classifyWithAI(reviews);
    if (!classification) {
      console.log('  ❌ Classification failed');
      continue;
    }

    // Show results
    console.log('\n  ✅ Classification Results:');
    
    // Hair types
    const topHairTypes = Object.entries(classification.hair_types)
      .filter(([_, score]) => score > 0.3)
      .sort((a, b) => b[1] - a[1])
      .map(([type, score]) => `${type} (${(score * 100).toFixed(0)}%)`)
      .slice(0, 3);
    
    if (topHairTypes.length > 0) {
      console.log(`     Hair Types: ${topHairTypes.join(', ')}`);
    }

    // Styles
    const topStyles = Object.entries(classification.styles)
      .filter(([_, score]) => score > 0.3)
      .sort((a, b) => b[1] - a[1])
      .map(([style, score]) => `${style} (${(score * 100).toFixed(0)}%)`)
      .slice(0, 3);
    
    if (topStyles.length > 0) {
      console.log(`     Styles: ${topStyles.join(', ')}`);
    }

    // Vibes
    if (classification.vibes.length > 0) {
      console.log(`     Vibes: ${classification.vibes.join(', ')}`);
    }

    // Flags
    const flags = [];
    if (classification.walk_in_friendly) flags.push('Walk-In Friendly');
    if (classification.kids_welcome) flags.push('Kids Welcome');
    if (flags.length > 0) {
      console.log(`     Flags: ${flags.join(', ')}`);
    }

    // Save to database
    await saveClassification(shop.id, classification);
    classified++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n\n✨ Classification Complete!');
  console.log(`📊 Classified ${classified} barbershops`);
  console.log('\n🔗 Check your Supabase dashboard → classifications table');
}

if (require.main === module) {
  classifyAllBarbers()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error:', error);
      process.exit(1);
    });
}

export { classifyAllBarbers };

