"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type DocSection = { id: string; label: string };

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

  return (
    <nav aria-label="Documentation sections" className="flex flex-col gap-0.5">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            activeId === s.id
              ? "bg-[#eef3fb] text-[#01214a]"
              : "text-[#5b6b82] hover:bg-[#f6f8fc] hover:text-[#01214a]",
          )}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
