"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions/account";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOutAction())}
      className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] px-5 py-2.5 text-sm font-semibold text-[#5b6b82] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
    >
      <LogOut className="size-4" />
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
