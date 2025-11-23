-- Disable RLS (Row Level Security) to allow anonymous access to barbershop data
-- This is needed for the public website to work

-- Disable RLS on all tables that need public access
ALTER TABLE barbershops DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE classifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE click_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE barbershop_analytics DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, create policies for anonymous access
-- But for now, disabling is simpler for a public directory site

-- Create policies for anonymous read access (alternative approach - commented out)
/*
CREATE POLICY "Allow anonymous read on barbershops" ON barbershops 
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous read on reviews" ON reviews 
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous read on classifications" ON classifications 
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous read/write on votes" ON votes 
FOR ALL TO anon USING (true);

CREATE POLICY "Allow anonymous write on click_events" ON click_events 
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous read on analytics" ON barbershop_analytics 
FOR SELECT TO anon USING (true);
*/
