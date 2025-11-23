# 🚀 DEPLOYMENT GUIDE

## Vercel + Supabase Deployment

### Step 1: Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose a name, database password, and region (choose US West for LA proximity)
4. Wait for the project to be created (~2 minutes)
5. Go to **SQL Editor** in the left sidebar
6. Copy the contents of `supabase/schema.sql` and run it
7. Go to **Settings** → **API** and copy:
   - Project URL (e.g., `https://abcdefgh.supabase.co`)
   - `anon` `public` key (the long string)

### Step 2: Deploy to Vercel

#### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### Option B: Via GitHub

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - LA Barber Guide MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/la-barber-guide.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your Supabase anon key
6. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `labarberguide.com`)
3. Follow DNS instructions
4. Vercel automatically handles SSL

### Step 4: Environment Variables for Production

Make sure these are set in Vercel:

**Required for MVP:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Required for data scraping (later):**
- `GOOGLE_PLACES_API_KEY`
- `OPENAI_API_KEY`

---

## Local Development Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/la-barber-guide.git
cd la-barber-guide

# Install dependencies
npm install

# Copy environment template
cp .env.local.template .env.local

# Add your Supabase credentials to .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Post-Deployment Checklist

- [ ] Site loads at your Vercel URL
- [ ] All pages render correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Supabase connection works
- [ ] Images load properly
- [ ] Links work
- [ ] Add domain (if you have one)
- [ ] Setup Google Analytics (optional)
- [ ] Submit to Google Search Console

---

## Quick Commands

```bash
# Local dev
npm run dev

# Build for production (test locally)
npm run build
npm run start

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

**"Missing Supabase environment variables"**
- Make sure you added the env vars in Vercel dashboard
- Redeploy after adding env vars

**Build fails on Vercel**
- Check build logs in Vercel dashboard
- Make sure all dependencies are in package.json
- Test build locally first: `npm run build`

**Database connection fails**
- Verify Supabase URL and key are correct
- Check that schema.sql was run in Supabase SQL editor
- Make sure env vars start with `NEXT_PUBLIC_` for client-side access

---

## What's Next?

1. **Seed the database** — Run the Google Places scraper to populate barbershops
2. **Add content** — Start adding real LA barber data
3. **SEO** — Create category pages and add metadata
4. **Share** — Post on social media and get feedback

Let's fucking go! 🚀

