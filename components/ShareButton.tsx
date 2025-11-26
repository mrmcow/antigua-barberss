'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
    title: string;
    description: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title,
                text: description,
                url: window.location.href,
            }).catch((error) => console.log('Error sharing:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold hover:text-la-orange transition-colors cursor-pointer"
        >
            <Share2 className="w-4 h-4" />
            Share Article
        </button>
    );
}
