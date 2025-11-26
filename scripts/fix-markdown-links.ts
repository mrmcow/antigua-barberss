
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

            const barberId = barberMap.get(lookupName);

            if (barberId) {
                fileUpdated = true;
                return `### ${prefix}[${displayName}](/barbers/${barberId})`;
            }

            return match;
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
