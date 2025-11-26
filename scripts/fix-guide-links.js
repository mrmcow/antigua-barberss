const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://hntjqndjdfmuzcxbqbva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudGpxbmRqZGZtdXpjeGJxYnZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg4MTcxMSwiZXhwIjoyMDc5NDU3NzExfQ.oWGU2aNWAQCuqFbLH__p9POM1MKIwD42Ktvh3n7LKkU';

// Convert name to slug format (same logic as original auto-linking)
function nameToSlug(name) {
    return name
        .toLowerCase()
        .replace(/['']/g, '')
        .replace(/\./g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

async function fixGuideLinks() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch all barbershops
    const { data: barbershops, error } = await supabase
        .from('barbershops')
        .select('id, name');

    if (error) {
        console.error('Error fetching barbershops:', error);
        return;
    }

    console.log(`Fetched ${barbershops.length} barbershops\n`);

    // Create slug -> ID mapping
    const slugMap = {};
    barbershops.forEach(barber => {
        const slug = nameToSlug(barber.name);
        slugMap[slug] = { id: barber.id, name: barber.name };
    });

    // Load blog posts
    const blogPath = path.join(__dirname, '../public/data/blog-posts.json');
    const blogPosts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

    console.log(`Processing ${blogPosts.length} blog posts...\n`);

    let updated = 0;
    let linksFixed = 0;

    // Process each blog post
    blogPosts.forEach(post => {
        let contentChanged = false;
        let newContent = post.content;

        // Find all barber links in the format /barbers/slug-name
        const linkRegex = /\[([^\]]+)\]\(\/barbers\/([a-z0-9-]+)\)/g;
        const matches = [...newContent.matchAll(linkRegex)];

        matches.forEach(match => {
            const fullMatch = match[0];
            const linkText = match[1];
            const slug = match[2];

            // Check if this is a slug (not a UUID)
            if (!slug.includes('-') || slug.length > 50 || slug.match(/^[0-9a-f]{8}-/)) {
                // Likely already a UUID or very short, skip
                return;
            }

            // Find matching barber
            const barber = slugMap[slug];
            if (barber) {
                const newLink = `[${linkText}](/barbers/${barber.id})`;
                newContent = newContent.replace(fullMatch, newLink);
                contentChanged = true;
                linksFixed++;
                console.log(`  ✓ Fixed: ${slug} -> ${barber.id.substring(0, 8)}... (${barber.name})`);
            } else {
                console.log(`  ❌ No match for slug: ${slug}`);
            }
        });

        if (contentChanged) {
            post.content = newContent;
            updated++;
        }
    });

    // Save updated blog posts
    fs.writeFileSync(blogPath, JSON.stringify(blogPosts, null, 2));
    console.log(`\n✅ Updated ${updated} blog posts`);
    console.log(`✅ Fixed ${linksFixed} barber links!`);
}

fixGuideLinks().catch(console.error);
