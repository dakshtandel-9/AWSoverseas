import Link from "next/link";
import { Plus } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { CategoryListGrid } from "@/components/admin/category-list-grid";
import { listAdminCategories, type AdminCategoryRow } from "@/lib/admin-category-tree";

export default async function AdminCategoriesPage() {
  const configured = isSupabaseConfigured();
  const categories: AdminCategoryRow[] = configured ? await listAdminCategories(null) : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
          <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Categories</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
            Shown as the grid on the public Products page, and as the Products dropdown in the site
            header. Open one to add products to it, or to nest subcategories under it.
          </p>
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
