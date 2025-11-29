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
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Rich descriptions for each area to ensure high-quality, unique content
const AREA_DETAILS = {
  "St. John's": {
    vibe: "The bustling capital city where commerce meets culture.",
    transport: "Easily accessible by all major bus routes (East and West Bus Stations) and taxis.",
    bestFor: "Quick cuts, lunch break grooming, and finding the widest variety of styles.",
    intro: "As the heartbeat of Antigua, St. John's hosts the highest concentration of barbershops on the island. From the busy Market Street to the historic Redcliffe Quay, you'll find everything from old-school traditionalists to modern fade masters."
  },
  "English Harbour": {
    vibe: "Yachting luxury meets historic charm.",
    transport: "Accessible via taxi or the #17 bus from St. John's.",
    bestFor: "Premium grooming, yacht crew services, and high-end experiences.",
    intro: "English Harbour isn't just for sailing week. The grooming scene here caters to an international clientele, meaning you can expect high standards, English-speaking staff, and services often tailored to yacht crews and visitors."
  },
  "Falmouth": {
    vibe: "Laid-back yachting village with a local twist.",
    transport: "Just next to English Harbour, accessible via the #17 bus.",
    bestFor: "A relaxed atmosphere close to the marinas.",
    intro: "Falmouth offers a slightly more relaxed alternative to the buzz of Nelson's Dockyard. Barbers here serve both the local community and the seasonal influx of sailors."
  },
  "Jolly Harbour": {
    vibe: "Resort living and expat community hub.",
    transport: "Accessible via the #20 or #22 bus from West Bus Station.",
    bestFor: "Convenience for villa renters and expats.",
    intro: "On the west coast, Jolly Harbour is a self-contained community. Finding a barber here often means looking just outside the gates in Bolans or finding a mobile service that comes to your villa."
  },
  "Bolans": {
    vibe: "Authentic west coast village life.",
    transport: "On the main road south of Jolly Harbour (Bus #20/22).",
    bestFor: "Local prices and authentic community connections.",
    intro: "Bolans is the gateway to the south-west. The barbershops here are community staples, offering a place to catch up on local news while getting a sharp cut away from the tourist prices."
  },
  "All Saints": {
    vibe: "The central residential heart of the island.",
    transport: "Central location accessible from multiple bus routes.",
    bestFor: "Reliable, consistent cuts for residents and locals.",
    intro: "As one of the largest villages in the middle of the island, All Saints has a thriving local economy. The barbers here are the real deal—skilled, fast, and central to village life."
  },
  "Liberta": {
    vibe: "Deep history and strong community roots.",
    transport: "Located on the road to English Harbour (Bus #17).",
    bestFor: "Traditional cuts and friendly, local service.",
    intro: "Just north of the yachting hubs, Liberta offers a grounded, authentic Antiguan experience. It's a great spot to stop for a cut if you're heading down to the dockyard but want to avoid tourist prices."
  },
  "Parham": {
    vibe: "Historic fishing town with a quiet pace.",
    transport: "Accessible via bus from East Bus Station.",
    bestFor: "No-nonsense grooming in a historic setting.",
    intro: "One of the oldest towns in Antigua, Parham has a quiet dignity. Barbershops here are small, personal, and deeply embedded in the neighborhood's fabric."
  },
  "Piggotts": {
    vibe: "Busy residential area near the airport.",
    transport: "Close to the airport and Factory Road.",
    bestFor: "Convenient stops before flying out or heading into town.",
    intro: "Ideally located for those living near the airport or working in the industrial zones. Piggotts offers practical, professional grooming services without the traffic of downtown St. John's."
  },
  "Old Road": {
    vibe: "Scenic south coast village.",
    transport: "Accessible via the scenic Fig Tree Drive route.",
    bestFor: "Relaxed cuts with a view of the south.",
    intro: "Tucked away on the south coast, Old Road is peaceful. The barbers here operate on island time in the best way possible—unrushed, detailed, and friendly."
  },
  "Dickenson Bay": {
    vibe: "Premier beach resort area.",
    transport: "A short taxi ride or drive north of St. John's.",
    bestFor: "Tourists and resort guests needing a touch-up.",
    intro: "While primarily known for its world-class beach and resorts like Sandals, the Dickenson Bay area services many visitors. You'll often find mobile barbers servicing this area or shops just inland on the main road."
  },
  "Crosbies": {
    vibe: "Upscale residential north coast.",
    transport: "Best accessed by car or taxi.",
    bestFor: "High-quality service in a quiet neighborhood.",
    intro: "Crosbies is home to many business leaders and expats. The grooming options nearby reflect this, focusing on quality, appointment-based service, and comfort."
  },
  "Winthorpes": {
    vibe: "Quiet residential village near the airport.",
    transport: "Minutes from V.C. Bird International Airport.",
    bestFor: "Last-minute cuts before a flight.",
    intro: "Literally neighbors with the airport runway, Winthorpes is the hidden gem for a pre-flight cleanup. It's a small community with a welcoming vibe."
  },
  "Cassada Gardens": {
    vibe: "Central business and residential mix.",
    transport: "Located off major arteries near St. John's.",
    bestFor: "Lunchtime cuts for professionals.",
    intro: "With many businesses moving out of the city center, Cassada Gardens has become a new hub. Barbers here cater to the working crowd looking for efficiency and style."
  },
  "Cobbs Cross": {
    vibe: "The crossroads of the yachting community.",
    transport: "The junction before English Harbour.",
    bestFor: "Meeting point for locals and yachties alike.",
    intro: "Cobbs Cross is the strategic junction where local life meets the international sailing community. The barbershops here are diverse, welcoming, and skilled at handling all hair types."
  }
};

