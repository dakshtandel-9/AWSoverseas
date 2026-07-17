import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FileText, MessageSquareText, Gift, ShieldCheck } from "lucide-react";
import { getAccount } from "@/lib/account";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Sign in — AWSOverseas",
  description: "Sign in with your email to request quotes, send product enquiries, and share your referral code.",
  robots: { index: false },
};

function safeNext(value?: string): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "";
}

const PERKS = [
  { icon: FileText, text: "Request shipping quotes for your cargo" },
  { icon: MessageSquareText, text: "Send enquiries on any product in our catalog" },
  { icon: Gift, text: "Get a referral code to share with other importers" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; mode?: string }>;
}) {
  const { next, error, mode } = await searchParams;
  const nextPath = safeNext(next);

  const account = await getAccount();
  if (account) {
    redirect(account.profile.status === "incomplete" ? "/profile/setup" : nextPath || "/profile");
  }

  const isSignUp = mode === "sign-up";

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Stub side — the manifest ticket half */}
      <aside className="relative isolate hidden overflow-hidden bg-[#000c1a] px-12 py-14 lg:flex lg:flex-col xl:px-16">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 12% 8%, rgba(172,32,56,0.18) 0%, transparent 60%), radial-gradient(50% 45% at 92% 100%, rgba(3,62,141,0.5) 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "auto, auto, 44px 44px, 44px 44px",
          }}
        />

        <Logo tone="light" priority className="relative z-10" />

        <div className="relative z-10 mt-auto flex flex-col gap-10">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e05c72]">
              <span className="size-1.5 rounded-full bg-[#d72846]" />
              Boarding pass — customer access
            </span>
            <h1
              className="mt-6 max-w-md font-heading text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] xl:text-[2.75rem]"
              style={{ color: "#ffffff" }}
            >
              One account clears every shipment.
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-white/60">
              Sign in to move your cargo through quoting, enquiries, and referrals — no re-filing paperwork
              at every gate.
            </p>
          </div>

          {/* Route line — the signature element, styled as a boarding-pass itinerary */}
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
            <span className="text-white/85">Enquiry</span>
            <span className="relative h-px flex-1 bg-white/15">
              <span className="absolute left-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#d72846]" />
              <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#d72846]" />
            </span>
            <span className="text-white/85">Cleared</span>
          </div>

          <ul className="flex flex-col gap-4 border-t border-white/12 pt-8">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-white/65">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/8 text-[#e05c72] ring-1 ring-white/10">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Perforated divider, desktop only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 lg:block"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(4,22,47,0.16) 60%, transparent 0%)",
          backgroundSize: "1px 14px",
          backgroundRepeat: "repeat-y",
        }}
      />

      {/* Form side — the stub you keep */}
      <main className="flex items-center justify-center bg-[#f6f8fc] px-5 py-14 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo tone="dark" priority />
          </div>

          <div className="mb-7">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8e1b2e]">
              <span className="size-1.5 rounded-full bg-[#d72846]" />
              Customer access
            </span>
            <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-[-0.02em] text-[#01214a] sm:text-[1.75rem]">
              {isSignUp ? "Create your account" : "Sign in to AWSOverseas"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">
              {isSignUp
                ? "Set up access in under a minute — verification happens right after."
                : "Enter your details to continue to your account."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)] sm:p-8">
            {error === "auth" && (
              <p
                className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                role="alert"
              >
                That confirmation link didn&rsquo;t work — it may have expired. Please try again.
              </p>
            )}
            <EmailAuthForm mode={isSignUp ? "sign-up" : "sign-in"} next={nextPath || undefined} />
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-[#94a3b8]">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
            New accounts are verified by our team before quoting is enabled — you&rsquo;ll complete a short
            profile right after creating your account.
          </p>
        </div>
      </main>
    </div>
  );
}
