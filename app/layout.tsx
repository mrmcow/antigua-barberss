import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

// Deployment trigger #3 - Force deploy now!

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
  title: "LA Barber Guide — Find Your Barber in 30 Seconds", // With proper author
  description: "The fastest, smartest way to find the right barber in Los Angeles. Filter by hair type, style, neighborhood, and vibe.",
  keywords: "LA barbers, Los Angeles barbershops, fade barbers LA, curly hair barbers, best barbers LA",
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="font-sans antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}

