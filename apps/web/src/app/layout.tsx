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
    default: "Mediterana Yachting | Luxury Yacht Charter in the Mediterranean",
    template: "%s | Mediterana Yachting",
  },
  description:
    "Experience the Mediterranean in unparalleled luxury. Mediterana Yachting offers bespoke yacht charters with personalized service, curated itineraries, and access to the finest vessels.",
  keywords: [
    "yacht charter",
    "luxury yacht",
    "Mediterranean cruise",
    "yacht rental",
    "private charter",
    "Greece yacht",
    "Croatia yacht",
    "Italy yacht",
  ],
  authors: [{ name: "Mediterana Yachting" }],
  creator: "Mediterana Yachting",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mediteranayachting.com",
    siteName: "Mediterana Yachting",
    title: "Mediterana Yachting | Luxury Yacht Charter",
    description:
      "Experience the Mediterranean in unparalleled luxury with bespoke yacht charters.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mediterana Yachting - Luxury Yacht Charter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mediterana Yachting | Luxury Yacht Charter",
    description:
      "Experience the Mediterranean in unparalleled luxury with bespoke yacht charters.",
    images: ["/og-image.jpg"],
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
