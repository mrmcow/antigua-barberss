import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { BrowseContent } from "@/components/BrowseContent";

export const metadata: Metadata = {
  title: "Browse Antigua Barbers - Find Shops Near You",
  description: "Search the official directory of barbershops in Antigua. Filter by neighborhood (St. John's, English Harbour, etc.), view ratings, and book appointments.",
  openGraph: {
    title: "Browse Antigua Barbers - Official Directory",
    description: "Find the best barbers in Antigua. Search by location, rating, and services.",
    url: "https://antiguabarbers.com/browse",
    type: "website",
  },
};

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

  // JSON-LD for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Antigua Barber Directory",
    "description": "A curated list of the best barbershops in Antigua and Barbuda.",
    "url": "https://antiguabarbers.com/browse",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": barbers.slice(0, 20).map((barber, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://antiguabarbers.com/barbers/${barber.id}`,
        "name": barber.name
      }))
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-24 sm:pt-32 px-4 sm:px-6 max-w-[1600px] mx-auto">
        
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