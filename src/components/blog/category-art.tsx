import { iconFor } from "@/lib/icons";
import { cn } from "@/lib/cn";

/**
 * No real blog images exist in public/ (blogGrid.posts[].image paths point at
 * files that were never added), so article art is generated from the post's
 * category — a large icon over a category-tinted gradient — instead of a
 * broken <Image> or a generic stock-photo placeholder.
 */
const PALETTE: Record<string, [string, string]> = {
  "Air Freight": ["#033e8d", "#0fade8"],
  "Sea Freight": ["#052f69", "#1351a8"],
  Customs: ["#0d5a80", "#0489c2"],
  "Import & Export": ["#04162f", "#033e8d"],
  Warehousing: ["#06234d", "#0d5a80"],
  Logistics: ["#052f69", "#0fade8"],
};

function paletteFor(category: string): [string, string] {
  return PALETTE[category] ?? ["#033e8d", "#0fade8"];
}

export function CategoryArt({ category, className }: { category: string; className?: string }) {
  const Icon = iconFor(category);
  const [from, to] = paletteFor(category);

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <Icon className="relative size-12 text-white/85 sm:size-14" strokeWidth={1.5} />
    </div>
  );
}
