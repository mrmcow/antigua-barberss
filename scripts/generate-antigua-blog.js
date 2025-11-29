const fs = require('fs');
const path = require('path');

const guides = [
  {
    slug: 'best-barbers-st-johns-antigua',
    title: 'The 5 Best Barbers in St. John\'s, Antigua (2025 Guide)',
    description: 'From Market Street to the outskirts, here are the top-rated barbershops in the capital city. Perfect for locals and cruise passengers.',
    category: 'neighborhood-guides',
    content: `
## St. John's: The Barber Capital

If you're looking for the highest concentration of skilled barbers in Antigua, St. John's is where it's at. The capital city is home to a mix of old-school legends and new-wave fade masters.

Whether you're a local needing a weekly shape-up or a visitor from the cruise port, these shops deliver.

### 1. The Market District
The area around the Public Market is buzzing with activity. Here you'll find shops that have been open for decades.
*   **Vibe:** Fast-paced, loud, authentic.
*   **Best for:** Quick cuts, reasonably priced.

### 2. Upper St. John's (Near Mount St. John's)
Head a bit further up and you'll find more spacious studios.
*   **Vibe:** More relaxed, often AC-cooled.
*   **Best for:** Detailed designs, beard grooming.

### 3. Redcliffe Quay Area
Closest to the cruise ships, these spots are premium and convenient.
*   **Vibe:** Upscale, tourist-friendly.
*   **Best for:** Cruise passengers, last-minute fixes.

## What to Expect
*   **Price:** $25-$50 XCD ($10-$20 USD) for a standard cut.
*   **Booking:** Walk-ins are standard, but WhatsApp appointments are growing.
*   **Style:** Fades are king here. Bring a photo if you want something specific.

[Browse all St. John's Barbers](/browse?neighborhood=st-johns)
    `
  },
  {
    slug: 'barbers-jolly-harbour-antigua',
    title: 'Finding a Barber Near Jolly Harbour & Bolans',
    description: 'Staying on the west coast? You don\'t need to drive to town. Here is where to get groomed near Jolly Harbour and Bolans.',
    category: 'neighborhood-guides',
    content: `
## West Coast Grooming

Jolly Harbour is a major hub for expats and tourists, but the barber scene is a bit more hidden than in Town. You often have to look into the nearby village of Bolans or catch a mobile barber.

### The Bolans Connection
Just outside the gates of Jolly Harbour, Bolans village has local barbers who serve the community.
*   **Pro Tip:** Ask the security guards or taxi drivers at the Jolly Harbour commercial center; they know exactly who is cutting in Bolans today.

### Mobile Services
Because Jolly Harbour is full of villas, mobile barbers are a popular option here.
*   **Convenience:** They come to your villa.
*   **Price:** Expect to pay a premium (often $40-$60 USD) for the convenience.

### Heading to Town?
If you're catching the bus or driving into St. John's, it's only a 20-minute drive (traffic permitting). This opens up the full directory of [St. John's barbers](/browse?neighborhood=st-johns).

[Find Barbers Near Jolly Harbour](/browse?neighborhood=jolly-harbour)
    `
  },
  {
    slug: 'barbers-english-harbour-falmouth',
    title: 'Yachtie Grooming: Barbers in English Harbour',
    description: 'Where do the yacht crews get their cuts? A guide to grooming in English Harbour and Falmouth.',
    category: 'neighborhood-guides',
    content: `
## The Yachting Hub

English Harbour and Falmouth Harbour are distinct from the rest of the island. The demand here is high during the season (December - May), driven by yacht crews and charter guests.

### The Season Factor
During the boat show or sailing week, barbers from Town often set up pop-up spots or offer dedicated mobile services to the docks.

### Local Spots in Liberta & All Saints
If you can't find a spot right on the dock, a quick 10-minute drive up to Liberta or All Saints opens up authentic local options. These are often the barbers who service the local workforce of the dockyard.

### Style Watch
*   **Crew Cuts:** Practical, low-maintenance styles are popular.
*   **Beard Work:** High demand for beard trimming and shaping before charter guests arrive.

[Browse English Harbour Options](/browse?neighborhood=english-harbour)
    `
  }
];

const outputDir = path.join(process.cwd(), 'content', 'blog');

guides.forEach(guide => {
  const filePath = path.join(outputDir, `${guide.slug}.md`);
  const content = `---
title: "${guide.title}"
description: "${guide.description}"
date: "2025-11-30"
author: "Antigua Barbers"
category: "${guide.category}"
tags: ["${guide.category}", "Antigua", "Local Guide"]
---

${guide.content}
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created ${guide.slug}.md`);
});

