import Link from "next/link";
import { Plus, TriangleAlert } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { ProductListGrid } from "@/components/admin/product-list-grid";
import { getCategoryPaths } from "@/lib/admin-category-tree";

type AdminProduct = {
  id: string;
  name: string;
  category_id: string | null;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  categoryName: string;
  categorySlug?: string;
};

export default async function AdminProductsPage() {
  const configured = isSupabaseConfigured();

  let products: AdminProduct[] = [];

  if (configured) {
    const db = supabaseAdmin();
    const [{ data: productRows }, paths] = await Promise.all([
      db
        .from("products")
        .select("id, name, category_id, image_url, is_active, sort_order, created_at")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      getCategoryPaths(),
    ]);

    products = (productRows ?? []).map((p) => {
      const meta = p.category_id ? paths.get(p.category_id) : undefined;
      return { ...p, categoryName: meta?.path ?? "", categorySlug: meta?.slug };
    });
  }

  // A product with no category is on no page at all, so it's the one thing on
  // this screen that needs acting on — put those first.
  const unfiled = products.filter((p) => !p.categoryName);
  const filed = products.filter((p) => p.categoryName);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
          <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Products</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
            Every item across every category. Each one shows on its category&apos;s page, where visitors
            send an enquiry — no pricing is displayed.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
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

      {unfiled.length > 0 && (
        <section className="mt-8">
          <div className="flex items-start gap-3 rounded-2xl border border-[#fcd9a4] bg-[#fffbf3] px-5 py-4">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-[#b45309]" />
            <div>
              <h2 className="text-sm font-bold text-[#1A0A53]">
                {unfiled.length} {unfiled.length === 1 ? "product isn't" : "products aren't"} filed in a
                category
              </h2>
              <p className="mt-1 text-sm text-[#5b6b82]">
                Nothing links to them, so they appear nowhere on the site. Edit each one and pick the
                category it belongs in.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ProductListGrid products={unfiled} />
          </div>
        </section>
      )}

      <div className="mt-8">
        {unfiled.length > 0 && (
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[#1A0A53]">
            Filed products
          </h2>
        )}
        <ProductListGrid products={filed} />
      </div>
    </div>
  );
}
