'use client';

import { Star, ExternalLink } from "lucide-react";
import { trackAndNavigate } from "@/lib/analytics";

interface GoogleReviewsProps {
  rating: number | null;
  reviewCount: number;
  barberName: string;
  barbershopId: string;
  googleMapsUrl: string | null;
  lat: number;
  lng: number;
}

export function GoogleReviews({ 
  rating, 
  reviewCount, 
  barberName, 
  barbershopId,
  googleMapsUrl,
  lat,
  lng
}: GoogleReviewsProps) {
  
  // Fallback to search query if no direct URL
  const targetUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(barberName + " Antigua")}`;

  if (!rating && reviewCount === 0) {
    return null; // Don't show if no data
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 mt-8">
      <div className="flex items-start justify-between mb-6">
        <div>
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-gray-900 mb-2">
            <img src="/images/google-g-logo.svg" alt="Google" className="w-4 h-4" />
            Google Rating
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#1a1a1a]">{rating ? rating.toFixed(1) : "N/A"}</span>
                <div className="flex text-[#FCD116]">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star} 
                            className={`w-4 h-4 ${rating && star <= Math.round(rating) ? "fill-current" : "text-gray-200"}`} 
                        />
                    ))}
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">Based on {reviewCount} verified reviews</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Read what people are saying about <strong>{barberName}</strong> on Google Maps.
        </p>
        <button
            onClick={() => trackAndNavigate(barbershopId, 'google_reviews_click', targetUrl, barberName)}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-gray-900"
        >
            Read {reviewCount} Reviews <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

