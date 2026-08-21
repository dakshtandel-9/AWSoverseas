import Link from "next/link";
import { Plus } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { CategoryListGrid } from "@/components/admin/category-list-grid";
import { listAdminCategories, type AdminCategoryRow } from "@/lib/admin-category-tree";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminCategoriesPage() {
  const configured = isSupabaseConfigured();
  const categories: AdminCategoryRow[] = configured ? await listAdminCategories(null) : [];

  return (
    <div>
      <AdminPageHeader
        href="/admin/categories"
        action={
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <Plus className="size-4" />
            New category
          </Link>
        }
      />

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
