"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { LayoutDashboard, Mail, FileText, Newspaper, Settings, LogOut, Boxes, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/lib/auth/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/enquiries", label: "Product Enquiries", icon: MessageSquareText },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <nav className="flex h-full flex-col justify-between">
      <ul className="flex flex-col gap-1">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#033e8d] text-white"
                    : "text-[#5b6b82] hover:bg-[#eef3fb] hover:text-[#06234d]",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => logoutAction())}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#5b6b82] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
      >
        <LogOut className="size-4 shrink-0" />
        Log out
      </button>
    </nav>
  );
}
