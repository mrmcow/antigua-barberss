require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const outputDir = path.join(process.cwd(), 'content', 'blog');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const VILLAGES = [
  "St. John's", "English Harbour", "Falmouth", "Jolly Harbour", "Bolans", 
  "Liberta", "All Saints", "Piggotts", "Parham", "Willikies", "Old Road",
  "Dickenson Bay", "Crosbies", "Five Islands", "Jennings", "Cobbs Cross",
  "Winthorpes", "Cassada Gardens"
];

function inferNeighborhood(barber) {
  let hood = barber.neighborhood;

  // If neighborhood is missing or generic, try address
  if (!hood || hood === 'Antigua' || hood === 'Antigua & Barbuda') {
    const address = barber.address || '';
    for (const village of VILLAGES) {
      if (address.includes(village)) {
        hood = village;
        break;
      }
    }
  }
  
  return hood === 'Antigua' ? null : hood; // Return null if still just 'Antigua'
}

async function generateNeighborhoodPages() {
  console.log('Fetching barbers from Supabase...');
  const { data: barbers, error } = await supabase
    .from('barbershops')
    .select('*');

  if (error) {
    console.error('Error fetching barbers:', error);
    return;
  }

  // Group by inferred neighborhood
  const neighborhoods = {};
  barbers.forEach(barber => {
    const hood = inferNeighborhood(barber);
    if (!hood) return;
    
    const cleanHood = hood.trim();
    if (!neighborhoods[cleanHood]) {
      neighborhoods[cleanHood] = [];
    }
    neighborhoods[cleanHood].push(barber);
  });

  console.log(`Found ${Object.keys(neighborhoods).length} neighborhoods/villages.`);

  for (const [hood, hoodBarbers] of Object.entries(neighborhoods)) {
    // Sort barbers by rating/reviews
    hoodBarbers.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    const slug = `best-barbers-${slugify(hood)}-antigua`;
    const title = `The Best Barbers in ${hood}, Antigua (2025 Guide)`;
    const description = `Find the top rated barbershops in ${hood}, Antigua. Verified reviews, photos, and booking info for local favorites.`;
    
    // Generate content
    let content = `---
title: "${title}"
description: "${description}"
date: "2025-11-30"
author: "Antigua Barbers"
category: "neighborhood-guides"
tags: ["${hood}", "Barbershop Guide", "Antigua"]
---

Looking for a fresh cut in **${hood}**? We've verified the top barbershops in the area to help you find the right chair.

Whether you're a local resident or visiting nearby, these are the most trusted spots in ${hood} for fades, line-ups, and beard trims.

## Top Rated Shops in ${hood}

`;

    hoodBarbers.forEach((barber, index) => {
      const ratingDisplay = barber.rating ? `⭐ ${barber.rating.toFixed(1)}/5` : 'Not yet rated';
      const reviewCount = barber.review_count ? `(${barber.review_count} reviews)` : '';
      const price = barber.price_range || '$$';
      
      content += `### ${index + 1}. ${barber.name}
**${ratingDisplay}** ${reviewCount} • ${price}

📍 **Location:** ${barber.address || 'Address available on profile'}

${barber.name} is a key part of the ${hood} grooming scene. Known for professional service and reliable cuts.

[View Profile & Book](/barbers/${barber.id})

---

`;
    });

    content += `
## Why Choose a Barber in ${hood}?
${hood} is known for its community vibe. The barbers here often serve as local hubs, offering not just a haircut but a connection to the real Antigua.

*   **Convenience:** Located close to major roads and residential areas.
*   **Style:** From classic cuts to modern designs.
*   **Vibe:** Authentic Island Standard service.

[View All ${hood} Barbers](/browse?neighborhood=${slugify(hood)})
    `;

    const filePath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Generated: ${slug}.md (${hoodBarbers.length} shops)`);
  }

  console.log('All neighborhood pages generated.');
}

generateNeighborhoodPages();
