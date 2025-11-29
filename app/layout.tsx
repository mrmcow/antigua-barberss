import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Header } from "@/components/Header";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

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
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://antiguabarbers.com",
    title: "Antigua Barbers — The Island's Best Cuts",
    description: "Perfect barber matching for Antigua. Cruise passengers, resort guests, and locals. Mobile service available.",
    siteName: "Antigua Barbers",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`} suppressHydrationWarning>
      <GoogleAnalytics gaId="G-2DKFFV7DQS" />
      <body className="font-sans antialiased bg-[#FAFAFA] text-black min-h-screen flex flex-col" suppressHydrationWarning>
        <ScrollToTop />
        <Header />
        <div className="flex-1">
           {children}
        </div>
      </body>
    </html>
  );
}