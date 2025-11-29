"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Phone, Navigation, ArrowRight, Car, MessageCircle, Search } from "lucide-react";
import { trackClickEvent } from "@/lib/analytics";
import { calculateDistance } from "@/lib/utils";

interface Barbershop {
    id: string;
    name: string;
    address: string;
    neighborhood: string | null;
    lat: number;
    lng: number;
    phone: string | null;
    website: string | null;
    rating: number | null;
    review_count: number;
    price_range: string | null;
    images: string[];
    distance?: number;
}

interface BrowseContentProps {
    initialBarbers: Barbershop[];
}

const ANTIGUA_NEIGHBORHOODS = [
    "St. John's",
    "English Harbour",
    "Jolly Harbour",
    "All Saints",
    "Dickenson Bay",
    "Liberta",
    "Old Road",
    "Crosbies",
    "Falmouth",
    "Bolans",
    "Piggotts",
    "Winthorpes",
    "Cassada Gardens",
    "Cobbs Cross"
];

export function BrowseContent({ initialBarbers }: BrowseContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [barbers, setBarbers] = useState<Barbershop[]>(initialBarbers);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
    const [activeNeighborhoods, setActiveNeighborhoods] = useState<string[]>(() => {
        const filters = searchParams.get('neighborhoods');
        return filters ? filters.split(',') : [];
    });

    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const sortBy = searchParams.get('sort');

    // Calculate counts for each neighborhood based on current barbers data
    const neighborhoodCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        ANTIGUA_NEIGHBORHOODS.forEach(hood => {
            counts[hood] = barbers.filter(b => 
                (b.neighborhood || "").toLowerCase().includes(hood.toLowerCase()) ||
                (b.address || "").toLowerCase().includes(hood.toLowerCase())
            ).length;
        });
        return counts;
    }, [barbers]);

    // Sync URL with state
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        
        if (activeNeighborhoods.length > 0) {
            params.set('neighborhoods', activeNeighborhoods.join(','));
        } else {
            params.delete('neighborhoods');
        }

        const newUrl = params.toString() ? `/browse?${params.toString()}` : '/browse';
        router.replace(newUrl, { scroll: false });
    }, [searchTerm, activeNeighborhoods, router, searchParams]);

    const toggleNeighborhood = (hood: string) => {
        setActiveNeighborhoods(prev => 
            prev.includes(hood) ? [] : [hood]
        );
    };

    const filteredAndSortedBarbers = useMemo(() => {
        let processed = [...barbers];

        // Calculate distances if user location is available
        if (userLat && userLng) {
            processed = processed.map(barber => ({
                ...barber,
                distance: calculateDistance(userLat, userLng, barber.lat, barber.lng)
            }));
        }

        // Filter
        processed = processed.filter(barber => {
            const matchesSearch = !searchTerm || 
                barber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                barber.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase());
                
            const matchesHood = activeNeighborhoods.length === 0 || 
                (barber.neighborhood && activeNeighborhoods.some(hood => 
                    (barber.neighborhood || "").toLowerCase().includes(hood.toLowerCase()) ||
                    (barber.address || "").toLowerCase().includes(hood.toLowerCase())
                ));

            return matchesSearch && matchesHood;
        });

        // Sort
        if (sortBy === 'distance' && userLat && userLng) {
            processed.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }

        return processed;
    }, [barbers, searchTerm, activeNeighborhoods, userLat, userLng, sortBy]);

    return (
        <div>
            {/* Search & Filters */}
            <div className="mb-8 space-y-6">
                {/* Rounded Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search barbers, shops, areas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-full border border-black/10 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CE1126]/20 focus:border-[#CE1126] transition-all text-base placeholder:text-gray-400"
                        />
                    </div>

                {/* Neighborhood Pills */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
                    {ANTIGUA_NEIGHBORHOODS.map(hood => (
                        <button
                            key={hood}
                            onClick={() => toggleNeighborhood(hood)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${
                                activeNeighborhoods.includes(hood)
                                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md"
                                    : "bg-white text-gray-600 border-black/5 hover:border-black/20 hover:text-black"
                            }`}
                        >
                            <span>{hood}</span>
                            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                                activeNeighborhoods.includes(hood) 
                                    ? "bg-white/20 text-white" 
                                    : "bg-black/5 text-black/60"
                            }`}>
                                {neighborhoodCounts[hood] || 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Active Filter Display */}
                {sortBy === 'distance' && userLat && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 w-fit px-4 py-2 rounded-full border border-gray-200">
                        <Navigation className="w-4 h-4 text-[#0072C6]" />
                        <span>Sorting by distance near you</span>
                        <button 
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('lat');
                                params.delete('lng');
                                params.delete('sort');
                                router.push(`/browse?${params.toString()}`);
                            }}
                            className="ml-2 text-xs font-bold uppercase text-[#CE1126] hover:underline"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedBarbers.map(barber => (
                    <div key={barber.id} className="group bg-white rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                        {/* Card Image */}
                        <Link href={`/barbers/${barber.id}`} className="block relative aspect-[4/3] bg-gray-100 overflow-hidden">
                            {barber.images?.[0] ? (
                                        <img
                                            src={barber.images[0]}
                                            alt={barber.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-4xl">AB</div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 fill-[#FCD116] text-[#FCD116]" />
                                <span className="text-xs font-bold">{barber.rating?.toFixed(1)}</span>
                            </div>
                            
                            {/* Distance Badge */}
                            {barber.distance !== undefined && (
                                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-bold">
                                    <Navigation className="w-3 h-3 text-[#FCD116]" />
                                    <span>{barber.distance} km</span>
                                </div>
                            )}
                        </Link>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col flex-1">
                            <div className="mb-4">
                                <Link href={`/barbers/${barber.id}`}>
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-1 group-hover:text-[#CE1126] transition-colors line-clamp-1">
                                        {barber.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {barber.neighborhood || "Antigua"}
                                    </span>
                                    <span>{barber.price_range || "$$"}</span>
                                            </div>
                                        </div>

                            <div className="mt-auto flex gap-2">
                                        {barber.phone && (
                                            <a
                                                href={`tel:${barber.phone}`}
                                        onClick={() => trackClickEvent(barber.id, 'phone_call', `tel:${barber.phone}`, barber.name)}
                                        className="flex-1 py-3 rounded-full border border-black/10 bg-gray-50 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors"
                                            >
                                        <Phone className="w-3.5 h-3.5" /> Call
                                            </a>
                                        )}
                                
                                {barber.website ? (
                                        <a
                                        href={barber.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        onClick={() => trackClickEvent(barber.id, 'website_click', barber.website!, barber.name)}
                                        className="flex-1 py-3 rounded-full bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#CE1126] transition-colors"
                                    >
                                        Book Now
                                    </a>
                                ) : (
                                    <a 
                                        href={`https://wa.me/12680000000`} // Placeholder number - would be dynamic if we had it
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackClickEvent(barber.id, 'whatsapp_click', 'wa.me', barber.name)}
                                        className="flex-1 py-3 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1ebc57] transition-colors shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" /> WhatsApp
                                                </a>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

            {filteredAndSortedBarbers.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 font-medium text-lg">No barbers found matching your criteria.</p>
                    <button 
                        onClick={() => {
                            setSearchTerm(""); 
                            setActiveNeighborhoods([]);
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete('lat');
                            params.delete('lng');
                            params.delete('sort');
                            router.push(`/browse?${params.toString()}`);
                        }}
                        className="mt-4 text-[#CE1126] font-bold uppercase tracking-widest text-xs hover:underline"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
