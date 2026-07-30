import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import type { PublicCategory } from "@/lib/category-data";

/** Paragraphs are authored as one textarea, split on blank lines. */
function paragraphsOf(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * The "About Our <category>" block: centred badge and heading, then prose on
 * one side and a captioned photo on the other. Consecutive blocks on the same
 * page flip `imageSide`, so a page listing several categories reads as an
 * alternating column rather than a stack of identical rows.
 *
 * Bare on purpose — the caller owns the surrounding <Section>, so the block can
 * sit alone or directly above a product grid without doubling up on padding.
 */
export function CategoryAbout({
  category,
  imageSide = "right",
  headingPrefix = "About Our",
}: {
  category: PublicCategory;
  imageSide?: "left" | "right";
  headingPrefix?: string;
}) {
  const paragraphs = paragraphsOf(category.about_body);
  const image = category.about_image_url || category.image_url;

  return (
    <div>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        {category.badge && (
          <Reveal direction="up">
            <Badge>{category.badge}</Badge>
          </Reveal>
        )}
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
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, i) => (
              <p key={i} className="text-pretty text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-pretty text-base leading-relaxed text-muted">
              {category.description}
            </p>
          )}
        </Reveal>

        <Reveal
          direction="up"
          delay={0.15}
          className={cn(
            "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#eef3fb] shadow-[0_18px_40px_-24px_rgba(1,33,74,0.45)]",
            imageSide === "left" ? "lg:order-1" : "lg:order-2",
          )}
        >
          {image ? (
            <Image
              src={image}
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

          {category.about_caption && (
            <>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
                aria-hidden
              />
              <p className="absolute bottom-5 start-6 text-lg font-bold text-white drop-shadow-sm">
                {category.about_caption}
              </p>
            </>
          )}
        </Reveal>
      </div>
    </div>
  );
}
