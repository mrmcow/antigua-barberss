
import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase';

async function fixMarkdownLinks() {
    console.log('🔧 STARTING MARKDOWN LINK FIX...');

    // 1. Fetch all barbers from Supabase
    console.log('📥 Fetching barbers from Supabase...');
    const { data: barbers, error } = await supabase
        .from('barbershops')
        .select('id, name, neighborhood');

    if (error || !barbers) {
        console.error('❌ Error fetching barbers:', error);
        process.exit(1);
    }

    console.log(`✅ Fetched ${barbers.length} barbers.`);

    // Create a lookup map: normalized name -> id
    const barberMap = new Map<string, string>();

    barbers.forEach(barber => {
        // Normalize name: lowercase, remove special chars
        const normalizedName = barber.name.toLowerCase().trim();
        barberMap.set(normalizedName, barber.id);

        // Also map by "name - neighborhood" if neighborhood exists
        if (barber.neighborhood) {
            const specificName = `${barber.name} ${barber.neighborhood}`.toLowerCase().trim();
            barberMap.set(specificName, barber.id);
        }
    });

    // 2. Process Markdown Files
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    if (!fs.existsSync(blogDir)) {
        console.error(`❌ Blog directory not found: ${blogDir}`);
        process.exit(1);
    }

    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
    console.log(`📝 Processing ${files.length} markdown files...`);

    let updatedCount = 0;

    for (const file of files) {
        const filePath = path.join(blogDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let fileUpdated = false;

        // Strategy 1: Fix existing slug-based links [Name](/barbers/slug) -> [Name](/barbers/uuid)
        // Regex to find [Name](/barbers/...) links
        // We capture the Name and the URL part
        const linkRegex = /\[([^\]]+)\]\(\/barbers\/([^\)]+)\)/g;

        content = content.replace(linkRegex, (match, name, slug) => {
            // If it's already a UUID, leave it alone (UUID is 36 chars, usually has dashes)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (uuidRegex.test(slug)) {
                return match;
            }

            // Try to find barber by name
            const normalizedName = name.toLowerCase().trim();
            let barberId = barberMap.get(normalizedName);

            // Fallback: Try to match by slug (e.g. "pier-86-barbershop" -> "pier 86 barbershop")
            if (!barberId) {
                const slugName = slug.replace(/-/g, ' ').toLowerCase().trim();
                barberId = barberMap.get(slugName);
            }

            if (barberId) {
                fileUpdated = true;
                return `[${name}](/barbers/${barberId})`;
            } else {
                console.warn(`⚠️ Could not find UUID for barber: "${name}" (slug: ${slug}) in file ${file}`);
                return match; // Keep original if not found
            }
        });

        // Strategy 2: Fix Headings "### Name" -> "### [Name](/barbers/uuid)"
        // Only if the heading is NOT already a link
        const headingRegex = /^### (?!\[)(.+)$/gm;

        content = content.replace(headingRegex, (match, name) => {
            const trimmedName = name.trim();
            const normalizedName = trimmedName.toLowerCase();

            // Check if this looks like a numbered list item "1. Name"
            const numberedMatch = trimmedName.match(/^(\d+\.)\s+(.+)$/);
            let lookupName = normalizedName;
            let prefix = "";
            let displayName = trimmedName;

            if (numberedMatch) {
                prefix = numberedMatch[1] + " ";
                displayName = numberedMatch[2];
                lookupName = displayName.toLowerCase();
            }

            // Try exact match first
            let barberId = barberMap.get(lookupName);

            // If not found, try removing " - Neighborhood" part
            if (!barberId && lookupName.includes(' - ')) {
                const namePart = lookupName.split(' - ')[0].trim();
                barberId = barberMap.get(namePart);
            }

            // If still not found, try replacing " - " with " " (space) to match specificName map entry
            if (!barberId && lookupName.includes(' - ')) {
                const spaceName = lookupName.replace(' - ', ' ').trim();
                barberId = barberMap.get(spaceName);
            }

            if (barberId) {
                fileUpdated = true;
                return `### ${prefix}[${displayName}](/barbers/${barberId})`;
            }

            return match;
        });

        // Strategy 3: Fix Bolded Names in Quick Answer/TL;DR "**Name**" -> "[**Name**](/barbers/uuid)"
        // Look for bolded text that matches a barber name
        const boldRegex = /\*\*([^*]+)\*\*/g;

        content = content.replace(boldRegex, (match, name) => {
            // If this bold text is already inside a link, ignore it
            // This is a bit tricky with regex replace, but we can check context if needed
            // For now, let's assume if we match **Name**, we check if it's a barber

            const trimmedName = name.trim();
            const normalizedName = trimmedName.toLowerCase();

            // Try exact match first
            let barberId = barberMap.get(normalizedName);

            // If not found, try removing " - Neighborhood" part
            if (!barberId && normalizedName.includes(' - ')) {
                const namePart = normalizedName.split(' - ')[0].trim();
                barberId = barberMap.get(namePart);
            }

            if (barberId) {
                // Check if this match is already part of a link
                // A simple heuristic: check if the match is followed by ](
                // But replace doesn't give us index easily in this form without more work
                // Let's just do it and if it creates double links we might need to be careful
                // Actually, markdown links are [text](url). If we have [**Name**](url), our regex won't match the outer [] part
                // But if we replace **Name** with [**Name**](url), we get [[**Name**](url)](url) which is bad.

                // Better approach: Only replace if NOT preceded by [
                return `[${match}](/barbers/${barberId})`;
            }

            return match;
        });

        // Fix any double linking artifacts if they occurred: [[**Name**](/barbers/id)](/barbers/id) -> [**Name**](/barbers/id)
        // This is a safety cleanup
        content = content.replace(/\[\[\*\*([^*]+)\*\*\]\(\/barbers\/[^\)]+\)\]\(\/barbers\/[^\)]+\)/g, (match, name) => {
            const normalizedName = name.toLowerCase().trim();
            const barberId = barberMap.get(normalizedName);
            return `[**${name}**](/barbers/${barberId})`;
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            updatedCount++;
            // console.log(`✅ Updated ${file}`);
        }
    }

    console.log(`🎉 Finished! Updated ${updatedCount} files.`);
}

fixMarkdownLinks().catch(console.error);
