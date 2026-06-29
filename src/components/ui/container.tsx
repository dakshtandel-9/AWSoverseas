import { cn } from "@/lib/cn";

/** Centered content column. `wide` uses the 1440px max; default is 1280px. */
export function Container({
  className,
  wide,
  children,
}: {
  className?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        wide ? "max-w-[1440px]" : "max-w-[1280px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
