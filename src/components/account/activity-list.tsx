import type { LucideIcon } from "lucide-react";

export type ActivityItem = {
  id: string;
  title: string;
  subtitle?: string;
  createdAt: string;
  badge?: string;
};

/** Shared card shell for "Your quote requests" / "Your product enquiries" on the profile page. */
export function ActivityList({
  icon: Icon,
  title,
  description,
  emptyLabel,
  items,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  emptyLabel: string;
  items: ActivityItem[];
}) {
  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7">
      <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#06234d]">
        <Icon className="size-4 text-[#0489c2]" />
        {title}
      </h2>
      <p className="mt-1 text-sm text-[#5b6b82]">{description}</p>

      {items.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
          {emptyLabel}
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-[#eef3fb]">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-1.5 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#06234d]">{item.title}</p>
                  {item.subtitle && <p className="truncate text-xs text-[#5b6b82]">{item.subtitle}</p>}
                </div>
                <span className="shrink-0 text-xs text-[#94a3b8]">{item.createdAt}</span>
              </div>
              {item.badge && (
                <p className="inline-flex w-fit items-center rounded-full bg-[#eef3fb] px-2.5 py-1 text-xs font-semibold text-[#033e8d]">
                  {item.badge}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
