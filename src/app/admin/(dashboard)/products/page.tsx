import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { ProductsCatalog } from "@/components/admin/products-catalog";
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
      {!configured && (
        <div className="mb-6">
          <SetupNotice />
        </div>
      )}

      <ProductsCatalog unfiled={unfiled} filed={filed} />
    </div>
  );
}
