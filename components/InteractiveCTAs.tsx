"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export function InteractiveCTAs() {
    return (
        <div className="space-y-4 mb-8">
            <Link href="/match" className="block group">
                <div className="border-4 border-black bg-black text-white p-6 md:p-8 active:scale-[0.98] transition-all duration-200 min-h-[100px] flex items-center justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-la-orange/20">
                    <div className="absolute inset-0 bg-la-orange translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></div>
                    <div className="absolute inset-0 border-4 border-la-orange opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="flex-1 relative z-10">
                        <div className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 group-hover:text-black transition-colors duration-400">FIND MY BARBER</div>
                        <div className="text-sm md:text-base opacity-90 group-hover:text-black/80 transition-colors duration-400">3 questions · Smart matching · LA's best</div>
                    </div>
                    <ArrowRight className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ml-4 relative z-10 group-hover:translate-x-2 group-hover:text-black transition-all duration-400" />
                </div>
            </Link>

            <Link href="/browse?urgency=now" className="block group">
                <div className="border-4 border-la-orange bg-la-orange text-white p-6 md:p-8 active:scale-[0.98] transition-all duration-200 min-h-[100px] flex items-center justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-black/20">
                    <div className="absolute inset-0 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-out"></div>
                    <div className="absolute inset-0 border-4 border-black opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <div className="flex-1 relative z-10">
                        <div className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 group-hover:text-white transition-colors duration-400">CUT TODAY</div>
                        <div className="text-sm md:text-base opacity-90 group-hover:text-white/90 transition-colors duration-400">Open right now · Walk-ins welcome · Drive time</div>
                    </div>
                    <Clock className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 ml-4 relative z-10 group-hover:rotate-12 group-hover:text-white transition-all duration-400" />
                </div>
            </Link>
        </div>
    );
}
