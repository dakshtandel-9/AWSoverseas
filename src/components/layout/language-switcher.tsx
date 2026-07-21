"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Check, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/language/language-context";
import { LANGUAGES, type LanguageInfo } from "@/lib/language/languages";

function filterLanguages(query: string): LanguageInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return LANGUAGES;
  return LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q),
  );
}

function LanguageList({
  query,
  activeCode,
  onSelect,
}: {
  query: string;
  activeCode: string;
  onSelect: (code: string) => void;
}) {
  const results = useMemo(() => filterLanguages(query), [query]);

  if (results.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-muted">No languages match "{query}".</p>
    );
  }

  return (
    <ul role="listbox" aria-label="Languages">
      {results.map((lang) => (
        <li key={lang.code}>
          <button
            type="button"
            role="option"
            aria-selected={activeCode === lang.code}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-sm transition-colors hover:bg-surface-soft hover:text-brand-900",
              activeCode === lang.code ? "text-brand-900 font-semibold" : "text-ink-soft font-medium",
            )}
          >
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="truncate">{lang.nativeName}</span>
              {lang.nativeName !== lang.name && (
                <span className="shrink-0 text-xs text-muted">{lang.name}</span>
              )}
            </span>
            {activeCode === lang.code && <Check className="size-4 shrink-0 text-brand-900" />}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function LanguageSwitcher({ mobile }: { mobile?: boolean }) {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const id = window.setTimeout(() => searchRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open || mobile) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, mobile]);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setOpen(false);
  };

  if (mobile) {
    return (
      <div data-no-translate>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between gap-2 rounded-2xl border border-line px-4 py-3.5 text-base font-medium text-ink transition-colors hover:bg-surface-soft"
        >
          <span className="flex items-center gap-2">
            <Globe className="size-4 text-ink-soft" />
            {current.nativeName}
          </span>
          <span className="text-sm text-muted">Change</span>
        </button>

        {open && (
          <div className="fixed inset-0 z-[60] flex flex-col bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
              <Search className="size-4 shrink-0 text-muted" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search languages"
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
              />
              <button
                type="button"
                aria-label="Close language search"
                onClick={() => setOpen(false)}
                className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface-soft"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <LanguageList query={query} activeCode={language} onSelect={handleSelect} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={rootRef} data-no-translate>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-900"
      >
        {isTranslating ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Globe className="size-4" />
        )}
        {current.code.toUpperCase()}
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 flex max-h-[70vh] w-72 flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-line px-3.5 py-2.5">
            <Search className="size-4 shrink-0 text-muted" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search languages"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            />
          </div>
          <div className="flex-1 overflow-y-auto py-1.5">
            <LanguageList query={query} activeCode={language} onSelect={handleSelect} />
          </div>
        </div>
      )}
    </div>
  );
}
