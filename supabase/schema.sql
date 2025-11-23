-- LA Barber Guide - Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Barbershops table
create table barbershops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  neighborhood text,
  lat float8 not null,
  lng float8 not null,
  phone text,
  website text,
  instagram_handle text,
  google_place_id text unique not null,
  rating float8,
  review_count int default 0,
  price_range text, -- $, $$, $$$
  hours jsonb, -- opening hours + open_now flag
  images text[],
  
  -- Booking & Availability
  booking_platform text, -- booksy, vagaro, square, etc
  booking_url text, -- direct link to booking page
  accepts_walk_ins boolean default false,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews table
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid references barbershops(id) on delete cascade not null,
  reviewer_name text,
  reviewer_photo text,
  rating int not null check (rating >= 1 and rating <= 5),
  text text,
  date timestamptz,
  source text, -- google, yelp, etc
  
  -- AI-extracted tags
  hair_types text[], -- detected hair types mentioned
  styles text[], -- fade, taper, etc
  sentiment float8, -- -1 to 1
  
  created_at timestamptz default now()
);

-- Classifications table (aggregated from reviews)
create table classifications (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid references barbershops(id) on delete cascade unique not null,
  
  -- Aggregated scores stored as JSON
  hair_types jsonb, -- { "4c": 0.8, "curly": 0.6, "straight": 0.3 }
  styles jsonb, -- { "fade": 0.9, "beard": 0.7, "color": 0.2 }
  vibes text[], -- upscale, old-school, queer-friendly, etc
  
  -- Computed flags
  walk_in_friendly boolean default false,
  kids_welcome boolean default false,
  
  last_updated timestamptz default now()
);

-- Indexes for performance
create index barbershops_neighborhood_idx on barbershops(neighborhood);
create index barbershops_rating_idx on barbershops(rating);
create index barbershops_location_idx on barbershops(lat, lng);
create index reviews_barbershop_id_idx on reviews(barbershop_id);
create index reviews_rating_idx on reviews(rating);

-- Updated_at trigger for barbershops
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_barbershops_updated_at
  before update on barbershops
  for each row
  execute function update_updated_at_column();

create trigger update_classifications_updated_at
  before update on classifications
  for each row
  execute function update_updated_at_column();

-- Row Level Security (optional - disable for now, enable when you add auth)
-- alter table barbershops enable row level security;
-- alter table reviews enable row level security;
-- alter table classifications enable row level security;

-- For now, allow public read access (you can restrict this later)
-- create policy "Allow public read access" on barbershops for select using (true);
-- create policy "Allow public read access" on reviews for select using (true);
-- create policy "Allow public read access" on classifications for select using (true);

