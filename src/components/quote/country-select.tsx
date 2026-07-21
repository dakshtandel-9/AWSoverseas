"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { COUNTRIES } from "@/lib/countries";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

/**
 * Searchable dropdown (countries by default) — native <select> can't be
 * typed into to filter, so this pairs a hidden input (carries the actual
 * form value/name) with a text input + filtered listbox for the combobox UI.
 */
export function CountrySelect({
  name,
  required,
  placeholder = "Search countries…",
  defaultValue = "",
  options = COUNTRIES,
  noResultsLabel = "countries",
}: {
  name: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  /** Defaults to the full country list; pass a different list (e.g. Indian states) to repurpose this combobox. */
  options?: string[];
  /** Noun used in the "No X match" empty state, to match whatever `options` represents. */
  noResultsLabel?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((c) => c.toLowerCase().includes(q));
  }, [query, options]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [value]);

  function selectCountry(country: string) {
    setValue(country);
    setQuery(country);
    setOpen(false);
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
      setQuery(value);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} required={required} />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setValue("");
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          className={cn(inputClasses, "pl-10 pr-10")}
        />
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b6b82] transition-transform",
            open && "rotate-180",
          )}
        />
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl border border-[#e4e9f2] bg-white py-1.5 shadow-[0_18px_40px_-16px_rgba(4,22,47,0.24)]"
        >
          {results.length === 0 ? (
            <li className="px-4 py-2.5 text-sm text-[#94a3b8]">
              No {noResultsLabel} match &ldquo;{query}&rdquo;
            </li>
          ) : (
            results.map((country, i) => (
              <li
                key={country}
                role="option"
                aria-selected={country === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectCountry(country);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "cursor-pointer px-4 py-2.5 text-sm text-[#002144] transition-colors",
                  i === activeIndex ? "bg-[#eef8fd] text-[#861b28]" : "hover:bg-[#f6f8fc]",
                )}
              >
                {country}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
