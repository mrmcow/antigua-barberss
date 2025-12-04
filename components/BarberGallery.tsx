"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "@/components/ui/Lightbox";

interface BarberGalleryProps {
  images: string[];
  barberName: string;
}

export function BarberGallery({ images, barberName }: BarberGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const mainImage = images?.[0];
  const sideImages = images?.slice(1, 3) || [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <Lightbox 
        images={images} 
        initialIndex={lightboxIndex} 
        isOpen={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
      />

      <section className="px-4 sm:px-6 max-w-[1600px] mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[50vh] md:h-[60vh] rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5 bg-white">
            {/* Main Image */}
            <div 
                className="md:col-span-2 relative h-full bg-gray-100 cursor-pointer group"
                onClick={() => openLightbox(0)}
            >
                {mainImage ? (
                    <img src={mainImage} alt={barberName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-6xl">AB</div>
                )}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm">
                    Featured Barber
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
            </div>
            
            {/* Side Images */}
            <div className="hidden md:grid grid-rows-2 gap-4 h-full">
                {sideImages.map((img, i) => (
                    <div 
                        key={i} 
                        className="relative bg-gray-100 h-full overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(i + 1)}
                    >
                        <img src={img} alt="Shop view" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize2 className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                    </div>
                ))}
                {sideImages.length === 0 && (
                    <>
                        <div className="bg-gray-50 h-full"></div>
                        <div className="bg-gray-50 h-full"></div>
                    </>
                )}
            </div>
        </div>
      </section>
    </>
  );
}


