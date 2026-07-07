"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight, Smartphone } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_LINKS, SERVICE_LINKS } from "@/lib/site";
import { iconFor } from "@/lib/icons";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { NavbarUser } from "@/components/auth/navbar-user";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setMegaOpen(false);
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
      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "bg-white border-b border-line shadow-soft"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
          <Logo tone={scrolled ? "dark" : "light"} priority />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              "mega" in link && link.mega ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href={link.href}
                    data-active={isActive(link.href)}
                    className={cn(
                      "nav-underline flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                      scrolled
                        ? "text-ink-soft hover:text-brand-900"
                        : "text-white/85 hover:text-white",
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-300",
                        megaOpen && "rotate-180",
                      )}
                    />
                  </Link>
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-4"
                      >
                        <div className="bg-white grid grid-cols-2 gap-1 rounded-3xl border border-line p-3 shadow-lift">
                          {SERVICE_LINKS.map((s) => {
                            const Icon = iconFor(s.title);
                            return (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-50"
                              >
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-900 group-hover:text-white">
                                  <Icon className="size-5" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-ink">
                                    {s.title}
                                  </span>
                                  <span className="line-clamp-2 block text-xs leading-relaxed text-muted">
                                    {s.description}
                                  </span>
                                </span>
                              </Link>
                            );
                          })}
                          <Link
                            href="/services"
                            className="col-span-2 mt-1 flex items-center justify-between rounded-2xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
                          >
                            View all services
                            <ArrowRight className="size-4" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive(link.href)}
                  className={cn(
                    "nav-underline rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    scrolled
                      ? "text-ink-soft hover:text-brand-900"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <NavbarUser scrolled={scrolled} />
            <Button
              href="/mobile-app"
              variant={scrolled ? "ghost" : "outline"}
              size="sm"
              magnetic={false}
              className={!scrolled ? "border-white/25 bg-white/10 text-white hover:bg-white/18 hover:border-white/40" : ""}
            >
              <Smartphone className="size-4" /> Download App
            </Button>
            <Button href="/quote" variant="primary" size="sm">
              Request Quote <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "grid size-11 place-items-center rounded-xl transition-colors lg:hidden",
              scrolled
                ? "text-ink ring-1 ring-line hover:bg-brand-50"
                : "text-white ring-1 ring-white/30 hover:bg-white/10",
            )}
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
            className="fixed inset-0 top-18 z-40 bg-surface lg:hidden"
          >
            <nav
              className="flex h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto px-5 py-6"
              aria-label="Mobile"
            >
              {NAV_LINKS.map((link) =>
                "mega" in link && link.mega ? (
                  <div key={link.href}>
                    <div
                      className={cn(
                        "flex items-center justify-between rounded-2xl text-lg font-semibold transition-colors",
                        isActive(link.href)
                          ? "bg-brand-50 text-brand-900"
                          : "text-ink-soft",
                      )}
                    >
                      <Link href={link.href} className="flex-1 px-4 py-3.5">
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={megaOpen ? "Collapse services" : "Expand services"}
                        aria-expanded={megaOpen}
                        onClick={() => setMegaOpen((v) => !v)}
                        className="grid size-11 shrink-0 place-items-center"
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-300",
                            megaOpen && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {megaOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 grid grid-cols-2 gap-2 rounded-2xl bg-surface-soft p-2">
                            {SERVICE_LINKS.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-white hover:text-brand-900"
                              >
                                {s.title}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
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
                ),
              )}
              <div className="mt-auto flex flex-col gap-3 pt-6">
                <Button href="/quote" variant="primary" size="lg" magnetic={false}>
                  Request a Quote <ArrowRight className="size-4" />
                </Button>
                <Button href="/mobile-app" variant="outline" size="lg" magnetic={false}>
                  <Smartphone className="size-4" /> Download App
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
