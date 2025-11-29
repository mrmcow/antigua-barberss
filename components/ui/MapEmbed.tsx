'use client';

import React, { useEffect } from 'react';

interface MapEmbedProps {
  lat: number;
  lng: number;
  className?: string;
  height?: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({ 
  lat, 
  lng, 
  className = '', 
  height = '300px' 
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.warn('Google Maps API Key is missing in MapEmbed component');
    }
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ height }}
      >
        <div className="text-center p-4">
           <p className="font-bold mb-1">Map Unavailable</p>
           <p className="text-xs">API Key Missing</p>
        </div>
      </div>
    );
  }

  // Ensure lat/lng are numbers
  const safeLat = Number(lat) || 0;
  const safeLng = Number(lng) || 0;

  return (
    <iframe
      src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${safeLat},${safeLng}&zoom=15`}
      width="100%"
      height={height}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
    />
  );
};
