import { createClient } from '@supabase/supabase-js';

// FORCE HARDCODED VALUES - IGNORE ALL ENV VARS
const supabaseUrl = 'https://hntjqndjdfmuzcxbqbva.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudGpxbmRqZGZtdXpjeGJxYnZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg4MTcxMSwiZXhwIjoyMDc5NDU3NzExfQ.oWGU2aNWAQCuqFbLH__p9POM1MKIwD42Ktvh3n7LKkU';

console.log('🚀 FORCED HARDCODED SUPABASE CONFIG');
console.log('URL:', supabaseUrl);
console.log('KEY (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for our database
export type Barbershop = {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  instagram_handle: string | null;
  google_place_id: string;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  hours: any; // JSON
  images: string[];
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  barbershop_id: string;
  reviewer_name: string | null;
  reviewer_photo: string | null;
  rating: number;
  text: string | null;
  date: string | null;
  source: string | null;
  hair_types: string[];
  styles: string[];
  sentiment: number | null;
  created_at: string;
};

export type Classification = {
  id: string;
  barbershop_id: string;
  hair_types: any; // JSON
  styles: any; // JSON
  vibes: string[];
  walk_in_friendly: boolean;
  kids_welcome: boolean;
  last_updated: string;
};

