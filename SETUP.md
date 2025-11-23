# LA Barber Guide - Setup Instructions

## 🎯 You Are Here

You have a complete Next.js app with:
- ✅ Modern, brutal LA aesthetic
- ✅ Homepage with brand identity
- ✅ UI component library (Button, Card, Badge)
- ✅ Supabase database schema
- ✅ TypeScript types
- ✅ Tailwind CSS configured
- ✅ Vercel deployment ready

## 🚀 Next Steps

### 1. Test Locally

```bash
npm run dev
```

Open http://localhost:3000 — you should see the homepage!

### 2. Setup Supabase (5 minutes)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to SQL Editor and run the contents of `supabase/schema.sql`
4. Copy your project URL and anon key from Settings → API
5. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 3. Deploy to Vercel (5 minutes)

See `DEPLOYMENT.md` for full instructions, or quick version:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add your Supabase env vars when prompted
```

## 📋 What's Built

**Pages:**
- `/` — Homepage (LA cool, brutal aesthetic)

**Components:**
- `Button` — Primary, secondary, outline, ghost variants
- `Card` — Clean bordered cards with hover
- `Badge` — Tags and labels

**Database:**
- `barbershops` table
- `reviews` table  
- `classifications` table

## 🎨 Brand Colors

```css
Black: #000000
White: #FFFFFF
Concrete: #E5E5E5
LA Orange: #FF6B35
LA Yellow: #F7B801
Hot Pink: #FF006E
Lime: #CCFF00
```

## 📝 To Build Next

1. **Browse page** (`/browse`) — Grid of barbers with filters
2. **Barber profile** (`/barbers/[id]`) — Individual barber pages
3. **Smart Match flow** — 3-question quiz for matching
4. **Data scraper** — Google Places → Supabase pipeline
5. **Category pages** — SEO-optimized landing pages

## 💡 Tips

- The site is mobile-first — test on your phone
- All components use the brutal aesthetic (hard edges, black/white)
- Typography is set up with Bebas Neue for display text
- Tailwind utility classes are extended with brand colors

## 🔥 Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
vercel           # Deploy to Vercel
```

---

**Ready to build the rest?** The foundation is solid. Let's ship this thing! 🚀

