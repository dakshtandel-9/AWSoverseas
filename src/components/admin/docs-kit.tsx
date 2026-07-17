import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export function DocSection({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-[#e4e9f2] py-10 first:pt-0 last:border-b-0">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-bold text-[#01214a] sm:text-2xl">{title}</h2>
      {intro && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5b6b82]">{intro}</p>}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

export function Callout({ kind = "info", children }: { kind?: "info" | "warning"; children: ReactNode }) {
  const Icon = kind === "warning" ? AlertTriangle : Info;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-relaxed",
        kind === "warning"
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-[#dbe6fb] bg-[#eef3fb] text-[#213a5f]",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function StepList({ steps }: { steps: { title: string; detail: ReactNode }[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#01214a] font-mono text-xs font-bold text-white">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-sm font-semibold text-[#01214a]">{step.title}</p>
            <div className="mt-1 text-sm leading-relaxed text-[#5b6b82]">{step.detail}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FieldTable({
  rows,
  columns = ["Field", "Meaning"],
}: {
  rows: [string, ReactNode][];
  columns?: [string, string];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e4e9f2]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#f6f8fc] text-left">
            <th className="w-1/3 px-4 py-2.5 font-semibold text-[#01214a]">{columns[0]}</th>
            <th className="px-4 py-2.5 font-semibold text-[#01214a]">{columns[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([field, meaning], i) => (
            <tr key={field} className={i % 2 === 1 ? "bg-[#fbfcfe]" : undefined}>
              <td className="border-t border-[#e4e9f2] px-4 py-2.5 align-top font-mono text-[12px] font-semibold text-[#8e1b2e]">
                {field}
              </td>
              <td className="border-t border-[#e4e9f2] px-4 py-2.5 align-top leading-relaxed text-[#5b6b82]">
                {meaning}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "amber" | "green" | "red" }) {
  const tones: Record<string, string> = {
    neutral: "bg-[#eef3fb] text-[#01214a]",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-[#e4e9f2] bg-[#f6f8fc] px-1.5 py-0.5 font-mono text-[12px] text-[#01214a]">
      {children}
    </code>
  );
}
