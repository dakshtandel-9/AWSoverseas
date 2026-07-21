"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { NavbarUser } from "@/components/auth/navbar-user";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock scroll when the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-white border-b border-line shadow-soft">
        <div className="mx-auto flex min-h-[88px] max-w-[1440px] items-center justify-between gap-4 px-5 py-3 sm:min-h-[100px] sm:px-8 lg:px-10">
          <Logo tone="dark" priority className="shrink-0" />

          {/* Desktop nav */}
          <nav
            className="hidden min-w-0 shrink items-center gap-0.5 overflow-x-auto xl:gap-1 lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive(link.href)}
                className="nav-underline shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-900 xl:px-3.5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3">
            <LanguageSwitcher />
            <NavbarUser scrolled />
            <Button href="/quote" variant="primary" size="sm" className="shrink-0">
              Request Quote <ArrowRight className="size-4 shrink-0" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-xl text-ink ring-1 ring-line transition-colors hover:bg-brand-50 lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[88px] z-40 bg-surface sm:top-[100px] lg:hidden"
          >
            <nav
              className="flex h-[calc(100dvh-88px)] flex-col gap-1 overflow-y-auto px-5 py-6"
              aria-label="Mobile"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-2xl px-4 py-3.5 text-lg font-semibold transition-colors",
                    isActive(link.href)
                      ? "bg-brand-50 text-brand-900"
                      : "text-ink-soft hover:bg-surface-soft",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-auto flex flex-col gap-3 pt-6">
                <LanguageSwitcher mobile />
                <Button href="/quote" variant="primary" size="lg" magnetic={false}>
                  Request a Quote <ArrowRight className="size-4" />
                </Button>
                <NavbarUser mobile />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
