import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { AdminNav, AdminMobileNav } from "@/components/admin/admin-nav";
import { EmailTemplateButton } from "@/components/admin/email-template-button";
import { getAdminCounts } from "@/lib/admin-counts";
import { getSiteSettings } from "@/lib/site-settings";

// The panel is a live control room, and the sidebar badges are counts — a
// statically cached admin page would show numbers baked at build time. Set on
// the layout so it covers every page beneath it.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin | AWS OVERSEAS impex", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Fetched here rather than per-page so the sidebar badges are correct on every
  // screen, not just the dashboard. Settings come along for the ride: the
  // template button pastes the same signature card /admin/email sends, and it
  // reads the office phone and address from the same place.
  const [counts, settings] = await Promise.all([getAdminCounts(), getSiteSettings()]);
  const templateDetails = {
    phone: settings.phones.find(Boolean) ?? "",
    address: settings.address,
    email: settings.emails.find(Boolean) ?? "",
  };

  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <aside className="sticky top-0 hidden h-screen w-[16.5rem] shrink-0 flex-col border-r border-[#e4e9f2] bg-white lg:flex">
        <div className="px-5 pb-4 pt-6">
          <Logo className="px-1" />
          <p className="mt-1 px-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
            Admin panel
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          <AdminNav counts={counts} />
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e4e9f2] bg-white px-4 py-3 lg:hidden">
          <AdminMobileNav counts={counts} />
          <Logo imageClassName="h-10" />
          <div className="ml-auto">
            <EmailTemplateButton details={templateDetails} compact />
          </div>
        </header>
        <header className="sticky top-0 z-30 hidden items-center justify-end border-b border-[#e4e9f2] bg-white px-5 py-3 lg:flex lg:px-10">
          <EmailTemplateButton details={templateDetails} />
        </header>
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
