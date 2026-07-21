"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

type Field = {
  label: string;
  type: "text" | "email" | "tel" | "url" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

type Data = {
  title: string;
  description: string;
  fields: Field[];
  submitButton: string;
  successMessage: string;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

function FieldControl({ field }: { field: Field }) {
  const id = useId();
  const name = field.label.toLowerCase().replace(/\s+/g, "-");

  if (field.type === "textarea") {
    return (
      <textarea
        id={id}
        name={name}
        required={field.required}
        placeholder={field.placeholder}
        rows={5}
        className={cn(inputClasses, "resize-none")}
      />
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <select
          id={id}
          name={name}
          required={field.required}
          defaultValue=""
          className={cn(inputClasses, "appearance-none pr-10")}
        >
          <option value="" disabled>
            Select an option
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b6b82]" />
      </div>
    );
  }

  return (
    <input
      id={id}
      name={name}
      type={field.type}
      required={field.required}
      placeholder={field.placeholder}
      className={inputClasses}
    />
  );
}

/**
 * Partnership application — no backend wired (per project convention), so
 * submit validates via native HTML5 required attributes and shows the JSON's
 * own success message. Anchored as #apply for the hero's primary CTA.
 */
export function PartnerApplyForm({ data }: { data: Data }) {
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <Section id="apply" spacing="lg" tone="soft">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#e4e9f2] bg-white p-7 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)] sm:p-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          Application Form
        </p>
        <h2 className="mt-3 text-2xl font-bold text-[#002144] sm:text-3xl">{data.title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#5b6b82]">{data.description}</p>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-start gap-3 rounded-2xl bg-[#f8f1f2] px-5 py-5 ring-1 ring-[#9e4953]/25"
            >
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#9e4953] text-white">
                <Check className="size-4" />
              </span>
              <p className="text-sm font-medium leading-relaxed text-[#861b28]">
                {data.successMessage}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 grid gap-5 sm:grid-cols-2"
            >
              {data.fields.map((field) => (
                <div
                  key={field.label}
                  className={cn(
                    "flex flex-col gap-2",
                    (field.type === "textarea" || field.type === "select") && "sm:col-span-2",
                  )}
                >
                  <label className="text-sm font-semibold text-[#002144]">
                    {field.label}
                    {field.required && <span className="ml-1 text-[#861b28]">*</span>}
                  </label>
                  <FieldControl field={field} />
                </div>
              ))}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#02224C] px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#011a38] hover:shadow-[0_0_0_4px_rgba(144, 45, 57,0.18),0_8px_24px_rgba(3,62,141,0.35)] sm:w-auto"
                >
                  {data.submitButton}
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
