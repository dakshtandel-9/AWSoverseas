import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FolderTree, Package, Pencil, Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { CategoryListGrid } from "@/components/admin/category-list-grid";
import { ProductListGrid } from "@/components/admin/product-list-grid";
import { getAdminCategory, getAdminTrail, listAdminCategories } from "@/lib/admin-category-tree";

export default async function AdminCategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1A0A53] sm:text-3xl">Category</h1>
        <div className="mt-6">
          <SetupNotice />
        </div>
      </div>
    );
  }

  const category = await getAdminCategory(id);
  if (!category) notFound();

  const db = supabaseAdmin();
  const [subcategories, trail, { data: productRows }] = await Promise.all([
    listAdminCategories(id),
    getAdminTrail(id),
    db
      .from("products")
      .select("id, name, image_url, is_active, sort_order")
      .eq("category_id", id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const products = (productRows ?? []).map((p) => ({
    ...p,
    categoryName: category.name,
    categorySlug: category.slug,
  }));

  // A category holds subcategories or products, never both — the database
  // enforces it. Nesting goes as deep as you like, so what this page shows is
  // decided by what the category actually contains, not by how far down it sits.
  const holdsSubcategories = subcategories.length > 0;
  const holdsProducts = products.length > 0;
  const isEmpty = !holdsSubcategories && !holdsProducts;
  const noun = trail.length > 1 ? "subcategory" : "category";

  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-[#5b6b82]">
        <Link href="/admin/categories" className="hover:text-maroon-admin">
          Categories
        </Link>
        {trail.map((step, i) => (
          <span key={step.id} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-[#94a3b8]" />
            {i === trail.length - 1 ? (
              <span className="font-semibold text-[#1A0A53]">{step.name}</span>
            ) : (
              <Link href={`/admin/categories/${step.id}`} className="hover:text-maroon-admin">
                {step.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A0A53] sm:text-3xl">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
            {holdsSubcategories
              ? "Holds subcategories. Open one to keep going down, or add another beside it — nesting can go as deep as you need."
              : holdsProducts
                ? "Holds products. These are the individual items customers enquire on, shown as a grid on this category's page."
                : "Empty so far. Fill it with products for people to enquire on, or with subcategories if it needs another level under it."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] px-5 py-2.5 text-sm font-semibold text-[#1A0A53] transition-colors hover:bg-[#f6f8fc]"
          >
            <Pencil className="size-4" />
            Edit {noun}
          </Link>

          {/* An empty category can go either way, so it gets both buttons. Once
              it holds one kind, only that kind can be added — matching the
              branch-or-leaf rule the database enforces. */}
          {!holdsProducts && (
            <Link
              href={`/admin/categories/new?parent=${category.id}`}
              className={
                holdsSubcategories
                  ? "inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
                  : "inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] px-5 py-2.5 text-sm font-semibold text-[#1A0A53] transition-colors hover:bg-[#f6f8fc]"
              }
            >
              <Plus className="size-4" />
              New subcategory
            </Link>
          )}

          {!holdsSubcategories && (
            <Link
              href={`/admin/products/new?category=${category.id}`}
              className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="size-4" />
              New product
            </Link>
          )}
        </div>
      </div>

      {isEmpty && (
        <p className="mt-6 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-4 text-sm text-[#5b6b82]">
          Nothing in here yet, so its page on the site is empty. Adding a product or a subcategory fixes
          that — whichever you pick first is what this category holds from then on.
        </p>
      )}

      {holdsSubcategories && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#1A0A53]">
            <FolderTree className="size-4" />
            Subcategories
          </h2>
          <div className="mt-5">
            <CategoryListGrid categories={subcategories} />
          </div>
        </section>
      )}

      {holdsProducts && (
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#1A0A53]">
            <Package className="size-4" />
            Products
          </h2>
          <div className="mt-5">
            <ProductListGrid products={products} />
          </div>
        </section>
      )}
    </div>
  );
}
