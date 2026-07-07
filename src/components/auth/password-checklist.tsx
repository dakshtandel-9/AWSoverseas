import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { checkPassword } from "@/lib/password";

/** Live red -> green checklist under a password field, one row per rule. */
export function PasswordChecklist({ password }: { password: string }) {
  const checks = checkPassword(password);

  return (
    <ul className="flex flex-col gap-1">
      {checks.map(({ key, label, met }) => (
        <li
          key={key}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors",
            met ? "text-emerald-600" : "text-red-500",
          )}
        >
          {met ? <Check className="size-3 shrink-0" /> : <X className="size-3 shrink-0" />}
          {label}
        </li>
      ))}
    </ul>
  );
}
