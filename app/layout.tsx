import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

// AUTO-DEPLOY TRIGGER #7 - Push to trigger GitHub auto-deployment!

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.labarberguide.xyz'),
  title: {
    default: "LA Barber Guide — Find Your Perfect Barber in Los Angeles",
    template: "%s | LA Barber Guide"
  },
  description: "Find the perfect barber in Los Angeles in 30 seconds. Smart matching by hair type, style & neighborhood. 500+ verified barbers across LA. Perfect for tourists and locals.",
  authors: [{ name: "LA Barber Guide" }],
  creator: "LA Barber Guide",
  publisher: "LA Barber Guide",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://labarberguide.xyz",
    title: "LA Barber Guide — Find Your Perfect Barber in Los Angeles",
    description: "Smart barber matching for Los Angeles. Find barbers by hair type, style & neighborhood. 500+ verified shops.",
    siteName: "LA Barber Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "LA Barber Guide — Find Your Perfect Barber in LA",
    description: "Smart barber matching for Los Angeles. 500+ verified barbershops.",
    creator: "@labarberguide",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "PLACEHOLDER-ADD-REAL-GSC-CODE", // TODO: Register at search.google.com/search-console and add real verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LA Barber Guide",
    "url": "https://labarberguide.xyz",
    "description": "Find the perfect barber in Los Angeles. Smart matching by hair type, style & neighborhood.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://labarberguide.xyz/browse?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "areaServed": {
      "@type": "City",
      "name": "Los Angeles",
      "sameAs": "https://en.wikipedia.org/wiki/Los_Angeles"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "geoRadius": "50000"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <GoogleAnalytics gaId="G-2DKFFV7DQS" />
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}

