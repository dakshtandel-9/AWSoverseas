import { cn } from "@/lib/cn";

/** Small pill label / eyebrow. */
export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase",
        tone === "default"
          ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100"
          : "bg-ink/8 text-ink ring-1 ring-ink/15",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-accent-500" aria-hidden />
      {children}
    </span>
  );
}
