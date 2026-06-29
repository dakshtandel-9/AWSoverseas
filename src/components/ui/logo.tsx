import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";
import logoDark from "../../../public/brand/logo-nav.png";
import logoLight from "../../../public/brand/logo-nav-light.png";

/**
 * Official AWSoverseas brand mark. The source logo ships with a cream
 * background; we serve a background-removed transparent PNG (navy/cyan on
 * light surfaces) and a recolored light variant for dark surfaces.
 */
export function Logo({
  className,
  tone = "dark",
  priority,
}: {
  className?: string;
  tone?: "dark" | "light";
  priority?: boolean;
}) {
  const src = tone === "light" ? logoLight : logoDark;
  return (
    <Link
      href="/"
      aria-label="AWSoverseas — Global Trade Solutions, home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src={src}
        alt="AWSoverseas — Global Trade Solutions"
        priority={priority}
        sizes="(max-width: 768px) 120px, 140px"
        className="h-12 w-auto sm:h-14"
      />
    </Link>
  );
}
