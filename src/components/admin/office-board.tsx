"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { Pencil, Plus, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { OfficeGroupWithOffices, OfficeLocation } from "@/lib/office-locations";
import {
  createGroupAction,
  deleteGroupAction,
  deleteOfficeAction,
  toggleGroupActiveAction,
  toggleOfficeActiveAction,
  updateGroupAction,
  type OfficeFormState,
} from "@/app/admin/(dashboard)/offices/actions";

const initialState: OfficeFormState = {};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

/**
 * The whole office directory on one page: every group, the offices inside it,
 * and the controls to add more of either. Mirrors what the Contact page renders.
 */
export function OfficeBoard({ groups }: { groups: OfficeGroupWithOffices[] }) {
  return (
    <div className="mt-8 flex flex-col gap-6">
      {groups.map((group) => (
        <GroupBlock key={group.id} group={group} />
      ))}
      <NewGroupBlock />
    </div>
  );
}

function GroupBlock({ group }: { group: OfficeGroupWithOffices }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [state, formAction, saving] = useActionState(
    updateGroupAction.bind(null, group.id),
    initialState,
  );

  useEffect(() => {
    if (state.success) setEditing(false);
  }, [state]);

  return (
    <section className="rounded-2xl border border-[#e4e9f2] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#1A0A53]">{group.title}</h2>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                group.is_active ? "bg-[#f8f1f2] text-maroon-admin" : "bg-[#f6f8fc] text-[#94a3b8]",
              )}
            >
              {group.is_active ? "Visible" : "Hidden"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#5b6b82]">
            {group.description || "No description."}
            <span className="text-[#94a3b8]">
              {" · "}
              {group.offices.length} {group.offices.length === 1 ? "office" : "offices"}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/admin/offices/new?group=${group.id}`}
            className="inline-flex items-center gap-1.5 rounded-full btn-navy px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            <Plus className="size-3.5" />
            Add office
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => toggleGroupActiveAction(group.id, !group.is_active))}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-[#5b6b82] transition-colors hover:bg-[#f6f8fc] disabled:opacity-50"
          >
            {group.is_active ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="rounded-lg p-2 text-[#5b6b82] transition-colors hover:bg-[#f6f8fc]"
            aria-label="Edit group heading"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              const warning = group.offices.length
                ? `Delete "${group.title}"? Its ${group.offices.length} ${group.offices.length === 1 ? "office" : "offices"} will be deleted too. This can't be undone.`
                : `Delete "${group.title}"? This can't be undone.`;
              if (confirm(warning)) startTransition(() => deleteGroupAction(group.id));
            }}
            className="rounded-lg p-2 text-[#5b6b82] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label="Delete group"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {editing && (
        <GroupFields
          formAction={formAction}
          state={state}
          pending={saving}
          group={group}
          submitLabel="Save heading"
          onCancel={() => setEditing(false)}
        />
      )}

      {group.offices.length === 0 ? (
        <p className="mt-5 rounded-xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
          No offices in this group yet — the group stays off the Contact page until you add one.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {group.offices.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>
      )}
    </section>
  );
}

function OfficeCard({ office }: { office: OfficeLocation }) {
  const [pending, startTransition] = useTransition();
  const phones = [office.phone_1, office.phone_2].filter(Boolean);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-[#e4e9f2] bg-[#f9fbfe] p-4",
        !office.is_active && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug text-[#1A0A53]">{office.name}</h3>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => toggleOfficeActiveAction(office.id, !office.is_active))}
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors disabled:opacity-50",
            office.is_active ? "bg-[#f8f1f2] text-maroon-admin" : "bg-white text-[#94a3b8]",
          )}
        >
          {office.is_active ? "Visible" : "Hidden"}
        </button>
      </div>

      {office.address && (
        <p className="mt-2 text-xs leading-relaxed text-[#5b6b82]">{office.address}</p>
      )}

      <ul className="mt-3 flex flex-col gap-1.5 text-xs text-[#5b6b82]">
        {phones.map((phone) => (
          <li key={phone} className="flex items-center gap-2">
            <Phone className="size-3 shrink-0 text-[#94a3b8]" />
            <span className="truncate">{phone}</span>
          </li>
        ))}
        {office.email && (
          <li className="flex items-center gap-2">
            <Mail className="size-3 shrink-0 text-[#94a3b8]" />
            <span className="truncate">{office.email}</span>
          </li>
        )}
        {office.map_url && (
          <li className="flex items-center gap-2">
            <MapPin className="size-3 shrink-0 text-[#94a3b8]" />
            <span className="truncate">Map link added</span>
          </li>
        )}
      </ul>

      <div className="mt-4 flex items-center gap-2 border-t border-[#e4e9f2] pt-3">
        <Link
          href={`/admin/offices/${office.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:bg-white hover:text-[#1A0A53]"
        >
          <Pencil className="size-3.5" />
          Edit
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm(`Delete "${office.name}"? This can't be undone.`)) {
              startTransition(() => deleteOfficeAction(office.id));
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 className="size-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

function NewGroupBlock() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createGroupAction, initialState);
  // Bumped on every save so the next open starts from empty fields rather than
  // the ones just submitted.
  const [formKey, setFormKey] = useState(0);

  // Each save returns a fresh state object, so this fires once per save — and
  // not again when the form is reopened with a stale `success` still set.
  useEffect(() => {
    if (state.success) {
      setOpen(false);
      setFormKey((k) => k + 1);
    }
  }, [state]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#cfd9e8] px-5 py-6 text-sm font-semibold text-[#5b6b82] transition-colors hover:border-[#9e4953] hover:text-maroon-admin"
      >
        <Plus className="size-4" />
        New group
      </button>
    );
  }

  return (
    <section className="rounded-2xl border border-[#e4e9f2] bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold text-[#1A0A53]">New group</h2>
      <p className="mt-1 text-sm text-[#5b6b82]">
        A heading on the Contact page with its own row of office cards — India, international, or
        anything else you need.
      </p>
      <GroupFields
        key={formKey}
        formAction={formAction}
        state={state}
        pending={pending}
        submitLabel="Create group"
        onCancel={() => setOpen(false)}
      />
    </section>
  );
}

function GroupFields({
  formAction,
  state,
  pending,
  group,
  submitLabel,
  onCancel,
}: {
  formAction: (formData: FormData) => void;
  state: OfficeFormState;
  pending: boolean;
  group?: OfficeGroupWithOffices;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <form action={formAction} className="mt-5 grid gap-4 border-t border-[#e4e9f2] pt-5">
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#1A0A53]">
            Heading<span className="ml-1 text-maroon-admin">*</span>
          </span>
          <input
            name="title"
            required
            defaultValue={group?.title ?? ""}
            placeholder="India Offices"
            className={inputClasses}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#1A0A53]">Order</span>
          <input
            name="sort_order"
            type="number"
            defaultValue={group?.sort_order ?? 0}
            className={inputClasses}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[#1A0A53]">Description</span>
        <input
          name="description"
          defaultValue={group?.description ?? ""}
          placeholder="Our offices across India."
          className={inputClasses}
        />
      </label>

      {group && <input type="hidden" name="is_active" value={String(group.is_active)} />}

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-full btn-navy px-6 text-sm font-semibold text-white transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-[#5b6b82] transition-colors hover:text-[#1A0A53]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
