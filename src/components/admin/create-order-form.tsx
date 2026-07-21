"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  createOrderForUserAction,
  getOrderContextAction,
  type CreateOrderState,
  type OrderContext,
} from "@/app/admin/(dashboard)/enquiries/actions";
import { OrderDecisionSection } from "@/components/admin/enquiry-row";

export type OrderUserOption = {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  status: string;
};

const STATUS_TAG: Record<string, string> = {
  pending: "Pending",
  rejected: "Rejected",
};

export type OrderProductOption = {
  id: string;
  name: string;
  category: string | null;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: CreateOrderState = {};

/** Searchable dropdown that carries its selected id in a hidden input. */
function Combobox<T extends { id: string }>({
  items,
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Search…",
  render,
  renderOption,
  filter,
}: {
  items: T[];
  value: T | null;
  onChange: (item: T) => void;
  placeholder: string;
  searchPlaceholder?: string;
  /** Collapsed (selected) display — kept to one line. */
  render: (item: T) => React.ReactNode;
  /** Dropdown row display; falls back to `render`. Can be multi-line. */
  renderOption?: (item: T) => React.ReactNode;
  filter: (item: T, query: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => filter(item, q));
  }, [items, query, filter]);

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
          {value ? render(value) : placeholder}
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
              placeholder={searchPlaceholder}
              className="w-full bg-transparent py-2.5 pl-8 pr-3 text-sm text-[#002144] outline-none placeholder:text-[#94a3b8]"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1.5">
            {results.length === 0 ? (
              <li className="px-4 py-2.5 text-sm text-[#94a3b8]">No matches</li>
            ) : (
              results.map((item) => (
                <li
                  key={item.id}
                  role="option"
                  aria-selected={item.id === value?.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(item);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "cursor-pointer px-4 py-2 text-sm text-[#002144] transition-colors hover:bg-[#f6f8fc]",
                    item.id === value?.id && "bg-[#eef8fd] text-[#861b28]",
                  )}
                >
                  {(renderOption ?? render)(item)}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function userLabel(u: OrderUserOption) {
  const name = `${u.first_name} ${u.last_name}`.trim() || u.email;
  return u.username ? `${name} (@${u.username})` : name;
}

function CreateOrderModal({
  users,
  products,
  onClose,
}: {
  users: OrderUserOption[];
  products: OrderProductOption[];
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(createOrderForUserAction, initialState);
  const [user, setUser] = useState<OrderUserOption | null>(null);
  const [product, setProduct] = useState<OrderProductOption | null>(null);
  const [context, setContext] = useState<OrderContext | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Once the order exists, pull its full context so the same decision UI as the
  // Orders row (approve/reject/reset/credit) can be shown right here.
  useEffect(() => {
    if (!state.orderId) return;
    let active = true;
    getOrderContextAction(state.orderId).then((ctx) => {
      if (active) setContext(ctx);
    });
    return () => {
      active = false;
    };
  }, [state.orderId]);

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
        aria-labelledby="create-order-title"
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#e4e9f2] bg-[#f6f8fc] px-6 py-5">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
              Place an Order
            </p>
            <h2 id="create-order-title" className="mt-1 text-base font-bold text-[#002144]">
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
          <div className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
            <div className="flex items-start gap-3 rounded-2xl bg-[#eef8fd] px-4 py-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#9e4953] text-white">
                <Check className="size-4" />
              </span>
              <p className="text-sm font-medium leading-relaxed text-[#861b28]">
                Order created for {context ? context.item.full_name : "the customer"} — it now shows on their
                profile. Revise the quote, reject it, or credit a referral below.
              </p>
            </div>

            {context ? (
              <div className="text-sm text-[#002144]">
                <OrderDecisionSection
                  item={context.item}
                  referrerName={context.referrerName}
                  alreadyCredited={context.alreadyCredited}
                />
              </div>
            ) : (
              <p className="text-sm text-[#94a3b8]">Loading order controls…</p>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-1 inline-flex h-10 items-center justify-center self-start rounded-full border border-[#e4e9f2] px-5 text-sm font-semibold text-[#002144] hover:border-[#9e4953]"
            >
              Done
            </button>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4 overflow-y-auto px-6 py-6">
            <input type="hidden" name="user-id" value={user?.id ?? ""} />
            <input type="hidden" name="product-id" value={product?.id ?? ""} />
            <input type="hidden" name="product-name" value={product?.name ?? ""} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#002144]">
                Customer <span className="text-[#861b28]">*</span>
              </label>
              <Combobox
                items={users}
                value={user}
                onChange={setUser}
                placeholder="Select a customer"
                searchPlaceholder="Search by name, username, or email…"
                render={(u) => userLabel(u)}
                renderOption={(u) => (
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-medium">{userLabel(u)}</span>
                      {STATUS_TAG[u.status] && (
                        <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          {STATUS_TAG[u.status]}
                        </span>
                      )}
                    </span>
                    <span className="truncate text-xs text-[#94a3b8]">{u.email}</span>
                  </div>
                )}
                filter={(u, q) =>
                  userLabel(u).toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
                }
              />
              <p className="text-xs text-[#94a3b8]">
                Pick any customer — pending or rejected accounts are tagged so you know their status.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#002144]">
                Product <span className="text-[#861b28]">*</span>
              </label>
              <Combobox
                items={products}
                value={product}
                onChange={setProduct}
                placeholder="Select a product"
                render={(p) => p.name}
                filter={(p, q) =>
                  p.name.toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q)
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#002144]">Message</label>
              <textarea
                name="message"
                rows={3}
                placeholder="Quantity, specs, or any note for this order…"
                className={cn(inputClasses, "resize-none")}
              />
            </div>

            <div className="rounded-2xl border border-[#e4e9f2] bg-[#f9fbfe] p-4">
              <p className="text-sm font-semibold text-[#002144]">Quote (optional)</p>
              <p className="mt-1 text-xs text-[#5b6b82]">
                Fill in a price to send the quote right away — or leave blank and price it out after creating.
                You can revise it any time.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                    Price (₹)
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="50000"
                    className={cn(inputClasses, "py-2")}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                    Quantity
                  </label>
                  <input name="quantity" placeholder="1000" className={cn(inputClasses, "py-2")} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                    Weight (kg)
                  </label>
                  <input
                    name="weight"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="500"
                    className={cn(inputClasses, "py-2")}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                    Delivery date
                  </label>
                  <input name="delivery-date" type="date" className={cn(inputClasses, "py-2 text-[#5b6b82]")} />
                </div>
              </div>
            </div>

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
              {pending ? "Creating…" : "Create order"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export function CreateOrderButton({
  users,
  products,
}: {
  users: OrderUserOption[];
  products: OrderProductOption[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[#02224C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#011a38]"
      >
        <Plus className="size-4" />
        New order
      </button>

      <AnimatePresence>
        {open && <CreateOrderModal users={users} products={products} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
