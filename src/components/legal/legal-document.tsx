"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { cn, slugify } from "@/lib/cn";

type SectionData = { title: string; content: string };

/**
 * Signature element: a clause index rendered like a real legal document's
 * numbered table of contents — mono clause numbers, a sticky rail that
 * tracks scroll position and highlights the active clause, and section
 * headings that carry their own number rather than a decorative marker.
 * Numbering is earned here (clauses are genuinely referenced by number in
 * documents like this), unlike Values/Story elsewhere in the site.
 */
export function LegalDocument({ sections }: { sections: SectionData[] }) {
  const items = sections.map((s) => ({ ...s, id: slugify(s.title) }));
  const [active, setActive] = useState(items[0]?.id ?? "");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    items.forEach((item) => {
      const el = refs.current[item.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Sticky clause index */}
          <nav
            aria-label="Document sections"
            className="hidden lg:block"
          >
            <div className="sticky top-28">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Clause index
              </p>
              <ol className="mt-4 flex flex-col gap-1 border-l border-line">
                {items.map((item, i) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={cn(
                          "-ml-px flex items-baseline gap-3 border-l-2 py-2 pl-4 text-sm transition-colors duration-200",
                          isActive
                            ? "border-accent-500 font-semibold text-brand-900"
                            : "border-transparent text-muted hover:text-ink",
                        )}
                      >
                        <span className="font-mono text-xs tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-pretty">{item.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>

          {/* Clause body */}
          <div className="flex flex-col gap-12">
            {items.map((item, i) => (
              <Reveal key={item.id} direction="up" delay={Math.min(i * 0.04, 0.2)}>
                <article
                  id={item.id}
                  ref={(el) => {
                    refs.current[item.id] = el;
                  }}
                  className="scroll-mt-28"
                >
                  <div className="flex items-baseline gap-3 border-b border-line pb-3">
                    <span className="font-mono text-sm font-semibold text-maroon-admin">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-bold text-ink sm:text-2xl">{item.title}</h2>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-muted text-pretty">
                    {item.content}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
