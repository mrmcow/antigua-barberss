'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LinkedBlogContentProps {
    content: string;
    barberMap: Record<string, string>;
}

export function LinkedBlogContent({ content, barberMap }: LinkedBlogContentProps) {
    // TEMPORARILY DISABLED - causing hot reload issues
    // Will re-enable once we fix the underlying barber route problem

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
    );
}
