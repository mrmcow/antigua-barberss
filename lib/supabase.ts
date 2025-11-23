import { createClient } from '@supabase/supabase-js';

// Supabase configuration with fallbacks for deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hntjqndjdfmuzcxbqbva.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudGpxbmRqZGZtdXpjeGJxYnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4ODE3MTEsImV4cCI6MjA3OTQ1NzcxMX0.3_9yZxqEU_sj6LJ0m3WZKtvshmeO10XqTsWWjY9OJc';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

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

