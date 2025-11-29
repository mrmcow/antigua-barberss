'use client';

import { Phone, MessageCircle, Globe, Instagram } from "lucide-react";
import { trackClickEvent } from "@/lib/analytics";

interface BarberActionsProps {
  barber: {
    id: string;
    name: string;
    phone: string | null;
    website: string | null;
    instagram_handle: string | null;
    google_maps_url: string | null;
    lat: number;
    lng: number;
  };
}

export function BarberContactActions({ barber }: BarberActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {barber.phone && (
        <a
          href={`tel:${barber.phone}`}
          onClick={() => trackClickEvent(barber.id, 'phone_call', `tel:${barber.phone}`, barber.name)}
          className="flex-1 bg-[#1a1a1a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg"
        >
          <Phone className="w-4 h-4" /> Call Shop
        </a>
      )}
      <a
        href={`https://wa.me/12680000000`} // Placeholder
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClickEvent(barber.id, 'whatsapp_click', 'wa.me', barber.name)}
        className="flex-1 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg"
      >
        <MessageCircle className="w-5 h-5" /> WhatsApp
      </a>
    </div>
  );
}

export function BarberLocationAction({ barber }: BarberActionsProps) {
  return (
    <a
      href={barber.google_maps_url || `https://maps.google.com/?q=${barber.lat},${barber.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClickEvent(barber.id, 'directions_click', barber.google_maps_url || '', barber.name)}
      className="block w-full py-3 border border-black/10 rounded-full text-center text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
    >
      Get Directions
    </a>
  );
}

export function BarberSocialActions({ barber }: BarberActionsProps) {
  return (
    <div className="space-y-4">
      {barber.website && (
        <a
          href={barber.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClickEvent(barber.id, 'website_click', barber.website!, barber.name)}
          className="flex items-center gap-3 text-sm font-bold hover:text-[#0072C6] transition-colors"
        >
          <Globe className="w-4 h-4" /> Visit Website
        </a>
      )}
      {barber.instagram_handle && (
        <a
          href={`https://instagram.com/${barber.instagram_handle}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClickEvent(barber.id, 'website_click', `instagram.com/${barber.instagram_handle}`, barber.name)}
          className="flex items-center gap-3 text-sm font-bold hover:text-[#E1306C] transition-colors"
        >
          <Instagram className="w-4 h-4" /> @{barber.instagram_handle}
        </a>
      )}
    </div>
  );
}

