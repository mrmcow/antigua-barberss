const fs = require('fs');
const path = require('path');

const guides = [
  {
    slug: 'barber-vocabulary-antigua-terms',
    title: 'Speak Like a Local: Essential Antiguan Barber Vocabulary',
    description: 'Don\'t accidentally ask for the wrong thing. Learn the local terms for lineups, fades, and shaves in Antigua.',
    category: 'culture',
    content: `
## Don't Get Lost in Translation

While English is the official language, Antigua has its own dialect and barbering terminology. Knowing these terms will earn you respect in the chair.

### Key Terms
*   **"Marking" / "Shape Up":** What Americans call a "Line Up" or "Edge Up". The crisp outline of the hairline.
*   **"Lowie":** A low fade or low cut.
*   **"Skin":** Bald. If you ask for a "Skin Fade", you are getting a bald fade.
*   **"Trim":** Usually means a full haircut, not just a small adjustment.
*   **"Dark":** Keeping the hair heavy/thick, usually referring to the fade transition (e.g., "Keep the fade dark").

### The "Vex" Factor
Antiguan barbers are artists, but they can be blunt. If they say your hair is "hard", they mean the texture is coarse. It's not an insult, just a technical observation.

### The Greeting
Always say **"Good morning/afternoon/night"** when entering a shop. A simple nod isn't enough in Caribbean culture. It's a sign of respect to the room.
    `
  },
  {
    slug: 'sunday-barbers-antigua',
    title: 'Is Anywhere Open on Sunday? Finding a Barber on the Weekend',
    description: 'Antigua shuts down on Sundays. Here is your survival guide for finding a haircut when everything else is closed.',
    category: 'travel-tips',
    content: `
## The Sunday Shutdown

Antigua is a deeply religious island. Most businesses, including barbershops, are closed on Sundays.

### Your Options
1.  **The "Town" Hustlers:** Some shops near the West Bus Station in St. John's open on Sundays, typically from 10 AM to 2 PM.
2.  **Resort Areas:** Barbershops in English Harbour (during sailing season) may open on Sundays to service yacht crews.
3.  **Mobile Barbers:** This is your best bet. Many barbers do house calls on their day off for an extra fee.

### Saturday Rush
Because Sunday is closed, **Saturday is chaos**.
*   **Wait Times:** 1-2 hours minimum for walk-ins.
*   **Strategy:** Go as early as possible (7 AM or 8 AM) or book an appointment mid-week.

[Find Barbers Open on Sundays](/browse?day=sunday)
    `
  },
  {
    slug: 'getting-haircut-sandals-antigua',
    title: 'Can I Get a Haircut at Sandals Grande Antigua?',
    description: 'Staying at the famous Sandals resort? Here are your grooming options on and off the property.',
    category: 'resort-guides',
    content: `
## Resort vs. Real World

Sandals Grande Antigua (Dickenson Bay) has an on-site spa (Red Lane® Spa) that offers men's grooming.

### The On-Site Option
*   **Pros:** You don't have to leave the resort. AC is guaranteed.
*   **Cons:** Expensive. It's "Spa Grooming," not a "Barber Shop" vibe. Expect scissors and simple trims rather than razor-sharp street fades.

### The "Real" Option
For a proper fade or detailed beard work, you are better off leaving the gates.
*   **Nearby:** St. John's is a 10-minute taxi ride ($15 USD).
*   **Recommended:** Head to a shop in **Crosbies** or **upper St. John's** for high-quality service at half the price.

### Mobile Service to Sandals?
Security at Sandals is strict. Most outside mobile barbers cannot access guest rooms unless they are pre-approved vendors. It is easier to meet them just outside or take a quick taxi.
    `
  },
  {
    slug: 'best-beard-trims-antigua',
    title: 'The Beard Guide: Best Shops for Hot Towels & Razor Shaves',
    description: 'Not everyone trusts their beard to a stranger. We found the barbers in Antigua who specialize in facial hair.',
    category: 'service-guides',
    content: `
## Respect the Beard

A haircut grows back in two weeks. A messed-up beard takes months. We know the stakes.

### What to Look For
In Antigua, look for older, established barbershops for beard work. The "young gun" shops often focus purely on fades.

### The Hot Towel Rareness
A true hot towel shave is a premium service in Antigua and not standard in $20 XCD shops. You will find this mostly in:
*   **English Harbour:** Yachting-focused shops.
*   **Upscale St. John's:** Shops catering to businessmen and politicians.

### Top Picks for Beards
1.  **Director's Cut (Liberta):** Known for precision and patience.
2.  **Any "Old School" shop in Market Street:** Ask for the "Senior Barber".

[Find Beard Specialists](/browse?service=beard)
    `
  },
  {
    slug: 'haircut-before-wedding-antigua',
    title: 'Getting Married in Antigua? Your Grooming Game Plan',
    description: 'Destination wedding grooming guide. Timing, booking, and how to ensure you look sharp for the photos.',
    category: 'wedding-guides',
    content: `
## Don't Risk the Wedding Photos

Getting married at a resort or on the beach? You need to look sharp.

### The Timing Rule
**Do NOT get your haircut on the wedding day.**
*   **Why?** If they push your hairline back or nick you, you have zero recovery time.
*   **The Fix:** Get your cut **2 days before**. It looks more natural, and any skin irritation has time to settle.

### Booking for the Groomsmen
If you have a party of 4-5 guys, **book a mobile barber** to come to the groom's suite.
*   **Vibe:** It settles the nerves, creates a cool photo op, and keeps everyone on schedule.
*   **Cost:** Negotiate a "Package Deal" (e.g., $200 USD for 5 heads + travel).

### The "Tropical" Factor
Antigua is humid.
*   **Hair:** Frizz happens. Go slightly shorter than usual.
*   **Beard:** Use oil. The salt air and sun will dry it out quickly.

[Book a Wedding Package Barber](/browse?service=wedding)
    `
  }
];

const outputDir = path.join(process.cwd(), 'content', 'blog');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

guides.forEach(guide => {
  const filePath = path.join(outputDir, `${guide.slug}.md`);
  // Escape double quotes in description for YAML
  const safeDescription = guide.description.replace(/"/g, '\\"');
  const content = `---
title: "${guide.title}"
description: "${safeDescription}"
date: "2025-11-29"
author: "Antigua Barbers"
category: "${guide.category}"
tags: ["${guide.category}", "Antigua", "Travel Tips", "Grooming"]
---

${guide.content}
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created ${guide.slug}.md`);
});

