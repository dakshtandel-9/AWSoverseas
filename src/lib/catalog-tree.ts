import { getActiveCategories, type PublicCategory } from "@/lib/category-data";
import { getActiveProducts, type PublicProduct } from "@/lib/product-data";

/**
 * A subcategory together with what it holds, so the category page can open a
 * row in place instead of sending people to another page. Branch-or-leaf is
 * enforced in the DB, so exactly one of `children` / `products` is ever filled.
 */
export type CategoryBranch = PublicCategory & {
  children: CategoryBranch[];
  products: PublicProduct[];
};

/** Guards against a malformed parent chain; real trees are two or three deep. */
const MAX_DEPTH = 6;

/** Everything filed under `parentId`, one level down, with its subtree attached. */
export async function getCategoryBranches(parentId: string): Promise<CategoryBranch[]> {
  const [categories, products] = await Promise.all([getActiveCategories(), getActiveProducts()]);

  const childrenOf = new Map<string, PublicCategory[]>();
  for (const category of categories) {
    if (!category.parent_id) continue;
    const siblings = childrenOf.get(category.parent_id) ?? [];
    siblings.push(category);
    childrenOf.set(category.parent_id, siblings);
  }

  const productsOf = new Map<string, PublicProduct[]>();
  for (const product of products) {
    if (!product.category_id) continue;
    const listed = productsOf.get(product.category_id) ?? [];
    listed.push(product);
    productsOf.set(product.category_id, listed);
  }

  function build(category: PublicCategory, depth: number): CategoryBranch {
    return {
      ...category,
      children:
        depth >= MAX_DEPTH ? [] : (childrenOf.get(category.id) ?? []).map((c) => build(c, depth + 1)),
      products: productsOf.get(category.id) ?? [],
    };
  }

  return (childrenOf.get(parentId) ?? []).map((c) => build(c, 1));
}
