"use client";

import { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#d6274c] focus:ring-2 focus:ring-[#d6274c]/20";

export type CaptchaHandle = {
  /** Verifies the current answer against the server; refreshes to a new
   * image on failure so a guess can't be retried against the same code. */
  verify: () => Promise<boolean>;
};

export const CaptchaField = forwardRef<CaptchaHandle, { answer: string; onAnswerChange: (value: string) => void }>(
  function CaptchaField({ answer, onAnswerChange }, ref) {
    const [svg, setSvg] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
      setLoading(true);
      onAnswerChange("");
      try {
        const res = await fetch("/api/captcha");
        const data = (await res.json()) as { svg: string; token: string };
        setSvg(data.svg);
        setToken(data.token);
      } finally {
        setLoading(false);
      }
    }, [onAnswerChange]);

    useEffect(() => {
      load();
    }, [load]);

    useImperativeHandle(ref, () => ({
      verify: async () => {
        const res = await fetch("/api/captcha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, answer }),
        });
        const data = (await res.json()) as { valid: boolean };
        if (!data.valid) await load();
        return data.valid;
      },
    }));

    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#002144]">Verification code</label>
        <div className="flex items-center gap-2">
          <div className="flex h-14 w-[160px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e4e9f2] bg-[#eef3fb]">
            {loading ? (
              <Loader2 className="size-4 animate-spin text-[#5b6b82]" />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            )}
          </div>
          <button
            type="button"
            onClick={load}
            aria-label="Get a new code"
            className="grid size-14 shrink-0 place-items-center rounded-xl border border-[#e4e9f2] bg-white text-[#5b6b82] transition-colors hover:border-[#d6274c] hover:text-[#8d1a32]"
          >
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          </button>
        </div>
        <input
          type="text"
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type the code above"
          className={inputClasses}
        />
      </div>
    );
  },
);
