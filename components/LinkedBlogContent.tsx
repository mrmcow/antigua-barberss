'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface LinkedBlogContentProps {
    content: string;
    barberMap: Record<string, string>;
}

export function LinkedBlogContent({ content, barberMap }: LinkedBlogContentProps) {
    
    // Basic auto-linking of barber names
    let processedContent = content;
    
    if (barberMap && Object.keys(barberMap).length > 0) {
        Object.entries(barberMap).forEach(([name, id]) => {
            try {
                const regex = new RegExp(`(?<!\\[|\\/|\\w)${name}(?!\\]|\\w)`, 'g');
                processedContent = processedContent.replace(regex, `[${name}](/barbers/${id})`);
            } catch (e) {
                // Ignore regex errors
            }
        });
    }

    return (
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
                a: ({ node, href, children, ...props }) => {
                    // Handle profile links (e.g., "View Profile & Booking Info") as buttons
                    if (href?.startsWith('/barbers/') && String(children).includes('View Profile')) {
                        return (
                            <Link 
                                href={href} 
                                className="inline-flex items-center gap-2 bg-[#CE1126] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#b00e20] transition-all shadow-md hover:shadow-lg no-underline my-4"
                            >
                                {children} <ExternalLink className="w-3 h-3" />
                            </Link>
                        );
                    }

                    if (href?.startsWith('/')) {
                        return (
                            <Link href={href} {...props} className="text-[#0072C6] hover:underline font-bold decoration-2 underline-offset-2">
                                {children}
                            </Link>
                        );
                    }
                    return (
                        <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#0072C6] hover:underline font-bold decoration-2 underline-offset-2"
                            {...props}
                        >
                            {children}
                        </a>
                    );
                },
                h2: ({node, children, ...props}) => <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mt-12 mb-6 pb-4 border-b border-black/5" {...props}>{children}</h2>,
                h3: ({node, children, ...props}) => <h3 className="text-2xl font-black uppercase tracking-tight mt-10 mb-4 text-[#1a1a1a]" {...props}>{children}</h3>,
                ul: ({node, children, ...props}) => <ul className="list-disc pl-5 space-y-3 mb-8 marker:text-[#CE1126]" {...props}>{children}</ul>,
                li: ({node, children, ...props}) => <li className="text-gray-800 text-lg leading-relaxed pl-2" {...props}>{children}</li>,
                p: ({node, children, ...props}) => <p className="mb-6 text-lg leading-relaxed text-gray-600 font-medium" {...props}>{children}</p>,
                strong: ({node, children, ...props}) => <strong className="font-black text-black" {...props}>{children}</strong>,
                blockquote: ({node, children, ...props}) => <blockquote className="border-l-4 border-[#FCD116] pl-6 py-2 my-8 italic text-xl text-gray-800 bg-gray-50 rounded-r-lg" {...props}>{children}</blockquote>,
            }}
        >
            {processedContent}
        </ReactMarkdown>
    );
}
