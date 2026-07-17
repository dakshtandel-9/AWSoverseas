"use client";

import { useActionState, useEffect, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImageAction, type ImageUploadState } from "@/app/admin/(dashboard)/blog/actions";

const initialState: ImageUploadState = {};

/**
 * Standalone upload form (not nested inside the post form) so its own
 * useActionState dispatch can never collide with the post-save action on
 * the same page — the resulting URL is passed up via onUploaded and carried
 * into the post form as a hidden input.
 */
export function ImageUploadField({
  value,
  onUploaded,
}: {
  value: string;
  onUploaded: (url: string) => void;
}) {
  const [state, formAction, pending] = useActionState(uploadImageAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.url) {
      onUploaded(state.url);
      formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.url]);

  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl border border-[#e4e9f2]">
          <Image src={value} alt="" width={320} height={180} className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <form ref={formRef} action={formAction}>
          <label className="flex w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#e4e9f2] bg-[#f6f8fc] px-4 py-8 text-center transition-colors hover:border-[#d72846]">
            {pending ? (
              <Loader2 className="size-6 animate-spin text-[#8e1b2e]" />
            ) : (
              <ImagePlus className="size-6 text-[#94a3b8]" />
            )}
            <span className="text-sm font-medium text-[#5b6b82]">
              {pending ? "Uploading…" : "Click to upload an image"}
            </span>
            <input
              type="file"
              name="image"
              accept="image/*"
              disabled={pending}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) formRef.current?.requestSubmit();
              }}
            />
          </label>
        </form>
      )}
      {state.error && <p className="text-xs font-medium text-red-600">{state.error}</p>}
    </div>
  );
}
