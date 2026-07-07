import { ProductForm } from "@/components/admin/product-form";

export default function AdminNewProductPage() {
  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Catalog</p>
      <h1 className="mt-2 text-2xl font-bold text-[#06234d] sm:text-3xl">New product</h1>
      <ProductForm />
    </div>
  );
}
