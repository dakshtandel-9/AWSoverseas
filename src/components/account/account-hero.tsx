import { Container } from "@/components/ui/container";

/**
 * Slim dark header band for the account pages (login / profile / setup) —
 * same manifest register as the other page heroes, minus the animation:
 * these are utility pages, so they load quiet and instant.
 */
export function AccountHero({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  right?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] pb-12 pt-32 sm:pb-14 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 88% 0%, rgba(144, 45, 57,0.12) 0%, transparent 60%), radial-gradient(45% 40% at 4% 100%, rgba(3,62,141,0.2) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <div className="flex items-center gap-4 border-b border-ink/12 pb-4">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e05c72]">
            <span className="size-1.5 rounded-full bg-[#9e4953]" />
            {eyebrow}
          </span>
          {right && (
            <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink/35 sm:block">
              {right}
            </span>
          )}
        </div>

        <h1
          className="mt-8 font-heading text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-4xl"
          style={{ color: "#002144" }}
        >
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/60">{subtitle}</p>}
      </Container>
    </section>
  );
}
