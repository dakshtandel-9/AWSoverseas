"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/lib/auth/actions";
import { ADMIN_NAV, DASHBOARD_ITEM, type AdminNavItem } from "@/lib/admin-nav";
import type { AdminCounts } from "@/lib/admin-counts";
import { Logo } from "@/components/ui/logo";

function isActive(pathname: string, item: AdminNavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function NavLink({
  item,
  active,
  count,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  count: number;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]",
        active ? "bg-[#002144] text-white" : "text-[#5b6b82] hover:bg-[#eef3fb] hover:text-[#1A0A53]",
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {count > 0 && (
        <span
          className={cn(
            "grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[11px] font-bold tabular-nums",
            active ? "bg-white/20 text-white" : "bg-[var(--btn-maroon)] text-white",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      // Deliberately not a <form action={logoutAction}> — a bare form action on a
      // page that also renders a useActionState form can dispatch the wrong action.
      onClick={() => startTransition(() => logoutAction())}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5b6b82] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144] disabled:opacity-60"
    >
      <LogOut className="size-4 shrink-0" />
      {pending ? "Logging out…" : "Log out"}
    </button>
  );
}

export function AdminNav({ counts, onNavigate }: { counts: AdminCounts; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col" aria-label="Admin sections">
      <div className="flex-1 space-y-6">
        <NavLink
          item={DASHBOARD_ITEM}
          active={isActive(pathname, DASHBOARD_ITEM)}
          count={0}
          onNavigate={onNavigate}
        />

        {ADMIN_NAV.map((group) => {
          const groupTotal = group.items.reduce((n, i) => n + (i.inbox ? counts[i.inbox] : 0), 0);
          return (
            <div key={group.title}>
              <p className="flex items-center gap-2 px-3 pb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                {group.title}
                {groupTotal > 0 && <span className="size-1.5 rounded-full bg-[var(--btn-maroon)]" />}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      active={isActive(pathname, item)}
                      count={item.inbox ? counts[item.inbox] : 0}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-[#e4e9f2] pt-3">
        <LogoutButton />
      </div>
    </nav>
  );
}

/** Menu button + slide-over drawer. Replaces stacking every link above the page on small screens. */
export function AdminMobileNav({ counts }: { counts: AdminCounts }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const waiting = Object.values(counts).reduce((a, b) => a + b, 0);

  // A tap that navigates should also dismiss the drawer.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="relative grid size-10 place-items-center rounded-xl border border-[#e4e9f2] text-[#1A0A53] transition-colors hover:bg-[#eef3fb]"
      >
        <Menu className="size-5" />
        <span className="sr-only">Open admin menu</span>
        {waiting > 0 && (
          <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[var(--btn-maroon)] ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#04162f]/40"
          />
          <div className="absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e4e9f2] px-4 py-3">
              <Logo imageClassName="h-10" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef3fb]"
              >
                <X className="size-5" />
                <span className="sr-only">Close admin menu</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <AdminNav counts={counts} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
