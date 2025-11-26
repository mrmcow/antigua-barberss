const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// This script will add barber links to blog posts
// Run with: node scripts/add-barber-links.js

// Supabase configuration
const supabaseUrl = 'https://hntjqndjdfmuzcxbqbva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudGpxbmRqZGZtdXpjeGJxYnZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg4MTcxMSwiZXhwIjoyMDc5NDU3NzExfQ.oWGU2aNWAQCuqFbLH__p9POM1MKIwD42Ktvh3n7LKkU';

async function addBarberLinks() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch all barbershops
    const { data: barbershops, error } = await supabase
        .from('barbershops')
        .select('id, name');

    if (error) {
        console.error('Error fetching barbershops:', error);
        return;
    }

    console.log(`Fetched ${barbershops.length} barbershops`);

    // Create name -> ID mapping (case-insensitive)
    const barberMap = {};
    barbershops.forEach(barber => {
        barberMap[barber.name.toLowerCase()] = barber.id;
    });

    // Load blog posts
    const blogPath = path.join(__dirname, '../public/data/blog-posts.json');
    const blogPosts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

    console.log(`Processing ${blogPosts.length} blog posts...\n`);

    let updated = 0;

    // Process each blog post
    blogPosts.forEach(post => {
        // Extract barber name from title (format: "Barber Name Review: ...")
        const titleMatch = post.title.match(/^(.+?)\s+Review:/);
        if (!titleMatch) return;

        const barberName = titleMatch[1];
        const barberKey = barberName.toLowerCase();

        // Find matching barber ID
        const barberId = barberMap[barberKey];
        if (!barberId) {
            console.log(`❌ No match found for: ${barberName}`);
            return;
        }

        // Add link at the beginning of content if not already present
        const link = `[Visit ${barberName}](/barbers/${barberId})`;
        if (!post.content.includes(`/barbers/${barberId}`)) {
            // Add link after the verdict line
            post.content = post.content.replace(
                /(\*\*The Verdict:\*\*.+?\n\n)/,
                `$1**${link}**\n\n`
            );
            updated++;
            console.log(`✓ Added link to: ${barberName} -> ${barberId.substring(0, 8)}...`);
        }
    });

    // Save updated blog posts
    fs.writeFileSync(blogPath, JSON.stringify(blogPosts, null, 2));
    console.log(`\n✅ Successfully updated ${updated} blog posts with barber links!`);
}

addBarberLinks().catch(console.error);
