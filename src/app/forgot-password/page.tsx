import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAccount } from "@/lib/account";
import { AccountHero } from "@/components/account/account-hero";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Reset your password — aws overseas",
  robots: { index: false },
};

export default async function ForgotPasswordPage() {
  const account = await getAccount();
  if (account) redirect("/profile");

  return (
    <>
      <AccountHero
        eyebrow="Account"
        title="Reset your password"
        subtitle="Enter the email on your account and we'll send you a link to set a new password."
        right="CUSTOMER ACCESS"
      />

      <Section spacing="md" tone="soft">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-[#e4e9f2] bg-white p-8 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
            <ForgotPasswordForm />

            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#861b28] hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Back to sign in
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
