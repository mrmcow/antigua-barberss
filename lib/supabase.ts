import { createClient } from '@supabase/supabase-js';

// Antigua Barber Guide Supabase configuration
const supabaseUrl = 'https://iegwteywyuyxtyvdcrzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZ3d0ZXl3eXV5eHR5dmRjcnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTg0OTksImV4cCI6MjA3OTk3NDQ5OX0.ZPVwrXy7jq_A6EkIkMoCd1weic2l8RMwYlvC3jsynmY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for Antigua Barber Guide database
export type Barbershop = {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  area: string | null; // St. John's, Jolly Harbour, English Harbour, etc.
  lat: number;
  lng: number;
  phone: string | null;
  whatsapp: string | null; // WhatsApp very popular in Caribbean
  website: string | null;
  instagram_handle: string | null;
  google_place_id: string;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  hours: any; // JSON
  images: string[];
  // Antigua-specific fields
  cruise_friendly: boolean; // Willing to serve cruise passengers
  mobile_service: boolean; // Comes to hotels/villas
  mobile_radius_km: number | null; // How far they travel
  accepts_ec_dollar: boolean; // Eastern Caribbean Dollar
  accepts_usd: boolean; // US Dollar
  languages_spoken: string[]; // English, Spanish, etc.
  walk_from_port_minutes: number | null; // Walking distance from cruise port
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
  hair_types: any; // JSON - 4C, coily, curly, wavy, straight
  styles: any; // JSON - fades, braids, locs, lineups, etc.
  vibes: string[]; // professional, casual, tourist-friendly, local-favorite
  walk_in_friendly: boolean;
  kids_welcome: boolean;
  tourist_friendly: boolean; // Good with visitors/language barriers
  wedding_specialist: boolean; // Does wedding parties/events
  last_updated: string;
};

// New types for Antigua-specific features
export type CruiseSchedule = {
  id: string;
  date: string;
  ships: {
    name: string;
    passengers: number;
    departure_time: string;
  }[];
  total_passengers: number;
  created_at: string;
};

export type BookingRequest = {
  id: string;
  barbershop_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  requested_date: string;
  requested_time: string;
  service_type: string;
  is_cruise_passenger: boolean;
  ship_departure_time: string | null;
  location_type: 'barbershop' | 'mobile'; // At shop or mobile service
  mobile_address: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

