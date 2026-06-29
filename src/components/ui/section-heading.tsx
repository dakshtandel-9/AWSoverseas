import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import { Reveal } from "./reveal";

/** Eyebrow + title + subtitle block reused at the top of most sections. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "default",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "default" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "items-start text-left max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="up">
          <Badge tone={tone === "light" ? "light" : "default"}>{eyebrow}</Badge>
        </Reveal>
      )}
      <Reveal direction="up" delay={0.05}>
        <h2
          className={cn(
            "text-balance text-3xl font-bold sm:text-4xl lg:text-[2.75rem]",
            tone === "light" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal direction="up" delay={0.1}>
          <p
            className={cn(
              "text-pretty text-base leading-relaxed sm:text-lg",
              tone === "light" ? "text-brand-100/80" : "text-muted",
            )}
          >
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
