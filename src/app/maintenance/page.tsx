import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/site-settings";
import { MAINTENANCE_HEADER } from "@/lib/maintenance";
import { DryDock } from "@/components/maintenance/dry-dock";

// Never prerendered: a static build would bake in whichever state the switch
// was in at build time. This page is only ever served during maintenance, so
// rendering it per request costs nothing that matters.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Down for maintenance",
  // While maintenance is on, `proxy.ts` serves this page for every public URL,
  // so it must not be indexed under any of them.
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const [settings, headerList] = await Promise.all([getSiteSettings(), headers()]);

  // A direct visit while the site is live is a dead end — send them home. Only
  // for direct visits: when the proxy rewrote the request it has already
  // decided maintenance is on, and redirecting would bounce against it.
  if (!settings.maintenanceMode && headerList.get(MAINTENANCE_HEADER) !== "1") {
    redirect("/");
  }

  return (
    <DryDock
      phone={settings.phones[0]}
      email={settings.emails[0]}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
