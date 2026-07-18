import Image from "next/image";
import { cn } from "@/lib/cn";

/** App Store / Play Store download buttons, using the official badge artwork. */
export function StoreButtons({
  playLabel,
  appLabel,
  className,
}: {
  playLabel: string;
  appLabel: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href="#"
        aria-label={appLabel}
        className="inline-block overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5"
      >
        <Image
          src="/brand/app-store-badge.png"
          alt={appLabel}
          width={168}
          height={50}
          className="h-[50px] w-auto"
        />
      </a>
      <a
        href="#"
        aria-label={playLabel}
        className="inline-block overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5"
      >
        <Image
          src="/brand/google-play-badge.png"
          alt={playLabel}
          width={168}
          height={50}
          className="h-[50px] w-auto"
        />
      </a>
    </div>
  );
}
