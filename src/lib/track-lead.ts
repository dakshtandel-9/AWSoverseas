/**
 * Fired from the public lead forms (quote request, product enquiry/order,
 * contact message) when a submit succeeds. Reports the lead to whichever ad
 * platforms are connected at /admin/integrations, and no-ops for the rest:
 *
 * - Google Ads: a conversion, when both conversion ID + label are configured
 *   (TrackingScripts stashes the combined send_to on window.__awsLeadSendTo).
 * - Meta Pixel: the standard "Lead" event.
 * - GA4: the recommended "generate_lead" event.
 */
type TrackingWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  __awsLeadSendTo?: string;
};

export function trackLead() {
  if (typeof window === "undefined") return;
  const w = window as TrackingWindow;
  try {
    if (w.gtag && w.__awsLeadSendTo) {
      w.gtag("event", "conversion", { send_to: w.__awsLeadSendTo });
    }
    if (w.gtag) w.gtag("event", "generate_lead");
    if (w.fbq) w.fbq("track", "Lead");
  } catch {
    // Tracking must never break the form's own success path.
  }
}
