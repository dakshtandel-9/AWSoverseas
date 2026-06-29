"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/** Client-only newsletter capture with a success state (no backend wired). */
export function NewsletterForm({
  placeholder,
  buttonText,
  successText,
  privacyText,
}: {
  placeholder: string;
  buttonText: string;
  successText: string;
  privacyText?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  }

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-4 text-sm font-medium text-white ring-1 ring-white/15"
          >
            <Check className="size-4 text-accent-400" /> {successText}
          </motion.p>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/15 focus-within:ring-accent-400"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-brand-100/50 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-400"
            >
              {buttonText}
              <ArrowRight className="size-4" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {privacyText && !done && (
        <p className="mt-3 text-xs text-brand-100/50">{privacyText}</p>
      )}
    </div>
  );
}
