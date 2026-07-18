"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { subscribeNewsletterAction, type NewsletterFormState } from "@/app/actions/newsletter";

const initialState: NewsletterFormState = {};

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
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {state.success ? (
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
            ref={formRef}
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/15 focus-within:ring-accent-400"
          >
            <label htmlFor={id} className="sr-only">
              Email address
            </label>
            <input
              id={id}
              name="email"
              type="email"
              required
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-brand-100/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-400 disabled:opacity-60"
            >
              {pending ? "Subscribing…" : buttonText}
              <ArrowRight className="size-4" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {state.error && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-300">
          <AlertCircle className="size-3.5" /> {state.error}
        </p>
      )}
      {privacyText && !state.success && !state.error && (
        <p className="mt-3 text-xs text-brand-100/50">{privacyText}</p>
      )}
    </div>
  );
}
