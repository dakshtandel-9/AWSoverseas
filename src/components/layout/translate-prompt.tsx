"use client";

import { useEffect, useState } from "react";
import { Languages, X } from "lucide-react";
import { useLanguage } from "@/lib/language/language-context";
import { LANGUAGE_MAP } from "@/lib/language/languages";

const DISMISS_KEY = "aws-overseas-translate-prompt-dismissed";
const LANG_KEY = "aws-overseas-lang";

// Matches navigator.language ("ar-SA", "zh-Hans-CN", ...) to a code we
// actually support, trying progressively shorter prefixes.
function matchBrowserLanguage(raw: string): string | null {
  const parts = raw.split("-");
  for (let len = parts.length; len > 0; len--) {
    const candidate = parts.slice(0, len).join("-");
    if (LANGUAGE_MAP[candidate]) return candidate;
    const lower = candidate.toLowerCase();
    if (LANGUAGE_MAP[lower]) return lower;
  }
  // zh special-case: bare "zh" isn't one of our two codes.
  if (parts[0] === "zh") return "zh-CN";
  return null;
}

export function TranslatePrompt() {
  const { language, setLanguage } = useLanguage();
  const [suggested, setSuggested] = useState<string | null>(null);

  useEffect(() => {
    // Session-scoped: reappears every new tab/visit, but not on every reload
    // within the same session once the visitor has already answered it.
    if (window.sessionStorage.getItem(DISMISS_KEY)) return;
    if (window.localStorage.getItem(LANG_KEY)) return;

    const browserLang = window.navigator.language;
    const match = matchBrowserLanguage(browserLang);
    if (match && match !== "en" && match !== language) {
      setSuggested(match);
    }
  }, [language]);

  if (!suggested) return null;

  const info = LANGUAGE_MAP[suggested];

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    setSuggested(null);
  };

  const accept = () => {
    setLanguage(suggested);
    window.sessionStorage.setItem(DISMISS_KEY, "1");
    setSuggested(null);
  };

  return (
    <div
      role="dialog"
      aria-label="Translation suggestion"
      data-no-translate
      className="fixed inset-x-4 top-[104px] z-[70] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-lg sm:top-[116px]"
    >
      <Languages className="size-5 shrink-0 text-brand-900" />
      <p className="min-w-0 flex-1 text-sm text-ink">
        <span style={{ color: "#1A0A53" }}>View this page in </span>
        <span className="font-semibold" style={{ color: "#1A0A53" }}>
          {info.nativeName}
        </span>
        <span style={{ color: "#1A0A53" }}>?</span>
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-brand-900 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          Translate
        </button>
        <button
          type="button"
          aria-label="Dismiss translation suggestion"
          onClick={dismiss}
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface-soft"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
