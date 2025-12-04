const fs = require('fs');
const path = require('path');

const seoArticles = [
  // NEIGHBORHOOD GUIDES
  {
    slug: 'barbers-all-saints-road-antigua',
    title: 'The Barber Corridor: Exploring All Saints Road',
    description: 'Why All Saints Road is the unofficial barber highway of Antigua. A guide to the best local shops away from the tourist traps.',
    category: 'neighborhood-guides',
    content: `
## The Real Barber Scene

If you want to see where the locals actually get cut, head to All Saints Road. This stretch is the heartbeat of Antiguan grooming culture. It's not about luxury spas; it's about sharp fades, loud debates about cricket and politics, and unbeatable prices.

### Why Go Here?
*   **Authenticity:** This is 100% Antigua. No filtered tourist experience.
*   **Skill:** These barbers cut hundreds of heads a week. Their fade game is elite.
*   **Price:** Expect to pay standard local rates ($30-$40 EC), significantly less than resort prices.

### Key Spots to Look For
Keep your eyes peeled as you drive south from St. John's. The shops are often small, painted in bright colors, and busy from morning til night.

> **Local Tip:** Parking can be tricky. Be prepared to park on a side street and walk a minute.
    `
  },
  {
    slug: 'barbers-near-vc-bird-airport',
    title: 'Fresh Off the Plane: Barbers Near V.C. Bird Airport',
    description: 'Just landed and need a fix? Here are the closest barbershops to the Antigua airport for a quick shape-up before you head to your hotel.',
    category: 'neighborhood-guides',
    content: `
## Land & Fade

Did you hop off the flight looking rough? You don't need to go all the way to town to get fixed up. The area surrounding V.C. Bird International Airport (Coolidge/Osbourn) has some hidden gems.

### Convenience King
If you have a rental car, stopping here before heading to a distant resort like St. James's or Curtain Bluff can save you a trip later.

### The Spots
Look for shops in the **Coolidge** area. They often service airport staff and residents of the north east.
*   **Vibe:** Efficient and professional.
*   **Wait Times:** Generally shorter than downtown St. John's.

[Find Barbers Near Airport](/browse?neighborhood=coolidge)
    `
  },
  
  // USE CASE / SPECIFIC GUIDES
  {
    slug: 'antigua-wedding-barber-packages',
    title: 'Getting Married in Antigua? Grooming Guide for Groomsmen',
    description: 'Destination wedding checklist: Don\'t let the groom look dusty. How to book mobile barbers for your wedding party in Antigua.',
    category: 'travel-tips',
    content: `
## Wedding Ready in Paradise

You spent thousands on the venue and the suits. Don't ruin the photos with a 3-week-old haircut. Getting the whole groomsmen party sharp is a standard part of the Antigua wedding experience.

### The Mobile "Suite" Experience
The best move is to book a mobile barber to come to your getting-ready suite.
*   **Timing:** Book them for the morning of the wedding, at least 4 hours before photos start.
*   **Logistics:** You provide the chairs and power; they bring the skills.
*   **Drinks:** It's customary (and fun) to offer the barber a drink once the blades are put away.

### Booking Advice
*   **Advance Notice:** Good mobile barbers book up weeks in advance, especially during wedding season (Nov - May).
*   **Deposit:** Expect to pay a deposit to secure the block of time.
*   **Style Consistency:** Send photos of the desired look beforehand so the barber brings the right tools.

[Find Wedding-Ready Barbers](/browse?service=wedding)
    `
  },
  {
    slug: 'kids-haircuts-antigua-barbers',
    title: 'Kid-Friendly Barbers in Antigua: A Parent\'s Guide',
    description: 'Where to take your little one for a fresh cut without the tears. Barbershops in Antigua known for being great with children.',
    category: 'neighborhood-guides',
    content: `
## Fresh Cuts for the Little Ones

Antiguan culture takes pride in well-groomed kids, especially for school and church. As a result, many barbers here are experts at handling squirming toddlers and nervous first-timers.

### What to Look For
*   **Patience:** The hallmark of a good kids' barber.
*   **Environment:** Some shops can be loud/explicit. Look for "family-friendly" tags or morning slots which are generally quieter.
*   **Treats:** Some shops keep lollipops on deck – the universal language of cooperation.

### Top Areas for Families
**Friars Hill Road** and **Old Parham Road** areas often have shops with easier parking and more spacious waiting areas, making the family trip less stressful than fighting downtown traffic.

[Browse Kid-Friendly Shops](/browse?feature=kids)
    `
  },

  // CULTURAL / INSIGHTS
  {
    slug: 'antigua-barbershop-culture-explained',
    title: 'More Than a Haircut: Understanding Antiguan Barbershop Culture',
    description: 'The barbershop is the community parliament. Here is what to expect from the conversation, the music, and the vibe.',
    category: 'culture',
    content: `
## The Community Parliament

In Antigua, the barbershop is third base. First is home, second is work, third is the shop. It's where news travels faster than on the radio.

### The Atmosphere
*   **Loud & Proud:** Expect lively debates about cricket, football (soccer), and local politics.
*   **Music:** Dancehall, Soca, and Reggae are standard. It keeps the energy high.
*   **The "Liming":** You'll see guys hanging out who aren't even getting cuts. They're just there for the vibe. This is normal.

### How to Participate
*   **Respect the Chair:** When you're in the chair, you're the focus, but the conversation includes everyone.
*   **Join In:** Don't be afraid to laugh or drop a comment. You'll be respected for engaging rather than sitting on your phone in silence.
*   **The Fist Bump:** The standard greeting and goodbye.

It's raw, it's real, and it's one of the best ways to experience authentic Antigua.
    `
  },
  {
    slug: 'black-hair-barbers-antigua-tourist-guide',
    title: 'Afro-Caribbean Hair Experts: Why Antigua is a Fade Paradise',
    description: 'Antigua has some of the world\'s best barbers for afro-textured hair. Why you should definitely wait until you arrive to get that fade.',
    category: 'culture',
    content: `
## Masters of Texture

If you have afro-textured hair, you know the anxiety of finding a new barber while traveling. In Europe or parts of the US, it can be a gamble. In Antigua, it's the standard.

### The Skill Level
Antiguan barbers train on coarse and curly hair from day one. They understand:
*   **Grain Direction:** Essential for avoiding razor bumps.
*   **Line Ups:** We take the hairline *very* seriously here. Crisp is the only acceptable standard.
*   **Skin Fades:** The blending techniques here are world-class.

### Best Services to Try
Since you're in expert hands, try something new:
*   **Sponge Twists:** Many shops specialize in curling sponge styling.
*   **Beard Sculpting:** It's an art form here. Hot towel treatments combined with razor lining.

Don't stress about your hair before your trip. The best cut of your year might be waiting for you in St. John's.
    `
  }
];

const outputDir = path.join(process.cwd(), 'content', 'blog');

seoArticles.forEach(article => {
  const filePath = path.join(outputDir, `${article.slug}.md`);
  // Escape double quotes in description for YAML
  const safeDescription = article.description.replace(/"/g, '\\"');
  
  const content = `---
title: "${article.title}"
description: "${safeDescription}"
date: "2025-11-28"
author: "Antigua Barbers"
category: "${article.category}"
tags: ["${article.category}", "Antigua", "Guide"]
---

${article.content}
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created ${article.slug}.md`);
});



