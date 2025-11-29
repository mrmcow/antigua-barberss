import Link from "next/link";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { BrowseContent } from "@/components/BrowseContent";

interface Barbershop {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  images: string[];
}

async function getBarbers(): Promise<Barbershop[]> {
  const { data, error } = await supabase
    .from('barbershops')
    .select('*')
    .not('images', 'is', null)
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(100);

  if (error) {
    console.error('Error fetching barbers:', error);
    return [];
  }

  return (data || []).filter(b => b.images && b.images.length > 0);
}

export default async function BrowsePage() {
  const barbers = await getBarbers();

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="pt-8 px-4 sm:px-6 max-w-[1600px] mx-auto">
        
        <div className="mb-8 text-center sm:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Island Barbers</h1>
            <p className="text-gray-500">Browse the full list of approved shops in Antigua & Barbuda.</p>
        </div>

        <Suspense fallback={
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#CE1126] border-t-transparent"></div>
          </div>
        }>
          <BrowseContent initialBarbers={barbers} />
        </Suspense>
      </div>
    </main>
  );
}