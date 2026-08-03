"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Plus, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FooterContact } from "@/lib/footer-contacts";
import { deleteFooterContactAction, toggleFooterContactActiveAction } from "@/app/admin/(dashboard)/footer-contacts/actions";

/** Every footer contact column, plus the control to add another. */
export function FooterContactsBoard({ contacts }: { contacts: FooterContact[] }) {
  return (
    <div className="mt-8">
      {contacts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
          No footer contact columns yet — the footer section stays hidden until you add one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <FooterContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      <Link
        href="/admin/footer-contacts/new"
        className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#cfd9e8] px-5 py-6 text-sm font-semibold text-[#5b6b82] transition-colors hover:border-[#9e4953] hover:text-maroon-admin"
      >
        <Plus className="size-4" />
        Add column
      </Link>
    </div>
  );
}

function FooterContactCard({ contact }: { contact: FooterContact }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-[#e4e9f2] bg-[#f9fbfe] p-4",
        !contact.is_active && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug text-[#1A0A53]">{contact.headline || "Untitled"}</h3>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => toggleFooterContactActiveAction(contact.id, !contact.is_active))}
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors disabled:opacity-50",
            contact.is_active ? "bg-[#f8f1f2] text-maroon-admin" : "bg-white text-[#94a3b8]",
          )}
        >
          {contact.is_active ? "Visible" : "Hidden"}
        </button>
      </div>

      {contact.address && (
        <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-[#5b6b82]">
          <MapPin className="mt-0.5 size-3 shrink-0 text-[#94a3b8]" />
          {contact.address}
        </p>
      )}

      <ul className="mt-3 flex flex-col gap-1.5 text-xs text-[#5b6b82]">
        {contact.phone && (
          <li className="flex items-center gap-2">
            <Phone className="size-3 shrink-0 text-[#94a3b8]" />
            <span className="truncate">{contact.phone}</span>
          </li>
        )}
        {contact.email && (
          <li className="flex items-center gap-2">
            <Mail className="size-3 shrink-0 text-[#94a3b8]" />
            <span className="truncate">{contact.email}</span>
          </li>
        )}
      </ul>

      <div className="mt-4 flex items-center gap-2 border-t border-[#e4e9f2] pt-3">
        <Link
          href={`/admin/footer-contacts/${contact.id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:bg-white hover:text-[#1A0A53]"
        >
          <Pencil className="size-3.5" />
          Edit
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm(`Delete "${contact.headline || "this column"}"? This can't be undone.`)) {
              startTransition(() => deleteFooterContactAction(contact.id));
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
