import React from 'react';

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

  if (!apiKey) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ height }}
      >
        Map unavailable
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`}
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

