import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { ProductListGrid } from "@/components/admin/product-list-grid";

export default async function AdminProductsPage() {
  const configured = isSupabaseConfigured();
  const products = configured
    ? (
        await supabaseAdmin()
          .from("products")
          .select("id, name, category, image_url, is_active, sort_order, created_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
          <h1 className="mt-2 text-2xl font-bold text-[#01214a] sm:text-3xl">Products</h1>
          <p className="mt-2 text-sm text-[#5b6b82]">Shown on the public Products page. No pricing is displayed — visitors submit an enquiry instead.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#01214a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#011938]"
        >
          <Plus className="size-4" />
          New product
        </Link>
      </div>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8">
        <ProductListGrid products={products} />
      </div>
    </div>
  );
}
