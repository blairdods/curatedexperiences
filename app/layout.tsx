import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@/components/ui/analytics";
import { OrganizationSchema } from "@/components/ui/schema-markup";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
