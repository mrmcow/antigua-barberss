import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
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

// Fetch barbers server-side for SEO
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

  // Filter out empty image arrays
  return (data || []).filter(b => b.images && b.images.length > 0);
}

export default async function BrowsePage() {
  const barbers = await getBarbers();

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link href="/browse" className="text-sm uppercase tracking-wider text-la-orange font-medium">
              Browse
            </Link>
            <Link href="/need-cut-now">
              <Button variant="primary" size="sm">
                Need Cut Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Browse Content (Client Component for Interactivity) */}
      <BrowseContent initialBarbers={barbers} />

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 bg-black text-white">
        <div className="container-brutal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Logo size="md" className="mb-3 invert" />
              <p className="text-sm text-gray-400">The best barbers in LA. Period.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-sm uppercase tracking-wider hover:text-la-orange transition-colors">
                Home
              </Link>
              <a href="mailto:support@pagestash.app?subject=LA Barber Guide - Contact" className="text-sm uppercase tracking-wider hover:text-la-orange transition-colors">
                Contact
              </a>
              <Link href="/feedback" className="text-sm uppercase tracking-wider hover:text-la-orange transition-colors">
                Feedback
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
