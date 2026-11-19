import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { preloadScript } from "@/lib/motion/preload";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — Gestion de projet, R&D industrielle, formation PMP®`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.fullName,
    url: "/",
    title: `${site.fullName} — Gestion de projets industriels`,
    description: site.description,
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Yao AVEVOR, Ph.D, PMP®" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} — Gestion de projets industriels`,
    description: site.description,
    images: ["/opengraph-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
