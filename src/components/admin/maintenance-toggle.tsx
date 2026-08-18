"use client";

import { useState, useTransition } from "react";
import { TriangleAlert } from "lucide-react";
import { setMaintenanceModeAction } from "@/app/admin/(dashboard)/settings/actions";

/**
 * Site-wide maintenance switch. Deliberately not part of <SettingsForm> — it's
 * a plain button, not a form field, so it can't collide with that form's action
 * and doesn't need the rest of the form to be valid.
 *
 * Turning it ON asks for confirmation (it takes the public site down); turning
 * it OFF is one click, because putting the site back should never be gated.
 */
export function MaintenanceToggle({ enabled }: { enabled: boolean }) {
  const [on, setOn] = useState(enabled);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function apply(next: boolean) {
    setError(null);
    setConfirming(false);
    startTransition(async () => {
      const result = await setMaintenanceModeAction(next);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOn(next);
    });
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#e4e9f2] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className={`size-2.5 shrink-0 rounded-full ${on ? "bg-[#f59e0b]" : "bg-[#16a34a]"}`}
              aria-hidden
            />
            <h2 className="text-base font-bold text-[#1A0A53]">
              {on ? "Site is in maintenance" : "Site is live"}
            </h2>
          </div>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5b6b82]">
            {on
              ? "Every visitor sees the maintenance page instead of the site. The admin panel stays open, so you can keep working here."
              : "Visitors see the site normally. Turn maintenance on to show everyone the maintenance page while you work."}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Maintenance mode"
          disabled={pending}
          onClick={() => (on ? apply(false) : setConfirming((c) => !c))}
          className={`relative h-8 w-14 shrink-0 rounded-full p-0 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9e4953] ${
            on ? "bg-[#f59e0b]" : "bg-[#cbd5e1]"
          }`}
        >
          <span
            className={`absolute left-0 top-1 size-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              on ? "translate-x-7" : "translate-x-1"
            }`}
            aria-hidden
          />
        </button>
      </div>

      {confirming && !on && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-[#fffbeb] px-4 py-3">
          <TriangleAlert className="size-4 shrink-0 text-[#b45309]" aria-hidden />
          <p className="flex-1 text-sm font-medium text-[#1A0A53]">
            This takes the public site offline for everyone. Ready?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => apply(true)}
              disabled={pending}
              className="inline-flex h-9 items-center rounded-full bg-[#b45309] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#92400e] disabled:opacity-60"
            >
              {pending ? "Turning on…" : "Turn on maintenance"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="inline-flex h-9 items-center rounded-full border border-[#e4e9f2] px-4 text-sm font-semibold text-[#5b6b82] transition-colors hover:bg-[#f6f8fc]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
