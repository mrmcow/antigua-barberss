'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
    title: string;
    description: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title,
            text: description,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.log('Error sharing:', error);
                }
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy:', error);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 hover:bg-black/5 transition-all text-xs uppercase tracking-widest font-bold text-gray-600 hover:text-black"
        >
            <Share2 className="w-3 h-3" />
            Share
        </button>
    );
}
