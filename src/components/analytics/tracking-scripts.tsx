"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import type { MarketingIntegrations } from "@/lib/marketing-integrations";

/**
 * Injects every connected tracking service (GA4, GTM, Clarity, Meta Pixel,
 * Google Ads) into public pages. Values arrive pre-validated by
 * getMarketingIntegrations — anything that didn't match its service's ID
 * format was dropped server-side, so interpolating into inline scripts is safe.
 *
 * Skipped on /admin so the owner's own dashboard visits don't pollute the
 * stats or ad audiences (same pathname gate as ChromeGate).
 */
export function TrackingScripts({ integrations }: { integrations: MarketingIntegrations }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const {
    ga4MeasurementId,
    gtmContainerId,
    clarityProjectId,
    metaPixelId,
    googleAdsId,
    googleAdsConversionLabel,
  } = integrations;

  // GA4 and Google Ads both ride the same gtag.js — load it once, config both.
  const gtagId = ga4MeasurementId || googleAdsId;
  const leadSendTo =
    googleAdsId && googleAdsConversionLabel ? `${googleAdsId}/${googleAdsConversionLabel}` : "";

  return (
    <>
      {gtmContainerId && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmContainerId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {gtagId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${ga4MeasurementId ? `gtag('config', '${ga4MeasurementId}');` : ""}
${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
${leadSendTo ? `window.__awsLeadSendTo = '${leadSendTo}';` : ""}`}
          </Script>
        </>
      )}

      {clarityProjectId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityProjectId}");`}
        </Script>
      )}

      {metaPixelId && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
