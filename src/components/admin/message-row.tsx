"use client";

import { markMessageReadAction, deleteMessageAction } from "@/app/admin/(dashboard)/messages/actions";
import { SubmissionRow } from "@/components/admin/submission-row";

type Message = {
  id: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  service_required: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function MessageRow({ item }: { item: Message }) {
  const createdAt = new Date(item.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <SubmissionRow
      title={item.full_name}
      subtitle={item.email}
      meta={item.service_required || "General"}
      isRead={item.is_read}
      createdAt={createdAt}
      onToggleRead={() => markMessageReadAction(item.id, !item.is_read)}
      onDelete={() => deleteMessageAction(item.id)}
      detail={
        <div className="grid gap-2">
          {item.company_name && (
            <p>
              <span className="font-semibold">Company:</span> {item.company_name}
            </p>
          )}
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            <a href={`tel:${item.phone.replace(/\s+/g, "")}`} className="text-[#8d1a32] hover:underline">
              {item.phone}
            </a>
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a href={`mailto:${item.email}`} className="text-[#8d1a32] hover:underline">
              {item.email}
            </a>
          </p>
          {item.service_required && (
            <p>
              <span className="font-semibold">Service:</span> {item.service_required}
            </p>
          )}
          <p className="mt-2 whitespace-pre-wrap text-[#5b6b82]">{item.message}</p>
        </div>
      }
    />
  );
}
