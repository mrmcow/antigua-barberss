# 🤖 AI Classification System

## What It Does

Analyzes Google reviews using OpenAI to automatically tag barbers with:

### Hair Types (confidence 0-1)
- **4C** - tight kinky coils, African hair textures
- **Curly** - 3a/3b/3c curl patterns  
- **Wavy** - 2a/2b wave patterns
- **Straight** - fine or thick straight hair
- **Thinning** - balding, receding hairline

### Styles (confidence 0-1)
- **Fade** - skin fade, high fade, low fade
- **Taper** - gradual taper cuts
- **Beard** - beard trim, lineup, grooming
- **Color** - hair dye, highlights
- **Long** - long hair cuts, scissor work
- **Crop** - textured crop, modern short cuts

### Vibes
- **Upscale** - luxury, high-end, premium
- **Old-School** - traditional, classic barber
- **Modern** - trendy, contemporary
- **Hip-Hop** - street culture, urban
- **Queer-Friendly** - LGBTQ+ inclusive
- **Cultural-Specialist** - specializes in ethnic hair

### Flags
- **Walk-In Friendly** - reviews mention walk-ins welcome
- **Kids Welcome** - good with kids

---

## How To Use

### 1. **First: Scrape barbershops**
```bash
npm run scrape
```

### 2. **Then: Scrape reviews**
```bash
npm run scrape:reviews
```

### 3. **Finally: Classify with AI**

**Add your OpenAI API key to `.env.local`:**
```bash
OPENAI_API_KEY="sk-..."
```

Get your key from: https://platform.openai.com/api-keys

**Run classification:**
```bash
npm run classify
```

This will:
- Pull reviews from the database
- Send to GPT-4o-mini for analysis
- Extract hair types, styles, vibes
- Save to `classifications` table

---

## Benefits

1. **Match users to the right barber** based on hair type & style
2. **Filter browse page** by specialization
3. **Show relevant badges** on profiles
4. **Smart recommendations** in the match flow

---

## Example Output

```
🔍 Analyzing: Fade Kings LA (52 reviews)
  📝 Processing 52 reviews...
  
  ✅ Classification Results:
     Hair Types: 4c (95%), curly (45%), thinning (20%)
     Styles: fade (92%), beard (78%), taper (65%)
     Vibes: modern, hip-hop, cultural-specialist
     Flags: Walk-In Friendly
```

---

## Cost

- Uses GPT-4o-mini (~$0.15 per 1M input tokens)
- ~50 reviews = ~5,000 tokens = **$0.0008** per barber
- 100 barbers = **~$0.08** total 🔥

---

## Next Steps

Once classified:
- Update browse page filters to use real data
- Show specialization badges on profiles
- Power the match flow with actual data
- Build "Best For Your Hair Type" rankings

