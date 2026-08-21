import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import logoDark from "../../../public/brand/logo-nav.png";
import logoLight from "../../../public/brand/logo-nav-light.png";

/**
 * Official AWS OVERSEAS impex brand mark: a transparent-background wordmark in
 * navy/maroon for light surfaces, and a recolored white/cyan variant for
 * dark surfaces (e.g. the navbar over the hero).
 */
export function Logo({
  className,
  tone = "dark",
  priority,
  imageClassName,
}: {
  className?: string;
  tone?: "dark" | "light";
  priority?: boolean;
  /**
   * Replaces the default height. Needed because the height lives on the <img>,
   * so a class on the wrapper alone can't shrink the mark.
   */
  imageClassName?: string;
}) {
  const src = tone === "light" ? logoLight : logoDark;
  return (
    <Link
      href="/"
      aria-label="AWS OVERSEAS impex — Global Trade Solutions, home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={src}
        alt="AWS OVERSEAS impex — Global Trade Solutions"
        priority={priority}
        sizes="(max-width: 768px) 120px, 140px"
        className={cn(imageClassName ?? "h-[72px] sm:h-[84px]", "w-auto")}
      />
    </Link>
  );
}
