"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  ArrowLeft,
  Scissors,
  Sparkles,
  Waves,
  Circle,
  MinusSquare,
  Zap,
  Ruler,
  Wind,
  UserCircle,
  Palette
} from "lucide-react";

// Hair type options with icons
const hairTypes = [
  { id: "standard", label: "Standard", icon: UserCircle, description: "Regular cut, any type" },
  { id: "4c", label: "4C Coils", icon: Circle, description: "Tight, kinky coils" },
  { id: "curly", label: "3B/3C Curls", icon: Waves, description: "Defined curls" },
  { id: "wavy", label: "2A/2B Waves", icon: Wind, description: "Loose waves" },
  { id: "straight", label: "Straight", icon: MinusSquare, description: "Fine or thick" },
  { id: "balding", label: "Thinning/Balding", icon: Scissors, description: "Receding or bald" },
];

// Style options with icons
const styles = [
  { id: "fade", label: "Fade", icon: Zap, description: "Classic skin fade" },
  { id: "taper", label: "Taper", icon: Ruler, description: "Gradual taper" },
  { id: "crop", label: "Textured Crop", icon: Sparkles, description: "Modern short cut" },
  { id: "beard", label: "Beard Trim", icon: UserCircle, description: "Shape + lineup" },
  { id: "long", label: "Long Hair", icon: Scissors, description: "Trim or style" },
  { id: "color", label: "Color/Highlights", icon: Palette, description: "Dye or highlights" },
];

// Vibe options
const vibes = [
  { id: "budget", label: "Quick & Affordable", price: "$20-40", description: "Clean cut, fair price" },
  { id: "quality", label: "Quality Classic", price: "$40-60", description: "Skilled barber, great vibe" },
  { id: "premium", label: "Premium Experience", price: "$60+", description: "Top-tier service" },
  { id: "walkin", label: "Walk-In Friendly", price: "Any", description: "No appointment needed" },
  { id: "queer", label: "Queer-Friendly", price: "Any", description: "Inclusive space" },
  { id: "cultural", label: "Cultural Specialist", price: "Any", description: "Black/Latino/Asian barbers" },
];

export default function MatchPage() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    hairType: "",
    style: "",
    vibe: "",
  });

  const handleSelection = (field: string, value: string) => {
    setSelections({ ...selections, [field]: value });

    // Auto-advance after selection
    setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Redirect to results with query params
        window.location.href = `/match/results?hair=${selections.hairType}&style=${value}&vibe=${selections.vibe}`;
      }
    }, 300);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b-2 border-black sticky top-0 bg-white z-50">
        <div className="container-brutal py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs">
              Exit
            </Button>
          </Link>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="border-b-2 border-black bg-concrete/20">
        <div className="container-brutal py-4">
          <div className="flex items-center gap-2">
            <div className={`h-2 flex-1 ${step >= 1 ? 'bg-la-orange' : 'bg-gray-300'} transition-all`} />
            <div className={`h-2 flex-1 ${step >= 2 ? 'bg-la-orange' : 'bg-gray-300'} transition-all`} />
            <div className={`h-2 flex-1 ${step >= 3 ? 'bg-la-orange' : 'bg-gray-300'} transition-all`} />
          </div>
          <div className="flex justify-between mt-2 text-xs uppercase tracking-wider font-medium text-gray-600">
            <span className={step === 1 ? 'text-black' : ''}>Hair</span>
            <span className={step === 2 ? 'text-black' : ''}>Style</span>
            <span className={step === 3 ? 'text-black' : ''}>Vibe</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <section className="py-8 md:py-12 min-h-[70vh]">
        <div className="container-brutal max-w-4xl">

          {/* Step 1: Hair Type */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="mb-8 md:mb-12 text-center">
                <div className="inline-block bg-la-orange text-white px-4 py-2 font-bold uppercase text-sm mb-4">
                  Step 1 of 3
                </div>
                <h1 className="text-brutal-hero mb-4">
                  WHAT'S YOUR<br />HAIR TYPE?
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  This helps us find barbers who know your hair.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hairTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleSelection('hairType', type.id)}
                      className={`border-4 p-6 md:p-8 text-left transition-all active:scale-95 ${selections.hairType === type.id
                          ? 'border-la-orange bg-la-orange text-white'
                          : 'border-black bg-white hover:border-la-orange'
                        }`}
                    >
                      <IconComponent className="w-12 h-12 mb-3" strokeWidth={2} />
                      <h3 className="text-xl md:text-2xl font-bold uppercase mb-1 tracking-tight">
                        {type.label}
                      </h3>
                      <p className={`text-sm ${selections.hairType === type.id ? 'text-white/90' : 'text-gray-600'}`}>
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Style */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="mb-8 md:mb-12 text-center">
                <div className="inline-block bg-la-orange text-white px-4 py-2 font-bold uppercase text-sm mb-4">
                  Step 2 of 3
                </div>
                <h1 className="text-brutal-hero mb-4">
                  WHAT STYLE<br />DO YOU WANT?
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Pick your look. We'll find specialists.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {styles.map((style) => {
                  const IconComponent = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleSelection('style', style.id)}
                      className={`border-4 p-6 md:p-8 text-left transition-all active:scale-95 ${selections.style === style.id
                          ? 'border-la-orange bg-la-orange text-white'
                          : 'border-black bg-white hover:border-la-orange'
                        }`}
                    >
                      <IconComponent className="w-12 h-12 mb-3" strokeWidth={2} />
                      <h3 className="text-xl md:text-2xl font-bold uppercase mb-1 tracking-tight">
                        {style.label}
                      </h3>
                      <p className={`text-sm ${selections.style === style.id ? 'text-white/90' : 'text-gray-600'}`}>
                        {style.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm uppercase tracking-wider font-medium hover:text-la-orange transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Hair Type
              </button>
            </div>
          )}

          {/* Step 3: Vibe */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="mb-8 md:mb-12 text-center">
                <div className="inline-block bg-la-orange text-white px-4 py-2 font-bold uppercase text-sm mb-4">
                  Step 3 of 3
                </div>
                <h1 className="text-brutal-hero mb-4">
                  WHAT'S YOUR<br />VIBE?
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Budget, vibe, or special requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {vibes.map((vibe) => (
                  <button
                    key={vibe.id}
                    onClick={() => handleSelection('vibe', vibe.id)}
                    className={`border-4 p-6 md:p-8 text-left transition-all active:scale-95 ${selections.vibe === vibe.id
                        ? 'border-la-orange bg-la-orange text-white'
                        : 'border-black bg-white hover:border-la-orange'
                      }`}
                  >
                    <div className="text-sm font-bold uppercase tracking-wider mb-2 opacity-60">
                      {vibe.price}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase mb-1 tracking-tight">
                      {vibe.label}
                    </h3>
                    <p className={`text-sm ${selections.vibe === vibe.id ? 'text-white/90' : 'text-gray-600'}`}>
                      {vibe.description}
                    </p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-sm uppercase tracking-wider font-medium hover:text-la-orange transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Style
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t-2 border-black py-6 bg-white">
        <div className="container-brutal">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 LA Barber Guide</p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-la-orange" />
              <span className="font-medium">Matching you with the perfect barber...</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

