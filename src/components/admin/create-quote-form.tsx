"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronDown, PackageSearch, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  createQuoteForUserAction,
  type CreateQuoteState,
} from "@/app/admin/(dashboard)/quotes/actions";
import { CountrySelect } from "@/components/quote/country-select";
import { INDIA_STATES } from "@/lib/india-states";

export type QuoteUserOption = {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  status: string;
};

const SERVICE_TYPES = [
  "Air Freight",
  "Sea Freight",
  "Import Services",
  "Export Services",
  "FCL Shipping",
  "LCL Shipping",
  "Customs Clearance",
  "Warehousing",
];

const SHIPMENT_TYPES = ["Commercial Cargo", "Machinery", "Electronics", "Others"];

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#d6274c] focus:ring-2 focus:ring-[#d6274c]/20";

const initialState: CreateQuoteState = {};

const STATUS_TAG: Record<string, string> = {
  pending: "Pending",
  incomplete: "Incomplete",
  rejected: "Rejected",
};

function userLabel(u: QuoteUserOption) {
  const name = `${u.first_name} ${u.last_name}`.trim() || u.email;
  return u.username ? `${name} (@${u.username})` : name;
}

/** Searchable customer dropdown carrying its selected id in a hidden input. */
function UserCombobox({
  users,
  value,
  onChange,
}: {
  users: QuoteUserOption[];
  value: QuoteUserOption | null;
  onChange: (u: QuoteUserOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => userLabel(u).toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(inputClasses, "flex items-center justify-between gap-2 text-left")}
      >
        <span className={cn("truncate", !value && "text-[#94a3b8]")}>
          {value ? userLabel(value) : "Select a customer"}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#5b6b82] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-[#e4e9f2] bg-white shadow-[0_18px_40px_-16px_rgba(4,22,47,0.24)]">
          <div className="relative border-b border-[#e4e9f2]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#94a3b8]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, username, or email…"
              className="w-full bg-transparent py-2.5 pl-8 pr-3 text-sm text-[#002144] outline-none placeholder:text-[#94a3b8]"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1.5">
            {results.length === 0 ? (
              <li className="px-4 py-2.5 text-sm text-[#94a3b8]">No matches</li>
            ) : (
              results.map((u) => (
                <li
                  key={u.id}
                  role="option"
                  aria-selected={u.id === value?.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(u);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col px-4 py-2 text-sm text-[#002144] transition-colors hover:bg-[#f6f8fc]",
                    u.id === value?.id && "bg-[#eef8fd] text-[#8d1a32]",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium">{userLabel(u)}</span>
                    {STATUS_TAG[u.status] && (
                      <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                        {STATUS_TAG[u.status]}
                      </span>
                    )}
                  </span>
                  <span className="truncate text-xs text-[#94a3b8]">{u.email}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function Select({ name, options, placeholder }: { name: string; options: string[]; placeholder: string }) {
  return (
    <div className="relative">
      <select name={name} required defaultValue="" className={cn(inputClasses, "appearance-none pr-10")}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b6b82]" />
    </div>
  );
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#002144]">{label}</label>
      {children}
    </div>
  );
}

function CreateQuoteModal({ users, onClose }: { users: QuoteUserOption[]; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(createQuoteForUserAction, initialState);
  const [user, setUser] = useState<QuoteUserOption | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const done = Boolean(state.success);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[#000c1a]/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-quote-title"
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#e4e9f2] bg-[#f6f8fc] px-6 py-5">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
              New Quote Request
            </p>
            <h2 id="create-quote-title" className="mt-1 text-base font-bold text-[#002144]">
              For a customer
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-full text-[#5b6b82] transition-colors hover:bg-[#eef3fb] hover:text-[#002144]"
          >
            <X className="size-4" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 px-8 py-14 text-center">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d6274c] text-white">
              <Check className="size-6" />
            </span>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-[#8d1a32]">
              Quote created — it now shows on this customer&rsquo;s profile and in the list below, ready to
              track.
            </p>
            {state.trackingNumber && (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#e4e9f2] bg-[#f6f8fc] px-6 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94a3b8]">Tracking</p>
                <p className="font-mono text-base font-bold text-[#002144]">{state.trackingNumber}</p>
                <Link
                  href={`/tracking?ref=${encodeURIComponent(state.trackingNumber)}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#02224C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#011a38]"
                >
                  <PackageSearch className="size-3.5" /> Track this shipment
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 inline-flex h-10 items-center justify-center rounded-full border border-[#e4e9f2] px-5 text-sm font-semibold text-[#002144] hover:border-[#d6274c]"
            >
              Done
            </button>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
            <input type="hidden" name="user-id" value={user?.id ?? ""} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#002144]">
                Customer <span className="text-[#8d1a32]">*</span>
              </label>
              <UserCombobox users={users} value={user} onChange={setUser} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Labelled label="Service type *">
                <Select name="service-type" options={SERVICE_TYPES} placeholder="Select a service" />
              </Labelled>
              <Labelled label="Shipment type *">
                <Select name="shipment-type" options={SHIPMENT_TYPES} placeholder="Select a type" />
              </Labelled>
              <Labelled label="Origin state *">
                <CountrySelect
                  name="origin-country"
                  required
                  placeholder="Search origin state…"
                  options={INDIA_STATES}
                  noResultsLabel="states"
                />
              </Labelled>
              <Labelled label="Destination country *">
                <CountrySelect name="destination-country" required placeholder="Search countries…" />
              </Labelled>
            </div>

            <Labelled label="Estimated shipment date">
              <input name="estimated-date" type="date" className={cn(inputClasses, "text-[#5b6b82]")} />
            </Labelled>

            <Labelled label="Cargo description">
              <textarea
                name="description"
                rows={3}
                placeholder="Weight, dimensions, or any note about this shipment…"
                className={cn(inputClasses, "resize-none")}
              />
            </Labelled>

            {state.error && (
              <div
                className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                role="alert"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#02224C] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#011a38] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create quote"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export function CreateQuoteButton({ users }: { users: QuoteUserOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[#02224C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#011a38]"
      >
        <Plus className="size-4" />
        New quote
      </button>

      <AnimatePresence>
        {open && <CreateQuoteModal users={users} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
