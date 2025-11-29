'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface LinkedBlogContentProps {
    content: string;
    barberMap: Record<string, string>;
}

export function LinkedBlogContent({ content, barberMap }: LinkedBlogContentProps) {
    
    // Basic auto-linking of barber names
    // We do this carefully to avoid breaking existing markdown links
    let processedContent = content;
    
    if (barberMap && Object.keys(barberMap).length > 0) {
        Object.entries(barberMap).forEach(([name, id]) => {
            // Match the name if it's NOT inside a link structure (roughly)
            // This regex looks for the name not preceded by '[' and not followed by ']'
            // It's not perfect but covers 90% of cases in simple blog text
            try {
                const regex = new RegExp(`(?<!\\[|\\/|\\w)${name}(?!\\]|\\w)`, 'g');
                processedContent = processedContent.replace(regex, `[${name}](/barbers/${id})`);
            } catch (e) {
                // Ignore regex errors for special characters in names
            }
        });
    }

    return (
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
                a: ({ node, href, children, ...props }) => {
                    if (href?.startsWith('/')) {
                        return (
                            <Link href={href} {...props} className="text-[#0072C6] hover:underline font-medium">
                                {children}
                            </Link>
                        );
                    }
                    return (
                        <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#0072C6] hover:underline font-medium"
                            {...props}
                        >
                            {children}
                        </a>
                    );
                },
                // Style other elements just in case prose is missing something
                h2: ({node, children, ...props}) => <h2 className="text-3xl font-black uppercase tracking-tight mt-8 mb-4" {...props}>{children}</h2>,
                h3: ({node, children, ...props}) => <h3 className="text-xl font-bold uppercase tracking-wider mt-6 mb-3" {...props}>{children}</h3>,
                ul: ({node, children, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-6" {...props}>{children}</ul>,
                li: ({node, children, ...props}) => <li className="text-gray-700" {...props}>{children}</li>,
                p: ({node, children, ...props}) => <p className="mb-6 leading-relaxed text-gray-700" {...props}>{children}</p>,
                strong: ({node, children, ...props}) => <strong className="font-bold text-black" {...props}>{children}</strong>,
            }}
        >
            {processedContent}
        </ReactMarkdown>
    );
}
