import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: "Admin | aws overseas", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f6f8fc]">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[#e4e9f2] bg-white px-5 py-6 lg:flex lg:flex-col">
        <Logo className="px-1" />
        <p className="mt-1 px-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
          Admin Panel
        </p>
        <div className="mt-8 flex-1">
          <AdminNav />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#e4e9f2] bg-white px-5 py-4 lg:hidden">
          <Logo className="h-9" />
        </header>
        <div className="border-b border-[#e4e9f2] bg-white px-5 py-3 lg:hidden">
          <AdminNav />
        </div>
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
