import Image from "next/image";
import { iconFor } from "@/lib/icons";
import { cn } from "@/lib/cn";

/**
 * Renders a post's real uploaded cover image when one exists (admin-uploaded
 * via Cloudinary). Falls back to generated art — a large icon over a
 * category-tinted gradient — for posts that don't have a cover image yet,
 * rather than a broken <Image> or a generic stock-photo placeholder.
 */
const PALETTE: Record<string, [string, string]> = {
  "Air Freight": ["#01214a", "#d72846"],
  "Sea Freight": ["#011938", "#023f8d"],
  Customs: ["#6c1423", "#8e1b2e"],
  "Import & Export": ["#000c1a", "#01214a"],
  Warehousing: ["#01214a", "#6c1423"],
  Shipping: ["#011938", "#d72846"],
};

function paletteFor(category: string): [string, string] {
  return PALETTE[category] ?? ["#01214a", "#d72846"];
}

export function CategoryArt({
  category,
  imageUrl,
  className,
}: {
  category: string;
  imageUrl?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={imageUrl} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    );
  }

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
