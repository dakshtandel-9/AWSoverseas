"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadPassportImageAction } from "@/app/actions/account";

/**
 * Passport photo picker. Unlike the admin image fields this is NOT its own
 * <form> — it calls the upload action directly, so it can sit inside the
 * profile form without nesting forms or colliding with its useActionState.
 */
export function PassportUploadField({
  label,
  value,
  onUploaded,
}: {
  label: string;
  value: string;
  onUploaded: (url: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function upload(file: File) {
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadPassportImageAction({}, formData);
      if (result.url) onUploaded(result.url);
      if (result.error) setError(result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[#002144]">
        {label} <span className="text-[#8d1a32]">*</span>
      </span>

      {value ? (
        <div className="relative w-full overflow-hidden rounded-xl border border-[#e4e9f2]">
          <Image src={value} alt={label} width={320} height={220} className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#e4e9f2] bg-[#f6f8fc] px-4 py-8 text-center transition-colors hover:border-[#d6274c]">
          {pending ? (
            <Loader2 className="size-6 animate-spin text-[#8d1a32]" />
          ) : (
            <ImagePlus className="size-6 text-[#94a3b8]" />
          )}
          <span className="text-sm font-medium text-[#5b6b82]">
            {pending ? "Uploading…" : "Click to upload a clear photo"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={pending}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </label>
      )}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
