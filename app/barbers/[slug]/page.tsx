import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { CommunityComments } from "@/components/CommunityComments";
import { BarberGallery } from "@/components/BarberGallery";
import { BarberContactActions, BarberLocationAction, BarberSocialActions } from "@/components/BarberActions";
import { GoogleReviews } from "@/components/GoogleReviews";

// Force dynamic rendering since we rely on DB data
export const dynamic = 'force-dynamic';

interface Barbershop {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  instagram_handle: string | null;
  rating: number | null;
  review_count: number;
  price_range: string | null;
  hours: any;
  images: string[];
  google_maps_url: string | null;
  google_place_id: string | null;
}

interface GoogleReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url?: string;
}

async function getBarber(id: string): Promise<Barbershop | null> {
      const { data, error } = await supabase
    .from('barbershops')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
      }

async function getNextBarber(currentName: string): Promise<string | null> {
  // Try to get next alphabetical
    const { data } = await supabase
      .from('barbershops')
      .select('id')
    .gt('name', currentName)
    .order('name', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (data) return data.id;

  // Fallback to first (wrap around)
  const { data: first } = await supabase
      .from('barbershops')
    .select('id')
    .order('name', { ascending: true })
    .limit(1)
    .maybeSingle();

  return first?.id || null;
}

async function getGoogleReviews(barbershopId: string): Promise<GoogleReview[]> {
  try {
    const { data, error } = await supabase
      .from('google_reviews')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .order('time', { ascending: false })
      .limit(5); // Limit to most recent 5 reviews

    if (error) {
      console.error('Error fetching Google reviews from database:', error);
      return [];
    }

    return data?.map(review => ({
      author_name: review.author_name,
      rating: review.rating,
      relative_time_description: review.relative_time_description,
      text: review.text,
      time: review.time,
      profile_photo_url: review.profile_photo_url
    })) || [];
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const barber = await getBarber(params.slug);
  
  if (!barber) {
    return { title: "Barber Not Found" };
  }

  return {
    title: `${barber.name} - Barber in ${barber.neighborhood || "St. John's, Antigua"}`,
    description: `Book a haircut at ${barber.name}. ${barber.rating ? `Rated ${barber.rating} stars.` : ''} Located in ${barber.neighborhood || "Antigua"}. See photos, reviews, and opening hours.`,
    openGraph: {
      title: `${barber.name} - Antigua Barbers`,
      description: `Check out ${barber.name} in ${barber.neighborhood || "Antigua"}. View photos and reviews on Antigua Barbers.`,
      images: barber.images?.[0] ? [barber.images[0]] : [],
      }
    };
}

export default async function BarberProfile({ params }: { params: { slug: string } }) {
  const barber = await getBarber(params.slug);

  if (!barber) {
    notFound();
    }

  const [nextBarberId, googleReviews] = await Promise.all([
    getNextBarber(barber.name),
    getGoogleReviews(barber.id)
  ]);

  // JSON-LD Schema for LocalBusiness
  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "name": barber.name,
    "url": `https://www.antiguabarbers.com/barbers/${barber.id}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": barber.address,
      "addressLocality": barber.neighborhood || "Saint John's",
      "addressCountry": "AG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": barber.lat,
      "longitude": barber.lng
    },
    "priceRange": barber.price_range || "$$",
  };

  if (barber.images?.[0]) {
    jsonLd.image = [barber.images[0]];
  }

  if (barber.phone) {
    jsonLd.telephone = barber.phone;
  }

  if (barber.google_maps_url) {
    jsonLd.hasMap = barber.google_maps_url;
  }

  if (barber.rating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": barber.rating,
      "reviewCount": barber.review_count || 1
    };
  }

  // Prepare simple barber object for client components
  const simpleBarber = {
    id: barber.id,
    name: barber.name,
    phone: barber.phone,
    website: barber.website,
    instagram_handle: barber.instagram_handle,
    google_maps_url: barber.google_maps_url,
    lat: barber.lat,
    lng: barber.lng
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-20 pt-28 sm:pt-32">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back Nav */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
            <Link href="/browse" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black hover:bg-gray-50 transition-all shadow-sm border border-black/5">
                <ArrowLeft className="w-3 h-3" /> <span className="hidden sm:inline">Back to Directory</span><span className="sm:hidden">Back</span>
            </Link>

            {nextBarberId && (
                <Link href={`/barbers/${nextBarberId}`} className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#CE1126] transition-all shadow-sm">
                    Next <span className="hidden sm:inline">Shop</span> <ArrowRight className="w-3 h-3" />
                </Link>
            )}
        </div>
      </div>

      {/* Gallery Hero (Client Component) */}
      <BarberGallery images={barber.images || []} barberName={barber.name} />

      {/* Content Grid */}
      <div className="px-4 sm:px-6 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
            <div>
                <h1 className="text-4xl sm:text-6xl font-black uppercase leading-tight mb-4 text-[#1a1a1a]">{barber.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 font-bold text-gray-900">
                        <MapPin className="w-4 h-4 text-[#CE1126]" />
                        {barber.neighborhood || "St. John's"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1 font-bold">
                        <Star className="w-4 h-4 fill-[#FCD116] text-[#FCD116]" />
                        {barber.rating?.toFixed(1)} ({barber.review_count} reviews)
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="font-bold text-gray-500">{barber.price_range || "$$"}</span>
                </div>
            </div>

            <BarberContactActions barber={simpleBarber} />

            {/* About / Hours */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5">
                <h3 className="text-lg font-black uppercase mb-6">Opening Hours</h3>
                {barber.hours?.weekday_text ? (
                    <div className="space-y-3 text-sm font-medium text-gray-600">
                        {barber.hours.weekday_text.map((day: string, i: number) => (
                            <div key={i} className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                                <span>{day.split(': ')[0]}</span>
                                <span className="text-black">{day.split(': ')[1]}</span>
                        </div>
                      ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">Hours not available</p>
                )}
            </div>

            {/* Community Comments */}
            <CommunityComments barbershopId={barber.id} barbershopName={barber.name} />

            {/* Google Reviews Summary */}
            <GoogleReviews 
                rating={barber.rating} 
                reviewCount={barber.review_count} 
                barberName={barber.name} 
                barbershopId={barber.id}
                googleMapsUrl={barber.google_maps_url}
                reviews={googleReviews}
            />
                </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5">
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-400">Location</h3>
                <div className="aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <MapEmbed lat={barber.lat} lng={barber.lng} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-6 leading-relaxed">
                    {barber.address}
                </p>
                <BarberLocationAction barber={simpleBarber} />
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-gray-400">Contact</h3>
                <BarberSocialActions barber={simpleBarber} />
          </div>
        </div>

      </div>
    </main>
  );
}
