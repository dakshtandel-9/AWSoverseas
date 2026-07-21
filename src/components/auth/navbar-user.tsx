"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { supabaseBrowser } from "@/lib/supabase/browser";

/**
 * Session-aware navbar auth control. Signed-out visitors see "Sign in" and
 * "Sign up" links (both routed to /login, which toggles mode via ?mode=);
 * once a Supabase session cookie exists it collapses to a single "Account"
 * link. Reads the session locally (no network) and tracks auth changes so
 * it flips immediately after login/logout.
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

  if (mobile) {
    if (signedIn) {
      return (
        <Link
          href="/profile"
          className="inline-flex h-auto min-h-14 items-center justify-center gap-2 whitespace-normal rounded-full border border-line px-4 text-center text-base font-medium text-ink transition-colors hover:bg-brand-50"
        >
          <UserRound className="size-4 shrink-0" />
          Account
        </Link>
      );
    }
    return (
      <div className="flex flex-wrap gap-3">
        <Link
          href="/login"
          className="inline-flex h-auto min-h-14 flex-1 basis-32 items-center justify-center gap-2 whitespace-normal rounded-full border border-line px-4 text-center text-base font-medium text-ink transition-colors hover:bg-brand-50"
        >
          Sign in
        </Link>
        <Link
          href="/login?mode=sign-up"
          className="inline-flex h-auto min-h-14 flex-1 basis-32 items-center justify-center gap-2 whitespace-normal rounded-full border border-line px-4 text-center text-base font-medium text-ink transition-colors hover:bg-brand-50"
        >
          Sign up
        </Link>
      </div>
    );
  }

  if (signedIn) {
    return (
      <Link
        href="/profile"
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
          scrolled ? "text-ink-soft hover:text-brand-900" : "text-white/85 hover:text-white",
        )}
      >
        <UserRound className="size-4 shrink-0" />
        Account
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Link
        href="/login"
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
          scrolled ? "text-ink-soft hover:text-brand-900" : "text-white/85 hover:text-white",
        )}
      >
        Sign in
      </Link>
      <Link
        href="/login?mode=sign-up"
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
          scrolled ? "text-ink-soft hover:text-brand-900" : "text-white/85 hover:text-white",
        )}
      >
        Sign up
      </Link>
    </div>
  );
}
