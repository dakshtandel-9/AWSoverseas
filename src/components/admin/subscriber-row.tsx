"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteSubscriberAction } from "@/app/admin/(dashboard)/newsletter/actions";

type Subscriber = { id: string; email: string; created_at: string };

export function SubscriberRow({ item }: { item: Subscriber }) {
  const [pending, startTransition] = useTransition();
  const createdAt = new Date(item.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e4e9f2] bg-white px-5 py-4">
      <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#002144]">
        <a href={`mailto:${item.email}`} className="hover:underline">
          {item.email}
        </a>
      </p>
      <span className="shrink-0 text-xs text-[#94a3b8]">{createdAt}</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteSubscriberAction(item.id))}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e4e9f2] px-3.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
        Remove
      </button>
    </div>
  );
}
