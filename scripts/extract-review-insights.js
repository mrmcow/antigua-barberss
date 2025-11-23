require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Keywords to look for in reviews
const HAIR_TYPE_KEYWORDS = {
  '4c': ['4c', 'coarse', 'kinky', 'afro', 'natural hair', 'african american', 'black hair'],
  'curly': ['curly', 'curls', 'wavy', 'waves', 'spiral', 'ringlets'],
  'straight': ['straight', 'fine hair', 'thin hair', 'asian hair'],
  'thick': ['thick hair', 'dense hair', 'heavy hair', 'coarse hair'],
  'beard': ['beard', 'facial hair', 'mustache', 'goatee', 'sideburns']
};

const STYLE_KEYWORDS = {
  'fade': ['fade', 'taper', 'skin fade', 'high fade', 'low fade', 'mid fade'],
  'lineup': ['lineup', 'line up', 'edge up', 'crisp lines', 'sharp edges'],
  'beard': ['beard trim', 'beard shape', 'beard cut', 'facial hair'],
  'buzz': ['buzz cut', 'crew cut', 'military cut', 'short all over'],
  'scissor': ['scissor cut', 'scissors only', 'no clippers', 'hand cut']
};

const VIBE_KEYWORDS = {
  'professional': ['professional', 'business', 'corporate', 'clean cut', 'formal'],
  'chill': ['chill', 'laid back', 'relaxed', 'cool', 'easy going', 'friendly'],
  'upscale': ['luxury', 'upscale', 'premium', 'high end', 'expensive', 'classy'],
  'budget': ['affordable', 'cheap', 'reasonable', 'good price', 'budget', 'value'],
  'walkin': ['walk in', 'no appointment', 'quick', 'fast service', 'drop in'],
  'kids': ['kids', 'children', 'family', 'child friendly', 'young'],
  'cultural': ['hispanic', 'latino', 'mexican', 'black barber', 'cultural', 'spanish'],
  'online': ['book online', 'website', 'appointment online', 'schedule online', 'instagram']
};

function analyzeReviewText(text, keywords) {
  const scores = {};
  const lowerText = text.toLowerCase();
  
  for (const [category, terms] of Object.entries(keywords)) {
    let matches = 0;
    for (const term of terms) {
      if (lowerText.includes(term)) {
        matches++;
      }
    }
    if (matches > 0) {
      scores[category] = Math.min(matches / terms.length, 1.0);
    }
  }
  
  return scores;
}

async function extractInsights() {
  console.log('🔍 ANALYZING REVIEWS FOR BETTER MATCHING...\n');

  // Get all barbers with reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('barbershop_id, text, rating')
    .not('text', 'is', null);

  if (!reviews || reviews.length === 0) {
    console.log('No reviews found');
    return;
  }

  console.log(`📊 Found ${reviews.length} reviews to analyze\n`);

  const barberInsights = {};

  reviews.forEach(review => {
    const barberId = review.barbershop_id;
    
    if (!barberInsights[barberId]) {
      barberInsights[barberId] = {
        hair_types: {},
        styles: {},
        vibes: {},
        total_reviews: 0,
        avg_rating: 0
      };
    }

    // Analyze text for keywords
    const hairTypes = analyzeReviewText(review.text, HAIR_TYPE_KEYWORDS);
    const styles = analyzeReviewText(review.text, STYLE_KEYWORDS);
    const vibes = analyzeReviewText(review.text, VIBE_KEYWORDS);

    // Accumulate scores
    Object.entries(hairTypes).forEach(([type, score]) => {
      barberInsights[barberId].hair_types[type] = 
        (barberInsights[barberId].hair_types[type] || 0) + score;
    });

    Object.entries(styles).forEach(([style, score]) => {
      barberInsights[barberId].styles[style] = 
        (barberInsights[barberId].styles[style] || 0) + score;
    });

    Object.entries(vibes).forEach(([vibe, score]) => {
      barberInsights[barberId].vibes[vibe] = 
        (barberInsights[barberId].vibes[vibe] || 0) + score;
    });

    barberInsights[barberId].total_reviews++;
    barberInsights[barberId].avg_rating += review.rating;
  });

  // Normalize scores and save to database
  for (const [barberId, insights] of Object.entries(barberInsights)) {
    // Normalize scores by review count
    const reviewCount = insights.total_reviews;
    
    Object.keys(insights.hair_types).forEach(type => {
      insights.hair_types[type] = Math.min(insights.hair_types[type] / reviewCount, 1.0);
    });
    
    Object.keys(insights.styles).forEach(style => {
      insights.styles[style] = Math.min(insights.styles[style] / reviewCount, 1.0);
    });

    const vibesList = [];
    Object.keys(insights.vibes).forEach(vibe => {
      const score = Math.min(insights.vibes[vibe] / reviewCount, 1.0);
      if (score > 0.3) vibesList.push(vibe); // Only include strong vibes
    });

    insights.avg_rating = insights.avg_rating / reviewCount;

    // Check if barber has website for additional scoring
    const { data: barberData } = await supabase
      .from('barbershops')
      .select('website, booking_url')
      .eq('id', barberId)
      .single();

    const hasOnlinePresence = barberData?.website || barberData?.booking_url;
    if (hasOnlinePresence && !vibesList.includes('online')) {
      vibesList.push('online');
    }

    // Save to classifications table
    const { error } = await supabase
      .from('classifications')
      .upsert({
        barbershop_id: barberId,
        hair_types: insights.hair_types,
        styles: insights.styles,
        vibes: vibesList,
        walk_in_friendly: vibesList.includes('walkin'),
        kids_welcome: vibesList.includes('kids'),
        last_updated: new Date().toISOString()
      });

    if (error) {
      console.log(`❌ Error saving ${barberId.slice(0,8)}:`, error.message);
    } else {
      console.log(`✅ ${barberId.slice(0,8)}: Hair types: ${Object.keys(insights.hair_types).join(', ')}`);
      console.log(`   Styles: ${Object.keys(insights.styles).join(', ')}`);
      console.log(`   Vibes: ${vibesList.join(', ')}`);
      console.log(`   Reviews: ${reviewCount}, Avg rating: ${insights.avg_rating.toFixed(1)}\n`);
    }
  }

  console.log('🚀 MATCHING ALGORITHM UPGRADED!');
  console.log('Your match results will now be way more accurate based on real review data.');
}

extractInsights();
