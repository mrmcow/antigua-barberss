const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://hntjqndjdfmuzcxbqbva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudGpxbmRqZGZtdXpjeGJxYnZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg4MTcxMSwiZXhwIjoyMDc5NDU3NzExfQ.oWGU2aNWAQCuqFbLH__p9POM1MKIwD42Ktvh3n7LKkU';

async function linkBarberNames() {
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

    // Sort by name length (longest first to avoid partial matches)
    const sortedBarbers = barbershops.sort((a, b) => b.name.length - a.name.length);

    // Load blog posts
    const blogPath = path.join(__dirname, '../public/data/blog-posts.json');
    const blogPosts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));

    console.log(`Processing ${blogPosts.length} blog posts...\n`);

    let updated = 0;
    let linksAdded = 0;

    blogPosts.forEach(post => {
        let newContent = post.content;
        let contentChanged = false;

        sortedBarbers.forEach(barber => {
            // Escape special regex characters in barber name
            const escapedName = barber.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Create regex to find barber name NOT already in a link
            // Matches: barber name that's not preceded by [ and not followed by ]
            const regex = new RegExp(
                `(?<!\\[)\\b${escapedName}\\b(?!\\])(?!\\()`,
                'gi'
            );

            const matches = newContent.match(regex);
            if (matches && matches.length > 0) {
                // Replace only the FIRST 2 mentions to avoid over-linking
                let replacements = 0;
                newContent = newContent.replace(regex, (match) => {
                    if (replacements < 2) {
                        replacements++;
                        linksAdded++;
                        console.log(`  ✓ Linking: ${match} in ${post.slug.substring(0, 30)}...`);
                        return `[${match}](/barbers/${barber.id})`;
                    }
                    return match;
                });

                if (replacements > 0) {
                    contentChanged = true;
                }
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
    console.log(`✅ Added ${linksAdded} barber name links!`);
}

linkBarberNames().catch(console.error);
