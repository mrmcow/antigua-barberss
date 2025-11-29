const fs = require('fs');
const path = require('path');

const guides = [
  {
    slug: 'tipping-barbers-antigua-guide',
    title: 'Tipping Etiquette: Do I Need to Tip Barbers in Antigua?',
    description: 'Confused about Caribbean tipping culture? Here is the definitive guide on if, when, and how much to tip your barber in Antigua.',
    category: 'travel-tips',
    content: `
## The Short Answer: Yes, but it's optional.

Unlike the US where 20% is mandatory survival money, tipping in Antigua is a gesture of appreciation. However, for service industry professionals like barbers who often rent their chairs, it is highly appreciated.

### How Much is Standard?
*   **Standard Cut:** $5 - $10 XCD ($2 - $4 USD)
*   **Complex Fade / Design:** $15 - $25 XCD ($5 - $10 USD)
*   **Mobile Service:** $25+ XCD ($10+ USD) - *Always tip mobile barbers more for the travel time.*

### USD or EC (XCD)?
Both are accepted everywhere.
*   **The "Street" Rate:** Most shops use 2.70 EC to 1 USD.
*   **Ideally:** Tip in the same currency you pay with to keep it simple.

### When NOT to Tip
If the barber was late, rushed you, or ignored your requests, do not feel obligated to tip. Antiguan culture respects directness.

> **Pro Tip:** If you're a regular visitor or staying for a while, a good tip on the first visit guarantees you the VIP slot next time.
    `
  },
  {
    slug: 'antigua-barber-prices-2025',
    title: 'Antigua Barber Prices: What Should You Pay in 2025?',
    description: "Don't get hit with the tourist tax. We break down the standard rates for haircuts, beards, and shape-ups across the island.",
    category: 'travel-tips',
    content: `
## Know the Rates Before You Sit Down

Prices in Antigua vary significantly based on location (Town vs. Resort areas) and the shop's amenities (AC vs. Fan).

Here is the 2025 baseline so you know if you're getting a fair deal.

### Standard Shop Rates (St. John's / Local Areas)
*   **Regular Men's Cut:** $30 - $40 XCD ($11 - $15 USD)
*   **Fade / Taper:** $40 - $50 XCD ($15 - $19 USD)
*   **Shape Up / Line Up:** $15 - $25 XCD ($6 - $10 USD)
*   **Beard Trim:** $20 - $30 XCD ($8 - $11 USD)

### "Tourist" / Resort Area Rates (Jolly Harbour / English Harbour)
Expect to pay a premium for location and English-speaking staff accustomed to tourist styles.
*   **Men's Cut:** $60 - $100 XCD ($25 - $40 USD)
*   **Full Service (Cut + Beard + Towel):** $135+ XCD ($50+ USD)

### Mobile Barber Rates
Convenience is the most expensive option.
*   **House Call Fee:** Usually $50 - $100 XCD ($20 - $40 USD) *on top of the haircut price*.

### Warning Signs
*   If a barber quotes you in USD and it sounds like US prices ($40 USD for a basic cut in a local shop), ask for the EC price.
*   **Always confirm the price before the cape goes on.**

[Browse Barbers by Price Range](/browse)
    `
  },
  {
    slug: 'mobile-barbers-antigua-resort',
    title: 'Mobile Barbers: How to Get a Haircut at Your Resort or Villa',
    description: 'Too relaxed to leave the pool? Here is how to book a mobile barber to come directly to your hotel room or rental villa.',
    category: 'how-to',
    content: `
## The Ultimate Vacation Luxury

You're in Antigua to relax. Fighting traffic into St. John's might not be on your agenda. Luckily, Antigua has a thriving community of mobile barbers who specialize in villa and resort calls.

### How it Works
1.  **Find a Mobile-Verified Barber:** Filter our directory for "Mobile Service".
2.  **WhatsApp is Key:** Don't email. Send a WhatsApp message with:
    *   Your exact Google Maps location (pin drop).
    *   Service needed.
    *   Preferred time.
3.  **Gate Access:** If you are in **Jolly Harbour**, **Galley Bay**, or **St. James's Club**, you *must* arrange gate access for the barber. Tell security a guest is coming.

### What to Provide
*   **A Chair:** A regular dining chair works fine.
*   **Lighting:** Pick a spot on the patio with good natural light or a well-lit bathroom.
*   **Power:** They will need an outlet for clippers (unless they are fully cordless).

### Who to Book?
We verify mobile barbers for reliability. Look for the "Mobile" badge on profiles.

> **Safety Note:** Our listed mobile barbers are vetted professionals. We do not list random freelancers without a track record.

[Find Mobile Barbers Now](/browse?mobile=true)
    `
  }
];

const outputDir = path.join(process.cwd(), 'content', 'blog');

guides.forEach(guide => {
  const filePath = path.join(outputDir, `${guide.slug}.md`);
  // Escape double quotes in description for YAML
  const safeDescription = guide.description.replace(/"/g, '\\"');
  const content = `---
title: "${guide.title}"
description: "${safeDescription}"
date: "2025-11-28"
author: "Antigua Barbers"
category: "${guide.category}"
tags: ["${guide.category}", "Antigua", "Travel Tips"]
---

${guide.content}
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created ${guide.slug}.md`);
});

