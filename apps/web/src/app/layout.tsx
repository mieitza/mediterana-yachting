import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.mediteranayachting.com"),
  title: {
    default: "Mediterranean Yacht Charter | Luxury Sailing & Motor Yachts | Mediterana Yachting",
    template: "%s | Mediterana Yachting",
  },
  description:
    "Charter luxury yachts across the Mediterranean. Private sailing & motor yacht charters in Greece, Croatia, French Riviera & Amalfi Coast. Expert crew, bespoke itineraries. Enquire today!",
  keywords: [
    "mediterranean yacht charter",
    "mediterranean sailing",
    "luxury yacht charter",
    "yacht charter mediterranean",
    "sailing charter",
    "motor yacht charter",
    "greek islands yacht charter",
    "amalfi coast yacht charter",
    "french riviera yacht rental",
    "croatia yacht charter",
    "yacht rental mediterranean",
    "luxury sailing vacation",
    "charter yacht",
    "mediterranean cruise",
    "private yacht charter",
    "catamaran charter",
    "crewed yacht charter",
    "bareboat charter mediterranean",
  ],
  authors: [{ name: "Mediterana Yachting" }],
  creator: "Mediterana Yachting",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mediteranayachting.com",
    siteName: "Mediterana Yachting",
    title: "Mediterranean Yacht Charter | Luxury Sailing & Motor Yachts",
    description:
      "Charter luxury yachts across the Mediterranean. Private sailing & motor yacht charters in Greece, Croatia, French Riviera & Amalfi Coast with expert crew.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mediterana Yachting - Luxury Mediterranean Yacht Charter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mediterranean Yacht Charter | Luxury Sailing & Motor Yachts",
    description:
      "Charter luxury yachts across the Mediterranean. Private sailing & motor yacht charters in Greece, Croatia, French Riviera & Amalfi Coast.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://www.mediteranayachting.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
