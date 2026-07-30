import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type { PublicCategory } from "@/lib/category-data";

/** A description typed as several paragraphs still renders as several. */
function paragraphsOf(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Whether there is anything to say. A category saved without a description
 * would otherwise render a heading beside an empty column, so callers use this
 * to leave the block out entirely.
 */
export function hasAboutContent(category: PublicCategory): boolean {
  return paragraphsOf(category.description).length > 0;
}

/**
 * The "About <product>" block: a name pill, a centred heading, then the
 * description on one side and the photo on the other. Consecutive blocks on the
 * same page flip `imageSide`, so a category page listing several products reads
 * as an alternating column rather than a stack of identical rows.
 *
 * Bare on purpose — the caller owns the surrounding <Section>, so the block can
 * sit alone or directly above a product grid without doubling up on padding.
 */
export function CategoryAbout({
  category,
  imageSide = "right",
  headingPrefix = "About",
}: {
  category: PublicCategory;
  imageSide?: "left" | "right";
  headingPrefix?: string;
}) {
  const paragraphs = paragraphsOf(category.description);
  if (paragraphs.length === 0) return null;

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <Reveal direction="up">
          <Badge>{category.name}</Badge>
        </Reveal>
        <Reveal direction="up" delay={0.05}>
          <h2 className="text-balance text-3xl font-bold text-ink sm:text-4xl lg:text-[2.75rem]">
            {headingPrefix} {category.name}
          </h2>
        </Reveal>
      </div>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Order classes belong on the Reveal itself — it is the grid child. */}
        <Reveal
          direction="up"
          delay={0.1}
          className={cn("flex flex-col gap-5", imageSide === "left" ? "lg:order-2" : "lg:order-1")}
        >
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="text-pretty text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal
          direction="up"
          delay={0.15}
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#eef3fb] shadow-[0_18px_40px_-24px_rgba(1,33,74,0.45)]",
            imageSide === "left" ? "lg:order-1" : "lg:order-2",
          )}
        >
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
              <ImageOff className="size-8" />
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
