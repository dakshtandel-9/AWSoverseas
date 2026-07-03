"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Mail, MailOpen, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function SubmissionRow({
  title,
  subtitle,
  meta,
  isRead,
  createdAt,
  detail,
  onToggleRead,
  onDelete,
}: {
  title: string;
  subtitle: string;
  meta: string;
  isRead: boolean;
  createdAt: string;
  detail: React.ReactNode;
  onToggleRead: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-[#e4e9f2] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        {!isRead && <span className="size-2 shrink-0 rounded-full bg-[#0fade8]" aria-hidden />}
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-sm", isRead ? "font-medium text-[#5b6b82]" : "font-bold text-[#06234d]")}>
            {title}
          </p>
          <p className="truncate text-xs text-[#94a3b8]">{subtitle}</p>
        </div>
        <span className="hidden shrink-0 font-mono text-xs text-[#94a3b8] sm:block">{meta}</span>
        <span className="shrink-0 text-xs text-[#94a3b8]">{createdAt}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#94a3b8] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-[#e4e9f2] px-5 py-4">
          <div className="text-sm leading-relaxed text-[#06234d]">{detail}</div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(onToggleRead)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e9f2] px-3.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:border-[#0fade8] hover:text-[#0489c2] disabled:opacity-50"
            >
              {isRead ? <Mail className="size-3.5" /> : <MailOpen className="size-3.5" />}
              Mark as {isRead ? "unread" : "read"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(onDelete)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e9f2] px-3.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
