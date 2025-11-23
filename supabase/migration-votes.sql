-- Add votes table for user feedback
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  voter_fingerprint TEXT, -- anonymous identifier (browser fingerprint or IP hash)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate votes from same user
  UNIQUE(barbershop_id, voter_fingerprint)
);

-- Add vote counts to barbershops for quick access
ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS upvotes INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS vote_score FLOAT DEFAULT 0; -- calculated score

-- Index for performance
CREATE INDEX IF NOT EXISTS votes_barbershop_id_idx ON votes(barbershop_id);
CREATE INDEX IF NOT EXISTS votes_fingerprint_idx ON votes(voter_fingerprint);

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_barbershop_votes()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate vote counts for the barbershop
  UPDATE barbershops
  SET 
    upvotes = (SELECT COUNT(*) FROM votes WHERE barbershop_id = NEW.barbershop_id AND vote_type = 'up'),
    downvotes = (SELECT COUNT(*) FROM votes WHERE barbershop_id = NEW.barbershop_id AND vote_type = 'down'),
    vote_score = (
      SELECT 
        CASE 
          WHEN COUNT(*) = 0 THEN 0
          ELSE (
            SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE -1 END)::FLOAT / COUNT(*)
          )
        END
      FROM votes 
      WHERE barbershop_id = NEW.barbershop_id
    )
  WHERE id = NEW.barbershop_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update vote counts
DROP TRIGGER IF EXISTS update_vote_counts ON votes;
CREATE TRIGGER update_vote_counts
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_barbershop_votes();

-- Enable Row Level Security for votes (optional)
-- ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all votes" ON votes FOR ALL USING (true);

