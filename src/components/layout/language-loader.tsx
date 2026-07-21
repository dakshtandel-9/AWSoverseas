"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language/language-context";

export function LanguageLoader() {
  const { isTranslating } = useLanguage();

  if (!isTranslating) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-no-translate
      className="page-loader"
    >
      <div className="page-loader__inner">
        <Image
          src="/brand/logo-mark.png"
          alt=""
          width={168}
          height={93}
          className="page-loader__logo"
        />
        <div className="page-loader__track">
          <div className="page-loader__bar" />
        </div>
        <p className="text-sm font-medium text-ink-soft">Translating page…</p>
      </div>
    </div>
  );
}
