import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageLoader } from "@/components/layout/page-loader";
import { LanguageLoader } from "@/components/layout/language-loader";
import { TranslatePrompt } from "@/components/layout/translate-prompt";
import { ChromeGate } from "@/components/layout/chrome-gate";
import { LanguageProvider } from "@/lib/language/language-context";
import { home } from "@/lib/content";
import { SITE_URL, OG_IMAGE } from "@/lib/site-url";
import { getSiteSettings } from "@/lib/site-settings";
import { getMarketingIntegrations } from "@/lib/marketing-integrations";
import { getCategoryTree } from "@/lib/category-data";
import { TrackingScripts } from "@/components/analytics/tracking-scripts";

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

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  // Search Console / Bing site-verification tokens are admin-entered at
  // /admin/integrations, so the meta tags have to come from the DB.
  const integrations = await getMarketingIntegrations();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: home.meta?.title ?? "AWS OVERSEAS impex | Global Shipping Beyond Borders",
      template: "%s | AWS OVERSEAS impex",
    },
    description: home.meta?.description,
    keywords: home.meta?.keywords,
    openGraph: {
      type: "website",
      siteName: "AWS OVERSEAS impex",
      url: SITE_URL,
      title: home.meta?.title,
      description: home.meta?.description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", images: [OG_IMAGE] },
    verification: {
      ...(integrations.googleSiteVerification
        ? { google: integrations.googleSiteVerification }
        : {}),
      ...(integrations.bingSiteVerification
        ? { other: { "msvalidate.01": integrations.bingSiteVerification } }
        : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000c1a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, integrations, categoryTree] = await Promise.all([
    getSiteSettings(),
    getMarketingIntegrations(),
    getCategoryTree(),
  ]);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style
          // Runtime color override — the only per-request source of truth for --btn-*/--text-maroon.
          dangerouslySetInnerHTML={{
            __html: `:root{--btn-navy:${settings.btnNavy};--btn-navy-hover:${settings.btnNavyHover};--btn-maroon:${settings.btnMaroon};--btn-maroon-hover:${settings.btnMaroonHover};--text-maroon:${settings.textMaroon};}`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-surface text-ink antialiased" suppressHydrationWarning>
        <TrackingScripts integrations={integrations} />
        <LanguageProvider>
          <PageLoader />
          <LanguageLoader />
          {/* Positioned to sit below the navbar, which maintenance mode removes —
              so it would land on top of the maintenance page's own header. */}
          {!settings.maintenanceMode && <TranslatePrompt />}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <ChromeGate
            navbar={<Navbar categoryTree={categoryTree} />}
            footer={<Footer />}
            maintenance={settings.maintenanceMode}
          >
            <main id="main">{children}</main>
          </ChromeGate>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
