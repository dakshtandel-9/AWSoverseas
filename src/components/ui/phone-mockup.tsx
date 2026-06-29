import { cn } from "@/lib/cn";

/** Stylized phone frame rendering an app-tracking screen mock. */
export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[9/19] w-[260px] rounded-[2.6rem] bg-brand-950 p-2.5 shadow-lift ring-1 ring-white/10",
        className,
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black/60" />
      {/* Screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-gradient-to-b from-surface-soft to-white">
        {/* App header */}
        <div className="bg-brand-900 px-5 pb-5 pt-9 text-white">
          <p className="text-xs text-brand-100/70">Tracking</p>
          <p className="mt-1 font-heading text-lg font-bold">AWS-9X42-118</p>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs">
            <span className="size-2 rounded-full bg-accent-400" />
            In Transit · Singapore Hub
          </div>
        </div>
        {/* Timeline */}
        <div className="space-y-4 px-5 py-5">
          {[
            { t: "Picked up", d: "Shanghai, CN", done: true },
            { t: "Customs cleared", d: "Export terminal", done: true },
            { t: "In transit", d: "Sea freight · FCL", done: false },
            { t: "Out for delivery", d: "Rotterdam, NL", done: false },
          ].map((s, i) => (
            <div key={s.t} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "size-3 rounded-full",
                    s.done ? "bg-accent-500" : "bg-line ring-2 ring-line",
                  )}
                />
                {i < 3 && <span className="mt-1 h-8 w-px bg-line" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-ink">{s.t}</p>
                <p className="text-[10px] text-muted">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Bottom CTA */}
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-brand-900 py-2.5 text-center text-xs font-semibold text-white">
          View Documents
        </div>
      </div>
    </div>
  );
}
