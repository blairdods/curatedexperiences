import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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
  title: "Curated Experiences | Luxury New Zealand Travel",
  description:
    "Bespoke luxury travel experiences across New Zealand, crafted by local experts for discerning travellers.",
  openGraph: {
    title: "Curated Experiences | Luxury New Zealand Travel",
    description:
      "Bespoke luxury travel experiences across New Zealand, crafted by local experts for discerning travellers.",
    type: "website",
    locale: "en_NZ",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
