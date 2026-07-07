"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { supabaseBrowser } from "@/lib/supabase/browser";

/**
 * Session-aware navbar link: "Sign in" for guests, "Account" once a
 * Supabase session cookie exists. Reads the session locally (no network)
 * and tracks auth changes so it flips immediately after login/logout.
 */
export function NavbarUser({ scrolled, mobile }: { scrolled?: boolean; mobile?: boolean }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => subscription.unsubscribe();
  }, []);

  const href = signedIn ? "/profile" : "/login";
  const label = signedIn ? "Account" : "Sign in";

  if (mobile) {
    return (
      <Link
        href={href}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-line text-base font-medium text-ink transition-colors hover:bg-brand-50"
      >
        <UserRound className="size-4" />
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
        scrolled ? "text-ink-soft hover:text-brand-900" : "text-white/85 hover:text-white",
      )}
    >
      <UserRound className="size-4" />
      {label}
    </Link>
  );
}
