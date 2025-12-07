"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when opening
  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, showNext, showPrev]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300">
      {/* Controls */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50 rounded-full bg-black/20"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation Arrows (Desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={showPrev}
            className="absolute left-4 text-white/50 hover:text-white hidden md:block p-4"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={showNext}
            className="absolute right-4 text-white/50 hover:text-white hidden md:block p-4"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div 
        className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()} // Close if clicking outside image
      >
        <div className="relative w-full h-full flex items-center justify-center">
            <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain shadow-2xl"
            />
        </div>
      </div>

      {/* Counter / Dots */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}



