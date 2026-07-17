import type { Metadata } from "next";
import { AccountHero } from "@/components/account/account-hero";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Set a new password — AWSOverseas",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <>
      <AccountHero
        eyebrow="Account"
        title="Set a new password"
        subtitle="Choose a new password for your account."
        right="CUSTOMER ACCESS"
      />

      <Section spacing="md" tone="soft">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-[#e4e9f2] bg-white p-8 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
            <ResetPasswordForm />
          </div>
        </div>
      </Section>
    </>
  );
}
