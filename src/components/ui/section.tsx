import { cn } from "@/lib/cn";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  className?: string;
  /** Vertical rhythm. */
  spacing?: "sm" | "md" | "lg";
  tone?: "default" | "soft" | "tint" | "ink";
  containerClassName?: string;
  bare?: boolean;
  children: React.ReactNode;
};

const SPACING = {
  sm: "py-14 sm:py-16",
  md: "py-20 sm:py-24",
  lg: "py-24 sm:py-32",
};

const TONE = {
  default: "bg-surface",
  soft: "bg-surface-soft",
  tint: "bg-surface-tint",
  ink: "bg-[#CFE8FF] text-ink",
};

/** A full-bleed section band with an inner Container. */
export function Section({
  id,
  className,
  spacing = "md",
  tone = "default",
  containerClassName,
  bare,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative", SPACING[spacing], TONE[tone], className)}
    >
      {bare ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
