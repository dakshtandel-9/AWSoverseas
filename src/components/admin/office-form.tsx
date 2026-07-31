"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { OfficeGroup, OfficeLocation } from "@/lib/office-locations";
import {
  createOfficeAction,
  updateOfficeAction,
  type OfficeFormState,
} from "@/app/admin/(dashboard)/offices/actions";

const initialState: OfficeFormState = {};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

/**
 * One office card's fields. Used for both new and existing offices — the caller
 * binds the matching action.
 */
export function OfficeForm({
  groups,
  office,
  defaultGroupId,
}: {
  groups: OfficeGroup[];
  office?: OfficeLocation;
  defaultGroupId?: string;
}) {
  const action = office ? updateOfficeAction.bind(null, office.id) : createOfficeAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 grid max-w-2xl gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[#1A0A53]">
          Group<span className="ml-1 text-maroon-admin">*</span>
        </span>
        <select
          name="group_id"
          required
          defaultValue={office?.group_id ?? defaultGroupId ?? ""}
          className={inputClasses}
        >
          <option value="" disabled>
            Choose a group
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
        <span className="text-xs text-[#5b6b82]">
          Which heading on the Contact page this office appears under.
        </span>
      </label>

      <Field
        label="Office name"
        name="name"
        required
        defaultValue={office?.name ?? ""}
        placeholder="Mumbai Office"
      />

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[#1A0A53]">Address</span>
        <textarea
          name="address"
          rows={3}
          defaultValue={office?.address ?? ""}
          placeholder="Office No. 305, Third Floor, …, Mumbai, Maharashtra, India, Pin Code: 400001"
          className={`${inputClasses} resize-none`}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone number"
          name="phone_1"
          defaultValue={office?.phone_1 ?? ""}
          placeholder="+91 98765 43210"
        />
        <Field
          label="Alternative phone number"
          name="phone_2"
          defaultValue={office?.phone_2 ?? ""}
          placeholder="Optional"
        />
      </div>

      <Field
        label="Email address"
        name="email"
        type="email"
        defaultValue={office?.email ?? ""}
        placeholder="mumbai@awsoverseas.com"
      />

      <Field
        label="Google Maps link"
        name="map_url"
        type="url"
        defaultValue={office?.map_url ?? ""}
        placeholder="https://maps.app.goo.gl/…"
        hint="Adds a “View on map” link to the card. Leave blank to hide it."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Order"
          name="sort_order"
          type="number"
          defaultValue={String(office?.sort_order ?? 0)}
          hint="Lower numbers come first within the group."
        />
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#1A0A53]">Visibility</span>
          <select
            name="is_active"
            defaultValue={String(office?.is_active ?? true)}
            className={inputClasses}
          >
            <option value="true">Visible on the site</option>
            <option value="false">Hidden</option>
          </select>
        </label>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-full btn-navy px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? "Saving…" : office ? "Save changes" : "Add office"}
        </button>
        <Link
          href="/admin/offices"
          className="text-sm font-semibold text-[#5b6b82] transition-colors hover:text-[#1A0A53]"
        >
          Cancel
        </Link>
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
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-[#1A0A53]">
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
      {hint && <span className="text-xs text-[#5b6b82]">{hint}</span>}
    </div>
  );
}
