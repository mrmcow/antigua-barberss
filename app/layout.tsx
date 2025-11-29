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
  metadataBase: new URL('https://www.antiguabarbers.com'),
  title: {
    default: "Antigua Barbers — The Island's Best Cuts",
    template: "%s | Antigua Barbers"
  },
  description: "Find the perfect barber in Antigua in minutes. Perfect for cruise passengers, resort guests, and locals. Mobile service available. Cruise-safe guarantee.",
  authors: [{ name: "Antigua Barbers" }],
  creator: "Antigua Barbers",
  publisher: "Antigua Barbers",
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
    url: "https://antiguabarbers.com",
    title: "Antigua Barbers — The Island's Best Cuts",
    description: "Perfect barber matching for Antigua. Cruise passengers, resort guests, and locals. Mobile service available.",
    siteName: "Antigua Barbers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antigua Barbers — The Island's Best Cuts",
    description: "Perfect barber matching for Antigua. Cruise-safe, mobile service, resort-friendly.",
    creator: "@antiguabarbers",
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
    "name": "Antigua Barber Guide",
    "url": "https://antiguabarberguide.com",
    "description": "Find the perfect barber in Antigua & Barbuda. Perfect for cruise passengers, resort guests, and locals.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://antiguabarberguide.com/browse?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Antigua and Barbuda",
      "sameAs": "https://en.wikipedia.org/wiki/Antigua_and_Barbuda"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 17.0608,
        "longitude": -61.7964
      },
      "geoRadius": "25000"
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

