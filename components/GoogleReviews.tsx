'use client';

import { Star, ExternalLink, User } from "lucide-react";
import { trackAndNavigate } from "@/lib/analytics";

interface GoogleReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url?: string;
}

interface GoogleReviewsProps {
  rating: number | null;
  reviewCount: number;
  barberName: string;
  barbershopId: string;
  googleMapsUrl: string | null;
  reviews: GoogleReview[];
}

export function GoogleReviews({ 
  rating, 
  reviewCount, 
  barberName, 
  barbershopId,
  googleMapsUrl,
  reviews
}: GoogleReviewsProps) {
  
  // Fallback to search query if no direct URL
  const targetUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(barberName + " Antigua")}`;

  if (!rating && reviewCount === 0 && reviews.length === 0) {
    return null; // Don't show if no data
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 mt-8">
      <div className="flex items-start justify-between mb-6">
        <div>
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-gray-900 mb-2">
            <img src="/images/google-g-logo.svg" alt="Google" className="w-4 h-4" onError={(e) => e.currentTarget.style.display = 'none'} />
            Google Reviews
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
        <button
            onClick={() => trackAndNavigate(barbershopId, 'google_reviews_click', targetUrl, barberName)}
            className="hidden sm:inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-gray-900"
        >
            View All <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start gap-3 mb-2">
                {review.profile_photo_url ? (
                  <img src={review.profile_photo_url} alt={review.author_name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{review.author_name}</span>
                    <span className="text-[10px] text-gray-400">{review.relative_time_description}</span>
                  </div>
                  <div className="flex text-[#FCD116] mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3 h-3 ${star <= review.rating ? "fill-current" : "text-gray-200"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mt-2">{review.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Read verified reviews for <strong>{barberName}</strong> on Google Maps.
            </p>
            <button
                onClick={() => trackAndNavigate(barbershopId, 'google_reviews_click', targetUrl, barberName)}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-gray-900"
            >
                Read {reviewCount} Reviews <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile Button */}
      <div className="mt-6 text-center sm:hidden">
         <button
            onClick={() => trackAndNavigate(barbershopId, 'google_reviews_click', targetUrl, barberName)}
            className="w-full inline-flex justify-center items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-gray-900"
        >
            Read All Reviews <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
