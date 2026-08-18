"use client";

import { usePathname } from "next/navigation";

export function ChromeGate({
  navbar,
  footer,
  maintenance,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  /** Maintenance mode is on — see `proxy.ts`, which serves the maintenance page here. */
  maintenance?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isBareChrome = pathname === "/login";

  // In maintenance the rendered page is always /maintenance (rewritten from
  // whatever URL was asked for, so `pathname` still reads as that URL). It
  // carries its own full-screen layout, so the site chrome has to stay off.
  if (isAdmin || isBareChrome || maintenance) return <>{children}</>;

  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  );
}
