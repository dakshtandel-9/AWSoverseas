import type { ReactNode } from "react";
import { adminPage } from "@/lib/admin-nav";

/**
 * Every admin page's heading. The eyebrow is the sidebar group the page sits in
 * and the title is the sidebar link's own label, both read from ADMIN_NAV — so
 * what you clicked and what you land on always read the same.
 */
export function AdminPageHeader({
  href,
  description,
  action,
}: {
  /** The page's own route, exactly as it appears in ADMIN_NAV. */
  href: string;
  /** Overrides the config's description when a page needs to say more. */
  description?: ReactNode;
  /** Buttons that belong beside the title, e.g. "Create order". */
  action?: ReactNode;
}) {
  const { item, group } = adminPage(href);
  const Icon = item.icon;

  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">{group}</p>
        <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-bold text-[#1A0A53] sm:text-3xl">
          <Icon className="size-6 shrink-0 text-[#94a3b8]" aria-hidden />
          {item.label}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
          {description ?? item.description}
        </p>
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}
