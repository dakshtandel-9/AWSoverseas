import { Apple, Play } from "lucide-react";
import { cn } from "@/lib/cn";

/** App Store / Play Store download buttons. Labels come from JSON content. */
export function StoreButtons({
  playLabel,
  appLabel,
  tone = "dark",
  className,
}: {
  playLabel: string;
  appLabel: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-3 rounded-2xl px-5 py-3 transition-transform hover:-translate-y-0.5";
  const skin =
    tone === "dark"
      ? "bg-brand-950 text-white hover:bg-brand-900"
      : "bg-white text-brand-900 shadow-soft hover:shadow-lift";

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a href="#" className={cn(base, skin)} aria-label={appLabel}>
        <Apple className="size-6" />
        <span className="flex flex-col leading-tight text-left">
          <span className="text-[10px] opacity-70">Download on the</span>
          <span className="text-sm font-semibold">{appLabel}</span>
        </span>
      </a>
      <a href="#" className={cn(base, skin)} aria-label={playLabel}>
        <Play className="size-6" />
        <span className="flex flex-col leading-tight text-left">
          <span className="text-[10px] opacity-70">Get it on</span>
          <span className="text-sm font-semibold">{playLabel}</span>
        </span>
      </a>
    </div>
  );
}
