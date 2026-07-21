"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { COUNTRY_CODES, DEFAULT_COUNTRY_ISO, type CountryCode } from "@/lib/country-codes";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

/** Splits a stored "+91 6363073455" style value into dial code + local number. */
function parsePhone(raw: string): { iso: string; number: string } {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("+")) {
    return { iso: DEFAULT_COUNTRY_ISO, number: trimmed };
  }
  // Longest dial-code match first, since e.g. +1 is a prefix of +1264.
  const byDialLength = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  const match = byDialLength.find((c) => trimmed.startsWith(c.dial + " ") || trimmed === c.dial);
  if (match) {
    return { iso: match.iso, number: trimmed.slice(match.dial.length).trim() };
  }
  return { iso: DEFAULT_COUNTRY_ISO, number: trimmed };
}

/**
 * Phone number field with a searchable country dial-code dropdown. Composes
 * to a single "+<dial> <number>" string carried in a hidden input so the
 * surrounding form keeps treating phone as one plain field server-side.
 */
export function PhoneInput({
  name,
  required,
  defaultValue = "",
}: {
  name: string;
  required?: boolean;
  defaultValue?: string;
}) {
  const initial = parsePhone(defaultValue);
  const [iso, setIso] = useState(initial.iso);
  const [number, setNumber] = useState(initial.number);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = COUNTRY_CODES.find((c) => c.iso === iso) ?? COUNTRY_CODES[0];
  const composed = number ? `${selected.dial} ${number}`.trim() : "";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase() === q,
    );
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function selectCountry(country: CountryCode) {
    setIso(country.iso);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && results[activeIndex]) selectCountry(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={rootRef} className="relative flex gap-2">
      <input type="hidden" name={name} value={composed} required={required} />

      <div className="relative w-[7.5rem] shrink-0">
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => {
            setOpen((v) => !v);
            setQuery("");
            setActiveIndex(Math.max(results.findIndex((c) => c.iso === iso), 0));
          }}
          onKeyDown={onKeyDown}
          className={cn(inputClasses, "flex items-center gap-1.5 pr-2 text-left")}
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="flex-1 truncate">{selected.dial}</span>
          <ChevronDown
            className={cn("size-3.5 shrink-0 text-[#5b6b82] transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="absolute z-20 mt-1.5 w-64 overflow-hidden rounded-xl border border-[#e4e9f2] bg-white shadow-[0_18px_40px_-16px_rgba(4,22,47,0.24)]">
            <div className="relative border-b border-[#e4e9f2]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#94a3b8]" />
              <input
                autoFocus
                type="text"
                placeholder="Search country or code…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent py-2.5 pl-8 pr-3 text-sm text-[#002144] outline-none placeholder:text-[#94a3b8]"
              />
            </div>
            <ul id={listId} role="listbox" className="max-h-56 overflow-y-auto py-1.5">
              {results.length === 0 ? (
                <li className="px-4 py-2.5 text-sm text-[#94a3b8]">No countries match &ldquo;{query}&rdquo;</li>
              ) : (
                results.map((country, i) => (
                  <li
                    key={country.iso}
                    role="option"
                    aria-selected={country.iso === iso}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectCountry(country);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 px-4 py-2 text-sm text-[#002144] transition-colors",
                      i === activeIndex ? "bg-[#eef8fd] text-[#861b28]" : "hover:bg-[#f6f8fc]",
                    )}
                  >
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-[#5b6b82]">{country.dial}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      <input
        type="tel"
        inputMode="tel"
        value={number}
        onChange={(e) => setNumber(e.target.value.replace(/[^\d\s-]/g, ""))}
        placeholder="98765 43210"
        className={cn(inputClasses, "flex-1")}
      />
    </div>
  );
}
