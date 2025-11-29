"use client";

import Link from "next/link";
import { ArrowRight, Anchor, MapPin, Users } from "lucide-react";

export function InteractiveCTAs() {
    return (
        <div className="space-y-4 mb-8">
            {/* Primary CTA - Cruise Passengers */}
            <Link href="/cruise" className="block group">
                <div className="border-4 border-black bg-antigua-navy text-white p-6 md:p-8 active:scale-[0.98] transition-all duration-200 min-h-[100px] flex items-center justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-antigua-coral/20">
                    <div className="absolute inset-0 bg-antigua-coral translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></div>
                    <div className="absolute inset-0 border-4 border-antigua-coral opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="flex-1 relative z-10">
                        <div className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 group-hover:text-white transition-colors duration-400">OFF A CRUISE SHIP?</div>
                        <div className="text-sm md:text-base opacity-90 group-hover:text-white/90 transition-colors duration-400">Quick cuts near port · Back to ship on time · Trusted barbers</div>
                    </div>
                    <Anchor className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ml-4 relative z-10 group-hover:translate-x-2 group-hover:rotate-12 group-hover:text-white transition-all duration-400" />
                </div>
            </Link>

            {/* Secondary CTA - Resort/Tourist */}
            <Link href="/browse?tourist=true" className="block group">
                <div className="border-4 border-antigua-coral bg-antigua-coral text-white p-6 md:p-8 active:scale-[0.98] transition-all duration-200 min-h-[100px] flex items-center justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-black/20">
                    <div className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></div>
                    <div className="absolute inset-0 border-4 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="flex-1 relative z-10">
                        <div className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 group-hover:text-white transition-colors duration-400">STAYING ON ISLAND</div>
                        <div className="text-sm md:text-base opacity-90 group-hover:text-white/90 transition-colors duration-400">Resort/villa cuts · Mobile barbers · Fresh for vacation</div>
                    </div>
                    <MapPin className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ml-4 relative z-10 group-hover:translate-x-2 group-hover:text-white transition-all duration-400" />
                </div>
            </Link>

            {/* Tertiary CTA - Locals */}
            <Link href="/browse?local=true" className="block group">
                <div className="border-4 border-black bg-white text-black p-6 md:p-8 active:scale-[0.98] transition-all duration-200 min-h-[100px] flex items-center justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-antigua-turquoise/20">
                    <div className="absolute inset-0 bg-antigua-turquoise translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></div>
                    <div className="absolute inset-0 border-4 border-antigua-turquoise opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="flex-1 relative z-10">
                        <div className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 group-hover:text-black transition-colors duration-400">LIVE HERE?</div>
                        <div className="text-sm md:text-base opacity-90 group-hover:text-black/80 transition-colors duration-400">Local favorites · Regular cuts · Your neighborhood barber</div>
                    </div>
                    <Users className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ml-4 relative z-10 group-hover:translate-x-2 group-hover:text-black transition-all duration-400" />
                </div>
            </Link>
        </div>
    );
}
