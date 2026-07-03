import { AlertTriangle } from "lucide-react";

/** Shown on admin pages when Supabase env vars are missing, instead of letting a query throw. */
export function SetupNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
      <AlertTriangle className="mt-0.5 size-5 shrink-0" />
      <div className="text-sm leading-relaxed">
        <p className="font-semibold">Supabase isn&apos;t connected yet.</p>
        <p className="mt-1">
          Add <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          and <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          to your <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.env</code> file (see{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.env.example</code>), then run the
          schema in <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">supabase/schema.sql</code>{" "}
          via the Supabase SQL editor.
        </p>
      </div>
    </div>
  );
}
