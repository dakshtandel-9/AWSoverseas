import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FileText, MessageSquareText, Gift, ShieldCheck } from "lucide-react";
import { getAccount } from "@/lib/account";
import { AccountHero } from "@/components/account/account-hero";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sign in — AWSoversea",
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

  return (
    <>
      <AccountHero
        eyebrow="Account"
        title="Sign in to AWSoversea"
        subtitle="Sign in with your email to unlock quotes, product enquiries, and your personal referral code."
        right="CUSTOMER ACCESS"
      />

      <Section spacing="md" tone="soft">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-[#e4e9f2] bg-white p-8 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
            <ul className="flex flex-col gap-3.5">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-[#5b6b82]">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#033e8d]">
                    <Icon className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-7 border-t border-[#e4e9f2] pt-7">
              {error === "auth" && (
                <p
                  className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  role="alert"
                >
                  That confirmation link didn&rsquo;t work — it may have expired. Please try again.
                </p>
              )}
              <EmailAuthForm mode={mode === "sign-up" ? "sign-up" : "sign-in"} next={nextPath || undefined} />
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-[#94a3b8]">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
              New accounts are verified by our team before quoting is enabled — you&rsquo;ll complete a
              short profile after confirming your email.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
