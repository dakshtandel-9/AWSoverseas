"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { updateSettingsAction, type SettingsState } from "@/app/admin/(dashboard)/settings/actions";
import type { SiteSettings } from "@/lib/site-settings";

const initialState: SettingsState = {};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid max-w-2xl gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Primary phone number" name="phone_1" defaultValue={settings.phone1} required placeholder="+91 98765 43210" />
        <Field label="Secondary phone number" name="phone_2" defaultValue={settings.phone2} placeholder="Optional" />
      </div>

      <Field label="Email address" name="email" type="email" defaultValue={settings.email} required placeholder="info@awsoverseas.com" />

      <Field
        label="WhatsApp number"
        name="whatsapp_number"
        defaultValue={settings.whatsappNumber}
        placeholder="Digits only with country code, e.g. 919876543210"
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-sm font-semibold text-[#002144]">
          Office address
        </label>
        <textarea
          id="address"
          name="address"
          defaultValue={settings.address}
          rows={3}
          placeholder="Street, City, Country"
          className={`${inputClasses} resize-none`}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-2 rounded-lg bg-[#f8f1f2] px-3 py-2 text-sm font-medium text-[#861b28]" role="status">
          <Check className="size-4" />
          Settings saved — live on the site now.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#02224C] px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#011a38] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-[#002144]">
        {label}
        {required && <span className="ml-1 text-[#861b28]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClasses}
      />
    </div>
  );
}
