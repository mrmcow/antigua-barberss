-- ============================================
-- COMMUNITY COMMENTS TABLE
-- Anonymous comments from locals and visitors
-- ============================================

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
  
  -- Anonymous user info (optional)
  display_name TEXT, -- "Local Regular", "Cruise Visitor", etc.
  
  -- Comment content
  comment TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5), -- optional rating
  
  -- Metadata
  is_local BOOLEAN DEFAULT false, -- helps identify local vs tourist perspective
  is_verified BOOLEAN DEFAULT true, -- for moderation (default to true for auto-approval)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS community_comments_barbershop_id_idx ON community_comments(barbershop_id);
CREATE INDEX IF NOT EXISTS community_comments_created_at_idx ON community_comments(created_at DESC);

-- Enable RLS and allow public read/insert (anonymous comments)
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read verified comments
CREATE POLICY "Allow public read access" ON community_comments 
  FOR SELECT USING (is_verified = true);

-- Allow anyone to insert comments (they'll be auto-verified)
CREATE POLICY "Allow public insert" ON community_comments 
  FOR INSERT WITH CHECK (true);
