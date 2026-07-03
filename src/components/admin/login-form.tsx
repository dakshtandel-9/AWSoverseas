"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-semibold text-[#06234d]">
          Admin password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            placeholder="Enter admin password"
            className="w-full rounded-xl border border-[#e4e9f2] bg-white py-3 pl-11 pr-4 text-sm text-[#06234d] outline-none transition-colors focus:border-[#0fade8] focus:ring-2 focus:ring-[#0fade8]/20"
          />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-[#033e8d] px-6 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#052f69] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
