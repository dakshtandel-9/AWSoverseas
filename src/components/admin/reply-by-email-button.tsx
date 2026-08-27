"use client";

import Link from "next/link";
import { Reply } from "lucide-react";
import type { ReplySource } from "@/lib/email-reply-draft";

/**
 * Opens the compose page with a reply to this submission already written —
 * addressed to the sender, with a subject and a quoted recap of what they
 * sent. Nothing is sent by clicking it; the operator finishes the message and
 * presses Send there.
 *
 * Only the source and the row id travel in the URL. The draft itself is built
 * on the server from the row, so the message can be as long as it needs to be
 * and can't be rewritten by editing the address bar.
 */
export function ReplyByEmailButton({
  source,
  id,
  email,
}: {
  source: ReplySource;
  id: string;
  /** No address, no button — there'd be nowhere to send it. */
  email: string;
}) {
  if (!email) return null;

  return (
    <Link
      href={`/admin/email?source=${source}&id=${id}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e9f2] px-3.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:border-[#9e4953] hover:text-maroon-admin focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
    >
      <Reply className="size-3.5" />
      Reply by email
    </Link>
  );
}