// Default fallback details
const DEFAULT_AREA = {
  vibe: "A vibrant Antiguan community.",
  transport: "Accessible by local bus or taxi.",
  bestFor: "Authentic local grooming services.",
  intro: "This neighborhood is home to trusted local barbers who keep the community looking sharp."
};

const VILLAGES = [
  "St. John's", "English Harbour", "Falmouth", "Jolly Harbour", "Bolans", 
  "Liberta", "All Saints", "Piggotts", "Parham", "Willikies", "Old Road",
  "Dickenson Bay", "Crosbies", "Five Islands", "Jennings", "Cobbs Cross",
  "Winthorpes", "Cassada Gardens", "Potters Village", "Urlings", "Bethesda",
  "Newfield", "Freetown"
];

function inferNeighborhood(barber) {
  let hood = barber.neighborhood;

  if (!hood || hood === 'Antigua' || hood === 'Antigua & Barbuda') {
    const address = barber.address || '';
    for (const village of VILLAGES) {
      if (address.includes(village)) {
        hood = village;
        break;
      }
    }
  }
  
  return hood === 'Antigua' ? null : hood; 
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
    const title = `The Best Barbers in ${hood}, Antigua (2025 Local Guide)`;
    const description = `Looking for a barber in ${hood}? Browse our verified list of top-rated barbershops in ${hood}, Antigua. Reviews, photos, and directions.`;
    
    const details = AREA_DETAILS[hood] || DEFAULT_AREA;

    // Generate content
    let content = `---
title: "${title}"
description: "${description}"
date: "2025-11-30"
author: "Antigua Barbers"
category: "neighborhood-guides"
tags: ["${hood}", "Barbershop Guide", "Antigua", "Local Business"]
---

${details.intro}

If you are in **${hood}** and need a fresh cut, you don't have to guess. We've curated the top spots in the area based on real reviews and local reputation.

## Quick Area Guide: ${hood}
*   **Vibe:** ${details.vibe}
*   **Best For:** ${details.bestFor}
*   **Getting There:** ${details.transport}

---

## Top Rated Barbershops in ${hood}

`;

    hoodBarbers.forEach((barber, index) => {
      const ratingDisplay = barber.rating ? `⭐ ${barber.rating.toFixed(1)}/5` : '🆕 New Listing';
      const reviewCount = barber.review_count ? `(${barber.review_count} verified reviews)` : '';
      const price = barber.price_range || '$$';
      const mapLink = barber.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(barber.name + ' Antigua')}`;
      
      // Generate a mini-description if missing
      const shopIntro = `Serving the ${hood} community, **${barber.name}** offers professional grooming services.`;

      content += `### ${index + 1}. ${barber.name}
**${ratingDisplay}** ${reviewCount} • ${price}

📍 **Address:** ${barber.address || 'Contact for location'}

${shopIntro}

*   **Services:** Haircuts, Fades, Beard Trims
*   **Walk-ins:** Generally Accepted

[View Profile & Booking Info](/barbers/${barber.id})

---

`;
    });

    content += `
## Finding Your Barber in ${hood}
${hood} is a unique part of Antigua's landscape. Whether you're looking for a quick shape-up before work or a relaxing weekend grooming session, these shops have you covered.

### Not in ${hood} right now?
Check out our guides for nearby villages or browse the full island directory:
*   [St. John's Barbers](/blog/best-barbers-st-johns-antigua)
*   [English Harbour Barbers](/blog/best-barbers-english-harbour-antigua)
*   [All Saints Barbers](/blog/best-barbers-all-saints-antigua)

[**View All ${hood} Barbers on Map**](/browse?neighborhood=${slugify(hood)})
    `;

    const filePath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Generated: ${slug}.md (${hoodBarbers.length} shops)`);
  }

  console.log('All neighborhood pages generated.');
}

generateNeighborhoodPages();
