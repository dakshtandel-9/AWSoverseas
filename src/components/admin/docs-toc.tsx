"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** `group` mirrors the sidebar group the documented page sits in. */
export type DocSection = { id: string; label: string; group: string };

export function DocsToc({ sections }: { sections: DocSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.current?.observe(el));
    return () => observer.current?.disconnect();
  }, [sections]);

  const groups = sections.reduce<{ title: string; items: DocSection[] }[]>((acc, s) => {
    const last = acc[acc.length - 1];
    if (last && last.title === s.group) last.items.push(s);
    else acc.push({ title: s.group, items: [s] });
    return acc;
  }, []);

  return (
    <nav aria-label="Documentation sections" className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
            {group.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  activeId === s.id
                    ? "bg-[#eef3fb] text-[#1A0A53]"
                    : "text-[#5b6b82] hover:bg-[#f6f8fc] hover:text-[#1A0A53]",
                )}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
