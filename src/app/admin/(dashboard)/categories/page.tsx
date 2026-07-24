import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { CategoryListGrid } from "@/components/admin/category-list-grid";

export default async function AdminCategoriesPage() {
  const configured = isSupabaseConfigured();

  let categories: {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    is_active: boolean;
    sort_order: number;
    productCount: number;
  }[] = [];

  if (configured) {
    const db = supabaseAdmin();
    const [{ data: categoryRows }, { data: productRows }] = await Promise.all([
      db
        .from("categories")
        .select("id, name, slug, image_url, is_active, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      db.from("products").select("category_id"),
    ]);

    const counts = new Map<string, number>();
    for (const row of productRows ?? []) {
      if (!row.category_id) continue;
      counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
    }

    categories = (categoryRows ?? []).map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 }));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
          <h1 className="mt-2 text-2xl font-bold text-[#002144] sm:text-3xl">Categories</h1>
          <p className="mt-2 text-sm text-[#5b6b82]">Shown as the grid on the public Products page. Each category has its own detail page listing its products.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="size-4" />
          New category
        </Link>
      </div>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8">
        <CategoryListGrid categories={categories} />
      </div>
    </div>
  );
}
