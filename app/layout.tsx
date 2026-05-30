import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/ui/analytics";
import { OrganizationSchema } from "@/components/ui/schema-markup";
import { ConsentBanner } from "@/components/ui/consent-banner";
import "./globals.css";

const cormorant = localFont({
  src: [
    {
      path: "../public/fonts/CormorantGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Curated Experiences | Luxury New Zealand Travel",
    template: "%s | Curated Experiences",
  },
  description:
    "Bespoke luxury travel experiences across New Zealand, crafted by local experts for discerning travellers.",
  metadataBase: new URL("https://curatedexperiences.com"),
  openGraph: {
    title: "Curated Experiences | Luxury New Zealand Travel",
    description:
      "Bespoke luxury travel experiences across New Zealand, crafted by local experts for discerning travellers.",
    type: "website",
    locale: "en_NZ",
    siteName: "Curated Experiences",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Experiences | Luxury New Zealand Travel",
    description:
      "Bespoke luxury travel experiences across New Zealand, crafted by local experts for discerning travellers.",
  },
  alternates: {
    canonical: "https://curatedexperiences.com",
  },
  verification: {
    google: "ChDHBuU2pc4TQTlmQzmIQPpzxWG8mjbk6tZcB1jzM2U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        {children}
        <ConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
