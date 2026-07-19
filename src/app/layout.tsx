import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/layout/page-loader";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { home } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://awsoverseas.com"),
  title: {
    default: home.meta?.title ?? "AWSOverseas | Global Shipping Beyond Borders",
    template: "%s | AWSOverseas",
  },
  description: home.meta?.description,
  keywords: home.meta?.keywords,
  openGraph: {
    type: "website",
    siteName: "AWSOverseas",
    title: home.meta?.title,
    description: home.meta?.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#000c1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-surface text-ink antialiased" suppressHydrationWarning>
        <PageLoader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <ChromeGate navbar={<Navbar />} footer={<Footer />}>
          <main id="main">{children}</main>
        </ChromeGate>
      </body>
    </html>
  );
}
