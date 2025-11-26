"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Star, Clock, Phone, Navigation, ArrowRight, Car } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { trackClickEvent } from "@/lib/analytics";

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
    driveTime?: string;
}

interface BrowseContentProps {
    initialBarbers: Barbershop[];
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Estimate drive time based on distance
function estimateDriveTime(miles: number): string {
    if (miles < 2) return `${Math.round(miles * 8)}min`;
    if (miles < 10) return `${Math.round(miles * 6)}min`;
    return `${Math.round(miles * 4)}min`;
}

// Comprehensive LA zip codes (same as need-cut-now page)
const LA_ZIP_CODES: Record<string, { lat: number; lng: number; area: string }> = {
    '90210': { lat: 34.0901, lng: -118.4065, area: 'Beverly Hills' }, '90211': { lat: 34.0667, lng: -118.3917, area: 'Beverly Hills' },
    '90212': { lat: 34.0667, lng: -118.3917, area: 'Beverly Hills' }, '90401': { lat: 34.0195, lng: -118.4912, area: 'Santa Monica' },
    '90402': { lat: 34.0276, lng: -118.4965, area: 'Santa Monica' }, '90403': { lat: 34.0276, lng: -118.4965, area: 'Santa Monica' },
    '90404': { lat: 34.0276, lng: -118.4965, area: 'Santa Monica' }, '90405': { lat: 34.0195, lng: -118.4912, area: 'Santa Monica' },
    '90291': { lat: 33.9425, lng: -118.4329, area: 'Venice' }, '90292': { lat: 33.9930, lng: -118.4673, area: 'Marina del Rey' },
    '90293': { lat: 33.9590, lng: -118.4500, area: 'Playa del Rey' }, '90028': { lat: 34.1016, lng: -118.3432, area: 'Hollywood' },
    '90038': { lat: 34.0896, lng: -118.3280, area: 'Hollywood' }, '90068': { lat: 34.1349, lng: -118.3267, area: 'Hollywood Hills' },
    '90069': { lat: 34.0901, lng: -118.3850, area: 'West Hollywood' }, '90046': { lat: 34.1030, lng: -118.3521, area: 'West Hollywood' },
    '90048': { lat: 34.0730, lng: -118.3618, area: 'West Hollywood' }, '90012': { lat: 34.0631, lng: -118.2378, area: 'Downtown LA' },
    '90013': { lat: 34.0407, lng: -118.2468, area: 'Downtown LA' }, '90014': { lat: 34.0407, lng: -118.2468, area: 'Downtown LA' },
    '90015': { lat: 34.0407, lng: -118.2468, area: 'Downtown LA' }, '90017': { lat: 34.0522, lng: -118.2614, area: 'Downtown LA' },
    '90021': { lat: 34.0395, lng: -118.2348, area: 'Arts District' }, '90004': { lat: 34.0827, lng: -118.3089, area: 'Koreatown' },
    '90005': { lat: 34.0589, lng: -118.3147, area: 'Koreatown' }, '90006': { lat: 34.0489, lng: -118.3075, area: 'Koreatown' },
    '90010': { lat: 34.0619, lng: -118.3089, area: 'Koreatown' }, '90019': { lat: 34.0489, lng: -118.3437, area: 'Mid-City' },
    '90016': { lat: 34.0194, lng: -118.3503, area: 'Leimert Park' }, '90018': { lat: 34.0285, lng: -118.3089, area: 'Adams-Normandie' },
    '90020': { lat: 34.0669, lng: -118.3089, area: 'Mid-Wilshire' }, '90036': { lat: 34.0757, lng: -118.3531, area: 'Mid-City' },
    '90035': { lat: 34.0522, lng: -118.3872, area: 'Beverlywood' }, '90026': { lat: 34.0780, lng: -118.2608, area: 'Echo Park' },
    '90027': { lat: 34.1067, lng: -118.2870, area: 'Los Feliz' }, '90029': { lat: 34.0889, lng: -118.2912, area: 'Los Feliz' },
    '90039': { lat: 34.1161, lng: -118.2358, area: 'Atwater Village' }, '90024': { lat: 34.0631, lng: -118.4454, area: 'Westwood' },
    '90025': { lat: 34.0522, lng: -118.4437, area: 'West LA' }, '90064': { lat: 34.0345, lng: -118.4309, area: 'West LA' },
    '90034': { lat: 34.0194, lng: -118.4012, area: 'Palms' }, '90066': { lat: 33.9930, lng: -118.4290, area: 'Mar Vista' },
    '90230': { lat: 34.0089, lng: -118.3965, area: 'Culver City' }, '90232': { lat: 34.0089, lng: -118.3965, area: 'Culver City' },
    '91604': { lat: 34.1478, lng: -118.3897, area: 'Studio City' }, '91602': { lat: 34.1392, lng: -118.3870, area: 'Studio City' },
    '91606': { lat: 34.1644, lng: -118.3897, area: 'Studio City' }, '91601': { lat: 34.1644, lng: -118.3681, area: 'North Hollywood' },
    '91605': { lat: 34.1800, lng: -118.3897, area: 'North Hollywood' }, '91607': { lat: 34.1800, lng: -118.4123, area: 'Valley Village' },
    '91423': { lat: 34.1589, lng: -118.4790, area: 'Sherman Oaks' }, '91403': { lat: 34.1589, lng: -118.4790, area: 'Sherman Oaks' },
    '91436': { lat: 34.1511, lng: -118.5089, area: 'Encino' }, '91316': { lat: 34.1511, lng: -118.5089, area: 'Encino' },
    '90041': { lat: 34.1161, lng: -118.1887, area: 'Eagle Rock' }, '90042': { lat: 34.1286, lng: -118.1959, area: 'Highland Park' },
    '90065': { lat: 34.1081, lng: -118.2137, area: 'Glassell Park' }, '90003': { lat: 33.9778, lng: -118.2729, area: 'South LA' },
    '90007': { lat: 34.0256, lng: -118.2850, area: 'South LA' }, '90011': { lat: 34.0075, lng: -118.2581, area: 'South LA' },
    '90037': { lat: 34.0075, lng: -118.2900, area: 'South LA' }, '91101': { lat: 34.1478, lng: -118.1445, area: 'Pasadena' },
    '91103': { lat: 34.1611, lng: -118.1311, area: 'Pasadena' }, '91104': { lat: 34.1611, lng: -118.1311, area: 'Pasadena' },
    '91105': { lat: 34.1611, lng: -118.1311, area: 'Pasadena' }, '91106': { lat: 34.1611, lng: -118.1311, area: 'Pasadena' },
};

export function BrowseContent({ initialBarbers }: BrowseContentProps) {
    const [barbers, setBarbers] = useState<Barbershop[]>(initialBarbers);
    const [searchTerm, setSearchTerm] = useState("");
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [zipSearchActive, setZipSearchActive] = useState(false);
    const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');

    useEffect(() => {
        // Request user location for distance calculation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    // Default to Downtown LA
                    setUserLocation({ lat: 34.0522, lng: -118.2437 });
                },
                { timeout: 10000, enableHighAccuracy: false }
            );
        }
    }, []);

    // Detect zip code in search and update location
    useEffect(() => {
        const trimmed = searchTerm.trim();
        if (/^\d{5}$/.test(trimmed) && LA_ZIP_CODES[trimmed]) {
            // It's a valid LA zip code!
            const zipData = LA_ZIP_CODES[trimmed];
            setUserLocation({ lat: zipData.lat, lng: zipData.lng });
            setZipSearchActive(true);
            setSortBy('distance'); // Auto-switch to distance sort when zip entered
        } else {
            setZipSearchActive(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        // Recalculate distances when user location is available
        if (userLocation && barbers.length > 0) {
            const barbersWithDistance = barbers.map(barber => ({
                ...barber,
                distance: calculateDistance(userLocation.lat, userLocation.lng, barber.lat, barber.lng),
                driveTime: estimateDriveTime(calculateDistance(userLocation.lat, userLocation.lng, barber.lat, barber.lng))
            }));
            setBarbers(barbersWithDistance);
        }
    }, [userLocation]);

    function toggleFilter(filter: string) {
        const neighborhoodFilters = ['venice', 'hollywood'];

        if (neighborhoodFilters.includes(filter)) {
            // Neighborhood filters are mutually exclusive
            if (activeFilters.includes(filter)) {
                // Clicking same neighborhood again = deselect it
                setActiveFilters(prev => prev.filter(f => f !== filter));
            } else {
                // Remove all other neighborhoods and add this one
                setActiveFilters(prev => prev.filter(f => !neighborhoodFilters.includes(f)).concat(filter));
            }
        } else {
            // Regular toggle for non-neighborhood filters (like price)
            setActiveFilters(prev =>
                prev.includes(filter)
                    ? prev.filter(f => f !== filter)
                    : [...prev, filter]
            );
        }
    }

    // Filter barbers
    const filteredBarbers = barbers.filter(barber => {
        // If zip code search is active, don't filter by search term (show all barbers sorted by distance)
        if (!zipSearchActive && searchTerm && !barber.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !barber.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (activeFilters.includes('under-40') && barber.price_range === '$$$') {
            return false;
        }
        if (activeFilters.includes('venice') && !barber.neighborhood?.toLowerCase().includes('venice')) {
            return false;
        }
        if (activeFilters.includes('hollywood') && !barber.neighborhood?.toLowerCase().includes('hollywood')) {
            return false;
        }

        return true;
    });

    // Sort barbers based on selected sort option
    const sortedBarbers = [...filteredBarbers].sort((a, b) => {
        switch (sortBy) {
            case 'distance':
                return (a.distance || 999) - (b.distance || 999);
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'price':
                const priceOrder = { '$': 1, '$$': 2, '$$$': 3 };
                return (priceOrder[a.price_range as keyof typeof priceOrder] || 2) - (priceOrder[b.price_range as keyof typeof priceOrder] || 2);
            default:
                return 0;
        }
    });

    const featuredBarbers = sortedBarbers
        .filter(b => b.rating && b.rating >= 4.5 && b.images && b.images.length > 0 && b.review_count >= 10)
        .slice(0, 2);

    const regularBarbers = sortedBarbers.filter(b => !featuredBarbers.includes(b));

    return (
        <>
            {/* Search and Filters */}
            <div className="border-b-4 border-black py-6 md:py-8 bg-white">
                <div className="container-brutal">
                    <h1 className="text-brutal-h1 mb-4">
                        LA <span className="text-la-orange">BARBERS</span>
                    </h1>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, neighborhood, or zip code..."
                            className="w-full pl-12 pr-4 py-4 border-4 border-black focus:border-la-orange outline-none text-base font-medium uppercase tracking-wide placeholder:normal-case placeholder:text-gray-400"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                        <button
                            onClick={() => toggleFilter('under-40')}
                            className={`inline-flex items-center px-3 py-1.5 border-2 text-sm font-medium uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 hover:scale-105 active:scale-95 ${activeFilters.includes('under-40')
                                ? 'bg-la-orange border-la-orange text-white'
                                : 'bg-white border-black text-black hover:border-la-orange hover:text-la-orange'
                                }`}
                        >
                            UNDER $40
                        </button>

                        <button
                            onClick={() => toggleFilter('venice')}
                            className={`inline-flex items-center px-3 py-1.5 border-2 text-sm font-medium uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 hover:scale-105 active:scale-95 ${activeFilters.includes('venice')
                                ? 'bg-la-orange border-la-orange text-white'
                                : 'bg-white border-black text-black hover:border-la-orange hover:text-la-orange'
                                }`}
                        >
                            VENICE
                        </button>

                        <button
                            onClick={() => toggleFilter('hollywood')}
                            className={`inline-flex items-center px-3 py-1.5 border-2 text-sm font-medium uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex-shrink-0 hover:scale-105 active:scale-95 ${activeFilters.includes('hollywood')
                                ? 'bg-la-orange border-la-orange text-white'
                                : 'bg-white border-black text-black hover:border-la-orange hover:text-la-orange'
                                }`}
                        >
                            HOLLYWOOD
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <section className="py-6 md:py-8">
                <div className="container-brutal">
                    <div className="mb-4 flex justify-between items-center text-sm md:text-base">
                        <p className="font-medium">
                            <span className="font-bold text-lg">{sortedBarbers.length}</span> barbers found
                            {activeFilters.length > 0 && (
                                <span className="ml-2 text-la-orange">({activeFilters.length} filters)</span>
                            )}
                        </p>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'price')}
                            className="border-2 border-black px-3 py-2 font-medium uppercase text-xs cursor-pointer hover:border-la-orange transition-colors"
                        >
                            <option value="distance">📍 Nearest</option>
                            <option value="rating">⭐ Top Rated</option>
                            <option value="price">💰 Price: Low</option>
                        </select>
                    </div>
                    {/* Barber List */}
                    <div className="space-y-4">
                        {/* Featured Barbers */}
                        {featuredBarbers.map((barber) => (
                            <div
                                key={barber.id}
                                className="border-4 border-la-orange bg-white"
                            >
                                <div className="relative">
                                    <div className="absolute top-0 left-0 bg-la-orange text-white px-3 py-1 text-xs font-bold uppercase z-10">
                                        FEATURED
                                    </div>

                                    {barber.images && barber.images.length > 0 && (
                                        <img
                                            src={barber.images[0]}
                                            alt={barber.name}
                                            className="aspect-[3/1] md:aspect-[4/1] w-full object-cover"
                                        />
                                    )}
                                </div>

                                <div className="p-4 md:p-6">
                                    <Link href={`/barbers/${barber.id}`} className="block mb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1 hover:text-la-orange transition-colors">
                                                    {barber.name}
                                                </h2>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {barber.neighborhood || 'Los Angeles'}
                                                    </p>
                                                    {barber.distance && barber.driveTime && (
                                                        <div className="text-sm font-bold text-la-orange flex items-center gap-1">
                                                            {barber.distance < 1
                                                                ? `${(barber.distance * 5280).toFixed(0)}ft`
                                                                : `${barber.distance.toFixed(1)}mi`
                                                            }
                                                            <Car className="w-4 h-4" />
                                                            {barber.driveTime}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {barber.rating && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-5 h-5 fill-black" />
                                                    <span className="font-bold text-lg">{barber.rating.toFixed(1)}</span>
                                                </div>
                                                <span className="text-sm text-gray-600">({barber.review_count} reviews)</span>
                                                <span className="text-sm font-bold">{barber.price_range || '$$'}</span>
                                            </div>
                                        )}
                                    </Link>

                                    <div className="grid grid-cols-3 gap-2">
                                        {barber.phone && (
                                            <a
                                                href={`tel:${barber.phone}`}
                                                onClick={() => trackClickEvent(barber.id, 'phone_call', `tel:${barber.phone}`, barber.name, barber.neighborhood || undefined)}
                                                className="border-2 border-black p-3 text-center font-bold uppercase text-xs md:text-sm flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Call
                                            </a>
                                        )}
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`}
                                            onClick={() => trackClickEvent(barber.id, 'directions_click', `https://www.google.com/maps/dir/?api=1&destination=${barber.lat},${barber.lng}`, barber.name, barber.neighborhood || undefined)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="border-2 border-black p-3 text-center font-bold uppercase text-xs md:text-sm flex flex-col items-center justify-center gap-1 active:bg-black active:text-white transition-colors"
                                        >
                                            <Navigation className="w-4 h-4" />
                                            Go
                                        </a>
                                        <Link
                                            href={`/barbers/${barber.id}`}
                                            className="border-2 border-la-orange bg-la-orange text-white p-3 text-center font-bold uppercase text-xs md:text-sm flex flex-col items-center justify-center gap-1 active:bg-black transition-colors"
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Regular Barbers */}
                        {regularBarbers.map((barber) => (
                            <div
                                key={barber.id}
                                className="border-2 border-black bg-white"
                            >
                                <div className="flex gap-3 md:gap-4 p-3 md:p-4">
                                    {barber.images && barber.images.length > 0 ? (
                                        <img
                                            src={barber.images[0]}
                                            alt={barber.name}
                                            className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 object-cover border-2 border-black"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold border-2 border-black">
                                            {barber.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <Link href={`/barbers/${barber.id}`}>
                                            <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight mb-1 hover:text-la-orange transition-colors">
                                                {barber.name}
                                            </h3>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {barber.neighborhood || 'LA'}
                                                </p>
                                                {barber.distance && barber.driveTime && (
                                                    <div className="text-xs font-bold text-la-orange flex items-center gap-1">
                                                        {barber.distance < 1
                                                            ? `${(barber.distance * 5280).toFixed(0)}ft`
                                                            : `${barber.distance.toFixed(1)}mi`
                                                        }
                                                        <Car className="w-3 h-3" />
                                                        {barber.driveTime}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <Link href={`/barbers/${barber.id}`}>
                                            {barber.rating && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-black" />
                                                        <span className="font-bold">{barber.rating.toFixed(1)}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-600">({barber.review_count})</span>
                                                    <span className="text-xs font-bold">{barber.price_range || '$$'}</span>
                                                </div>
                                            )}
                                        </Link>

                                        <div className="flex gap-2">
                                            {barber.phone && (
                                                <a
                                                    href={`tel:${barber.phone}`}
                                                    onClick={() => trackClickEvent(barber.id, 'phone_call', `tel:${barber.phone}`, barber.name, barber.neighborhood || undefined)}
                                                    className="flex-1 border-2 border-black py-2 text-center font-bold uppercase text-xs active:bg-black active:text-white transition-colors"
                                                >
                                                    Call
                                                </a>
                                            )}
                                            <Link
                                                href={`/barbers/${barber.id}`}
                                                className="flex-1 border-2 border-la-orange bg-la-orange text-white py-2 text-center font-bold uppercase text-xs active:bg-black active:border-black transition-colors"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
