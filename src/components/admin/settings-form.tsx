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

      <SectionDivider
        title="Button colors"
        description="Every navy button (Request Quote, Order, form submits) and every maroon button (Start Export Journey and other hero CTAs) on the live site pulls from these four values."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <ColorField label="Navy buttons" name="btn_navy" defaultValue={settings.btnNavy} />
        <ColorField label="Navy buttons — hover" name="btn_navy_hover" defaultValue={settings.btnNavyHover} />
        <ColorField label="Maroon buttons" name="btn_maroon" defaultValue={settings.btnMaroon} />
        <ColorField label="Maroon buttons — hover" name="btn_maroon_hover" defaultValue={settings.btnMaroonHover} />
      </div>

      <SectionDivider
        title="Text color"
        description="Maroon text across the site — headline highlights, icons, links, required-field marks — all read from this one color."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <ColorField label="Maroon text" name="text_maroon" defaultValue={settings.textMaroon} />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-2 rounded-lg bg-[#f8f1f2] px-3 py-2 text-sm font-medium text-maroon-admin" role="status">
          <Check className="size-4" />
          Settings saved — live on the site now.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-full btn-navy px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
        {required && <span className="ml-1 text-maroon-admin">*</span>}
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

function SectionDivider({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-4 border-t border-[#e4e9f2] pt-6">
      <h2 className="text-base font-bold text-[#002144]">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-[#5b6b82]">{description}</p>
    </div>
  );
}

function ColorField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-[#002144]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} — color picker`}
          defaultValue={defaultValue}
          onChange={(e) => {
            const sibling = e.currentTarget.nextElementSibling as HTMLInputElement | null;
            if (sibling) sibling.value = e.currentTarget.value;
          }}
          className="size-12 shrink-0 cursor-pointer rounded-xl border border-[#e4e9f2] bg-white p-1"
        />
        <input
          id={name}
          name={name}
          type="text"
          required
          pattern="^#[0-9a-fA-F]{3,8}$"
          title="A hex color, e.g. #861B28"
          defaultValue={defaultValue}
          onChange={(e) => {
            const sibling = e.currentTarget.previousElementSibling as HTMLInputElement | null;
            if (sibling && /^#[0-9a-fA-F]{6}$/.test(e.currentTarget.value)) sibling.value = e.currentTarget.value;
          }}
          placeholder="#861B28"
          className={`${inputClasses} font-mono uppercase`}
        />
      </div>
    </div>
  );
}
